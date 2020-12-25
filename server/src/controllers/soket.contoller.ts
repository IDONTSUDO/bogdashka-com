// const Emitter = require("events");


// const myCache = new NodeCache();
// export const  socketEmitter =   Emitter();
// export const PAYEVENT = 'PAY_EVENT';
// export const LINKEVENT = 'LINK_EVENT';
// export const EXITEVENT = 'EXIT_EVENT';
// export const SENDSOKET = 'SEND_SOKET';


// socketEmitter.on(PAYEVENT, function(eventE){
//     console.log(eventE);
//     // socketEmitter.emit(SENDSOKET,{id:eventE., event, data})
// });
// socketEmitter.on(LINKEVENT, function(event:ILINKEVENT){
//     myCache.set(event.session_id, event.soket_id,10000);
//     socketEmitter.removeListener(LINKEVENT);

// });
// socketEmitter.on(EXITEVENT, function(session_id:string){
//     const p =  myCache.del(session_id);
//     socketEmitter.removeListener(EXITEVENT);
// });
// interface IPAYEVENT{
    
// }
// interface ILINKEVENT{
//     soket_id:string;
//     session_id:string;
// }