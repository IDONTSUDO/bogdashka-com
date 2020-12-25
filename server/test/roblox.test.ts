import { RobloxApi } from '../src/lib/roblox.http'; // this will be your custom import
import { expect } from 'chai';
import * as mockTrans from './mocks/transaction.json';

describe('Тесты Robox', () => { 
    it('Получение XCRFTOKEN', async () => { 
        const p = await RobloxApi.getXCrfToken(mockTrans.cookie,'1')
        expect(p).to.be.an("string")
    });
    it('Получение баланса группы', async () => { 
        const p = await RobloxApi.getGroupBalance(mockTrans.groupId,mockTrans.cookie);
        expect(p).to.be.an("number")
    });
    it('Тест на пользователя который  состоит в группе', async () =>{
        const p = await RobloxApi.UserLoginWithGroup(mockTrans.userWithGroup,mockTrans.cookie,mockTrans.groupId);
        expect(p).to.equal(true)
    })
    it('Тест на пользователя который  не состоит в группе', async () =>{
        const p = await RobloxApi.UserLoginWithGroup('123213231123312312321312',mockTrans.cookie,mockTrans.groupId);
        expect(p).to.equal(false);
    })
    it('Попытка оплаты если ли юзер не состоит в группе', async () => { 
        // const p = await RobloxApi.getGroupBalance(mockTrans.groupId,mockTrans.cookie);
        // expect(p).to.be.an("number")
    });
    it('Оплата юзером', async () => { 
        // const p = await RobloxApi.getGroupBalance(mockTrans.groupId,mockTrans.cookie);
        // expect(p).to.be.an("number")
    });
});