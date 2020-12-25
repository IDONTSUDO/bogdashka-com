import io from 'socket.io-client';
const prod = true;
if(prod){

}else{
    
}
const SERVER_URL = 'http://localhost:8080' 



const socket = io(SERVER_URL);
const session = localStorage.getItem('sessionId');
if(session == undefined){
    socket.emit('new-session','')
}else{
    socket.emit('reboot-session',session)
}
socket.on('sendSession', (msg) =>{
    localStorage.setItem('sessionId',msg)
})
const amountInput = document.getElementById('amount');
const promoCodeInput = document.getElementById('promocodeInput');
const NameInput = document.getElementById('nameInput');
const btnSender = document.getElementById("sendAmount");
btnSender.addEventListener("click", async function () {
    const amount = parseInt(amountInput.value);
    const login = NameInput.value;
    const promocode = promoCodeInput.value;
    const session = localStorage.getItem('sessionId');
    const res = { amount: amount, sessionId: session, serviceType: "", userLogin: "" }
    const response = await fetch(`${SERVER_URL}/qiwi/pay`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(res) })
    let result = await response.json();
    console.log(result);
});