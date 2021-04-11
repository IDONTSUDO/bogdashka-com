import { RESPONCE_ALL_GROUP, ROBLOC_GROUP_URL } from '../lib/contsanst';
import { RobloxApi } from '../helper/roblox.http';
import { Group } from '../model/Group';
import { IPayments, Payments, servicePaymentError } from '../model/Payments';
import { IPaymentsBlock, PaymentsBlock, TYPEPAYMENTBLOCK } from '../model/PaymentsBlock';
import { StatisticService } from './statistic.service';
import { updateBalance, updateTransaction, upStatistic } from '../io';

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
                allBalance = +  Math.floor(group.balance);
            });
            return 0 <= allBalance - amount;
        }
        return false;
    }
    static  async  userGroupPaymentBuild(payment: IPayments)  {
        const user = payment.payLogin;
       const result =  await RobloxService.checkOnUserAllGroup(user);
       if (!(result instanceof  Error)) {
          return result.filter((n) => n.status === true);
       } else {
           return result;
       }

    }
    /**
     * @problem Совершение транзакции
     * @param {IPayments} payment
     * @return {Error} если случилась какая то ошибка зависящая от внешнего сервиса.
     * @return {void} если все прошло успешно
     */
    static async transactionClientGroup(payment: IPayments, group: IcheckGroup[]): Promise<Error | void> {
        const { amount, id, payLogin } = payment;
        try {
            const groupList = await Group.groupFindAllByIdByCheckGroup(group);
            console.log(groupList);
            const paymentValid = Group.groupValidatePayment(groupList, 0, amount, []);
            let finalTotalTranscaction = 0;
            const userId = await RobloxApi.userIdAsLogin(payLogin, groupList[0].cookies);
            if (Array.isArray(groupList) && groupList.length > 0) {
                if (userId === undefined) {
                    return await Payments.updateErrorPayment(id, servicePaymentError.USERISNOT);
                }
                if (typeof paymentValid !== 'boolean') {
                    if (paymentValid.pay_operations) {

                        for (const pay of paymentValid.pay_operations) {
                            try {
                                if (pay.totalAmount !== 0) {
                                    finalTotalTranscaction = finalTotalTranscaction + pay.totalAmount;
                                    const transcationStatus = await RobloxApi.transaction(
                                    pay.cookies,
                                    pay.groupId,
                                    pay.totalAmount,
                                    userId);
                                    if (transcationStatus) {
                                        await Group.updateBalance(pay.id, pay.totalAmount);
                                        await StatisticService.updateTransation( Math.floor(pay.totalAmount));
                                        updateTransaction(pay.totalAmount);
                                    } else {
                                        Payments.updateErrorPayment(id, servicePaymentError.TRANSCACTION_SERVICE_ERROR);
                                    }
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }
                        const groupBalanceActual = Group.groupBalanceActual(groupList, finalTotalTranscaction);
                        updateBalance(groupBalanceActual);
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
    static async  checkUserAllGroup(user: string) {
        const groups = await Group.findAll();
        groups.forEach(async (group) => {
            const {cookies, groupId} = group;
            // const result = await RobloxApi.UserLoginWithGroup(user, cookies, );
        });
    }
    /**
     * @problem Состоит ли пользователь во все возможных группах?
     * @param {string} user
     * @return {string} если пользователь  состоит во всех группах сервиса.
     * @return {[number]} список групп в которых пользователь не состоит.
     */
    static async checkOnUserAllGroup(userName: string): Promise<IcheckGroup[] | Error> {
        const groups = await Group.findAllGroup();
        if (groups !== undefined) {
            const userId  = await RobloxApi.userIdAsLogin(userName, groups[0].cookies);
            if (userId !== undefined) {
                const responce: string | any = [];
                if (groups[0] !== undefined && groups[0].cookies !== undefined) {
                    for await (const group of groups) {
                        const result = await RobloxApi.checkUserDateJoinAtGroup(userId, group.groupId, group.cookies);
                        responce.push({
                            id: group.id,
                            roboxId: group.groupId,
                            status: result,
                            url: group.url,
                            balance: group.balance
                        });
                    }
                }
                return responce;
            } else {
                return Error('Не могу найти такого человка');
            }
        } else {
            return Error('Техническая ошибка');
        }
}
}
export interface IcheckGroup {
    id: string;
    roboxId: string;
    status: boolean;
    url: string;
    balance: number;
}
