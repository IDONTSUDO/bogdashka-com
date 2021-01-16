import * as express from 'express';
import {  Request, Response } from 'express';
import { upCourse, upStatistic } from '../io';
import { StatisticAll, StatisticInit } from '../model/StaticticsAll';
import { validate as uuidValidate } from 'uuid';

import { RobloxService } from '../service/roblox.service';
import { Payments } from '../model/Payments';
import { Settings } from '../model/Settings';

const router = express.Router();

router.post('/group/user', async (req: Request, res: Response) => {
    try {
        const { login, amount } = req.body;
        // tslint:disable-next-line:radix
        const amountResult = await RobloxService.amountValid(parseInt(amount));
        const groupsResponce =  await RobloxService.checkOnUserAllGroup(login);
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
router.post('/upcourse', async (req, res) => {
    res.status(200).json(true);
    const data = await Settings.getCourse();
    if (typeof data !== 'undefined') {
        upCourse(data);
    } else {
        console.log('course soket error');
    }
});
router.post('/balance/valid', async (req, res) => {
    try {
        const { amount } = req.body;
        return res.status(200).json(await RobloxService.amountValid(amount));
    } catch (error) {
        return res.status(404).json(error);
    }
});

router.post('/pay/process', async (req, res) => {
    const id = req.body.id;
    if (uuidValidate(id)) {
        return res.status(200).json(await Payments.paymentInfo(id));
    }
});
export const comerceRoboxRouter = router;
