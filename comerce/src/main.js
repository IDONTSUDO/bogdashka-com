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
const preloaderMain = document.getElementById('preloader-main');
const sum = document.getElementById('sum');
const payProcessAlertDoc = document.getElementById('pay-process-alert');
const LoginInput = document.getElementById('loging-input');
const summDoc = document.getElementById('summ');
const preloaderText = document.getElementById('preloader-text');
const roboxPayDoc = document.getElementById('robox-pay');
const priceRobux = document.getElementById('price-robux');
const RoboxCalculteDoc = document.getElementById('calculted-store');
const amountInput = document.getElementById('amount');
 const promoCodeInput = document.getElementById('promocodeInput');
const NameInput = document.getElementById('nameInput');
const btnSender = document.getElementById("sendAmount");
// btnSender.addEventListener("click", async function () {
//     // const amount = parseInt(amountInput.value);
//     // const login = NameInput.value;
//     // const promocode = promoCodeInput.value;
//     // const session = localStorage.getItem('sessionId');
//     // const res = { amount: amount, sessionId: session, serviceType: "", userLogin: "" }
//     // const response = await fetch(`${SERVER_URL}/qiwi/pay`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(res) })
//     // let result = await response.json();
//     // console.log(result);
// });

socket.on('balance', (msg) => {
    console.log(msg)
})
socket.on('pay', (msg) =>{
    console.log(msg);
})
const closeModal = document.getElementById('btn-close trigger');
closeModal.addEventListener('click', function(){
    const el = document.getElementById("modal-wrapper")
    el.classList.toggle("open");
    preloaderText.innerText = 'Проверяем вступили ли вы в наши группы'
})
payProcessAlertDoc.addEventListener('click', function (){
    if(LoginInput.value === ''){
        LoginInput.classList.add('required-form')
    }
    if(amountInput.value === ''){
        amountInput.classList.add('required-form')
    }
    if(LoginInput.value != '' && amountInput.value != ''){
        const el = document.getElementById("modal-wrapper")
        el.classList.toggle("open");
    }
    // console.log(200);
    setTimeout(() => preloaderText.innerText = 'Проверяем вступили ли вы в наши группы' ,3000)
    setTimeout(() => preloaderMain.classList.add('none-calculated'),6000 )
})
LoginInput.addEventListener('change', function(){
    if(LoginInput.className === 'required-form'){
        LoginInput.className = '';
    }
})
amountInput.addEventListener('change', function (e){
    const value = amountInput.value;
    if(amountInput.className === 'required-form'){
        amountInput.className = '';
    }
    if(value !== ''){
         summDoc.innerText = `${value * CALCULATIONGROUPVALUE} ₽`;
    }else{
        summDoc.innerText = '';
    }
})