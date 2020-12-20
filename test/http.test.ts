
import { expect } from 'chai';
import { Group } from '../src/model/Group';
import axios from 'axios';
import * as Mock from './mocks/httpTransaction.json';
import * as env from '../src/config/env.json';

let server = env.serverURL;
let mockId = '1dbc8680-42f4-11eb-85d0-17d057c3393f'
 
describe('Тесты HTTP сервера', () => {
    it('Тест перевода PEDDING', async () => {
        const p = await axios.post('http://localhost:8080/qiwi/pay', Mock)
        expect(p.data).to.be.an('string');
    });
    it('Тест перевода COMPLETE',async () => {
        const p = await axios.post(`http://localhost:8080/qiwi/complete/?id=${mockId}`)
        // console.log(p);

    })
}); 
// /path/filename?id=123&option=456
