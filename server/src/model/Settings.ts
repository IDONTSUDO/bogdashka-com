import db from '../lib/firestore';

export class Settings {
  static ref = db.collection('Settings');
  static async getCourse(courseType: CourseType): Promise<number> {
    const data = (await Settings.ref.doc(courseType).get()).data() as ISettings;
    return parseInt(data.course) as number;
  }
}
interface ISettings {
  course: string;
  maxRoboxPay: string;
  mininalPay: string;
}
export enum CourseType { GROUP = 'group' }
