"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RobloxApi = void 0;
const axios_1 = require("axios");
const roblox_urlV1 = 'https://groups.roblox.com/v1';
const roblox_urlMain = 'https://www.roblox.com';
/**
 *
 *
 * @export
 * @class RobloxApi
 */
class RobloxApi {
    /**
     *
     *
     * @static
     * @param {Кука} cookies
     * @param {Айди группы} groupId
     * @param {сколько отослать} amount
     * @param {айди юзера} userId
     * @return {*}
     * @memberof RobloxApi
     */
    static async transaction(cookies, groupId, amount, userId) {
        const sessssionTokenCache = this.getXCrfToken(cookies);
        try {
            const resBody = [{ 'recipientId': userId, 'recipientType': 'User', 'amount': amount }];
            const p = await axios_1.default.post(`${roblox_urlV1}groups/${groupId}/payouts`, {
                body: JSON.stringify(resBody),
                headers: {
                    cookie: cookies,
                    'x-csrf-token': sessssionTokenCache
                }
            });
            return p;
        }
        catch (error) {
            console.log(error);
        }
    }
    /**
     * @static
     * @param {*} cookies
     * @param {*} groupId
     * @return {*}  {(Promise<String | void>)}
     * @memberof RobloxApi
     */
    static async getXCrfToken(cookies) {
        try {
            const p = await axios_1.default.get(`https://web.roblox.com/home`, { headers: { 'cookie': cookies } });
            let result = resolveTokenStr(p.data);
            return result;
        }
        catch (error) {
            console.log(error);
        }
    }
    /**
     * @static
     * @param {*} groupId
     * @param {*} cookies
     * @return {*}
     * @memberof RobloxApi
     */
    static async getGroupBalance(groupId, cookies) {
        const sessssionTokenCache = this.getXCrfToken(cookies);
        const res = await axios_1.default.get(`https://economy.roblox.com/v1/groups/${groupId}/currency`, { headers: { 'cookie': cookies, 'x-csrf-token': sessssionTokenCache } });
        const data = res.data;
        const { robux } = data;
        return robux;
    }
    /**
     * @static
     * @param {*} user
     * @param {*} cookies
     * @param {*} groupId
     * @memberof RobloxApi
     */
    static async UserLoginWithGroup(user, cookies, groupId) {
        try {
            const sessssionTokenCache = this.getXCrfToken(cookies);
            const res = await axios_1.default.get(`https://users.roblox.com/v1/users/search?keyword=${user}&limit=10}`, { headers: { 'cookie': cookies, 'x-csrf-token': sessssionTokenCache } });
            const data = res.data;
            if (data.data.length != 0) {
                if (typeof data.data[0].name === 'string') {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.RobloxApi = RobloxApi;
function resolveTokenStr(data) {
    const reg = new RegExp(/setToken.*'(\w+)'/);
    const index = data.search(reg);
    let rangeMin;
    let rangeMax;
    index + 9;
    let i = index;
    for (i; i < data.length; i++) {
        if (data[i] === `'`) {
            if (rangeMax === undefined) {
                if (rangeMin === undefined) {
                    rangeMin = i + 1;
                }
                else {
                    rangeMax = i;
                }
            }
        }
    }
    console.log(rangeMin, rangeMax);
    // console.log(data.slice(rangeMin,rangeMax))
    return data.slice(rangeMin, rangeMax);
}
//# sourceMappingURL=roblox.http.js.map