"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerQiwi = void 0;
const express = require("express");
const qiwi_controllers_1 = require("../controllers/qiwi.controllers");
const Payments_1 = require("../model/Payments");
const url = require('url');
const router = express.Router();
router.post('/qiwi/pay', async (req, res) => {
    try {
        const { userLogin, amount, sessionId, serviceType } = req.body;
        console.log(userLogin, amount, sessionId, serviceType, "REQ");
        const id = await qiwi_controllers_1.payProcessing(userLogin, amount, serviceType, sessionId);
        return res.status(200).json(await qiwi_controllers_1.newPay(amount, id));
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
router.post('/qiwi/complete/', async (req, res) => {
    try {
        const id = req.query.id;
        await Payments_1.Payments.newStatus(id);
        return res.status(200).json(true);
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
exports.routerQiwi = router;
//# sourceMappingURL=qiwi.route.js.map