import db from './lib/firestore';
import { Payments } from './model/Payments';



const cron = require('node-cron');
cron.schedule('* * * * *', async () => {
  console.log('CRON RUNIING');
  await Payments.PaymentCron();
});
