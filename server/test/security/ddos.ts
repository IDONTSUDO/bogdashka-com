import { RobloxApi } from "../../src/lib/roblox.http"

export const pormisesLoop = async (promise, quality) => {
    for (let i = 0; quality > i; i++) {
        const p = Promise.resolve(promise)
        p.then((data) => {
            console.log(i)
            if (typeof p != 'string') {
                throw new Error('BAD')
            }
        })
    }
}

async function name() {
    const qulity = 10000;
    const p = RobloxApi.getXCrfToken(`RBXViralAcquisition=time=12/25/2020 3:51:02 AM&referrer=&originatingsite=; RBXSource=rbx_acquisition_time=12/25/2020 3:51:02 AM&rbx_acquisition_referrer=&rbx_medium=Direct&rbx_source=&rbx_campaign=&rbx_adgroup=&rbx_keyword=&rbx_matchtype=&rbx_send_info=1; GuestData=UserID=-1789665684; __utmc=200924205; __utmz=200924205.1608889869.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); gig_bootstrap_3_OsvmtBbTg6S_EUbwTPtbbmoihFY5ON6v6hbVrTbuqpBs7SyF_LQaJwtwKJ60sY1p=_gigya_ver3; .ROBLOSECURITY=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_0C9B7A0C710E9F3F1CB9EC59AB27781CBE230898533351A12FD1220DA6D816A01608E32AE7D35974D2128BEDDB0FD66CA493498DAD18CB8B9B0EFE4409E3914F4F32742142F0B98DAAA42D7E048FBBD177A317E4021BCD0290351E33A717962C1488AAD8D5CFE0383E6FE18C70946604C8D2BB5286C7C83D4EC9219696B1BBE850B410BFCC9AC8158C341B73B6FEE5E358C4DD794C7C9C94E3F2CE2A8C19562299A0BDEB3FB419834475916870B41AA820D8FC0498AAAC946A714FD1BB1E8A17689DB8995F98E813A8F6E83860FBAA65704933941C6EFFDD0C397AC1368BBE9CE5D3DDA37A79A6DF3FBD94B3BE6533927CB8AE620FD9C2E74C939FF189095C7B898C47E252F30567893F7F60A2715E145E11CE21CE2A70FA1D04C99139938F6CDDE3E031; .RBXID=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxNTZlNmRkNy1kODE4LTRmMzktYjRlYi0wNmZlMDJkODgzMTYiLCJzdWIiOjc0MjA2NzY0MX0.rhvCB3vl-fb5Ij1Kyl6heLJeQXG0nHklWSmS2G8NxNE; RBXEventTrackerV2=CreateDate=12/25/2020 6:11:51 AM&rbxid=1979314814&browserid=72585713937; RBXSessionTracker=sessionid=e748d780-8700-4981-950c-ee64117d10a5; __utma=200924205.2012144798.1608889869.1608898249.1608991709.3; __utmb=200924205.0.10.1608991709; rbx-ip2=`);
    pormisesLoop(p, 100000);
}

name();