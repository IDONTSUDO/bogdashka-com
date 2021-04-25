import 'package:adm/models/Payment.dart';
import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';

class Controller {
  Stream<List<Payment>> get subject => getPayments();
  void updatePayment(String id) {
    FirebaseFirestore.instance
        .collection('Payments')
        .doc(id)
        .update({'payment': 'COMPELTE'});
  }

  Stream<List<Payment>> getPayments() {
    final Stream<QuerySnapshot> stream = FirebaseFirestore.instance
        .collection('Payments')
        .where('status', isEqualTo: 'COMPLETE')
        .where('service', isEqualTo: 'LOG+PASS')
        .where('payment', isEqualTo: 'AWAITING')
        .snapshots();
    return stream.map((qShot) => qShot.docs.map((doc) {
          var fire = doc.data();

          return Payment.fromJson(fire);
        }).toList());
  }
}

final payCheckController = Controller();
