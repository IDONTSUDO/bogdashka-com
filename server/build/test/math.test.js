"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Group_1 = require("../src/model/Group");
const groupMock = require("./mocks/groupBalance.json");
const testMoock = groupMock;
describe('Тесты расчетов', () => {
    it('Превышение баланса', async () => {
        const p = Group_1.Group.paymentWithOutGroup(testMoock, 100);
        chai_1.expect(p).to.be.an("Object");
    });
    it('Сильное превышение баланса', async () => {
        const p = Group_1.Group.paymentWithOutGroup(testMoock, 100000);
        chai_1.expect(p).to.be.an("Object");
    });
    it('Нормальный баланс', async () => {
        const p = Group_1.Group.paymentWithOutGroup(testMoock, 49);
        chai_1.expect(p).to.be.an("Array");
    });
});
//# sourceMappingURL=math.test.js.map