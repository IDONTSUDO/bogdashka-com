import * as  env from '../config/env.json';

import * as crypto from 'crypto';
const payMethods = [
  {
    payNumber: '45',
    description: 'yandexMoney',
    status: true
  },
  {
    payNumber: '160',
    description: 'visa',
    status: true
  },
  {
    payNumber: '82',
    description: 'mobileMegafon',
    status: true
  },
  {
    payNumber: '83',
    description: 'mobile Bilain',
    status: true
  }
];
import db from '../lib/firestore';

export class FreeKassaHttp {
  static newPay(amount: number, orderId: string, payType: string) {
    console.log(`${env.roboKassaStoreId}:${amount}:${env.roboKassaSecret}:${orderId}`);
    // "ID Вашего магазина:Сумма платежа:Секретное слово:Номер заказа"
    const secret = crypto.createHash('md5').update(`${env.roboKassaStoreId}:${amount}:${env.roboKassaSecret}:${orderId}`).digest('hex');
    console.log(secret);
    return `http://www.free-kassa.ru/merchant/cash.php?m=307493&oa=${amount}&o=${orderId}&s=${secret}&lang=ru&i=${payType}&em=idont@yandex.com`;
  }
  static async getPayMethod(): Promise<FreeKassaMethodPay[]> {
    return (await db.collection('FreeKassPayments').get()).docs.map((e) => e.data() as unknown as FreeKassaMethodPay);
  }

}
export interface FreeKassaMethodPay {
  payNumber: string;
  description: string;
  status: boolean;
}
