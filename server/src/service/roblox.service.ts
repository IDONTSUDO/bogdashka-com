import { RobloxApi } from '../lib/roblox.http';
import { sendSocket } from '../main';
import { Group } from '../model/Group';
import { IPayments, Payments } from '../model/Payments';

export class RobloxService {
    static async transactionClient(payment: IPayments) {
        const { amount, sessionId, id } = payment;
        try {
            const groupList = await Group.findAllGroup();
            const paymentValid: any = Group.groupValidatePayment(groupList, 0, amount, []);
            if (paymentValid) {
                for (const pay of paymentValid) {
                    await RobloxApi.transaction(pay.cookies, pay.groupId, pay.amount, pay.userId);
                    await Group.updateBalance(pay.id, pay.amount);
                }
                sendSocket(sessionId, 'pay', 'PayComplete');
            }
        } catch (error) {
            await Payments.updateErrorPayment(id, error);
            throw new Error('');
            // TODO: ERROR
        }
    }
}
