import io from 'socket.io-client';
import { htmlComlpetePay, HtmlerrorPay, load, HtmlPedding, preloadHtml, badBalanceHtml, prelaodHTML,snackBar } from './html';
import { compose } from './std';
import { SERVER_URL } from './constants';
let COURSE = 3;
let  maxPay = 15000;

const coourseHeaderDoc = document.getElementById('courseheader');
let path = location.pathname.split('/');
const id = path[1]; 
console.log("ID",id);

const balanceDoc = document.getElementById('total_balance');


const socket = io(SERVER_URL);
const session = localStorage.getItem('sessionId');
const preloaderDoc = document.getElementById('preloader');
const LoginInput = document.getElementById('loginInput');
const preloaderText = document.getElementById('loader-text');
const btnBuy = document.getElementById('show');
const OnlineDoc = document.getElementById('online');
const SumInput = document.getElementById('sumInput');
const TotalSales = document.getElementById('total-sales');
const site = document.getElementById('site');
const roboxQualityInput = document.getElementById('roboxQuality');
if (session == undefined) {
    socket.emit('new-session', '')
} else {
    socket.emit('reboot-session', session)
}
socket.on('course',(course) =>{
    COURSE = course;
    coourseHeaderDoc.value = `1₽ = ${course}R$`;
    maxPay = 15000 / course;
})
socket.on('sendSession', (msg) => {
    localStorage.setItem('sessionId', msg)
})
socket.on('userOnline', (msg) => {
 
    if (OnlineDoc)
        OnlineDoc.textContent = msg;
})
socket.on('balance', (msg) => {
    const data = JSON.parse(msg);
    if (balanceDoc != null && TotalSales != null) {
        balanceDoc.innerText = ` В наличии ${data.balance} R$`;
        TotalSales.innerText = data.paidTotal;
    }
})

if (path[1] === '') {
    roboxQualityInput.addEventListener('change', (e) => {
        e.preventDefault();
        if (roboxQualityInput.className === 'rub required') {
            return roboxQualityInput.classList.remove("required");
        }
        const input = parseInt(e.target.value);
        const curency = input / COURSE;
        if(curency > 15000 ){
            roboxQualityInput.classList.add('required');
            return snackBar('Привышает максимальную  сумму робуксов')
        }
        if(curency < 1){
            roboxQualityInput.classList.add('required');
            return snackBar('Привышает минимальную  сумму робуксов')
        }
        SumInput.value = `${parseInt(curency)}`;
        
    })
    SumInput.addEventListener('change', (e) => {
        e.preventDefault();
        
        const p = SumInput.value;
        const sum = parseInt(p);
        const curency = sum * COURSE;
        if(sum <= 0){
            SumInput.classList.add('required');
            return snackBar('Привышает минимальную сумму платежа')
        }
        if(sum > 15000){
            SumInput.classList.add('required');
            return snackBar('Привышает максимальную  сумму платежа')
        }
        roboxQualityInput.value = String(parseInt(curency));
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
            console.log(result);
            clearTimeout(timerPreloadOne);
            clearTimeout(timerPreloadTwo);
            clearTimeout(timerPreloadThere);
            const bodyPopup = document.getElementById('popup-body');
            if (result.amount) {
                // typeof result.groups === 'string'
                if (true) {
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

                bodyPopup.innerHTML = badBalanceHtml;
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
            snackBar('Введите коректную сумму')
           return SumInput.classList.add('required');
        }
        if (login === '') {
            snackBar('Введите коректный логин')
            return   LoginInput.classList.add('required');
        }
        if (LoginInput.value != '' && SumInput.value != '') {
            const el = document.querySelector(".modal-wrapper");
            const doc = document.getElementById('popup-body');
            doc.innerHTML = preloadHtml
            if (el.classList.contains('open') === false) {
                el.classList.add("open");
            }
        }
    }
} else {
    site.innerHTML = ``
    site.innerHTML = HtmlPedding()
    setTimeout(async function processWaiting() {
        const reqBody = JSON.stringify({ id: id })
        const request = await fetch(`${SERVER_URL}/pay/process`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: reqBody });

        if (request.status === 200) {
            let result = await request.json();
            if (result === 'ERROR') {
                site.innerHTML = ``;
                site.innerHTML = HtmlerrorPay('3212');
                return;
            }
            else if (result === 'COMPLETE') {
                site.innerHTML = ``;
                site.innerHTML = htmlComlpetePay;
                return;
            }
            setTimeout(processWaiting, 3000);
        }
    }, 3000);
}
