// tslint:disable-next-line:import-spacing
import * as QiwiBillPaymentsAPI from'@qiwi/bill-payments-node-js-sdk';
import * as env from '../config/env.json';
import { v1 as uuidv1 } from 'uuid';
import { IPayments, Payments } from '../model/Payments';
import { isProd } from '../lib/prod';
import { FAKE_ORDER_ID } from '../lib/contsanst';

const qiwiApi = new QiwiBillPaymentsAPI(env.qiwiServer);


const publicKey = env.qiwiPublic;


export const payProcessing = async (userLogin, amount, service, sessionId) => {
    let id;
    if (isProd()) {
       id = uuidv1();
    } else {
        id = FAKE_ORDER_ID;
    }
    const trancaction: IPayments = {
        id: id,
        amount: amount,
        status: 'PEDDING',
        service: service,
        sessionId: sessionId,
        payLogin: userLogin
    };
    await Payments.savePayment(trancaction);
    return id;
};

export const newPay = async (amount, uuid) => {
    if (isProd()) {
        const params = {
            publicKey,
            amount: amount,
            billId: uuid,
            successUrl: `${env.publicURL}/qiwi/complete?=${uuid}`
        };
        const link = qiwiApi.createPaymentForm(params);
        return link;
    } else {
        return 'QIWI линк';
    }
};

