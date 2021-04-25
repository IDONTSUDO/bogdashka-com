import 'package:adm/components/CopiableText.dart';
import 'package:adm/components/TextLayout1.dart';
import 'package:adm/components/TextLayout4.dart';
import 'package:adm/controllers/payCheck.dart';
import 'package:adm/models/Payment.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../main.dart';

class MainScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Container(
            height: MediaQuery.of(context).size.height, child: Payments()));
  }
}
// test11@test.com 1234567

class Payments extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<List<Payment>>(
        stream: payCheckController.getPayments(),
        builder: (context, snapshot) {
          if (snapshot.data == null) {
            return buildLoadingWidget();
          } else {
            List<Payment> payments = snapshot.data;
            return ListView(children: [
              for (var payment in payments) paymentBuild(payment, context)
            ]);
          }
        });
  }
}

Widget paymentBuild(Payment payment, BuildContext context) {
  if (payment.socialLink != null) {
    return Container(
      margin: EdgeInsets.all(9),
      color: Colors.grey,
      child: Row(
        children: [
          Spacer(),
          Flex(
            direction: Axis.vertical,
            children: [
              TextLayouth1('Robox'),
              TextLayouth4(payment.amount.toString())
            ],
          ),
          Spacer(),
          payment.socialLink != null
              ? (Flex(
                  direction: Axis.vertical,
                  children: [
                    TextLayouth1('Social Link'),
                    TextLayouth4(payment.socialLink),
                    Flex(
                      direction: Axis.horizontal,
                      children: [
                        InkWell(
                          onTap: () => {launch(payment.socialLink)},
                          child: Container(
                            color: Colors.white,
                            height: 20,
                            child: Text('Launch'),
                          ),
                        ),
                        Container(
                          width: 5,
                        ),
                        CopiableText(
                          payment.socialLink,
                          child: Container(
                            color: Colors.white,
                            height: 20,
                            child: Text('Copy'),
                          ),
                        ),
                      ],
                    )
                  ],
                ))
              : (Container()),
          Spacer(),
          OutlinedButton(
            onPressed: () {
              payCheckController.updatePayment(payment.id);
            },
            child: Text('Passsed'),
          ),
          Spacer(),
          Flex(
            direction: Axis.vertical,
            children: [
              TextLayouth1('Log/Pass'),
              Flex(direction: Axis.horizontal, children: [
                TextLayouth4('LOG:'),
                CopiableText(
                  payment.payLogin,
                  child: TextLayouth4(payment.payLogin),
                ),
              ]),
              Flex(direction: Axis.horizontal, children: [
                TextLayouth4('PASS:'),
                CopiableText(
                  payment.userPassword,
                  child: TextLayouth4(payment.userPassword),
                ),
              ]),
            ],
          ),
          Spacer(),
        ],
      ),
    );
  } else {
    print(200);
    return Container();
  }
}
