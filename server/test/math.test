
import { expect } from 'chai';
import { Group } from '../src/model/Group';
import { RobloxService } from '../src/service/roblox.service';
import * as groupMock from './mocks/groupBalance.json';
import * as grouoOneMock from './mocks/groupBlanceOne.json';

const testMoock: any = groupMock;
const testMockOne: any = grouoOneMock;
describe('Тесты расчетов', () => {
    it('Превышение баланса с нескольких групп', async () => {
        const p = Group.groupValidatePayment(testMoock, 0, 100, []);
        expect(p).to.be.an('Object');
    });
    it('Нормальный баланс с нескольких групп', async () => {
        const p = Group.groupValidatePayment(testMoock, 0, 50, []);
        expect(p).to.be.an('Array');
    });
    it('Баланс с одной группы нормальный', async () => {
        const p = Group.groupValidatePayment(testMockOne, 0, 50, []);
        expect(p).to.be.an('Array');
    });
    it('Баланс с одной группы превышение', async () => {
        const p = Group.groupValidatePayment(testMockOne, 0, 100, []);
        expect(p).to.be.an('Object');
    });
    it('Валидация баланса групп если платеж привышен', async () => {
        const p = await RobloxService.amountValid(100);
        expect(p).to.equal(false);
    });
    it('Валидация баланса групп если платеж равен', async () => {
        const p = await RobloxService.amountValid(60);

        expect(p).to.equal(true);
    });
    it('Валидация баланса групп если платеж меньше', async () => {
        const p = await RobloxService.amountValid(1);
        expect(p).to.equal(true);
    });
});
