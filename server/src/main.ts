import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { Request, Response } from 'express';
import * as env from './config/env.json';
import { routerComerce } from './route/qiwi.route';
import { comerceRoboxRouter } from './route/comerce.route';
import { routerGeo } from './route/geo.router';

const app = express();
const path = '/';
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.get('*', (req: Request, res: Response) => {
  res.status(200);
  res.send(`API ${env.version}`);
});
app.use(path, routerGeo);
app.use(path, routerComerce);
app.use(path, comerceRoboxRouter);
app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).send('Something broke!');
});
export const server = app.listen(env.port, async () => {
  console.log(`SERVER START:${env.port}`);
});
