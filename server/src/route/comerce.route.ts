import * as express from 'express';
import {  Request, Response } from 'express';

import { RobloxService } from '../service/roblox.service';

const router = express.Router();

router.post('/group/user', async (req: Request, res: Response) => {
    try {
        const { login, amount } = req.body;
        // tslint:disable-next-line:radix
        const amountResult = await RobloxService.amountValid(parseInt(amount));
        const groups =  await RobloxService.checkOnUserAllGroup(login);

        res.status(200).json({
            'amount': amountResult,
            'groups': groups
        });
    } catch (error) {
        return res.status(400).json(error);
    }
});
export const comerceRoboxRouter = router;
