import * as React from 'react';
import { signIn } from '../api/Auth';
import { auth } from '../lib/firestore';
export interface IAuthPageProps {
}

export default class AuthPage extends React.Component<IAuthPageProps> {
  auth = () => {
    const email = 'test@test.com'
    const password = 'test123';
    auth.signInWithEmailAndPassword(email, password).then(data => {
      signIn(data.user.email)
    }).catch(error => {

      console.error("Error signing in with password and email", error);
    });
  }
  public render() {
    return (
      <div onClick={(e) => this.auth()}>
        eqwwe
      </div>
    );
  }
}
