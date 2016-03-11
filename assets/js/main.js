jQuery(document).ready(function($) { 
  $(".scroll").click(function(event){        
    event.preventDefault();
    $('html,body').animate({scrollTop:$(this.hash).offset().top}, 800);
 });
});

$(document).ready(function() {
	$('html').niceScroll({
		cursorborder: '#00aeef',
		cursorcolor:  '#00aeef'
	});

	$(window).scroll(function() {
  		var menuScroll = $('#arrow a');
    	var Mainscroll = $(this).scrollTop();

    	if(scroll == 585) {}
    	else if(scroll == 1440) {}
    	else if(scroll == 2295) {}
    	else {};
  	});
});