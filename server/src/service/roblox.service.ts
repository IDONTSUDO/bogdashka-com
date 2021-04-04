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
    /**
     * @problem Совершение транзакции
     * @param {IPayments} payment
     * @return {Error} если случилась какая то ошибка зависящая от внешнего сервиса.
     * @return {void} если все прошло успешно
     */
    static async transactionClient(payment: IPayments): Promise<Error | void> {
        const { amount, id, payLogin } = payment;
        try {
            const groupList = await Group.findAllGroup();
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
    static async checkOnUserAllGroup(userName: string): Promise<string | [string] | Error> {
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
const cook = 'GuestData=UserID=-1035402760; __utmz=200924205.1614718246.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); gig_bootstrap_3_OsvmtBbTg6S_EUbwTPtbbmoihFY5ON6v6hbVrTbuqpBs7SyF_LQaJwtwKJ60sY1p=_gigya_ver4; .ROBLOSECURITY=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_EFC3C30EE631D4CC53FCEBD636731527C145A036B5552C4D70CCA797D8682FBDC39297410824C38031AA6949265EE1F4339BD60A474162837C81B4686CE0F74039BE0FCD42ADB5C1319FC48A2F6E82782F684034030ECEF2DB81DA83C96DF05C44560CCD71C2068592EF773488453ADB476E21C87D59420A982DFAF6FCA123764490A942B605A03779FCBDDEC38268BC42FCAAB9D291856FA4A69AFF75B2A477ED4FCCE2F06E9541B416844CF824C3AC09F8290F74AEFD295B0E9DCBD1D8338BE3B8B27897506B8D4F1644B34EE32457BB5C6D872DD5C4F23E12A0D60447143F6384EDB43E4EC8070852990A384D17AD64BD9E62FA09C2133E750718B8154C4EA03794D792F07EA9B5D0C0BCA1AEE949200D0A2C3DFAE8E13C1C2B0EB96F6E1F52970639389B108A8C43AF85852CF106D95C1D1F; .RBXID=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4N2I1MTM4Yy04YWQyLTRjNzktODBjMC04NjI1MzExOTQ4YTAiLCJzdWIiOjkzODE4MDg1Nn0.V6d-DvONUCklW6eTDH7r4s-10XfOmr4lqckIe1BqmhY; RBXEventTrackerV2=CreateDate=3/20/2021 10:42:33 AM&rbxid=2310271238&browserid=83646993796; RBXSource=rbx_acquisition_time=4/3/2021 1:19:59 PM&rbx_acquisition_referrer=&rbx_medium=Direct&rbx_source=&rbx_campaign=&rbx_adgroup=&rbx_keyword=&rbx_matchtype=&rbx_send_info=1; RBXSessionTracker=sessionid=61b533f6-1761-4772-9a2a-8c306358d821; __utma=200924205.618666093.1614718246.1617474002.1617523807.7; __utmb=200924205.0.10.1617523807; __utmc=200924205; rbx-ip2=';
// async function main() {
//     const p =   await RobloxService.checkOnUserAllGroup('maksimkaa4221');
//     console.log('RESPONCE', p);
// }
// main();
