import 'package:flutter/material.dart';

class TextLayouth4 extends StatelessWidget {
  String text;

  TextLayouth4(this.text);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Center(
        child: Text(
          text,
          style: TextStyle(fontSize: 13),
        ),
      ),
    );
  }
}
