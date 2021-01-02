import { resolveSrv } from 'dns';
import db from '../lib/firestore';
export enum StatiscUpdate {
  NEW_TRANSACTION = 'NEW_TRANSACTION',
  MESSAGE = 'MESSAGE',
  REQUEST_AT_ZERO_BALANCE = 'REQUEST_AT_ZERO_BALANCE'
}
export class Statistic {
  private static ref = db.collection(`Statictics`).doc(String(new Date().getFullYear()));

  private  static  getTodayDate() {
    console.log(200);
    const now: any = new Date();
    const start: any = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }
  static async updateStatic(event: StatiscUpdate, amount?: number) {
    const todayKey =  Statistic.getTodayDate();
    const fire = await Statistic.ref.get();
    if (fire.exists) {
      const doc: any = fire.data();
      if (doc[`${todayKey}`] === undefined) {
        if (event === 'NEW_TRANSACTION') {
          doc[`${todayKey}`] = {
            amountTotal: amount,
            qualityTransactionDay: 1,
          };
        }
        if (event === 'REQUEST_AT_ZERO_BALANCE') {
          doc[`${todayKey}`] = {
            missingTotal: amount
          };
        }

      } else {
        const transactionTotal = doc[`${todayKey}`].qualityTransactionDay || 0;
        const amountTotal = doc[`${todayKey}`].amountTotal || 0;
        const missingTotalDoc = doc[`${todayKey}`].missingTotal || 0;
        console.log(event);
        if (event === 'NEW_TRANSACTION') {
          doc[`${todayKey}`] = {
            amountTotal: amountTotal + amount,
            qualityTransactionDay: transactionTotal + 1,
          };
        }
        if (event === 'REQUEST_AT_ZERO_BALANCE') {
          doc[`${todayKey}`] = {
            missingTotal: missingTotalDoc + amount
          };
        }
      }
      await db.collection('Statictics').doc(String(new Date().getFullYear())).set(doc, {merge: true});
    } else {
      const payload = {};
      if (event === 'NEW_TRANSACTION') {
        payload[`${todayKey}`] = {
          amountTotal: amount,
          qualityTransactionDay: 1,
        };
      }
      if (event === 'REQUEST_AT_ZERO_BALANCE') {
        payload[`${todayKey}`] = {
          amountTotal: amount,
          missingTotal: 1,
        };
      }
      await db.collection('Statictics').doc(String(new Date().getFullYear())).set(payload);

    }
  }
}

async function name() {

  await Statistic.updateStatic(StatiscUpdate.NEW_TRANSACTION, 300);
  await Statistic.updateStatic(StatiscUpdate.REQUEST_AT_ZERO_BALANCE, 400);
}
name();

