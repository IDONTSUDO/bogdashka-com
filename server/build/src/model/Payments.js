"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payments = void 0;
const firestore_1 = require("../lib/firestore");
class Payments {
    static async savePayment(transaction) {
        try {
            await Payments.ref.doc(transaction.id).set(transaction);
        }
        catch (error) {
            console.log(error);
        }
    }
    static async newStatus(id) {
        try {
            await Payments.ref.doc(id).update({ status: 'COMPLETE' });
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.Payments = Payments;
Payments.ref = firestore_1.default.collection('Payments');
var statusPay;
(function (statusPay) {
    statusPay[statusPay["CANCEL"] = 0] = "CANCEL";
    statusPay[statusPay["COMPLETE"] = 1] = "COMPLETE";
    statusPay[statusPay["PEDDING"] = 2] = "PEDDING";
    statusPay[statusPay["RETURN_PAY"] = 3] = "RETURN_PAY";
})(statusPay || (statusPay = {}));
var servicePay;
(function (servicePay) {
    servicePay[servicePay["GROUP"] = 0] = "GROUP";
    servicePay[servicePay["LOG+PASS"] = 1] = "LOG+PASS";
})(servicePay || (servicePay = {}));
//# sourceMappingURL=Payments.js.map