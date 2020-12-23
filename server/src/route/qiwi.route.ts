import { constants } from 'buffer';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import { newPay, payProcessing } from '../controllers/qiwi.controllers';
import { Payments } from '../model/Payments';
const url = require('url');

const router = express.Router();

router.post('/qiwi/pay', async (req: Request, res: Response) => {
    try {
        const { userLogin, amount, sessionId, serviceType } = req.body
        console.log(userLogin,amount,sessionId,serviceType,"REQ")
        const id = await payProcessing(userLogin, amount, serviceType, sessionId)
        return res.status(200).json(await newPay(amount, id))
    } catch (error) {
        return res.status(400).json(error);
    }
});
router.post('/qiwi/complete/', async (req: Request, res: Response) => {
    try {
        const id = req.query.id;
        await Payments.newStatus(id);
        return res.status(200).json(true);
    } catch (error) {
        return res.status(400).json(error);
    }
})
export const routerQiwi = router;