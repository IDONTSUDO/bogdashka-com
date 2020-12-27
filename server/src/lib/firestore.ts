// tslint:disable-next-line:import-spacing
import * as admin  from 'firebase-admin';
import {conf_fire} from '../config/firestore.conf';
const p: any = conf_fire;
admin.initializeApp({
  credential: admin.credential.cert(p)
});
export default  admin.firestore();

