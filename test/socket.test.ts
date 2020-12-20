
import { expect } from 'chai';
import { Group } from '../src/model/Group';
import * as env from '../src/config/env.json';
const socket = require('socket.io-client')(env.serverURL);
 
describe('Тесты сокет сервера', () => {
    it('Сокет коннект', async () => {
    }); 
    it('Выдача сессии',async () => {

    })
    it('Калбек сессии после оплаты',async () =>{

    })
});