// tslint:disable-next-line:import-spacing
import * as QiwiBillPaymentsAPI from '@qiwi/bill-payments-node-js-sdk';
import * as env from '../config/env.json';
import { v1 as uuidv1 } from 'uuid';
import { IPayments, Payments, PaySystem } from '../model/Payments';
import { isProd } from '../lib/prod';
import { FAKE_ORDER_ID } from '../lib/contsanst';
import { encrypt } from '../lib/crypto';
import { Settings } from '../model/Settings';

const qiwiApi = new QiwiBillPaymentsAPI(env.qiwiServer);


const publicKey = env.qiwiPublic;


export const payProcessing = async (userLogin, amount, service, sessionId) => {
    let id;
    if (isProd()) {
        id = uuidv1();
    } else {
        id = FAKE_ORDER_ID;
    }
    const finalAmount = amount * await Settings.getCourse();
    const trancaction: IPayments = {
        id: id,
        amount: finalAmount,
        status: 'PEDDING',
        service: service,
        sessionId: sessionId,
        payLogin: userLogin,
        pay: PaySystem.QIWI
    };
    await Payments.savePayment(trancaction);
    return id;
};

export const newPayQiwi = async (amount, userLogin, uuid) => {
    if (isProd()) {
        try {
            const crypt = encrypt(uuid);
            const params = {
                publicKey,
                amount: amount,
                comment: `${amount * await Settings.getCourse()} количество робуксов, ник: ${userLogin}`,
                billId: uuid,
                successUrl: `${env.frontURL}${uuid}`,
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
