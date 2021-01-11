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


const CALCULATIONGROUPVALUE = 2;
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
const LoginInput = document.getElementById('loginInput');
const preloaderText = document.getElementById('loader-text');
const btnBuy = document.getElementById('show');
 const OnlineDoc = document.getElementById('online');
const SumInput = document.getElementById('sumInput');

SumInput.addEventListener('change', ()=>{
  if(SumInput.className === 'rub required'){
      return SumInput.classList.remove("required");
  }
})
LoginInput.addEventListener('change', ()=>{
    if(LoginInput.className === 'rub required'){
        return LoginInput.classList.remove("required");
    }
  })
btnBuy.addEventListener("click", async function () {
   compose(processAlert(), 
   userPay()
   )
    // const amount = parseInt(amountInput.value);
    // const login = NameInput.value;
    // const promocode = promoCodeInput.value;
    // const session = localStorage.getItem('sessionId');
    // const res = { amount: amount, sessionId: session, serviceType: "", userLogin: "" }
    // const response = await fetch(`${SERVER_URL}/qiwi/pay`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(res) })
    // let result = await response.json();
    // console.log(result);
});
socket.on('userOnline', (msg) => {
    OnlineDoc.textContent = msg;
})
socket.on('badPay', (msg) => {
    console.log(msg);
})
socket.on('balance', (msg) => {
    console.log(msg);
    // console.log(document.styleSheets[0].addRule('.home .header::before','content: "1" !important;'));
    // console.log(document.styleSheets[0])

    // .addRule('p.special:before', 'content: "' + str + '";');

    // document.styleSheets[0].addRule('p.special:before','content: "'+str+'";');

})
socket.on('pay', (msg) => {
    console.log(msg);
})
const closeModal = document.getElementById('close');
closeModal.addEventListener('click', function () {
    const el = document.getElementById("modal-wrapper")
    el.classList.toggle("open");
    preloaderText.innerText = 'Проверяем вступили ли вы в наши группы'
})
// payProcessAlertDoc.addEventListener('click', () => compose(processAlert(), userPay()));

// LoginInput.addEventListener('change', function () {
//     if (LoginInput.className === 'required-form') {
//         LoginInput.className = '';
//     }
// })
// amountInput.addEventListener('change', function (e) {
//     const value = amountInput.value;
//     if (amountInput.className === 'required-form') {
//         amountInput.className = '';
//     }
//     if (value !== '') {
//         summDoc.innerText = `${value * CALCULATIONGROUPVALUE} ₽`;
//     } else {
//         summDoc.innerText = '';
//     }
// })





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
    const resBody = JSON.stringify({ login: LoginInput.value,amount:parseInt(SumInput.value) * 2});
    timerPreloadOne = setTimeout(() => preloaderText.innerText = 'Проверяем вступили ли вы в наши группы', 3000)
    timerPreloadTwo = setTimeout(() => preloaderText.innerText = 'Синхронизируем балансы', 6000)
    timerPreloadThere = setTimeout(() => preloaderText.innerText = 'Вычисляем стоймость хлеба', 9000)

    const responce = await fetch(`${SERVER_URL}/group/user`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: resBody });
     
    if (responce.status === 200) {
        let result = await responce.json();
        clearTimeout(timerPreloadOne);
        clearTimeout(timerPreloadTwo);
        clearTimeout(timerPreloadThere);
        const bodyPopup = document.getElementById('popup-body');
        console.log(result)
        if(result.amount){
            console.log(result.groups.lenght == 0)
            //todo: result.groups.lenght == 0
            if(true){
                console.log(20000)
            //   ЕСЛИ У НАС ВО ВСЕ ГРУППЫ ЧЕЛОВЕК ВСТУПИЛ
                bodyPopup.classList.remove("centered-loader");
                    const html = `  <h2>Ваш заказ</h2>
                    <div class="item-price">
                      <div class="item-price__img-text"><img src="./images/rs.png" alt="rs"> <span>${parseInt(SumInput.value) * 2}</span>
                        <span>Robux</span></div>
                      <div class="price"><span>${SumInput.value}</span> <span>р.</span></div>
                    </div>
                    <div class="price__summ">
                    <form class="form-robox" action="">
                      <div class="input__promo"><label for="name">Введите ваш промокод (если есть):</label> <input
                          class="nick" type="text"><br></div>
                       <a href="#" id='pay_process' class="pay__btn btn" style='    display: flex;
                       justify-content: center;'>ОПЛАТИТЬ</a>
                     
                    </form>  
                  </div>`
                    const loader = document.getElementById('loader');
                    loader.style.display = 'none';
                    bodyPopup.innerHTML = html;
                    const pay_processBtn = document.getElementById('pay_process');
                    pay_processBtn.addEventListener('click', async () =>{
                        const responceBody = JSON.stringify({ 'userLogin': LoginInput.value, 'amount': parseInt(SumInput.value), 'sessionId': localStorage.getItem('sessionId'), 'serviceType': 'GROUP' });
                        const responce = await fetch(`${SERVER_URL}/qiwi/pay`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: responceBody });
                        if (responce.status === 200) {
                            let result = await responce.json();
                            console.log(result);
                            if(typeof result === 'string'){
                              bodyPopup.innerHTML = '';
                              bodyPopup.innerHTML =`<a href='${result}'>ссылка на оплату (клик) </a>`;

                            }
                        }
                    })
                  
            }else{  
                const p = responceUserGroupTransformHTML(result.groups);
                bodyPopup.classList.remove("centered-loader");
                const loader = document.getElementById('loader');
                loader.style.display = 'none';
                bodyPopup.innerHTML = p;
                const btnEntered = document.getElementById('user-group-entered')
                btnEntered.addEventListener('click', () =>{
                    userPay();
                 })
            }

        }else{
            bodyPopup.classList.remove("centered-loader");
            const loader = document.getElementById('loader');
            loader.style.display = 'none';
         
            bodyPopup.innerHTML = '<h3>Ксожалению недостаточно средтсв на балансе</h3>'
            return
        }

    }else{

    }

}

function processAlert() {
    const amount = SumInput.value;
    const login = LoginInput.value; 
    if(amount === ''){
        SumInput.classList.add('required');   
    }
    if(login === ''){
        LoginInput.classList.add('required');   
    }
    if(LoginInput.value != '' && SumInput.value != '') {
        const el = document.querySelector(".modal-wrapper");
        if (el.classList.contains('open') === false) {
            el.classList.add("open");
        }

    }
}

