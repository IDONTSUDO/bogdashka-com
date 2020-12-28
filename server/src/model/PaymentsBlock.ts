import db from '../lib/firestore';

export interface IPaymentsBlock {
  userLogin: string;
  date: string;
  amount: number;
  operationID: string;
  type: TYPEPAYMENTBLOCK;
}
export class PaymentsBlock {
  static ref = db.collection('PaymentsBlock');
  /**
   * @problem генерация заболоченного платежа, такой может возникунуть только в особом случае.
   * если два человека заплатят за один и тот же товар одновременно.
   * @param {IPaymentsBlock} doc
   */
  static async new(doc: IPaymentsBlock): Promise<void> {
    try {
      await PaymentsBlock.ref.doc(doc.operationID).set(doc);
    } catch (error) {
      throw new Error(`PaymentsBlock is not  save:${error}`);
    }

  }
}
export enum TYPEPAYMENTBLOCK {
  NEW_REQUEST = 'NEW_REQUEST',
  ERROR = 'ERROR'
}
