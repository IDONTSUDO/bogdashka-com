import 'package:flutter/material.dart';

class TextLayouth1 extends StatelessWidget {
  String text;

  TextLayouth1(this.text);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Center(
        child: Text(
          text,
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}
