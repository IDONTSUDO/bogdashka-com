"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const axios_1 = require("axios");
const Mock = require("./mocks/httpTransaction.json");
let server = 'http://localhost:8080/';
let mockId = '1dbc8680-42f4-11eb-85d0-17d057c3393f';
describe('Тесты HTTP сервера', () => {
    it('Тест перевода PEDDING', async () => {
        const p = await axios_1.default.post(`${server}qiwi/pay`, Mock);
        chai_1.expect(p.data).to.be.an('string');
    });
    it('Тест перевода COMPLETE', async () => {
        await axios_1.default.post(`${server}qiwi/complete/?id=${mockId}`);
    });
});
//# sourceMappingURL=http.test.js.map