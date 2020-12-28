import { expect } from 'chai';
import { Group } from '../src/model/Group';
import axios from 'axios';
import * as Mock from './mocks/httpTransaction.json';
import * as env from '../src/config/env.json';
import { FAKE_ORDER_ID } from '../src/lib/contsanst';

const server = 'http://localhost:8080/';
const mockId = FAKE_ORDER_ID;

describe('Тесты HTTP сервера', () => {
    it('Тест перевода PEDDING', async () => {
        const p = await axios.post(`${server}qiwi/pay`, Mock);
        expect(p.data).to.be.an('string');
    });
    it('Тест перевода COMPLETE', async () => {
       const p =  await axios.post(`${server}qiwi/complete/?id=${mockId}`);
        expect(p.data).to.equal(true);
    });
});
