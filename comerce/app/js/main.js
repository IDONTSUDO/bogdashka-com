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


//Counter
/* $(function () {
  var oTop = $(".counter").offset().top - window.innerHeight;
  $(window).scroll(function () {
    $(window).scroll(function () {
      scrollTracking();
    });

    $(document).ready(function () {
      scrollTracking();
    });
    $(".count-number").each(function () {
      var $this = $(this),
        countTo = $this.attr("data-to");
      $({ countNum: $this.text() }).animate(
        {
          countNum: countTo,
        },

        {
          duration: 3500,
          easing: "linear",
          step: function () {
            $this.text(Math.floor(this.countNum));
          },
          complete: function () {
            $this.text(this.countNum);
            //alert('finished');
          },
        }
      );
    });
    //var pTop = $('body').scrollTop();
    var pTop = $("html, body").scrollTop();
    console.log(pTop + " - " + oTop);
    if (pTop > oTop) {
      start_count();
    }
  });
}); */




/* $(window).resize(function() {
  if(document.documentElement.clientWidth < 768) {
    
  }
}); */

/* if ($(document).width() < 450) */

