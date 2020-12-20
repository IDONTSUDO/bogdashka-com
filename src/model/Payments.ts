
export class Payments{
    static async savePayment(transaction:IPayments){

    }
}

export interface IPayments{
    id:string;
    amount:number;
    status:string;
    service:servicePay;
    sessionId:string;
}
enum statusPay{
    'CANCEL','COMPLETE','PEDDING','RETURN_PAY',
}
enum servicePay{
    'GROUP','LOG+PASS'
}