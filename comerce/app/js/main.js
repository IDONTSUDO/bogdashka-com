$('.count').each(function () {
  $(this).prop('Counter',0).animate({
      Counter: $(this).text()
  }, {
      duration: 4000,
      easing: 'swing',
      step: function (now) {
          $(this).text(Math.ceil(now));
      }
  });
});

//конвертер
/* document.getElementsByClassName('rub')[0].addEventListener('keypress', function(){
    const val = $(this).val()
    $('#summ').text(val + 1 * 2)
});
 */



$( document ).ready(function() {
    $('.trigger').click(function() {
       $('.modal-wrapper').toggleClass('open');
      $('.page-wrapper').toggleClass('blur');
       return false;
    });
  });



// Smooth scroll naivgation
$(document).ready(function () {
    $("#buy-robox, #next, #atHome").on("click", "a", function (event) {
      //отменяем стандартную обработку нажатия по ссылке
      event.preventDefault();
  
      //забираем идентификатор бока с атрибута href
      var id = $(this).attr("href"),
        //узнаем высоту от начала страницы до блока на который ссылается якорь
        top = $(id).offset().top;
  
      //анимируем переход на расстояние - top за 1500 мс
      $("body,html").animate({
        scrollTop: top
      }, 1500);
    });
  });
    