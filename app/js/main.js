
	$(".nav-trigger").on("click", function(e){
		e.preventDefault();
		if ($("body").hasClass("active") == true && $(".header-nav").hasClass("open") == true) {
			$("body").removeClass("active");
			$(".header-nav").removeClass("open");
			console.log("Remove");
		} else {
			$("body").addClass("active");
			$(".header-nav").addClass("open");
			console.log("Add");
		}
	});

	$(".header-nav.open a").on("click touch", function(e){
		$("body").removeClass("active");
		$(".header-nav").removeClass("open");
		console.log("touch");
	})

	var offset = 1800,
		offset_opacity = 1200,
		scroll_top_duration = 1800,
		$back_to_top = $(".sttop");
	$(window).scroll(function () {
		$(this).scrollTop() > offset ? $back_to_top.addClass("is-visible") : $back_to_top.removeClass("is-visible fade-out"), $(this).scrollTop > offset_opacity && $back_to_top.addClass("fade-out")
	}), $back_to_top.on("click", function (o) {
		o.preventDefault(), $("body,html").animate({
			scrollTop: 0
		}, scroll_top_duration)
	}), $(function () {
		$(".smoothScroll").click(function () {
			if (location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname) {
				var o = $(this.hash);
				if (o = o.length ? o : $("[name=" + this.hash.slice(1) + "]"), o.length) return $("html,body").animate({
					scrollTop: o.offset().top
				}, 1e3), !1
			}
		})
	});