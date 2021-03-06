import * as express from 'express';
import { Request, Response } from 'express';
import { actualBalance, upCourse, updateBalance, upStatistic } from '../io';
import { StatisticAll, StatisticInit } from '../model/StaticticsAll';
import { validate as uuidValidate } from 'uuid';

import { RobloxService } from '../service/roblox.service';
import { Payments } from '../model/Payments';
import { Settings } from '../model/Settings';
import { Group } from '../model/Group';
import { RobloxApi } from '../helper/roblox.http';
import { FreeKassaHttp } from '../helper/free-kassa.http';


const router = express.Router();

router.post('/group/user', async (req: Request, res: Response) => {
    try {
        const { login, amount } = req.body;
        const amountResult = await RobloxService.amountValid(parseInt(amount));
        const groupsResponce = await RobloxService.checkOnUserAllGroup(login);
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
        const p = await RobloxService.checkOnUserAllGroup(userName);
        return res.status(200).json(p);
    } catch (error) {
        return res.status(400).json(error);
    }
});
router.post('/new/pay', async (req, res) => {

});

const freekassaPay = (req, res, next) => {
    const freekassaIp = ['136.243.38.147', '136.243.38.149', '136.243.38.150', '136.243.38.151', '136.243.38.189', '136.243.38.108'];
    console.log(req.headers);
    console.log(req['REMOTE_ADDR']);
    next();
};
router.use(freekassaPay);
router.post('/notification/pay/free-kassa', async (req, res) => {
    console.log(200);
    res.status(200).json('ok');
});
router.post('/get/freekassa/method', async (req, res) => {
    return res.status(200).json(await FreeKassaHttp.getPayMethod());
});

export const comerceRoboxRouter = router;

