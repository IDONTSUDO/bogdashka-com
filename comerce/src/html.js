import { defaultURL } from './constants';
export const svgSucsessPay = `

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

</div>
`

export const htmlComlpetePay = `
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
      <div class="sq-pos centered-ch">${svgSucsessPay}</div>
</div>
</div>
</header>
</div>
</div>
</div>
</section>
</div>`
export const HtmlerrorPay = (payid) => {
  return `
  <section class="home" id="atHome">
        <header class="header hw100">
          <section class="home" id="atHome">
            <header id='header' class="header">
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
            </header>
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
          <div class="sq-pos centered-ch">
            <svg height="100px" viewBox="0 0 329.26933 329" width="100px" xmlns="http://www.w3.org/2000/svg"><g fill="#f44336"><path d="m21.339844 329.398438c-5.460938 0-10.925782-2.089844-15.082032-6.25-8.34375-8.339844-8.34375-21.824219 0-30.164063l286.589844-286.59375c8.339844-8.339844 21.824219-8.339844 30.164063 0 8.34375 8.339844 8.34375 21.824219 0 30.164063l-286.589844 286.59375c-4.183594 4.179687-9.621094 6.25-15.082031 6.25zm0 0"/><path d="m307.929688 329.398438c-5.460938 0-10.921876-2.089844-15.082032-6.25l-286.589844-286.59375c-8.34375-8.339844-8.34375-21.824219 0-30.164063 8.339844-8.339844 21.820313-8.339844 30.164063 0l286.589844 286.59375c8.34375 8.339844 8.34375 21.824219 0 30.164063-4.160157 4.179687-9.621094 6.25-15.082031 6.25zm0 0"/></g></svg>
            <span class="txSQ_suc">Случилась критическая ошибка, нам жаль номер платежа ${payid}!</span>
            <a href="https://vk.com/bogdashkacom" target="_blank" id='pay_process' class="pay__btn btn" style='    display: flex;justify-content: center;'>Обратится в тех поддержку</a>
          </div>
          <!-- https://vk.com/bogdashkacom -->
    </div>
    </div>
    </header>
    </div>
    </div>
    </div>
    </section>
    `
}

export const load = `    
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

export const HtmlPedding = () => {
  return `
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
}
export const preloadHtml = `<span id='loader'><div class="hourglass"></div><div id='loader-text'>Актуализируем баланс</div></span>`
export const badBalanceHtml = `<h3 class="mt10 mb10">Ксожалению недостаточно средтсв на балансе</h3>`
export const prelaodHTML = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div><span id='preloader-text' class="title">Проверяем вступили ли вы в наши группы</span>`