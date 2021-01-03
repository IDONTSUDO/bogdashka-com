import { RESPONCE_ALL_GROUP, ROBLOC_GROUP_URL } from '../lib/contsanst';
import { RobloxApi } from '../helper/roblox.http';
import { sendSocket } from '../io';
import { Group } from '../model/Group';
import { IPayments, Payments, servicePaymentError } from '../model/Payments';
import { IPaymentsBlock, PaymentsBlock, TYPEPAYMENTBLOCK } from '../model/PaymentsBlock';
import { StatisticService } from './statistic.service';

export class RobloxService {


    /**
     * @problem Проверка на валидность баланcа перед выставлением счета.
     * @param {number} amount
     * @return {boolean} ответ на вопрос валиден ли баланс.
     */
    static async amountValid(amount: number) {
        const groupList: any = await Group.findAllGroup();
        console.log(groupList);
        if (groupList && groupList.length !== 0) {
            console.log(200);
            let allBalance = 0;
            groupList.forEach((group) => {
                allBalance = + group.balance;
            });
            return 0 <= allBalance - amount;
        }
        return false;
    }
    /**
     * @problem Совершение транзакции
     * @param {IPayments} payment
     * @return {Error} если случилась какая то ошибка зависящая от внешнего сервиса.
     * @return {void} если все прошло успещно
     */
    static async transactionClient(payment: IPayments): Promise<Error | void> {
        const { amount, sessionId, id, payLogin } = payment;
        try {
            const groupList = await Group.findAllGroup();
            const paymentValid = Group.groupValidatePayment(groupList, 0, amount, []);
            if (typeof paymentValid !== 'boolean') {
                if (paymentValid.pay_operations) {
                    for (const pay of paymentValid.pay_operations) {
                        await RobloxApi.transaction(pay.cookies, pay.groupId, pay.totalAmount, pay.userId);
                        await Group.updateBalance(pay.id, pay.totalAmount);
                        await StatisticService.updateTransation(pay.totalAmount);
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
                    if (paymentValid.pay_operations.length === 1) {
                        sendSocket(sessionId, 'pay', 'PayComplete');
                    } else {
                        sendSocket(sessionId, 'badPay', 'PayBad');
                    }
                }
            } else {
                // ЕСЛИ ПЛАТЕЖ ПО НЕ ПРЕДВИДЕННЫМ ОБСТОЯТЕЛЬСТВАМ ПРОШЕЛ ТО ЕГО НАДО ВЫСТАВИТЬ АПДЕЙТНУТЬ
                Payments.updateErrorPayment(id, servicePaymentError.BALANCE_ERROR);
            }
        } catch (error) {
            throw new Error(`${JSON.stringify(error)}`);
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
