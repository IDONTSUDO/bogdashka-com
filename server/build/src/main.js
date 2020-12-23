"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const env = require("./config/env.json");
const qiwi_route_1 = require("./route/qiwi.route");
const socket_io_1 = require("socket.io");
const uuid_1 = require("uuid");
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.get('*', (req, res) => {
    res.status(200);
    res.send(`API ${env.version}`);
});
app.use('/', qiwi_route_1.routerQiwi);
const server = app.listen(env.port, () => {
    console.log(`SERVER START:${env.port}`);
});
const io = new socket_io_1.Server(server, { cors: { origin: '*' } });
io.on("connection", (socket) => {
    console.log("A user has connected to the socket!");
    socket.emit('session', uuid_1.v1());
    socket.on('session-connect', (msg) => {
        console.log(msg);
    });
    socket.on('disconnect', () => console.log('A user has disconnected from the socket!'));
});
//# sourceMappingURL=main.js.map