"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const firestore_1 = require("../lib/firestore");
class Group {
    static findAllGroup() {
    }
    static paymentWithOutGroup(groups, amount) {
        const p = recursive(groups, 0, amount, []);
        return p;
    }
}
exports.Group = Group;
Group.ref = firestore_1.default.collection('Groups');
function recursive(groups, index, totalAmount, PayList) {
    if (groups[index] != undefined) {
        const sum = totalAmount - groups[index].balance;
        PayList.push({ group: groups[index].balance, groupId: groups[index].groupId });
        if (isPositive(sum)) {
            return PayList;
        }
        else {
            return recursive(groups, index + 1, sum, PayList);
        }
    }
    else {
        return { pay_operation: PayList, misingSum: totalAmount };
    }
}
function isPositive(num) {
    var result;
    if (num >= 0) {
        result = false;
    }
    else if (num < 0) {
        result = true;
    }
    return result;
}
//# sourceMappingURL=Group.js.map