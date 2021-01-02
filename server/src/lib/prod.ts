import * as env from '../config/env.json';

/**
 * @problem ограничивает исходный код.
 * @return если это на проде возвращает FALSE
 * @return если это локально  возввращает TRUE
 */

export const isProd = () => {
    if (process.env.test !== 'true') {
        return true;
    } else {
        return false;
    }
};

export const isDeploy = () => {
    return env.deploy;
};
