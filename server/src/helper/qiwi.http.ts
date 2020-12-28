import axios from 'axios';
import * as env from '../config/env.json';

const qiwiServer = 'https://api.qiwi.com/partner';
const secreteKey: string = env.qiwiServer;

export class QiwiProvider {
// https://developer.qiwi.com/ru/bill-payments/?javascript#refund

  /**
   * @problem возвращение средст
   * @param {string} refundId уникальный идентификатор возврата в системе мерчанта.
   * @param {string} billId уникальный идентификатор счета в моей системе. ??? шо це за поле.
   * @param {number} amountReturn сумма которую надо вернуть
   * @return {*}
   */
  static async returnPay(billId: string, refundId: string, amountReturn: number) {
    const body =  {'amount': {
      'currency': 'RUB',
      'value': amountReturn
    }};
    const  res =  await axios.put(`${qiwiServer}'/bill/v1/bills/${billId}/refunds/${refundId}`, {
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secreteKey}`
      }
    });
    // TODO:TESTTT1
  }
}
