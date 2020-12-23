"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env = require("../src/config/env.json");
const socket = require('socket.io-client')(env.serverURL);
describe('Тесты сокет сервера', () => {
    it('Сокет коннект', async () => {
    });
    it('Выдача сессии', async () => {
    });
    it('Калбек сессии после оплаты', async () => {
    });
});
//# sourceMappingURL=socket.test.js.map