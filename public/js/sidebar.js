
// on page ready
$(document).ready(() => {

  let sidebarOpen = false;

  // tracking key up events on the search box
  $('.dash-head-close').on('click',function(e){

    if(sidebarOpen){

      $('.dash-wrapper').css({'grid-template-columns':'100px repeat(4, 1fr)'});
      $('.dash-head').css({'grid-template-columns':'100px repeat(4, 1fr)'});
      $('.dash-side-bar').css({'width':'100px'});
      $('.dash-head-title').css({'width':'100px'});


    } else {

      $('.dash-wrapper').css({'grid-template-columns':'200px repeat(4, 1fr)'});
      $('.dash-head').css({'grid-template-columns':'200px repeat(4, 1fr)'});
      $('.dash-side-bar').css({'width':'200px'});
      $('.dash-head-title').css({'width':'200px'});


    }
    
    sidebarOpen ^= true;
  });

});
