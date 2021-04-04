
import axios from 'axios';
import { group } from 'console';
import { mainModule } from 'process';
import { dataTokenParserRegExp, regexpFindHTML } from '../lib/contsanst';
import { isProd } from '../lib/prod';
import { Group, IGroup } from '../model/Group';
const fs = require('fs');
const https = require('https');
const agent = new https.Agent({
    rejectUnauthorized: false
});
export class RobloxApi {
    static async userIdAsLogin(userLogin: string, cookies: string): Promise<string | undefined> {
        const bodyReq = { usernames: [userLogin], excludeBannedUsers: false };
        const sessssionTokenCache = this.getXCrfToken(cookies);
        const res = await axios.post(`https://users.roblox.com/v1/usernames/users`, bodyReq,
            { headers: { 'cookie': cookies, 'x-csrf-token': sessssionTokenCache }, httpsAgent: agent }
        );
        const responce = res.data.data;
        if (responce[0] !== undefined) {
            const user = responce[0];
            if (user.requestedUsername === userLogin) {
                return user.id;
            }
        }
    }
    /**
     * @param {Кука} cookies
     * @param {Айди группы} groupId
     * @param {сколько отослать} amount
     * @param {айди юзера} userId
     * @return {*}
     * @memberof RobloxApi
     */
    static async transaction(cookies: string, groupId: string, amountPay: number, userId: string): Promise<boolean | void> {
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
        try {
            const response = await axios.post(`https://groups.roblox.com/v1/groups/${groupId}/payouts`,
                JSON.stringify(resBody), {
                headers: head,
                httpsAgent: agent
            });
            console.log('STATUS', response.statusText);
            if (JSON.stringify(response.data) === '{}') {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            // await Group.error(groupId);
        }
    }
    /**
     * @static
     * @param {*} cookies
     * @param {*} groupId
     * @return {*}  {(Promise<String | void>)}
     * @memberof RobloxApi
     */
    static async getXCrfToken(cookies: string): Promise<String | void> {
        try {
            const p: any = await axios.get(`https://web.roblox.com/home`, { headers: { 'cookie': cookies }, httpsAgent: agent });
            const result = resolveTokenStr(p.data);
            console.log('RESULT TOKEN PARSE', result);
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
    static async checkUserDateJoinAtGroup(userId: string, groupId: string, cookies: string): Promise<Error|boolean > {
        const sessssionTokenCache = this.getXCrfToken(cookies);
        const res = await axios.get(`https://economy.roblox.com/v1/groups/${groupId}/users-payout-eligibility?userIds=${userId}`,
         { headers: { 'cookie': cookies, 'x-csrf-token': sessssionTokenCache }, httpsAgent: agent } );
         if (res.status === 200) {
            const data = res.data as ICheckUserPayGroupValid;
            if (
                data.usersGroupPayoutEligibility[userId] === 'PayoutRestricted' ||
                data.usersGroupPayoutEligibility[userId] === 'Eligible'
                ) {
                return true;
            }
            return false;
         } else {
            return Error('Техничкская ошибка checkUserDateJoinAtGroup');
         }
    }
    /**
     * @problem Поиск пользователя в группе.
     * @param {string} login
     * @param {string} cookies
     * @param {string} groupId
     * @return {boolean} если юзер не состоит вернет фалсе.
     * @return {number} если юзер состоит в группе вернет его айди.
     */
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
            } else {
                return Error('Техническая ошибка');
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
export function resolveTokenStr(data: string): string | void {
    // console.log(data);
    /** @reference <meta name="csrf-token" data-token="HnsiKNRUR+CB" />*/
    const match = data.match(/data-token=.+?>/gm);
    // fs.writeFile('html.txt', data, function (err) {
    //     if (err) return console.log(err);
    //   });
    if (match !== null) {
        /** @reference 'data-token="HnsiKNRUR+CB"';*/
        const dataTokenStr = match[0];
        const tokenResolve = dataTokenStr.match(/data-token=.+?>/gm);
         if (tokenResolve !== null) {
            const tokenWithQuotes = tokenResolve[0];
            const newToken = tokenWithQuotes.replace(/data-token=/, '');
            return newToken.replace(/>/, '');
        }
    } else {
        console.log('MATCH NOT FOUND');
        // TODO: НАВЕРНОЕ ОНО ДОЛЖНО КУДА ТО СЫПАТЬ ЛОГИ
    }
}
function groupHelper(groups: [IGroup]) {
    const object = {};
    groups.forEach((group) => {
        object[parseInt(group.groupId)] = false;
    });
    return object;
}


/**
 * @example {
    "usersGroupPayoutEligibility": {
        "1939020221": "PayoutRestricted"
    }
    1939020221 UserId
}
*/
export interface ICheckUserPayGroupValid {
    usersGroupPayoutEligibility: Object;
}
// tslint:disable-next-line:max-line-length
// const cokc = `GuestData=UserID=-1035402760; __utmz=200924205.1614718246.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); gig_bootstrap_3_OsvmtBbTg6S_EUbwTPtbbmoihFY5ON6v6hbVrTbuqpBs7SyF_LQaJwtwKJ60sY1p=_gigya_ver4; .ROBLOSECURITY=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_EFC3C30EE631D4CC53FCEBD636731527C145A036B5552C4D70CCA797D8682FBDC39297410824C38031AA6949265EE1F4339BD60A474162837C81B4686CE0F74039BE0FCD42ADB5C1319FC48A2F6E82782F684034030ECEF2DB81DA83C96DF05C44560CCD71C2068592EF773488453ADB476E21C87D59420A982DFAF6FCA123764490A942B605A03779FCBDDEC38268BC42FCAAB9D291856FA4A69AFF75B2A477ED4FCCE2F06E9541B416844CF824C3AC09F8290F74AEFD295B0E9DCBD1D8338BE3B8B27897506B8D4F1644B34EE32457BB5C6D872DD5C4F23E12A0D60447143F6384EDB43E4EC8070852990A384D17AD64BD9E62FA09C2133E750718B8154C4EA03794D792F07EA9B5D0C0BCA1AEE949200D0A2C3DFAE8E13C1C2B0EB96F6E1F52970639389B108A8C43AF85852CF106D95C1D1F; .RBXID=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4N2I1MTM4Yy04YWQyLTRjNzktODBjMC04NjI1MzExOTQ4YTAiLCJzdWIiOjkzODE4MDg1Nn0.V6d-DvONUCklW6eTDH7r4s-10XfOmr4lqckIe1BqmhY; RBXEventTrackerV2=CreateDate=3/20/2021 10:42:33 AM&rbxid=2310271238&browserid=83646993796; RBXSource=rbx_acquisition_time=4/3/2021 1:19:59 PM&rbx_acquisition_referrer=&rbx_medium=Direct&rbx_source=&rbx_campaign=&rbx_adgroup=&rbx_keyword=&rbx_matchtype=&rbx_send_info=1; RBXSessionTracker=sessionid=61b533f6-1761-4772-9a2a-8c306358d821; __utma=200924205.618666093.1614718246.1617474002.1617523807.7; __utmb=200924205.0.10.1617523807; __utmc=200924205; rbx-ip2=`;
// async function main() {
//   const res =   await RobloxApi.transaction(cokc, '4947725', 1, '405190350');
//   console.log(res);

// }
// main();
