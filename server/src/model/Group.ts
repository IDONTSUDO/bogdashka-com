import { sign } from 'jsonwebtoken';
import { RESPONCE_ALL_GROUP } from '../lib/contsanst';
import db from '../lib/firestore';
export class Group {
    static ref = db.collection('Groups');
    /**
     * @problem Апдейт баланса групп.
     * @return {*}  {void}
     */
    static async updateBalance(id: string, amount: number): Promise<void> {
        console.log(id);
        const fire: FirebaseFirestore.DocumentData = await Group.ref.doc(id).get();
        if (fire.exists) {
            const doc =  fire.data();
            // tslint:disable-next-line:radix
            await Group.ref.doc(id).set({ 'balance': parseInt(doc.balance) - amount }, {merge: true});
        }
    }
    /**
     * @problem Поиск всех групп с не нулевым баланцем.
     * @return {*}  {Promise<[IGroup]>}
     */
    static async findAllGroup(): Promise<[IGroup]> {
        const fire: FirebaseFirestore.DocumentData = await Group.ref.where('balance', '>', 0).orderBy('balance', 'asc').get();
        const fireDoc: any = [];
        fire.docs.forEach(doc => {
            fireDoc.push(doc.data());
        });
        return fireDoc;
    }
    /**
    * @problem Валидация платежа
    * @param {[IgroupBalanceList]} groups
    * @param {number} index
    * @param {number} totalAmount
    * @param {*} PayList
    * @return {boolean} если баланс слишком маленький
    * @return {IPayList} лист платежа, с каких групп сколько списать.
    */
    static groupValidatePayment(groups: [IGroup], index: number, totalAmount: number, PayList): boolean | IPayList {
        if (groups.length !== 1) {
            if (groups[index] !== undefined) {
                const sum =  totalAmount -  groups[index].balance;
                if (isPositive(sum)) {
                    return {pay_operations: PayList};
                }
                PayList.push({
                    totalAmount: groups[index].balance,
                    groupId: groups[index].groupId,
                    cookies: groups[index].cookies,
                    id: groups[index].id
                });
                return Group.groupValidatePayment(groups, index + 1, sum, PayList);
            }
            return { pay_operations: PayList, misingSum: totalAmount };
        } else {
            const sum =  totalAmount -  groups[index].balance;
            if (isPositive(sum)) {
                PayList.push({
                    totalAmount: sum +  groups[index].balance,
                    groupId: groups[index].groupId,
                    cookies: groups[index].cookies,
                    id: groups[index].id
                });
                return {pay_operations: PayList};
            } else {
                return {misingSum: sum, pay_operations: [{
                    totalAmount: sum +  groups[index].balance,
                    groupId: groups[index].groupId,
                    id: groups[index].id
                }]};
            }
        }
    }
}
export interface IGroup {
    balance: number;
    id: string;
    groupId: string;
    cookies: string;
    status: boolean;
}

/**
 * @problem определение позитивных чисел
 * @param {*} num
 * @return {*}  {boolean}
 */
function isPositive(num): boolean {

    let result;

    if (num > 0) {
        result = false;
    } else if (num < 0) {
        result = true;
    }
    return result;
}
interface IPayList {
    pay_operations: [IpaymentOperation];
    misingSum?: number;
}

interface IpaymentOperation {
    totalAmount: number;
    groupId: string;
    id: string;
}
