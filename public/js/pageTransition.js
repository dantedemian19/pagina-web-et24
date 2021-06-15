function delay(n){
    n = n || 2000;
    return new Promise(done => {
      setTimeout(() => done(), n);
    });
}

function basicPageTransition(){

  const tl =  gsap.timeline();


  tl.to('ul.rows-c li', {duration:.7, scaleX: 1, transformOrigin: "bottom left", stagger: .2});
  tl.to('.page-transition img', {opacity: 1, rotate: 0, x: "-50%", y: "-50%"}, "-=.5")
  tl.to('body', {position: 'fixed'})
  tl.to('ul.rows-c li', {duration:.7, scaleX: 0, transformOrigin: "bottom left", stagger: .1, delay: 1});
  tl.to('.page-transition img', {opacity: 0, rotate: "-45deg", x: "-100%", y: "-60%"}, "-=1.4")
  tl.to('body', {position: ''}, "-=1.4")

}

function transitiongop(){
  const tl =  gsap.timeline();
  if($(window).width() > 1000){
    tl.to('#op-nav', {duration: .5, marginRight: "10px", height: "400px"});
  }else{
    tl.to('#op-nav', {duration: .5, x: "-100%", opacity: 0});
  }
}
function transitionOptionsLeaving(){
  const tl =  gsap.timeline();

  tl.to('#mng-op.container-content .container-content.ttl-width',{
    opacity: 0,
    scale: 0.5,
    x: "-100%"
  })
  tl.to('#op-nav', {duration: .5, marginRight: "auto"});
}

function transitionContainerEntering(){
  const tl = gsap.timeline();

  tl.fromTo('#mng-op.container-content .container-content.ttl-width', {
    opacity: 0,
    scale: 0.5,
    x: "100%"
  },{
    duration: .5,
    opacity: 1,
    scale: 1,
    x: "0"
  });


}

function transitionContainerLeaving(){
  const tl = gsap.timeline();

  tl.to('#mng-op.container-content .container-content.ttl-width',{
    opacity: 0,
    scale: 0.5,
    x: "-100%"
  });
}

function contentAnimation(){

  const tl = gsap.timeline();

  tl.from('.view-content', {duration: 1, opacity: 0, y: 100});
}


barba.init({
  sync: true,
  preventRunning: true,
  cacheIgnore: true,
  requestError: (trigger, action, url, response) => {
    console.log(response);
  },
  transitions: [{
    name: "basic-transition",
    // from: {
    //   namespace: [
    //     "inicio",
    //     "bi",
    //     "equipod",
    //     "proy",
    //     "reg",
    //     "vision",
    //     "ade",
    //     "computacion",
    //     "login",
    //     "register",
    //     "messages",
    //     "projects",
    //     "users",
    //     "gestion"
    //   ]
    // },
    async leave(data){

      const done = this.async();

      basicPageTransition();
      await delay(1500);

      done();
    },
    async enter(data){
      //contentAnimation();
    }
  },{
    name: "gview-transition",
    from: {
      namespace: [
        "gestion"
      ]
    },
    async leave(data){

      const done = this.async();

      transitiongop();
      await delay(500);

      done();
    },
    async enter(data){
      transitionContainerEntering();
    }
  },{
    name: "lv-gview-transition",
    from: {
      namespace: [
        "messages",
        "projects",
        "users"
      ]
    },
    to: {
      namespace: [
        "gestion"
      ]
    },
    async leave(data){

      const done = this.async();

      transitionOptionsLeaving();
      await delay(500);

      done();
    },
  },{
    name: "container-transition",
    from: {
      namespace: [
        "messages",
        "projects",
        "users",
        "messageView",
        "projectView"
      ]
    },
    to: {
      namespace: [
        "messages",
        "projects",
        "users",
        "messageView",
        "projectView"
      ]
    },
    async leave(data){

      const done = this.async();

      transitionOptionsLeaving();
      await delay(500);

      done();
    },
    async enter(data){
      transitionContainerEntering();
    }
  }]
});
barba.hooks.beforeEnter((data) => {
  $('html').removeClass('res-navigation-open');
  $('.active').removeClass('active');

  if($(`a.c-link[href="${window.location.pathname}"]`).length > 0){
    $(`a.c-link[href="${window.location.pathname}"]`).addClass('active');
    if($(`a.c-link[href="${window.location.pathname}"]`).parents('.dropdown:not(#user)').length > 0){
      $('.dropdown > .nav-link').addClass('active');
      if($(`a.c-link[href="${window.location.pathname}"]`).parents('.sub-dropdown').length > 0){
        $('.sub-dropdown > .nav-link').addClass('active');
      }
    }
  }
});
