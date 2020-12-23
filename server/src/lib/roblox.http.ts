import axios from 'axios';
import { runInThisContext } from 'vm';
const roblox_urlV1 = 'https://groups.roblox.com/v1' 
const roblox_urlMain = 'https://www.roblox.com'
/**
 *
 *
 * @export
 * @class RobloxApi
 */
export class RobloxApi {
    /**
     *
     *
     * @static
     * @param {Кука} cookies
     * @param {Айди группы} groupId
     * @param {} body
     * @return {*} 
     * @memberof RobloxApi
     */
    static async transaction(cookies,groupId) {
        const sessssionTokenCache = this.getXCrfToken(cookies,groupId)
        try {
            const p = await axios.post(`${roblox_urlV1}groups/${groupId}/payouts`, {
                body: [{"recipientId": 727236058, "recipientType": "User", "amount": 1}],
                     
                headers: {
                    cookie: cookies,
                    'x-csrf-token':sessssionTokenCache
                }
            })
            console.log(p.data)
            return p;
        } catch (error) {
            console.log(error)
        }
    }
    /**
     * @static
     * @param {*} cookies
     * @param {*} groupId
     * @return {*}  {(Promise<String | void>)}
     * @memberof RobloxApi
     */
    static async getXCrfToken(cookies,groupId):Promise<String | void>{
        try {
            const p:any = await axios.get(`${roblox_urlMain}/home`, { headers: { 'cookie': cookies }})
            let result = p.data.match(/setToken.*'(\w+)'/);
            return result[1];
        } catch (error) {
            console.log(error)
        }
    }
    /**
     * @static
     * @param {*} groupId
     * @param {*} cookies
     * @return {*} 
     * @memberof RobloxApi
     */
    static async getGroupBalance(groupId,cookies){
        const sessssionTokenCache = this.getXCrfToken(cookies,groupId)
        const res = await axios.get(`https://economy.roblox.com/v1/groups/${groupId}/currency`,   { headers: { 'cookie': cookies,  'x-csrf-token':sessssionTokenCache }});
        const data = res.data;
        const {robux} = data;
        return robux;
    }
    /**
     * @static
     * @param {*} user
     * @param {*} cookies
     * @param {*} groupId
     * @memberof RobloxApi
     */
    static async UserLoginWithGroup(user,cookies,groupId){
        try {
            const sessssionTokenCache = this.getXCrfToken(cookies,groupId)
            const res = await axios.get(`https://users.roblox.com/v1/users/search?keyword=${user}&limit=10}`,{ headers: { 'cookie': cookies,  'x-csrf-token':sessssionTokenCache }})
            const data = res.data;
            if(data.data.length != 0){
                if(typeof data.data[0].name === 'string'){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
        }

    }
}   
 