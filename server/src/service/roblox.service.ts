import { cpuUsage } from 'process';
import { RESPONCE_ALL_GROUP, ROBLOC_GROUP_URL } from '../lib/contsanst';
import { RobloxApi } from '../lib/roblox.http';
import { sendSocket } from '../main';
import { Group } from '../model/Group';
import { IPayments, Payments } from '../model/Payments';
import { IPaymentsBlock, PaymentsBlock, TYPEPAYMENTBLOCK } from '../model/PaymentsBlock';

export class RobloxService {
    static async amountValid(amount: number) {
        const groupList = await Group.findAllGroup();
        let allBalance = 0;
        groupList.forEach((group) => {
            allBalance = + group.balance;
        });
        return  0 <= allBalance - amount;
    }
    static async transactionClient(payment: IPayments) {
        const { amount, sessionId, id, payLogin } = payment;
        try {
            const groupList = await Group.findAllGroup();
            const paymentValid: any = Group.groupValidatePayment(groupList, 0, amount, []);
            console.log(paymentValid);
            if (paymentValid.pay_operations) {
                for (const pay of paymentValid.pay_operations) {
                    await RobloxApi.transaction(pay.cookies, pay.groupId, pay.totalAmount, pay.userId);
                    console.log(pay.id, pay.totalAmount);
                    await Group.updateBalance(pay.id, pay.totalAmount);
                }
                if (paymentValid.misingSum !== undefined) {
                    const doc: IPaymentsBlock = {
                        userLogin: payLogin,
                        date: new Date().toJSON(),
                        amount: paymentValid.misingSum,
                        operationID: id,
                        type: TYPEPAYMENTBLOCK.ERROR
                    };
                    await PaymentsBlock.new(doc);
                }
                if (paymentValid.pay_operations.length === 0) {
                    sendSocket(sessionId, 'badPay', 'PayBad');
                } else {
                    sendSocket(sessionId, 'pay', 'PayComplete');
                }
            }
        } catch (error) {
            console.log(error);
            // await Payments.updateErrorPayment(id, error);
            throw new Error('');
            // TODO: ERROR
        }
    }
    /**
     * @problem Состоит ли пользователь во все возможных группах?
     * @param {string} user
     * @return {string} если пользователь  состоит во всех группах сервиса.
     * @return {[number]} список групп в которых пользователь не состоит.
     */
    static async checkOnUserAllGroup(user: string): Promise<string | [string]> {
        const responce: [string] | any = [];
        const groupList = await Group.findAllGroup();
        for (const group of groupList) {
            const result = await RobloxApi.UserLoginWithGroup(user, group.cookies, group.id!);
            if (typeof result === 'number') {
                responce.push(`${ROBLOC_GROUP_URL}${result}`);
            }
        }
        if (responce.length === 0) {
            return RESPONCE_ALL_GROUP;
        } else {
            return responce;
        }
    }
}
