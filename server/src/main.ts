import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { Request, Response } from "express";
import * as env from './config/env.json';
import { routerQiwi } from './route/qiwi.route';
import { Server } from 'socket.io';
import { v1 as uuidv1 } from 'uuid';
import { isProd } from './lib/prod';
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.get('*', (req: Request, res: Response) => {
  res.status(200);
  res.send(`API ${env.version}`);
});
app.use('/', routerQiwi)
const server = app.listen(env.port, () => {
  console.log(`SERVER START:${env.port}`)
});

const io = new Server(server, { cors: { origin: '*' } });

io.on("connection", (socket) => {
  socket.on('new-session', () => {
    const session = uuidv1();
    io.to(socket.id).emit('sendSession', session);
    myCache.set(session, socket.id, 100000);
    myCache.set(socket.id, session, 100000);
  })
  socket.on('reboot-session', (msg) => {
    myCache.set(msg, socket.id, 100000);
    myCache.set(socket.id, msg, 100000);
  })
  socket.on('disconnect', () => {
    const sessionId = myCache.get(socket.id);
    if (sessionId != undefined) {
      myCache.del(sessionId);
      myCache.del(socket.id);
    }
  });
});
/**
 * @session_id { айди  сессии }
 * @event {тип ивента}
 * @payload {данные которые надо отправить}
 */
export const sendSocket = (session_id, event, payload) => {
  const socketId = myCache.get(session_id);
  if (socketId != undefined) {
    if (!isProd()) {
      console.log(event, payload)
    }
    io.to(socketId).emit(event, payload);
  }
}