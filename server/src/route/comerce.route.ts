import * as express from 'express';
import {  Request, Response } from 'express';
import { actualBalance, upCourse, updateBalance, upStatistic } from '../io';
import { StatisticAll, StatisticInit } from '../model/StaticticsAll';
import { validate as uuidValidate } from 'uuid';

import { RobloxService } from '../service/roblox.service';
import { Payments } from '../model/Payments';
import { Settings } from '../model/Settings';
import { Group } from '../model/Group';
import { RobloxApi } from '../helper/roblox.http';


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
    const p = await Group.findAllGroup();
    const balanceActual = Group.groupBalanceActual(p);
    actualBalance(balanceActual);
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
router.post('/user/group/time', async (req, res) => {
    try {
        const userName = req.body.userName;
        console.log(userName);
        const p = await RobloxService.checkOnUserAllGroup(userName) as any;
        p.push({
            'id': 'RfnD5KiaMQCZt2fkK62k',
            'roboxId': '4947725',
            'status': true,
            'url': 'https://www.roblox.com/groups/4947725/unicorn-is-the-answer#!/about',
            'balance': 700
          });
        return res.status(200).json(p);
    } catch (error) {
        return res.status(400).json(error);
    }
});
router.post('/new/pay', async (req, res) => {

});
export const comerceRoboxRouter = router;

