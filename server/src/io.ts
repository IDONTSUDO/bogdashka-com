import { server } from './main';

import { Server } from 'socket.io';
import NodeCache = require('node-cache');
import { v1 as uuidv1 } from 'uuid';
import { StatisticAll, StatisticInit } from './model/StaticticsAll';
import { Payments } from './model/Payments';
import { Settings } from './model/Settings';

const cron = require('node-cron');
cron.schedule('* * * * *', async () => {
  console.log('CRON RUNIING');
  await Payments.PaymentCron();
});
const userOnlineCache = new NodeCache();
const io = new Server(server, { cors: { origin: '*' } });
let userOnline = 0;
let course = 2;
let statictic: StatisticInit | undefined;
export const upCourse = (value) => {
  course = value;
  io.emit('course', course);
};
export const upStatistic =  (value: StatisticInit) => {
  statictic = value;
};
export const getCourse = () => {
  return course;
};
io.on('connection', async (socket) => {
  if (statictic === undefined) {
    statictic = await StatisticAll.getInitStatistic();
    course = await Settings.getCourse();
  }
  userOnline =  userOnline + 1;
  io.to(socket.id).emit('balance', JSON.stringify(statictic));
  io.emit('userOnline', userOnline);
  io.emit('course', course);
  socket.on('new-session', () => {
    const session = uuidv1();
    io.to(socket.id).emit('sendSession', session);
    userOnlineCache.set(session, socket.id, 100000);
    userOnlineCache.set(socket.id, session, 100000);
  });

  socket.on('reboot-session', (msg) => {
    userOnlineCache.set(msg, socket.id, 100000);
    userOnlineCache.set(socket.id, msg, 100000);
  });

  socket.on('disconnect', () => {
    userOnline = userOnline  - 1;
    io.emit('userOnline', userOnline);
    const sessionId: any = userOnlineCache.get(socket.id);
    if (sessionId !== undefined) {
      userOnlineCache.del(sessionId);
      userOnlineCache.del(socket.id);
    }
  });
});
/**
 * @session_id { айди  сессии }
 * @event { тип ивента }
 * @payload { данные которые надо отправить }
 */
export const sendSocket = (session_id, event, payload) => {
  const socketId: any = userOnlineCache.get(session_id);
  if (socketId !== undefined) {
    io.to(socketId).emit(event, payload);
  }

};
export enum EventIO {
  NEW_PAY = 'NEW_PAY'
}
/**
 * @session_id { айди  сессии }
 * @event EventIO { тип ивента }
 * @payload { данные которые надо отправить }
 */
export const sendIo = (event: EventIO, data) => {
  io.emit(event, data);
};
