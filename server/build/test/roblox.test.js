"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roblox_http_1 = require("../src/lib/roblox.http"); // this will be your custom import
const chai_1 = require("chai");
const mockTrans = require("./mocks/transaction.json");
describe('Тесты Robox', () => {
    it('Получение XCRFTOKEN', async () => {
        const p = await roblox_http_1.RobloxApi.getXCrfToken(mockTrans.cookie, '1');
        chai_1.expect(p).to.be.an("string");
    });
    it('Получение баланса группы', async () => {
        const p = await roblox_http_1.RobloxApi.getGroupBalance(mockTrans.groupId, mockTrans.cookie);
        chai_1.expect(p).to.be.an("number");
    });
    it('Тест на пользователя который  состоит в группе', async () => {
        const p = await roblox_http_1.RobloxApi.UserLoginWithGroup(mockTrans.userWithGroup, mockTrans.cookie, mockTrans.groupId);
        chai_1.expect(p).to.equal(true);
    });
    it('Тест на пользователя который  не состоит в группе', async () => {
        const p = await roblox_http_1.RobloxApi.UserLoginWithGroup('123213231123312312321312', mockTrans.cookie, mockTrans.groupId);
        chai_1.expect(p).to.equal(false);
    });
    it('Попытка оплаты если ли юзер не состоит в группе', async () => {
        // const p = await RobloxApi.getGroupBalance(mockTrans.groupId,mockTrans.cookie);
        // expect(p).to.be.an("number")
    });
    it('Оплата юзером', async () => {
        // const p = await RobloxApi.getGroupBalance(mockTrans.groupId,mockTrans.cookie);
        // expect(p).to.be.an("number")
    });
});
//# sourceMappingURL=roblox.test.js.map