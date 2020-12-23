"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreORM = void 0;
const admin = require("firebase-admin");
const firestore_conf_1 = require("../config/firestore.conf");
const p = firestore_conf_1.conf_fire;
admin.initializeApp({
    credential: admin.credential.cert(p)
});
exports.default = admin.firestore();
class FirestoreORM {
    save() {
        this.ref.save();
    }
}
exports.FirestoreORM = FirestoreORM;
//# sourceMappingURL=firestore.js.map