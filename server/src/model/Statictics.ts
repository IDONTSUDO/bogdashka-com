import { STATISTIC_ALL_ID } from '../lib/contsanst';
import db from '../lib/firestore';

export class StatisticAll {
  static ref = db.doc(`${STATISTIC_ALL_ID}`);
  static up() {

  }
}
interface IstatisticAll {
  paidInTotal: number;
  // ОПЛАЧЕНО ВСЕГО
  NumberTransaction: number;
  // КОЛИЧЕСТВО ТРАНЗАКЦИЙ
  gifts: number;
  // ПОДАРКОВ КОЛИЧЕСТВО
}
