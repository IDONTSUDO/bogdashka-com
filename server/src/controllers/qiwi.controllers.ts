// tslint:disable-next-line:import-spacing
import * as QiwiBillPaymentsAPI from '@qiwi/bill-payments-node-js-sdk';
import * as env from '../config/env.json';
import { v1 as uuidv1 } from 'uuid';
import { IPayments, IPaymentsGroup, Payments, PaySystem, servicePay } from '../model/Payments';
import { isProd } from '../lib/prod';
import { FAKE_ORDER_ID } from '../lib/contsanst';
import { encrypt } from '../lib/crypto';
import { CourseType, Settings } from '../model/Settings';

const qiwiApi = new QiwiBillPaymentsAPI(env.qiwiServer);


const publicKey = env.qiwiPublic;

export const payProcessQiwiGroup = async (userLogin, amount, serviceType, sessionId, userPassword, socialLink): Promise<string> => {
    let id;
    if (isProd()) {
        id = uuidv1();
    } else {
        id = FAKE_ORDER_ID;
    }
    const finalAmount = amount * await Settings.getCourse(CourseType.GROUP);
    const trancaction: IPaymentsGroup = {
        id: id,
        amount:  parseInt(finalAmount.toFixed()),
        status: 'PEDDING',
        service: servicePay.LOGPASS,
        sessionId: sessionId,
        payLogin: userLogin,
        pay: PaySystem.QIWI,
        roboxPay: false,
        userPassword: userPassword,
        socialLink: socialLink,
        servicePay: servicePay.LOGPASS,
        payment: 'AWAITING'
    };
    await Payments.savePayment(trancaction);
    return id;
};

export const payProcessing = async (userLogin: string, amount: number, service: servicePay, sessionId: string, servicePay: servicePay) => {
    console.log(userLogin, amount, service, sessionId, servicePay);
    let id;
    if (isProd()) {
        id = uuidv1();
    } else {
        id = FAKE_ORDER_ID;
    }
    const finalAmount = amount * await Settings.getCourse(CourseType.GROUP);
    const trancaction: IPayments = {
        id: id,
        amount:  parseInt(finalAmount.toFixed()),
        status: 'PEDDING',
        service: service,
        sessionId: sessionId,
        payLogin: userLogin,
        pay: PaySystem.QIWI,
        roboxPay: false,
        servicePay: servicePay
    };
    await Payments.savePayment(trancaction);
    return id;
};

export const newPayQiwi = async (amount: number, userLogin: string, uuid: string, courseType: CourseType) => {
    if (isProd()) {
        const p = amount * await Settings.getCourse(courseType);
        try {
            const params = {
                publicKey,
                amount: amount,
                comment: `${parseInt(p.toFixed())} количество робуксов, ник: ${userLogin}`,
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
