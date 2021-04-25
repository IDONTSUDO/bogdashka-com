// To parse this JSON data, do
//
//     final payment = paymentFromJson(jsonString);

import 'dart:convert';

Payment paymentFromJson(String str) => Payment.fromJson(json.decode(str));

String paymentToJson(Payment data) => json.encode(data.toJson());

class Payment {
  Payment({
    this.id,
    this.roboxPay,
    this.payLogin,
    this.sessionId,
    this.service,
    this.pay,
    this.socialLink,
    this.date,
    this.servicePay,
    this.status,
    this.amount,
    this.userPassword,
  });

  String id;
  bool roboxPay;
  String payLogin;
  String sessionId;
  String service;
  String pay;
  String socialLink;
  DateTime date;
  String servicePay;
  String status;
  int amount;
  String userPassword;

  factory Payment.fromJson(Map<String, dynamic> json) => Payment(
        id: json["id"],
        roboxPay: json["roboxPay"],
        payLogin: json["payLogin"],
        sessionId: json["sessionId"],
        service: json["service"],
        pay: json["pay"],
        socialLink: json["socialLink"],
        date: DateTime.parse(json["date"]),
        servicePay: json["servicePay"],
        status: json["status"],
        amount: json["amount"],
        userPassword: json["userPassword"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "roboxPay": roboxPay,
        "payLogin": payLogin,
        "sessionId": sessionId,
        "service": service,
        "pay": pay,
        "socialLink": socialLink,
        "date": date.toIso8601String(),
        "servicePay": servicePay,
        "status": status,
        "amount": amount,
        "userPassword": userPassword,
      };
}
