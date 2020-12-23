"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProd = void 0;
exports.isProd = () => {
    if (process.env.test !== 'true') {
        return true;
    }
    else {
        return false;
    }
};
//# sourceMappingURL=prod.js.map