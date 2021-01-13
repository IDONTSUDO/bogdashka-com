import io from 'socket.io-client';
const defaultURL = location.origin;
let path = location.pathname.split('/');
path = path[path.length - 1];
const SERVER_URL = 'https://bogdashka-api-server.space'
const socket = io(SERVER_URL);
const session = localStorage.getItem('sessionId');

if (session == undefined) {
    socket.emit('new-session', '')
} else {
    socket.emit('reboot-session', session)
}
socket.on('sendSession', (msg) => {
    localStorage.setItem('sessionId', msg)
})
socket.on('userOnline', (msg) => {
    if(OnlineDoc)
    OnlineDoc.textContent = msg;
})
socket.on('badPay', (msg) => {
    console.log(msg);
    const bodyPopup = document.getElementById('popup-body');
    if(bodyPopup != null){
        bodyPopup.innerHTML = ''
        bodyPopup.innerHTML = '<h3 class="mt10 mb10">Ксожалению во время платежа что то пошло не так.</h3>'
    }

})
socket.on('balance', (msg) => {
    const data = JSON.parse(msg);
    balanceDoc.innerText = ` В наличии ${data.balance} R$`;
    TotalSales.innerText = data.paidTotal;
})
socket.on('pay', (msg) => {
    console.log(msg);
    const bodyPopup = document.getElementById('popup-body');
    bodyPopup.innerHTML = ''
    bodyPopup.innerHTML = '<h3 class="mt10 mb10">Платеж выполнен.</h3>'
})
const sucseccPay = `     
   

<?xml version="1.0" encoding="iso-8859-1"?>

<svg class='check-svg' version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 367.805 367.805"
  style="enable-background:new 0 0 367.805 367.805;" xml:space="preserve">
  <g>
    <path style="fill:#3BB54A;" d="M183.903,0.001c101.566,0,183.902,82.336,183.902,183.902s-82.336,183.902-183.902,183.902
S0.001,285.469,0.001,183.903l0,0C-0.288,82.625,81.579,0.29,182.856,0.001C183.205,0,183.554,0,183.903,0.001z" />
    <polygon style="fill:#D4E1F4;" points="285.78,133.225 155.168,263.837 82.025,191.217 111.805,161.96 155.168,204.801 
256.001,103.968 	" />
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
</svg>
<span class="txSQ_suc">Обработка платежа успешно завершена!</span>
<a href="#" id='pay_process' class="pay__btn btn" style='    display: flex;justify-content: center;'>Вернуться на сайт</a>

</div>`
if (path === '') {
    const prod = true;
    const compose = (...fns) =>
        fns.reduceRight((prevFn, nextFn) =>
            (...args) => nextFn(prevFn(...args)),
            value => value
        );
    const balanceDoc = document.getElementById('total_balance');
    const prelaodHTML = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div><span id='preloader-text' class="title">Проверяем вступили ли вы в наши группы</span>`
    const preloaderDoc = document.getElementById('preloader');
    const LoginInput = document.getElementById('loginInput');
    const preloaderText = document.getElementById('loader-text');
    const btnBuy = document.getElementById('show');
    const OnlineDoc = document.getElementById('online');
    const SumInput = document.getElementById('sumInput');
    const TotalSales = document.getElementById('total-sales');

    SumInput.addEventListener('change', () => {
        if (SumInput.className === 'rub required') {
            return SumInput.classList.remove("required");
        }
    })
    LoginInput.addEventListener('change', () => {
        if (LoginInput.className === 'rub required') {
            return LoginInput.classList.remove("required");
        }
    })
    btnBuy.addEventListener("click", async function () {
        compose(processAlert(), userPay())
    });
    const closeModal = document.getElementById('close');
    closeModal.addEventListener('click', function () {
        const el = document.getElementById("modal-wrapper")
        el.classList.toggle("open");
        preloaderText.innerText = 'Проверяем вступили ли вы в наши группы'
    })
    function responceUserGroupTransformHTML(paylaod) {
        let html = '';
        if (paylaod instanceof Array) {
            html += '<h3 class="mt10 mb10">Список групп</h3>'
            for (const group of paylaod) {
                html += `<li><a class="link-d" target="_blank" href='${group}'>ссылка на группу(клик)</a></li>`
            }
            html += `<a  href="javascript:;" id='user-group-entered' class="content-box__btn btn trigger mt10 mb10">ВСТУПИЛ</a>`;
        }
        return html;
    }
    async function userPay() {
        let timerPreloadOne
        let timerPreloadTwo
        let timerPreloadThere
        preloaderDoc.innerHTML = prelaodHTML;
        const resBody = JSON.stringify({ login: LoginInput.value, amount: parseInt(SumInput.value) * 2 });
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
            if (result.amount) {
                if (typeof result.groups === 'string') {
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
                    bodyPopup.innerHTML = html;
                    const pay_processBtn = document.getElementById('pay_process');
                    pay_processBtn.addEventListener('click', async () => {
                        const responceBody = JSON.stringify({ 'userLogin': LoginInput.value, 'amount': parseInt(SumInput.value), 'sessionId': localStorage.getItem('sessionId'), 'serviceType': 'GROUP' });
                        const responce = await fetch(`${SERVER_URL}/qiwi/pay`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: responceBody });
                        if (responce.status === 200) {
                            let result = await responce.json();
                            if (typeof result === 'string') {
                                bodyPopup.innerHTML = '';
                                bodyPopup.innerHTML = `<a class="link-d" target="_blank"  href='${result}'>ссылка на оплату (клик) </a>`;

                            }
                        }
                    })

                } else {
                    const p = responceUserGroupTransformHTML(result.groups);
                    bodyPopup.classList.remove("centered-loader");
                    const loader = document.getElementById('loader');
                    loader.style.display = 'none';
                    bodyPopup.innerHTML = p;
                    const btnEntered = document.getElementById('user-group-entered')
                    btnEntered.addEventListener('click', () => {
                        userPay();
                    })
                }
            } else {
                bodyPopup.classList.remove("centered-loader");
                const loader = document.getElementById('loader');
                loader.style.display = 'none';

                bodyPopup.innerHTML = '<h3 class="mt10 mb10">Ксожалению недостаточно средтсв на балансе</h3>'
                return
            }

        } else {
            bodyPopup.innerHTML = '';
            bodyPopup.innerHTML = '<h3 class="mt10 mb10">Что то пошло не так мне жаль</h3>';
        }

    }

    function processAlert() {
        const amount = SumInput.value;
        const login = LoginInput.value;
        if (amount === '') {
            SumInput.classList.add('required');
        }
        if (login === '') {
            LoginInput.classList.add('required');
        }
        if (LoginInput.value != '' && SumInput.value != '') {
            const el = document.querySelector(".modal-wrapper");
            const doc = document.getElementById('popup-body');
            doc.innerHTML = `<span id='loader'><div class="hourglass"></div><div id='loader-text'>Актуализируем баланс</div></span>`
            if (el.classList.contains('open') === false) {
                el.classList.add("open");
            }

        }
    }
} else {
    const site = document.getElementById('site');

    const load = `
    
    <div class="txSQ_wait">Ожидает оплаты</div>
    <div class="popover__wrapper">
  <a href="#">
  <span id='loader'><div class="hourglass"></div>
  </a>
  <div class="popover__content">
    <p class="popover__message">Если вы уйдете то не дождетесь смены статуса оплаты</p>
    <img alt="Joseph Francis Joey Tribbiani, Jr." src="https://media.giphy.com/media/11SIBu3s72Co8w/giphy.gif">
  </div>
</div>
    </span> `;
    site.innerHTML = ``
    site.innerHTML = `
    <section class="home" id="atHome">
    <header class="header hw100">
    <section class="home" id="atHome">
   
      <!-- герлянда -->
      <div class="gerland-wrapper">
        <div class="vetka" style="position:absolute; top:0; left:0; ; width: 100%;"><img class="vetka-img"
            src="https://uguide.ru/js/script/elka.png" alt="vetka"></div>
        <div id="garland" class="garland_4">
          <div id="nums_1">1</div>
        </div>
        <div id="garland-small" class="garland_4">
          <div id="nums_1">1</div>
        </div>
      </div>
      <div class="menu-nav">
        <div class="logo"><a href="#"><img src="./images/logo-crop.png" alt="logo"></a></div>
        <ul class="menu-nav__links">
          <li><a href="https://vk.com/topic-199352331_46459026" target="_blank">ОТЗЫВЫ</a></li>
        </ul>
      </div>
   

      <div class="sq-pos centered-ch">${load} <a href="${defaultURL}" id='pay_process' class="pay__btn btn" style='    margin-top: 40px;    display: flex;justify-content: center;'>Вернуться на сайт</a>
</div>
      
</div>
</div>
</header>
</div>
</div>
</div>
</section>
</div>
`
    processWaiting();
}

async function processWaiting() {
    const id = '139ebe20-5505-11ebbe37'
    const reqBody = JSON.stringify({ id: id })
    const request = await fetch(`${SERVER_URL}/pay/process`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: reqBody });
    let result = await request.json();
    console.log(result);
    if (result === 'PEDDING') {
        return;
    } else if (result === 'COMPLETE') {
        site.innerHTML = `
    <section class="home" id="atHome">
    <header class="header hw100">

      <div class="gerland-wrapper">
        <div class="vetka" style="position:absolute; top:0; left:0; ; width: 100%;"><img class="vetka-img"
            src="https://uguide.ru/js/script/elka.png" alt="vetka"></div>
        <div id="garland" class="garland_4">
          <div id="nums_1">1</div>
        </div>
        <div id="garland-small" class="garland_4">
          <div id="nums_1">1</div>
        </div>
      </div>
      <div class="sq-pos centered-ch">${sucseccPay}</div>
</div>
</div>
</header>
</div>
</div>
</div>
</section>
</div>`
    }
}
