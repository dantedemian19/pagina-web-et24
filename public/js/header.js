$(function(){

  const tl = gsap.timeline({defaults: {ease: "power1.out"}});

  tl.to(".text", {duration: 1, y: "0%", stagger: 0.2});
  tl.to(".preload", {duration: .6, y: "-100%", delay: 1});
  tl.to(".text-animation", {duration: .6, y: "100%", opacity: 0, display: "none"}, "-=.5");

  if($(`a.c-link[href="${window.location.pathname}"]`).length > 0){
    $(`a.c-link[href="${window.location.pathname}"]`).addClass('active');
    if($(`a.c-link[href="${window.location.pathname}"]`).parents('.dropdown:not(#user)').length > 0){
      $('.dropdown > .nav-link').addClass('active');
      if($(`a.c-link[href="${window.location.pathname}"]`).parents('.sub-dropdown').length > 0){
        $('.sub-dropdown > .nav-link').addClass('active');
      }
    }
  }

  $('body').on('click', '.show-menu-btn', function(e){
    if($('html').hasClass('res-navigation-open')){
      $('html').removeClass('res-navigation-open');
    }else{
      $('html').addClass('res-navigation-open');
    }
  });

  $('body').on('click', '.close-msg', function(){
    $(this).parents('.msg').hide();
  });

  $('body').on('click', '.open-g-nav', function(){
    $('html').addClass('g-nav-is-open');
  });
  $('body').on('click', '#op-nav .close-btn', function(){
    $('html').removeClass('g-nav-is-open');
  });


  $('body').on('click', '.contact-btn', function(){
    $('html').addClass('contact-show');
  });
  $('body').on('click', '.contact .close-btn', function(){
    $('html').removeClass('contact-show');
  });

  $('body').on('click', '.p-item-title', function(e){
    if($(this).hasClass('show')){
      $('.p-item-title').removeClass('show');
    }else{
      $('.p-item-title').removeClass('show');
      $(this).toggleClass('show');
    }

    e.stopPropagation();
  });

  $('#send-msg').on('submit', function(e){
    let email = $('form#send-msg input[name="email"]');
    let subject = $('form#send-msg input[name="subject"]');
    let message = $('form#send-msg textarea[name="message"]');

    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        email.val('');
        subject.val('');
        message.val('');
      }
      if (this.readyState == 4 && this.status == 400) {
        let errors = JSON.parse(this.responseText);
        let errorsContainer = $('.errors');

        console.log(errors);
        let html = '';
        let emailExists = '';
        for(let error in errors){
          emailExists = errors[error] == "El email ya esta en uso." ? '<a class="err-link" href="/users/login">Inicia Sesión</a>' : '';
          html += `<div class="msg err_c">
                    <p>${errors[error]}${emailExists}</p>
                    <div class="close-msg">
                      <i class="fas fa-times"></i>
                    </div>
                   </div>`
        }
        errorsContainer.html(html);
      }
    };
    request.open("POST", "/messages", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(`email=${email.val()}&subject=${subject.val()}&content=${message.val()}`);

    e.preventDefault();
  });

});
