import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import { newPay } from '../controllers/qiwi.controllers';
const router = express.Router();

router.post('/qiwi/pay', async (req: Request, res: Response) => {
    try {
        const { userLogin, amount, sessionId } = req.body


    } catch (error) {

    }
});
router.post('/qiwi/complete', async (req: Request, res: Response) => {

})
export const routerQiwi = router;