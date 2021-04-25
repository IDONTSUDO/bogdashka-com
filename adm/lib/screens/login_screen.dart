import 'package:adm/controllers/notificationBloc.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class LoginScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var authData = {'email': '', 'password': ''};
    return SizedBox(
      height: MediaQuery.of(context).size.height,
      width: MediaQuery.of(context).size.width,
      child: Scaffold(
        body: SizedBox(
          height: MediaQuery.of(context).size.height,
          width: MediaQuery.of(context).size.width,
          child: Center(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Form(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    Container(
                      width: 300,
                      child: TextFormField(
                        decoration: const InputDecoration(
                          hintText: 'ЛОГИН',
                        ),
                        onChanged: (e) => {
                          // newMailingObj.addAll({'text': e})
                          authData.addAll({'email': e})
                        },
                        validator: (value) {
                          if (value.isEmpty) {
                            return 'Введите текст рассылки';
                          }
                          return null;
                        },
                      ),
                    ),
                    Container(
                      width: 300,
                      child: TextFormField(
                        decoration: const InputDecoration(
                          hintText: 'ПАРОЛЬ',
                        ),
                        onChanged: (e) => {
                          authData.addAll({'password': e})
                        },
                        validator: (value) {
                          if (value.isEmpty) {
                            return 'Введите текст рассылки';
                          }
                          return null;
                        },
                      ),
                    ),
                    Padding(
                      padding: EdgeInsets.all(9),
                    ),
                    RaisedButton(
                      color: Colors.red,
                      onPressed: () async {
                        if (authData['email'] == '') {
                          await notificationBloc.notification(
                              'поле ЛОГИН является обязательным!112');
                        }
                        if (authData['password'] == '') {
                          await notificationBloc.notification(
                              'поле ПАРОЛЬ является обязательным!112');
                        }
                        return await fireStoreLogin(
                            authData['email'], authData['password']);
                      },
                      child: Text(
                        'Войти',
                        style: TextStyle(fontSize: 16, color: Colors.white),
                      ),
                    )
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

Future<void> fireStoreLogin(String email, String password) async {
  try {
    UserCredential userCredential = await FirebaseAuth.instance
        .signInWithEmailAndPassword(email: email, password: password);
  } on FirebaseAuthException catch (e) {
    if (e.code == 'invalid-email') {
      await notificationBloc
          .notification('Адрес электронной почты неправильно отформатирован.');
    }
    if (e.code == 'user-not-found') {
      await notificationBloc.notification(
          'Для этого адреса электронной почты не найдено ни одного пользователя.');
    } else if (e.code == 'wrong-password') {
      await notificationBloc
          .notification('Для этого пользователя введен неверный пароль.');
    }
  }
}
