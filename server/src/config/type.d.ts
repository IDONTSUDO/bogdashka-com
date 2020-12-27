interface IpaymentOperation {
  totalAmount: number;
  groupId: string;
}
interface IPayList {
  pay_operations: IpaymentOperation;
  misingSum: number;
}