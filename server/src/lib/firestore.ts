import * as admin  from 'firebase-admin';
import {conf_fire} from '../config/firestore.conf';
const p:any = conf_fire;
admin.initializeApp({
  credential: admin.credential.cert(p)
});
export default  admin.firestore();


export class FirestoreORM{
  ref: any;
  save(){
    this.ref.save();
  }
}