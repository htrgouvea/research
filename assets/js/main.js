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
  		var menuLink = $('# a');
    	var scroll   = $(this).scrollTop();
    	
    	console.log(scroll);

    	if(scroll == 585) {
    		menuLink.css({'color': '#000'});
    	}
    	else if(scroll > 1440 && scroll < 2095) {
      		menuLink.css({'color': '#000'});
    	}
    	else if(scroll > 2295) {
      		menuLink.css({'color': '#000'});
    	}
    	else {
    		menuLink.css({'color': '#fff'});
    	};
  	});
});