import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import { newPayQiwi, payProcessing, payProcessQiwiGroup } from '../controllers/qiwi.controllers';
import { FreeKassaHttp } from '../helper/free-kassa.http';
import { IPayments, Payments, PaySystem, servicePay } from '../model/Payments';
import { CourseType } from '../model/Settings';

const router = express.Router();

router.post('/pay/group', async (req: Request, res: Response) => {
    try {
        const { userLogin, amount, sessionId, serviceType, paySystem } = req.body;
        if (paySystem === PaySystem.QIWI) {
            const id = await payProcessing(userLogin, amount, serviceType, sessionId, servicePay.GROUP);
            return res.status(200).json(await newPayQiwi(amount, userLogin, id, CourseType.GROUP));
        }
        if (paySystem === PaySystem.FREEKASSA) {
            const id = await payProcessing(userLogin, amount, serviceType, sessionId, servicePay.GROUP);

            return res.status(200).json(FreeKassaHttp.newPay(amount, id, req.body.payType));
        }
        return res.status(500);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
});
router.post('/pay/logpass', async (req: Request, res: Response) => {
    try {
        const { userLogin, amount, sessionId, serviceType, paySystem, userPassword, socialLink } = req.body;
        if (paySystem === PaySystem.QIWI) {
            const id = await payProcessQiwiGroup(userLogin, amount, serviceType, sessionId, userPassword, socialLink);
            return res.status(200).json(await newPayQiwi(amount, userLogin, id, CourseType.LOGPASS));
        }
        return res.status(500);
    } catch (error) {
        return res.status(400).json(error);
    }
});
export const routerComerce = router;
