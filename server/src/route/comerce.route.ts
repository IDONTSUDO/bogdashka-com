import * as express from 'express';
import {  Request, Response } from 'express';
import { upStatistic } from '../io';
import { StatisticAll, StatisticInit } from '../model/StaticticsAll';

import { RobloxService } from '../service/roblox.service';

const router = express.Router();

router.post('/group/user', async (req: Request, res: Response) => {
    try {
        const { login, amount } = req.body;
        // tslint:disable-next-line:radix
        const amountResult = await RobloxService.amountValid(parseInt(amount));
        const groupsResponce =  await RobloxService.checkOnUserAllGroup(login);
        console.log(groupsResponce);
        res.status(200).json({
            'amount': amountResult,
            'groups': groupsResponce
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
});
router.post('/sync/statistic', async (req, res) => {
   res.status(200).json(true);
   const data: StatisticInit | undefined = await StatisticAll.getInitStatistic();
   if (typeof data !== 'undefined') {
        upStatistic(data);
   } else {
       console.log('static soket error');
   }
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
