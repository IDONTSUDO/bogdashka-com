import { RESPONCE_ALL_GROUP, ROBLOC_GROUP_URL } from '../lib/contsanst';
import { RobloxApi } from '../helper/roblox.http';
import { Group } from '../model/Group';
import { IPayments, Payments, PaySystem, servicePaymentError } from '../model/Payments';
import { IPaymentsBlock, PaymentsBlock, TYPEPAYMENTBLOCK } from '../model/PaymentsBlock';
import { StatisticService } from './statistic.service';
import { isProd } from '../lib/prod';
import { upStatistic } from '../io';

export class RobloxService {


    /**
     * @problem Проверка на валидность баланcа перед выставлением счета.
     * @param {number} amount
     * @return {boolean} ответ на вопрос валиден ли баланс.
     */
    static async amountValid(amount: number) {
        const groupList: any = await Group.findAllGroup();
        if (groupList && groupList.length !== 0) {
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
        const { amount, id, payLogin } = payment;
        try {
            const groupList = await Group.findAllGroup();
            const paymentValid = Group.groupValidatePayment(groupList, 0, amount, []);
            const userId = await RobloxApi.userIdAsLogin(payLogin, groupList[0].cookies);
            if (Array.isArray(groupList) && groupList.length > 0) {
                console.log(200);
                if (userId === undefined) {
                    return await Payments.updateErrorPayment(id, servicePaymentError.USERISNOT);
                }
                if (typeof paymentValid !== 'boolean') {
                    console.log(201);
                    if (paymentValid.pay_operations) {
                        console.log(202);
                        for (const pay of paymentValid.pay_operations) {
                            try {
                                if (pay.totalAmount !== 0) {
                                    console.log(2000);
                                    const transcationStatus = await RobloxApi.transaction(
                                    pay.cookies,
                                    pay.groupId,
                                    pay.totalAmount,
                                    userId);
                                    if (transcationStatus) {
                                        await Group.updateBalance(pay.id, pay.totalAmount);
                                        await StatisticService.updateTransation(pay.totalAmount);
                                        // upStatistic(pay.totalAmount);
                                    } else {
                                        Payments.updateErrorPayment(id, servicePaymentError.TRANSCACTION_SERVICE_ERROR);
                                    }
                                }
                            } catch (error) {
                                console.log(error);
                            }
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
                    }
                } else {
                    Payments.updateErrorPayment(id, servicePaymentError.BALANCE_ERROR);
                }
            } else {
                Payments.updateErrorPayment(id, servicePaymentError.BALANCE_ERROR);
            }
        } catch (error) {
            console.log(error);
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
        let responce: string | any = [];
        const groupList = await Group.findAllGroup();
        if (groupList[0] !== undefined && groupList[0].cookies !== undefined) {
            const result = await RobloxApi.UserLoginWithGroup(user, groupList[0].cookies, groupList);
            responce = result;
        }
        if (typeof responce === 'string') {
            return RESPONCE_ALL_GROUP;
        } else {
            return responce;
        }
    }
}
