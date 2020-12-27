import db from '../lib/firestore';
export class Group {
    static ref = db.collection('Groups');
    /**
     * @problem Апдейт баланца групп.
     * @static
     * @return {*}  {void}
     */
    static async updateBalance(id: string, amount: number): Promise<void> {
        const fire: FirebaseFirestore.DocumentData = await Group.ref.doc(id).get();
        if (fire.exists) {
            await Group.ref.doc(id).set({'balance': fire.balance - amount}, {merge: true});
        }
    }
    /**
     * @problem Поиск всех групп с не нулевым баланцем.
     * @static
     * @return {*}  {Promise<[IGroup]>}
     */
    static async findAllGroup(): Promise<[IGroup]> {
        const fire: any = await Group.ref.where('balance', '>', '0').get();
        return fire.docs;
    }
    /**
    * @problem Валидация платежа
    * @param {[IgroupBalanceList]} groups
    * @param {number} index
    * @param {number} totalAmount
    * @param {*} PayList
    * @return {boolean} если баланс слишком маленький
    * @return {void} потому что рекурсия
    * @return {IPayList} лист платежа, с каких групп сколько списать.
    */
    static groupValidatePayment(groups: [IgroupBalanceList], index: number, totalAmount: number, PayList): boolean | void | IPayList {
        if (groups[index] !== undefined) {
            const sum = totalAmount - groups[index].balance;
            PayList.push({ totalAmount: groups[index].balance, groupId: groups[index].groupId, cookies: groups[index].cookies });
            if (isPositive(sum)) {
                return PayList;
            } else {
                return Group.groupValidatePayment(groups, index + 1, sum, PayList);
            }
        } else {

            return { pay_operations: PayList, misingSum: totalAmount };
        }
    }
}
export interface IGroup {
    balance: number;
    id?: string;
    groupId: string;
    cookies: string;
    status: boolean;
}
interface IgroupBalanceList {
    balance: number;
    id?: string;
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

    if (num >= 0) {
        result = false;
    } else if (num < 0) {
        result = true;
    }
    return result;
}
