jQuery(document).ready(function($) { 
  $(".scroll").click(function(event){        
    event.preventDefault();
    $('html,body').animate({scrollTop:$(this.hash).offset().top}, 800);
 });
});

$(document).ready(function() {
	/* style for scroll bar */ 
	$('html').niceScroll({
		cursorborder: '#000',
		cursorcolor:  '#000'
	});

	/* for changes in menu link colors */ 
  $(window).scroll(function() {
  	var menuLink = $('#menu a');
    var scroll   = $(this).scrollTop();
    console.log(scroll);

    if(scroll > 585 && scroll < 1230) {
    	menuLink.css({'color': '#000'});
    } else if(scroll > 1440 && scroll < 2095) {
      menuLink.css({'color': '#000'});
    } else if(scroll > 2295) {
      menuLink.css({'color': '#000'});
    } else {
    	menuLink.css({'color': '#fff'});
    };
  });
});


