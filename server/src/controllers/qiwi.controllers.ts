// tslint:disable-next-line:import-spacing
import * as QiwiBillPaymentsAPI from'@qiwi/bill-payments-node-js-sdk';
import * as env from '../config/env.json';
import { v1 as uuidv1 } from 'uuid';
import { IPayments, Payments } from '../model/Payments';
import { isProd } from '../lib/prod';

const qiwiApi = new QiwiBillPaymentsAPI(env.qiwiServer);


const publicKey = env.qiwiPublic;


export const payProcessing = async (userLogin, amount, service, sessionId) => {
    let id;
    if (isProd()) {
       id = uuidv1();
    } else {
        id = '1dbc8680-42f4-11eb-85d0-17d057c3393f';
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

