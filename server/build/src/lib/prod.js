"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDeploy = exports.isProd = void 0;
const env = require("../config/env.json");
exports.isProd = () => {
    if (process.env.test !== 'true') {
        return true;
    }
    else {
        return false;
    }
};
exports.isDeploy = () => {
    return env.deploy;
};
//# sourceMappingURL=prod.js.map