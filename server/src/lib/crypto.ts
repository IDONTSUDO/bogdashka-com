import crypto = require('crypto');
import { ALGORITM_CRYPTO } from './contsanst';
import * as env from '../config/env.json';
const secretKey = env.crypro_secret_key;
const iv = crypto.randomBytes(16);

export interface Icrypt {
  iv: string;
  content: string;
}

export const encrypt = (text: string): Icrypt => {

  const cipher = crypto.createCipheriv(ALGORITM_CRYPTO, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
      iv: iv.toString('hex'),
      content: encrypted.toString('hex')
  };
};

export const decrypt = (hash: Icrypt): string => {
  const decipher = crypto.createDecipheriv(ALGORITM_CRYPTO, secretKey, Buffer.from(hash.iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
  return decrpyted.toString();
};
