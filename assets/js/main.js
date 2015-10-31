$('.anchorList a').smoothScroll();

jQuery.fn.smoothScroll = function(){
	$(this).each(function(){
		var node = $(this);
		$(node).click(function(e){
			var anchor = $(this).attr('href');
			anchor = anchor.split("#");
			anchor = anchor[1];
			var t = 0;
			var found = false;
			var tName = 'a[name='+anchor+']';
			var tId = '#'+anchor;
			if (!!$(tName).length){
				t = $(tName).offset().top;
				if ($(tName).text() == ""){
					t = $(tName).parent().offset().top;
				}
				found = true;
			} else if(!!$(tId).length){
				t = $(tId).offset().top;
				found = true;
			}
			if (found){
				$("body, html").animate({scrollTop: t}, 500);
			}
			//e.preventDefault();
		});
	});
	var lAnchor = location.hash;
	if (lAnchor.length > 0){
		lAnchor = lAnchor.split("#");
		lAnchor = lAnchor[1];
		if (lAnchor.length > 0){
			$("body, html").scrollTop(0);
			var lt = 0;
			var lfound = false;
			var ltName = 'a[name='+lAnchor+']';
			var ltId = '#'+lAnchor;
			if (!!$(ltName).length){
				lt = $(ltName).offset().top;
				if ($(ltName).text() == ""){
					lt = $(ltName).parent().offset().top;
				}
				lfound = true;
			} else if(!!$(ltId).length){
				lt = $(ltId).offset().top;
				lfound = true;
			}
			if (lfound){
				$("body, html").animate({scrollTop: lt}, 500);
			}
		}
	}
}