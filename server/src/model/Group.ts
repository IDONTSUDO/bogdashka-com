import db from '../lib/firestore';
export class Group {
    static ref = db.collection('Groups');
    static findAllGroup() {

    }
    static paymentWithOutGroup(groups: [IgroupBalanceList], amount: number) {
        const p = recursive(groups, 0, amount, [])
        return p;
    }
}
export interface IGroup {
    balace: number;
    id?: string;
    groupId: string;
    cookies: string;
    status:boolean;
}
interface IgroupBalanceList {
    groupId: string;
    balance: number
}

function recursive(groups: [IgroupBalanceList], index: number, totalAmount: number, PayList) {
    if (groups[index] != undefined) {
        const sum = totalAmount - groups[index].balance;
        PayList.push({ group: groups[index].balance, groupId: groups[index].groupId })
        if (isPositive(sum)) {
            return PayList;
        } else {
            return recursive(groups, index + 1, sum, PayList)
        }
    } else {
        
        return {pay_operation:PayList,misingSum:totalAmount};
    }
}
function isPositive(num) {

    var result;

    if (num >= 0) {
        result = false;
    } else if (num < 0) {
        result = true;
    }
    return result;
}