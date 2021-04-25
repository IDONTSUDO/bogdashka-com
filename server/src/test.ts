import { Payments } from './model/Payments';
import db from './lib/firestore';

const p = async () => {
  console.log('CRON');
 const p =  await db.collection('Payments').doc('300bdf60-9b9c-11eb-aa37-1143c9f3e5ff').get();
 console.log(JSON.stringify(p.data()));
};

p();
