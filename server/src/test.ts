import { Payments } from './model/Payments';

const p = async () => {
  console.log('CRON');
  await Payments.PaymentCron();
};

p();