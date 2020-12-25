import { expect } from 'chai';
import { Group } from '../src/model/Group';
import axios from 'axios';
import * as Mock from './mocks/httpTransaction.json';
import * as env from '../src/config/env.json';

let server = 'http://localhost:8080/';
let mockId = '1dbc8680-42f4-11eb-85d0-17d057c3393f'
 
describe('Тесты HTTP сервера', () => {
    it('Тест перевода PEDDING', async () => {
        const p = await axios.post(`${server}qiwi/pay`, Mock);
        expect(p.data).to.be.an('string');
    });
    it('Тест перевода COMPLETE',async () => {
        await axios.post(`${server}qiwi/complete/?id=${mockId}`);
    })
}); 