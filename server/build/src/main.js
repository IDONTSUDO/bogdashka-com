"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSocket = void 0;
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const env = require("./config/env.json");
const qiwi_route_1 = require("./route/qiwi.route");
const socket_io_1 = require("socket.io");
const uuid_1 = require("uuid");
const prod_1 = require("./lib/prod");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
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
    socket.on('new-session', () => {
        const session = uuid_1.v1();
        io.to(socket.id).emit('sendSession', session);
        myCache.set(session, socket.id, 100000);
        myCache.set(socket.id, session, 100000);
    });
    socket.on('reboot-session', (msg) => {
        myCache.set(msg, socket.id, 100000);
        myCache.set(socket.id, msg, 100000);
    });
    socket.on('disconnect', () => {
        const sessionId = myCache.get(socket.id);
        if (sessionId != undefined) {
            myCache.del(sessionId);
            myCache.del(socket.id);
        }
    });
});
exports.sendSocket = (session_id, event, payload) => {
    const socketId = myCache.get(session_id);
    if (socketId != undefined) {
        if (!prod_1.isProd()) {
            console.log(event, payload);
        }
        io.to(socketId).emit(event, payload);
    }
};
//# sourceMappingURL=main.js.map