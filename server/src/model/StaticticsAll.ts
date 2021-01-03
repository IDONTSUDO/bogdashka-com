import { STATISTIC_ALL_ID } from '../lib/contsanst';
import db from '../lib/firestore';
import { Statistic } from './Statistics';

export class StatisticAll {
  private static  ref = db.doc(`StaticticsAll/${STATISTIC_ALL_ID}`);
  static async updateTransaction(amount: number) {
    const fire: FirebaseFirestore.DocumentData = await StatisticAll.ref.get();
    if (fire.exists) {
      const doc  = fire.data();
      await StatisticAll.ref.set({
        'amount': doc.paidInTotal = doc.paidInTotal + amount,
        'NumberTransaction': doc.NumberTransaction = doc.NumberTransaction + 1
      }, {merge: true});
    }
  }
  static async getInitStatistic() {
    const fire = await StatisticAll.ref.get();
    if (fire.exists) {
      const doc: any = fire.data();
      return doc.paidInTotal;
    }

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
