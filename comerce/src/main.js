import io from 'socket.io-client';
const prod = true;
if(prod){

}else{
    
}
const SERVER_URL = 'http://localhost:8080' 


const CALCULATIONGROUPVALUE = 3;
const socket = io(SERVER_URL);
const session = localStorage.getItem('sessionId');
const MINIMALPAY = 10;

if(session == undefined){
    socket.emit('new-session','')
}else{
    socket.emit('reboot-session',session)
}
socket.on('sendSession', (msg) =>{
    localStorage.setItem('sessionId',msg)
})
const mimimunAmountDoc = document.getElementById('minimalPay');
const sum = document.getElementById('sum');
const payProcessAlertDoc = document.getElementById('pay-process-alert');

mimimunAmountDoc.innerText = MINIMALPAY;

const roboxPayDoc = document.getElementById('robox-pay');
const priceRobux = document.getElementById('price-robux');

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

socket.on('pay', (msg) =>{
    console.log(msg);
})

payProcessAlertDoc.addEventListener('click', function (){
    roboxPayDoc.innerText = amountInput.value;

    priceRobux.innerText = amountInput.value * CALCULATIONGROUPVALUE;
})