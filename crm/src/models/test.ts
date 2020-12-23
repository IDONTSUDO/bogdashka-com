import { firestore } from '../lib/firestore';
export const test = async () =>{
    let final = [];
    await firestore.collection('Groups').onSnapshot((snap) => {
        snap.forEach((doc) => {
            final.push(doc.data())
        })
    })
    return final;
}