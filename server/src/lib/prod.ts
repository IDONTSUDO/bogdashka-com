import * as env from '../config/env.json';
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
