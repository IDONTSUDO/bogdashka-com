import db from './lib/firestore';



const cron = require('node-cron');
cron.schedule('* * * * *', async () => {
});
