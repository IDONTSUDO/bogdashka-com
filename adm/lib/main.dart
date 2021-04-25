import 'package:adm/screens/login_screen.dart';
import 'package:adm/screens/MainScreen/main_screen.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final Future<FirebaseApp> _initialization = Firebase.initializeApp();
    return FutureBuilder(
        future: _initialization,
        builder: (context, appSnapshot) {
          return MaterialApp(
              debugShowCheckedModeBanner: false,
              title: 'adm',
              theme: ThemeData(
                accentColor: Colors.black,
                primaryColor: Colors.black,
                scaffoldBackgroundColor: Colors.white,
                visualDensity: VisualDensity.adaptivePlatformDensity,
              ),
              home: appSnapshot.connectionState != ConnectionState.done
                  ? buildLoadingWidget()
                  : StreamBuilder(
                      stream: FirebaseAuth.instance.userChanges(),
                      builder: (ctx, userSnapshot) {
                        if (userSnapshot.connectionState ==
                            ConnectionState.waiting) {
                          return buildLoadingWidget();
                        }
                        if (userSnapshot.hasData) {
                          return Stack(children: [MainScreen()]);
                        } else {
                          return LoginScreen();
                        }
                      }));
        });
  }
}

Widget buildLoadingWidget() {
  return Center(child: CircularProgressIndicator());
}
