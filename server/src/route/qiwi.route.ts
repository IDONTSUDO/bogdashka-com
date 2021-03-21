import { constants } from 'buffer';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import { newPayQiwi , payProcessing } from '../controllers/qiwi.controllers';
import { decrypt, Icrypt } from '../lib/crypto';
import { isDontError } from '../lib/std';
import { IPayments, Payments } from '../model/Payments';
import { RobloxService } from '../service/roblox.service';

const router = express.Router();

router.post('/qiwi/pay', async (req: Request, res: Response) => {
    try {
        const { userLogin, amount, sessionId, serviceType } = req.body;

        const id = await payProcessing(userLogin, amount, serviceType, sessionId);
        return res.status(200).json(await newPayQiwi(amount, userLogin, id));
    } catch (error) {
        return res.status(400).json(error);
    }
});

export const routerQiwi = router;
