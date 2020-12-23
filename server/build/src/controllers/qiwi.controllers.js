"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPay = exports.payProcessing = void 0;
const QiwiBillPaymentsAPI = require("@qiwi/bill-payments-node-js-sdk");
const env = require("../config/env.json");
const uuid_1 = require("uuid");
const Payments_1 = require("../model/Payments");
const prod_1 = require("../lib/prod");
const qiwiApi = new QiwiBillPaymentsAPI(env.qiwiServer);
const publicKey = env.qiwiPublic;
exports.payProcessing = async (userLogin, amount, service, sessionId) => {
    let id;
    if (prod_1.isProd()) {
        id = uuid_1.v1();
    }
    else {
        id = '1dbc8680-42f4-11eb-85d0-17d057c3393f';
    }
    const trancaction = {
        id: id,
        amount: amount,
        status: 'PEDDING',
        service: service,
        sessionId: sessionId,
        payLogin: userLogin
    };
    await Payments_1.Payments.savePayment(trancaction);
    return id;
};
exports.newPay = async (amount, uuid) => {
    if (prod_1.isProd()) {
        const params = {
            publicKey,
            amount: amount,
            billId: uuid,
            successUrl: `${env.publicURL}/qiwi/complete?=${uuid}`
        };
        const link = qiwiApi.createPaymentForm(params);
        return link;
    }
    else {
        return 'QIWI линк';
    }
};
//# sourceMappingURL=qiwi.controllers.js.map