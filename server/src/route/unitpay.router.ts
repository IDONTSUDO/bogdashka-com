import { constants } from 'buffer';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import { newPay, payProcessing } from '../controllers/qiwi.controllers';
import { isDontError } from '../lib/std';
import { IPayments, Payments } from '../model/Payments';
import { RobloxService } from '../service/roblox.service';

const router = express.Router();

router.post('/qiwi/pay', async (req: Request, res: Response) => {
    try {
        const { userLogin, amount, sessionId, serviceType } = req.body;

        const id = await payProcessing(userLogin, amount, serviceType, sessionId);
        return res.status(200).json(await newPay(amount, id));
    } catch (error) {
        return res.status(400).json(error);
    }
});
router.post('/unitpay/complete', async (req: Request, res: Response) => {
    try {
        const idQuery: string | any = req.query.id;
        const calculatedPayment: IPayments = await Payments.getPayment(idQuery);
        res.status(200).json(true);
        const p =   await RobloxService.transactionClient(calculatedPayment);
    } catch (error) {
       console.log(error);
    }
});
export const routerQiwi = router;
