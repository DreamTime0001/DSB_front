$(function(){

	$(window).scroll(function(){
		sc= $(document).scrollTop();
		if(sc > 200){
			$(".back-top").show(); 
		}else{
			$(".back-top").hide(); 
		}
	})


    // BACK TOP 

	$(".back-top").click(function(){

    	$('html,body').animate({scrollTop:0},500); 

    })

	

	

	//TAB

	$(".js-tab-box").each(function(i){

		$(this).attr("id","js-tab-box-"+i);

	})

	

	$(".js-tab").each(function(i){

		$(this).attr("id","js-tab-"+i);

	

		$(this).children("span,a,li").click(function(){

	

			$(this).addClass("active").siblings().removeClass("active");

			

			var index = $(this).index(); 

			

			$("#js-tab-box-"+i).find(".js-tab-con").eq(index).addClass("active").siblings().removeClass("active");

			

		})

	})

	

	

	//  ========== 

	//  = MB-MENU = 

	//  ========== 

	$(".js-mb-nav").click(function(){

		if (!$(this).hasClass("active")) {

			$(this).addClass("active");

			$(".js-mb-menu").animate({"left":"70%"},200);

			$(".menu-slide").hide();

			$(".js-slide-bar").removeClass("active").addClass("default");

			$(".shade").show();

		}else {

			$(this).removeClass("active");

			$(".js-mb-menu").animate({"left":"100%"},200);

			$(".menu-slide").hide();

			$(".js-slide-bar").removeClass("active").addClass("default");

			$(".shade").hide();

		}

	});

	

	$(".shade").click(function(){

		$(this).hide();

		$(".js-mb-nav").removeClass("active");

		$(".js-mb-menu").animate({"left":"100%"},200);

		$(".menu-slide").hide();

		$(".js-slide-bar").removeClass("active").addClass("default");

	});

	

	$(".js-mb-menu li").each(function(){

		var menuSlide = $(this).children(".menu-slide");

		if(menuSlide.length){

			menuSlide.prev().addClass("js-slide-bar haschild default");

		};

	});

	

	$(".js-slide-bar").click(function(){

		if ($(this).next(".menu-slide").css("display") == "none") {

			$(this).next(".menu-slide").show().parent().siblings().find(".menu-slide").hide();

			$(this).removeClass("default").addClass("active").parent().siblings().children(".haschild").removeClass("active").addClass("default");

		}else{

			$(this).next(".menu-slide").hide();

			$(this).removeClass("active").addClass("default");

		}

	});

	

	
	
	$(".language-change").hover(function(){
		$(".language-con").show();
	});
	$(".language-change").mouseleave(function(){
		$(".language-con").hide();
	});
	$(".language-con").hover(function(){
		$(".language-con").show();
	});
	$(".language-con").mouseleave(function(){
		$(".language-con").hide();
	});
	
	

	$(".banner .slick").slick({

		autoplay:true,

		autoplaySpeed:3000,

	    slidesToShow: 1,

	    slidesToScroll:1,

	    dots:true,

	    arrows:false

	});

	

	

	

	$(".mb-cooperative .item").click(function(){

		$(this).toggleClass("active").siblings().removeClass("active");

		$(this).children("ul").slideToggle().parent().siblings().children("ul").slideUp();

	});

	

	

	

	$(".index-news .slick").slick({

		autoplay:true,

		autoplaySpeed:3000,

	    slidesToShow: 1,

	    slidesToScroll:1,

	    dots:true,

	    arrows:false

	});

	

	

	

	//  ========== 

	//  = hot-product-item = 

	//  ========== 

	$(".hot-product-item").hover(function(){

		$(this).addClass("active").siblings().removeClass("active");

	});

	

	

	

	

	

	

	$(".logistics-box li .item span").click(function(){

		$(this).addClass("active").parents("li").siblings().find("span").removeClass("active");

		var index = $(this).parents("li").index(); 

		$(".all-tab .all-tab-con").eq(index).addClass("active").siblings().removeClass("active");

		

		var scroll_offset = $(".all-tab").offset(); 

		$("body,html").animate({

			scrollTop:scroll_offset.top 

		},0);	

	}) 	

	

	

	

	

	

	//  ========== 

	//  = HISTORY = 

	//  ========== 

	

	var mySwiper = new Swiper('.history .swiper-container', {

		slidesPerView :6,

	    navigation: {

	      nextEl: '.history .swiper-button-next',

	      prevEl: '.history .swiper-button-prev',

	    },

	    on: {

		    slideChangeTransitionEnd: function(){

		    	year=$(".swiper-slide-active").attr("year"); 

		    	$('.history .year span').each(function(){

					if($(this).attr("year")==year){

						$(this).addClass("active").siblings().removeClass("active");

					}

				});

		    },

		},

	});

	

	

	$('.history .year span').click(function(){

		$(this).addClass("active").siblings().removeClass("active");

		year=$(this).attr("year")

		$(".history .swiper-slide").each(function(){

			if($(this).attr("year")==year){

				var index=$(this).index();

				mySwiper.slideTo(index, 500, false);;

			}

		});

	})

	

		

	var mhistory = new Swiper('.mb-histoty .swiper-container', {

		slidesPerView :1,

		autoHeight: true,

	    navigation: {

	      nextEl: '.mb-histoty .swiper-button-next',

	      prevEl: '.mb-histoty .swiper-button-prev',

	    },

	    on: {

		    slideChangeTransitionEnd: function(){

				$(".mb-histoty .year span").eq(this.activeIndex).addClass("active").siblings().removeClass("active");

		    },

		},

	});

	



	

	

	//  ========== 

	//  = TEAM = 

	//  ========== 

	$(".team .slick-nav").slick({

		autoplay:true,

		autoplaySpeed:4000,

	    slidesToShow: 4,

	    slidesToScroll:1,

	    dots:false,

	    arrows:false,

		focusOnSelect: true,

		asNavFor: '.team .slick-for'

	});

	$(".team .slick-for").slick({

		autoplay:true,

		autoplaySpeed:4000,

	    slidesToShow: 1,

	    slidesToScroll:1,

	    dots:false,

	    arrows:false,

	    fade:true,

	    asNavFor: '.team .slick-nav'

	});

	

	

 

	//  ========== 

	//  = join = 

	//  ========== 

	$('.jobList').on('click', '.join-button', function(){

		var id = $(this).attr('data-id');

		$.post('/api/myapi.php', {'id': id, action:'job'}, function (res) {

		  if (res.code == 200) {

		    $('.join-title').html(res.data.title);

		    $('.join-content').html(res.data.content)

		    $('.join-pop').fadeIn("fast");

		  } else {

		    alert('读取文章失败，请稍候重试');

		  }

		}, 'json')

		

	})

	

	$('.join-pop .close').click(function(){

		$('.join-pop').hide();

	})



    $(".join-pop").click(function(event){	

		$('.join-pop').hide();

	});

	

	$(".join-pop .content").click(function(event){	

		event.stopPropagation();	

	});

	





	$(".faq-list li").click(function(){

		$(this).addClass("active").siblings().removeClass("active");

		$(this).children(".con").slideToggle("fast");

			

	})

	

	$('#submit-biaodan').click(function () {

	   var linkman = $.trim($('#linkman').val());

	   var tel = $.trim($('#tel').val());

	   var title = $.trim($('#title').val());

	   var content = $.trim($('#content').val());

	   if (!linkman) {

	      alert('请填写联系人');

	      return false;

	   }

	   if (!tel) {

	      alert('请填写联系电话');

	      return false;

	   }

	   if (!title) {

	      alert('请填写企业名称');

	      return false;

	   }

	   if (!content) {

	      alert('请填写合作需求');

	      return false;

	   }

	   var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;

	   if(!myreg.test(tel))

	   {

	      alert("请填写正确的手机号码");

	      return false;

	   }

	   $.post('/api/myapi.php', {

	   	linkman: linkman,

	   	tel: tel,

	   	title: title,

	   	content: content

	   }, function (res) {

	      if (res.code == '200') {

	         alert('申请成功');

	         $('.input-txt').attr('readonly', true); 

	         $('#submit-biaodan').attr('disabled', true); 

	      }

	   }, 'json')

	})



	$('.reg-box .transition').click(function () {

	   var mobile = $.trim($(this).parents('.reg-box').find('.in').val())

       window.open(regUrl+'?mobile='+mobile) 

	})



	$('.in').on('keypress', function (event) {

	 if (event.keyCode == 13) {

	   var mobile = $.trim($(this).val());

       window.open(regUrl+'?mobile='+mobile) 

	 }

	})

})

