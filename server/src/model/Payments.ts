import db from '../lib/firestore';
import { RobloxService } from '../service/roblox.service';
import * as QiwiBillPaymentsAPI from '@qiwi/bill-payments-node-js-sdk';
import * as env from '../config/env.json';
import {to} from '../lib/to';
import { StatisticAll } from './StaticticsAll';
import { Group } from './Group';
const qiwiApi = new QiwiBillPaymentsAPI(env.qiwiServer);


export enum servicePaymentError {
    BALANCE_ERROR = 'BALANCE_ERROR',
    USERISNOT = 'USERISNOT',
    TRANSCACTION_SERVICE_ERROR = 'TRANSCACTION_SERVICE_ERROR'
}
export class Payments {
    static ref = db.collection('Payments');
    static async PaymentCronLogPass() {
        const TodayDateBegin = new Date();
        const TodayDateEnd = new Date();
        TodayDateBegin.setHours(0), TodayDateBegin.setUTCHours(0), TodayDateBegin.setMinutes(0), TodayDateBegin.setSeconds(0);
        TodayDateEnd.setHours(23), TodayDateEnd.setUTCHours(23), TodayDateEnd.setMinutes(59), TodayDateEnd.setSeconds(59);
        const beginDate = TodayDateBegin.toJSON();
        const endDate = TodayDateEnd.toJSON();
        const fire = await Payments.ref.where(
            'status', '==', 'PEDDING'
        ).where('date', '>=', beginDate).where('date', '<=', endDate).where('servicePay', '==', servicePay.LOGPASS).get();
        fire.docs.forEach(async (firedoc) => {
            const doc = firedoc.data() as IPayments;
            const [err, pay]  = await to(qiwiApi.getBillInfo(doc.id));
            if (pay !== undefined && pay.status !== undefined && pay.status.value === 'PAID' && pay.billId !== undefined ) {
                console.log(doc.id);
               await Payments.newStatus(doc.id);
            }
        });
    }
    static async PaymentCronGroupPay() {
        const TodayDateBegin = new Date();
        const TodayDateEnd = new Date();
        TodayDateBegin.setHours(0), TodayDateBegin.setUTCHours(0), TodayDateBegin.setMinutes(0), TodayDateBegin.setSeconds(0);
        TodayDateEnd.setHours(23), TodayDateEnd.setUTCHours(23), TodayDateEnd.setMinutes(59), TodayDateEnd.setSeconds(59);
        const beginDate = TodayDateBegin.toJSON();
        const endDate = TodayDateEnd.toJSON();
        const fire = await Payments.ref.where(
            'status', '==', 'PEDDING'
        ).where('date', '>=', beginDate).where('date', '<=', endDate).where('servicePay', '==', servicePay.GROUP).get();
            fire.docs.forEach(async firedoc => {
                const doc = firedoc.data() as IPayments;
                if (doc.pay !== undefined && doc.pay === PaySystem.QIWI) {
                    const [err, pay]  = await to(qiwiApi.getBillInfo(doc.id));
                    if (pay !== undefined && pay.status !== undefined && pay.status.value === 'PAID' && pay.billId !== undefined ) {
                        const docId = pay.billId;
                        const calculatedPayment: IPayments = await Payments.getPayment(docId);
                        const paymentBuild = await  RobloxService.userGroupPaymentBuild(calculatedPayment);
                        if (!(paymentBuild instanceof Error)) {
                            await RobloxService.transactionClientGroup(calculatedPayment, paymentBuild);
                        }
                        await StatisticAll.updateTransaction(pay.totalAmount);
                        await Payments.newStatus(docId);
                    }
                }
            });
    }
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
        } catch (error) {
            console.log(error);
        }
    }
    static async updateErrorPayment(id: string, event: servicePaymentError): Promise<void> {
        await Payments.ref.doc(id).set({ 'status': event }, { merge: true });
    }
    static async paymentInfo(id: string) {
      const fire =   await Payments.ref.doc(id).get();
        if (fire.exists) {
            const doc =  fire.data() as IPayments;
            return doc.status;
        }
    }
}
export interface IPaymentsGroup extends IPayments {
    socialLink: string;
    userPassword: string;
    // payRobox: number;
}
export interface IPayments {
    id: string;
    amount: number;
    status: string;
    service: servicePay;
    sessionId: string;
    payLogin: string;
    date?: string;
    userId?: string;
    pay: PaySystem;
    roboxPay: boolean;
    servicePay: servicePay;
    payment?: string;
}
export enum statusPay {
    'CANCEL', 'COMPLETE', 'PEDDING', 'RETURN_PAY', 'ERROR',
}
export enum servicePay {
    GROUP = 'GROUP', LOGPASS = 'LOG+PASS'
}
export enum PaySystem {
    QIWI = 'QIWI',
    FREEKASSA = 'FREEKASSA'
}
