import db from '../lib/firestore';
import { sendSocket } from '../io';
import { RobloxService } from '../service/roblox.service';

export enum servicePaymentError {
    BALANCE_ERROR = 'BALANCE_ERROR'
}
export class Payments {
    static ref = db.collection('Payments');
    /**
     * @problem Получение платежа по айди.
     * @param {string} id
     * @return {*}  {Promise<IPayments>}
    */
    static async getPayment(id: string): Promise<IPayments> {
        try {
            const p: any | IPayments = await Payments.ref.doc(id).get();
            if (p.exists) {
                return p.data();
            } else {
                throw new Error('Payment not found');
            }
        } catch (error) {
            throw new Error(`Payments id is undefined:${error}`);
        }
    }

    /**
     * @problem Получение платежа по айди.
     * @param {IPayments} transaction
     */
    static async savePayment(transaction: IPayments): Promise<void> {
        transaction.date = new Date().toJSON();
        try {
            await Payments.ref.doc(transaction.id).set(transaction);
        } catch (error) {
            throw new Error(`Payments is not  save:${error}`);
        }
    }


    /**
     * @problem Апдейт платежки.
     * @param {string} id
     */
    static async newStatus(id: string) {
        try {
            await Payments.ref.doc(id).update({ status: 'COMPLETE' });
            const fire = await Payments.ref.doc(id).get();
            const doc = fire.data();
            if (doc !== undefined) {
                sendSocket(doc.sessionId, 'pay', '');
            }
        } catch (error) {
            console.log(error);
        }
    }
    static async updateErrorPayment(id: string, event: servicePaymentError): Promise<void> {
        await Payments.ref.doc(id).set({'status': event}, {merge: true});
    }
}

export interface IPayments {
    id: string;
    amount: number;
    status: string;
    service: servicePay;
    sessionId: string;
    payLogin: string;
    date?: string;
}
enum statusPay {
    'CANCEL', 'COMPLETE', 'PEDDING', 'RETURN_PAY',
}
enum servicePay {
    'GROUP', 'LOG+PASS'
}

