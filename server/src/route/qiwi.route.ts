import { constants } from 'buffer';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import { newPayQiwi , payProcessing } from '../controllers/qiwi.controllers';
import { decrypt, Icrypt } from '../lib/crypto';
import { isDontError } from '../lib/std';
import { IPayments, Payments, PaySystem } from '../model/Payments';
import { CourseType } from '../model/Settings';
import { RobloxService } from '../service/roblox.service';

const router = express.Router();

router.post('/pay/group', async (req: Request, res: Response) => {
    try {
        const { userLogin, amount, sessionId, serviceType } = req.body;
        if (serviceType === PaySystem.QIWI) {
            const id = await payProcessing(userLogin, amount, serviceType, sessionId);
            return res.status(200).json(await newPayQiwi(amount, userLogin, id, CourseType.GROUP));
        }
        return res.status(500);
    } catch (error) {
        return res.status(400).json(error);
    }
});
export const routerComerce = router;
