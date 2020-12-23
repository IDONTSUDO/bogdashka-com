import * as http from "http";
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { Request, Response } from "express";
import * as env from './config/env.json';
import { routerQiwi } from './route/qiwi.route';
import { Server } from 'socket.io';
import { v1 as uuidv1 } from 'uuid';

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.get('*', (req: Request, res: Response) => {
  res.status(200);
  res.send(`API ${env.version}`);
});
app.use('/', routerQiwi)
const server = app.listen(env.port,() =>{
  console.log(`SERVER START:${env.port}`)
});
const io = new Server(server, { cors: { origin: '*' } });

io.on("connection", (socket) => {
  console.log("A user has connected to the socket!");
  socket.emit('session', uuidv1())
  socket.on('session-connect',(msg) =>{
    console.log(msg);
  })
  socket.on('disconnect', () => console.log('A user has disconnected from the socket!'));
});


