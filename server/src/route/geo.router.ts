import * as express from 'express';
import { NextFunction, Request, Response } from 'express';

const router = express.Router();

router.post('/get/geo', async (req: Request, res: Response) => {
    try {
      return res.status(200).json({
        titel: 'Hello!',
        country: 'RU',
        select_mode: 'Выберите режим',
        BuyRoboxButton: 'Купить робуксы',
        reviews: 'Отзывы',
        log_pass_pay: 'LOG + PASS',
        transfer_pay: 'ТРАНСФЕР',
        group_method: 'ГРУППОВОЙ МЕТОД',
        link_bar: 'vk.com/bogdashka',
        main_buy_robox_h1: 'Купить робуксы'
      });
    } catch (error) {
        return res.status(400).json(error);
    }
});

export const routerGeo = router;
