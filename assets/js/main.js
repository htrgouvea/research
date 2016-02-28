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
});