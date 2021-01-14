
import axios from 'axios';
import { group } from 'console';
import { mainModule } from 'process';
import { isProd } from '../lib/prod';
import { Group, IGroup } from '../model/Group';
const https = require('https');
const agent = new https.Agent({
    rejectUnauthorized: false
});
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
            const p: any = await axios.get(`https://web.roblox.com/home`, { headers: { 'cookie': cookies }, httpsAgent: agent});
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
    static async getGroupBalance(groupId: any, cookies: any): Promise<number> {
        const sessssionTokenCache = this.getXCrfToken(cookies);
        const res = await axios.get(`https://economy.roblox.com/v1/groups/${groupId}/currency`, { headers: { 'cookie': cookies, 'x-csrf-token': sessssionTokenCache }, httpsAgent: agent });
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

    // tslint:disable-next-line:no-shadowed-variable
    static async UserLoginWithGroup(login: string, cookies: string, group: [IGroup]) {
        try {
            const groupsIds: any = groupHelper(group);
            const bodyReq = { usernames: [login], excludeBannedUsers: false };
            const sessssionTokenCache = this.getXCrfToken(cookies);
            const res = await axios.post(`https://users.roblox.com/v1/usernames/users`, bodyReq,
                { headers: { 'cookie': cookies, 'x-csrf-token': sessssionTokenCache }, httpsAgent: agent }
            );
            const responce = res.data.data;
            if (responce[0] !== undefined) {
                const user = responce[0];
                if (user.requestedUsername === login) {

                    const resGroupsData = await axios.get(`https://groups.roblox.com/v2/users/${user.id}/groups/roles`,
                        { headers: { 'cookie': cookies, 'x-csrf-token': sessssionTokenCache }, httpsAgent: agent });
                    const groupUser = resGroupsData.data.data;
                    if (Array.isArray(groupUser)) {
                        groupUser.forEach((meta) => {
                            if (groupsIds[parseInt(meta.group.id)] === false) {
                                groupsIds[parseInt(meta.group.id)] = true;
                            }
                        });
                        const groupMissing: any = [];
                        for (const [key, value] of Object.entries(groupsIds)) {
                            if (
                                typeof value === 'boolean' &&
                                value.toString() === 'false' &&
                                typeof key === 'string') groupMissing.push(key);
                        }
                        if (Array.isArray(groupMissing) && groupMissing.length !== 0) {
                            const groups: any = [];
                            groupMissing.forEach((mis) => {
                                group.forEach((gr) => {
                                    if (gr.groupId === mis) groups.push(gr.url);
                                });
                            });
                            return groups;
                        } else {
                            return '';
                        }
                    }
                }
            }
        } catch (error) {
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
function groupHelper(groups: [IGroup]) {
    const object = {};
    groups.forEach((group) => {
        object[parseInt(group.groupId)] = false;
    });
    return object;
}
