import io from 'socket.io-client';
const prod = true;
const compose = (...fns) =>
    fns.reduceRight((prevFn, nextFn) =>
        (...args) => nextFn(prevFn(...args)),
        value => value
    );

if (prod) {

} else {

}
const SERVER_URL = 'http://localhost:8080'


const CALCULATIONGROUPVALUE = 3;
const socket = io(SERVER_URL);
const session = localStorage.getItem('sessionId');
const MINIMALPAY = 10;

if (session == undefined) {
    socket.emit('new-session', '')
} else {
    socket.emit('reboot-session', session)
}
socket.on('sendSession', (msg) => {
    localStorage.setItem('sessionId', msg)
})
const prelaodHTML = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div><span id='preloader-text' class="title">Проверяем вступили ли вы в наши группы</span>`
const preloaderDoc = document.getElementById('preloader');
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
socket.on('badPay', (msg) =>{
    console.log(msg);
})
socket.on('balance', (msg) => {
    console.log(msg);
})
socket.on('pay', (msg) => {
    console.log(msg);
})
const closeModal = document.getElementById('btn-close trigger');
closeModal.addEventListener('click', function () {
    const el = document.getElementById("modal-wrapper")
    el.classList.toggle("open");
    preloaderText.innerText = 'Проверяем вступили ли вы в наши группы'
})
payProcessAlertDoc.addEventListener('click', () => compose(processAlert(), userPay()));

LoginInput.addEventListener('change', function () {
    if (LoginInput.className === 'required-form') {
        LoginInput.className = '';
    }
})
amountInput.addEventListener('change', function (e) {
    const value = amountInput.value;
    if (amountInput.className === 'required-form') {
        amountInput.className = '';
    }
    if (value !== '') {
        summDoc.innerText = `${value * CALCULATIONGROUPVALUE} ₽`;
    } else {
        summDoc.innerText = '';
    }
})





function responceUserGroupTransformHTML(paylaod) {
    let html = '';
    if (paylaod instanceof Array) {
        html += '<h3>Список групп</h3>'
        for (const group of paylaod) {
            html += `<li class='group'>${group}</li>`
        }
        html += `<a href="javascript:;" id='user-group-entered' class="content-box__btn btn trigger">ВСТУПИЛ</a>`;
    }
    return html;
}

async function userPay() {
    let timerPreloadOne
    let timerPreloadTwo
    let timerPreloadThere
    preloaderDoc.innerHTML = prelaodHTML;
    const resBody = JSON.stringify({ login: LoginInput.value });
    timerPreloadOne = setTimeout(() => preloaderText.innerText = 'Проверяем вступили ли вы в наши группы', 3000)
    timerPreloadTwo = setTimeout(() => preloaderText.innerText = 'Синхронизируем баланцы', 6000)
    timerPreloadThere = setTimeout(() => preloaderText.innerText = 'Вычисляем стоймость хлеба', 9000)

    const responce = await fetch(`${SERVER_URL}/group/user`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: resBody });
    if (responce.status === 200) {
        let result = await responce.json();
        clearTimeout(timerPreloadOne);
        clearTimeout(timerPreloadTwo);
        clearTimeout(timerPreloadThere);
        const p = responceUserGroupTransformHTML(result);
        if (p != undefined) {
            const payInfoHTML = `
            <div class="popupContent">
                          <h2>Ваш заказ</h2>
                          <div class="item-price">
                            <div class="item-price__img-text">
                              <img src="./images/rs.png" alt="rs">
                              <span>${amountInput.value * CALCULATIONGROUPVALUE}</span>
                              <span>Robux</span>
                            </div>
                            <div class="price">
                              <span>${amountInput.value}</span>
                              <span>р.</span>
                            </div>
                          </div>
                          <div class="price__summ">
                            <span>Сумма:</span>
                            <span>${amountInput.value}</span>р.
                            <a href="javascript:;" id='pay-process-start' class="content-box__btn btn trigger">Оплатить</a>
                          </div>`
            preloaderDoc.innerHTML = payInfoHTML
            const docProcessPay = document.getElementById('pay-process-start');
            docProcessPay.addEventListener('click', async () =>{
                

                const responceBody = JSON.stringify({'userLogin':LoginInput.value,'amount':parseInt(amountInput.value),'sessionId':localStorage.getItem('sessionId'),'serviceType':'GROUP'});
                const responce = await fetch(`${SERVER_URL}/qiwi/pay`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: responceBody });
                if(responce.status === 200){
                    let result = await  responce.json();
                    console.log(result);
                }
            })
            // preloaderDoc.innerHTML = p;
            // const btnEntered = document.getElementById('user-group-entered');
            // btnEntered.addEventListener('click', () =>{
            //    userPay();
            // })
        } else {
            // preloaderDoc.innerHTML = '';
        }
    } else {
        //TODO:ERROR VALIDATOR
    }


}

function processAlert() {
    if (LoginInput.value === '') {
        LoginInput.classList.add('required-form')
    }
    if (amountInput.value === '') {
        amountInput.classList.add('required-form')
    }
    if (LoginInput.value != '' && amountInput.value != '') {
        const el = document.getElementById("modal-wrapper");

        if (el.classList.contains('open') === false) {
            el.classList.add("open");
        }
    }
}

