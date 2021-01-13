// tslint:disable-next-line:import-spacing
import * as QiwiBillPaymentsAPI from '@qiwi/bill-payments-node-js-sdk';
import * as env from '../config/env.json';
import { v1 as uuidv1 } from 'uuid';
import { IPayments, Payments, PaySystem } from '../model/Payments';
import { isProd } from '../lib/prod';
import { FAKE_ORDER_ID } from '../lib/contsanst';
import { encrypt } from '../lib/crypto';

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
        payLogin: userLogin,
        pay: PaySystem.QIWI
    };
    await Payments.savePayment(trancaction);
    return id;
};

export const newPayQiwi = async (amount, uuid) => {
    if (isProd()) {
        try {
            const crypt = encrypt(uuid);
            const params = {
                publicKey,
                amount: amount,
                comment: `${amount * 2} количество робуксов, курс 1 к 2`,
                billId: uuid,
                successUrl: `${env.publicURL}/qiwi/complete?=${crypt.content}===${crypt.iv}`,
                email: 'm@ya.ru'
            };
            const link = qiwiApi.createPaymentForm(params);
            return link;
        } catch (error) {
            console.log(error);
        }
    } else {
        return 'QIWI линк';
    }
};

