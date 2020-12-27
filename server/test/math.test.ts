
import { expect } from 'chai';
import { Group } from '../src/model/Group';
import * as groupMock from './mocks/groupBalance.json';
const testMoock: any = groupMock;
describe('Тесты расчетов', () => {
    it('Превышение баланса', async () => {
        const p = Group.paymentWithOutGroup(testMoock, 100)
        console.log(p);
        expect(p).to.be.an("Object")
    });
    it('Сильное превышение баланса', async () => {
        const p = Group.paymentWithOutGroup(testMoock, 100000)
        expect(p).to.be.an("Object")
    });
    it('Нормальный баланс', async () => {
        const p = Group.paymentWithOutGroup(testMoock, 49);
        console.log(p);
        expect(p).to.be.an("Array")
    });
});