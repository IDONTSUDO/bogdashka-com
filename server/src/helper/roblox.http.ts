
import axios from 'axios';
import { isProd } from '../lib/prod';
import { Group } from '../model/Group';
const https = require('https');

export class RobloxApi {
    /**
     * @param {Кука} cookies
     * @param {Айди группы} groupId
     * @param {сколько отослать} amount
     * @param {айди юзера} userId
     * @return {*}
     * @memberof RobloxApi
     */
    static async transaction(cookies, groupId, amountPay, userId): Promise<boolean | void> {
        try {
            if (isProd()) {
                try {
                    const sessssionTokenCache = await this.getXCrfToken(cookies);
                    const agent = new https.Agent({
                        rejectUnauthorized: false
                    });
                    const resBody = {
                        PayoutType: 'FixedAmount',
                        Recipients: [{ recipientId: userId, recipientType: 'User', amount: amountPay }]
                    };
                    const head = {
                        'Accept': '*/*',
                        'cookie': cookies,
                        'x-csrf-token': sessssionTokenCache,
                        'Content-Type': 'application/json'
                    };
                    const response = await axios.post(`https://groups.roblox.com/v1/groups/${groupId}/payouts`, JSON.stringify(resBody), {
                        headers: head,
                        httpsAgent: agent
                    });
                    console.log(response.data);
                    if (JSON.stringify(response.data) === '{}') {
                        return true;
                    } else {
                        return false;
                    }
                } catch (error) {
                    await Group.error(groupId);
                }
            } else {
                return true;
            }
        } catch (error) {
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
    static async getXCrfToken(cookies): Promise<String | void> {
        try {
            const p: any = await axios.get(`https://web.roblox.com/home`, { headers: { 'cookie': cookies } });
            const result = resolveTokenStr(p.data);
            return result;
        } catch (error) {
            console.log(error);
        }
    }
    /**
     * @static
     * @param {*} groupId
     * @param {*} cookies
     * @memberof RobloxApi
     */
    static async getGroupBalance(groupId, cookies): Promise<number> {
        const sessssionTokenCache = this.getXCrfToken(cookies);
        const res = await axios.get(`https://economy.roblox.com/v1/groups/${groupId}/currency`, { headers: { 'cookie': cookies, 'x-csrf-token': sessssionTokenCache } });
        const data = res.data;
        const { robux } = data;
        return robux;
    }
    /**
     * @problem Поиск пользователя в группе.
     * @param {string} login
     * @param {string} cookies
     * @param {string} groupId
     * @return {boolean} если юзер не состоит вернет фалсе.
     * @return {number} если юзер состоит в группе вернет его айди.
     */
    static async UserLoginWithGroup(login: string, cookies: string, groupId: string): Promise<boolean | number> {
        try {
            const sessssionTokenCache = this.getXCrfToken(cookies);
            const res = await axios.get(`https://users.roblox.com/v1/users/search?keyword=${login}&limit=10}`,
                { headers: { 'cookie': cookies, 'x-csrf-token': sessssionTokenCache } }
            );
            const responce = res.data;
            if (responce.data.length !== 0) {
                if (typeof responce.data[0].name === 'string') {
                    return responce.data[0].id;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (error) {
            await Group.error(groupId);
            throw new Error(`Check Group stack:${JSON.stringify(error)}`);
        }

    }
}

/**
 *
 * @problem поиск XCrfTokena.
 * @param {*} data
 * @return {*} string
 */
export function resolveTokenStr(data): string {
    const reg = new RegExp(/setToken./);
    const index = data.search(reg);
    let rangeMin;
    let rangeMax;
    // tslint:disable-next-line:no-unused-expression
    index + 9;
    let i = index;

    for (i; i < data.length; i++) {
        if (data[i] === `'`) {
            if (rangeMax === undefined) {
                if (rangeMin === undefined) {
                    rangeMin = i + 1;
                } else {
                    rangeMax = i;
                }
            }
        }
    }
    return data.slice(rangeMin, rangeMax);
}
