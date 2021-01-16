import db from '../lib/firestore';

export class Settings {
  static ref = db.collection('Settings').doc('Pcd9URGV3CYfrLWBfCW7');
  static async getCourse() {
    const p: any | ISettings = await Settings.ref.get();
    return p.data().course;
  }
}
interface ISettings {
  course: number;
}
