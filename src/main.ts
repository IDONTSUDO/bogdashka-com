import * as http from "http";
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { Request, Response } from "express";
import * as env from './config/env.json';
import { routerQiwi } from './route/qiwi.route';
import   db   from "./lib/firestore";
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.get('*', (req: Request, res: Response) => {
  res.status(200);
  res.send(`API ${env.version}`);
});
app.use('/', routerQiwi)

const socket = require("socket.io");


const server = new http.Server(app);
const io = socket(server);

server.listen(env.port, () => {
  console.log(`Application listening on port ${env.port || 3000}!`);
});

io.on("connection", (socket) => {
  console.log("A user has connected to the socket!");
  socket.on('disconnect', () => console.log('A user has disconnected from the socket!'));
});


