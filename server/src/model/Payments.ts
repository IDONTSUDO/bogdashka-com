import db from '../lib/firestore';

export class Payments {
    static ref = db.collection('Payments')
    static async savePayment(transaction: IPayments) {
        try {
            await Payments.ref.doc(transaction.id).set(transaction);
        } catch (error) {
            console.log(error);
        }
    }
    static async newStatus(id){
        try {   
           await Payments.ref.doc(id).update({status:'COMPLETE'}); 
        } catch (error) {
            console.log(error);
        }
    }
}

export interface IPayments {
    id: string;
    amount: number;
    status: string;
    service: servicePay;
    sessionId: string;
    payLogin:string;
}
enum statusPay {
    'CANCEL', 'COMPLETE', 'PEDDING', 'RETURN_PAY',
}
enum servicePay {
    'GROUP', 'LOG+PASS'
}