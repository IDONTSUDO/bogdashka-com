import * as QiwiBillPaymentsAPI from'@qiwi/bill-payments-node-js-sdk';
import * as env from '../config/env.json';
import { v1 as uuidv1 } from 'uuid';
import { IPayments, Payments } from '../model/Payments';
 
const qiwiApi = new QiwiBillPaymentsAPI(env.qiwiServer);


const publicKey = env.qiwiPublic;

export const payProcessing = async (userLogin,amount) =>{

}
 

export const newPay = async (amount,sessionId,serviceType) =>{
    const billId = uuidv1().toUpperCase();
    const objTransaction:IPayments = {
        id:billId,
        amount:amount,
        status:'PEDDING',
        sessionId:sessionId,
        service:serviceType
    }
    await Payments.savePayment(objTransaction)
    const fields = {
        amount: amount,
        currency: 'RUB',
        expirationDateTime: '2018-03-02T08:44:07',
        email: 'example@mail.org',
        account : '',
        successUrl: `${env.publicURL}`
    };
    qiwiApi.createBill( billId, fields ).then( data => {
        console.log(fields);
    });
}