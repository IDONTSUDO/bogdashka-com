import { EventIO, sendIo } from '../io';
import { StatisticAll } from '../model/StaticticsAll';
import { Statistic, EventStatisticUpdate } from '../model/Statistics';

export class StatisticService {
   static async updateTransation(amount: number) {
      await Statistic.updateStatic(EventStatisticUpdate.NEW_TRANSACTION, amount);
      await StatisticAll.updateTransaction(amount);
   }
}
