new WOW().init();
wow = new WOW(
  {
  boxClass:     'wow',      // default
  animateClass: 'animated', // default
  offset:       0,          // default
  mobile:       true,       // default
  live:         true        // default
}
);


//Popup
$(document).ready(function () {
  $('.trigger').click(function () {
    $('.modal-wrapper').toggleClass('open');
    $('.page-wrapper').toggleClass('blur');
    return false;
  });
});

//плавный скролл по ссылкам
$('a[href*="#"]').on('click',
  function (e) {
    e.preventDefault();
    var scroll_el = $(this).attr('href');
    if ($(scroll_el).length != 0) {
      $('html, body').animate({
        scrollTop: $(scroll_el).offset().top - 50
      }, 1000);
    }
    return false;
  }
);


//удаление скролла при открытой модалке
const showPopup = () => {
  document.getElementById('popup').classList.add('show');
  const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
  const body = document.body;
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}`;
};
const closePopup = () => {
  const body = document.body;
  const scrollY = body.style.top;
  body.style.position = '';
  body.style.top = '';
  window.scrollTo(0, parseInt(scrollY || '0') * -1);
  document.getElementById('popup').classList.remove('show');
}
window.addEventListener('scroll', () => {
  document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
});
