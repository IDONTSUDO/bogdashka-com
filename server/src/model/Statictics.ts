import { STATISTIC_ALL_ID } from '../lib/contsanst';
import db from '../lib/firestore';

export class StatisticAll {
  static ref = db.doc(`${STATISTIC_ALL_ID}`);
  static up(doc: IstatisticAll) {

  }
}
interface IstatisticAll {
  paidInTotal: number;
  NumberTransaction: number;
  gifts: number;
}
