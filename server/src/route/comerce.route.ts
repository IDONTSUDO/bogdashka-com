import * as express from 'express';
import {  Request, Response } from 'express';
import { upStatistic } from '../io';
import { StatisticAll } from '../model/StaticticsAll';

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
        console.log(error);
        return res.status(400).json(error);
    }
});
router.post('/sync/statistic', async (req, res) => {
    res.status(200);
   const data = await StatisticAll.getInitStatistic();
   upStatistic(data);
});

router.post('/balance/valid', async (req, res) => {
    try {
        const { amount } = req.body;
        return res.status(200).json(await RobloxService.amountValid(amount));
    } catch (error) {
        console.log(error);
        return res.status(404).json(error);
    }
});
export const comerceRoboxRouter = router;
