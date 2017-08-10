/*
	App-like One Page Layout by jayjnu

	To apply one page layout to your web page,
	it is crucial to set key values of frame, container and sections.

	App-like One Page Layout provides active radio nav animation.
	To activate this feature, Create html elements in accordance with markup and style guides on README.md.
	After that, set radio and radioOn key values.
	
	{
		frame: "#id",
		container: "#id",
		sections: ".class",
		radio: "#id",
		radioOn: "#id",
		speed: 500,
		easing: "swing"
	}

*/

//$(document).ready(function(){
//	startOnePage({
//		frame: "#view",
//		container: "#frame",
//		sections: ".op-section",
//		radio: "#radio",
//		radioOn: "#radioOn",
//		speed: 1000,
//		easing: "swing"
//	});
//});
function startOnePage(myInput){
	'use strict';

	var settings = myInput;

	// input values
	var frame = $(settings.frame),
		container = $(settings.container),//内容
		sections = $(settings.sections),//获得所有页面
		speed = settings.speed || 1000,//速度
		radio = $(settings.radio),//电梯按钮
		radioOn = $(settings.radioOn),
		easing = settings.easing || "swing";

	/* 
	 布尔值启用/禁用默认滚动操作
		linked to
			1) init()
			2) animateScr()
			3) scroll, keydown bound event handler
		default: true;
	*/
	var didScroll = true,
		isFocused = true;

	// 获得页面总高度
	var height = $(window).height();

	// 页面的个数
	var totalSections = sections.length-1;//7个

	// 目前隐藏的窗口个数
	var num = 0; 

	// 键盘的unicode号,创建一个空对象
	var pressedKey = {};
		pressedKey[36] = "top"; // home
		pressedKey[38] = "up"; // upward arrow
		pressedKey[40] = "down"; // downward arrow
		pressedKey[33] = "up"; // page up
		pressedKey[34] = "down"; // page down
		pressedKey[35] = "bottom"; // end


	// init函数来初始化/重新分配值可变的值,防止部分错位引起的窗口大小。
	function init(){
		height = $(window).height();
		frame.css({"overflow":"hidden", "height": height + "px"});
		sections.css({"height": height + "px"});
		didScroll = true;
		isFocused = true;
		end = - height * ( totalSections );

		
		container.stop().animate({marginTop : 0}, 0, easing, function(){
			num = 0;
			didScroll = true;
			turnOnRadio(0, 0);
		});
	}
	// 事件绑定到init函数
	$(window).bind("load resize", init);
	

	// 动画滚动效果
	var now, end;
	function animateScr(moveTo, duration, distance){
		var top;
		duration = duration || speed;
		switch(moveTo){
			case "down":
				top = "-=" + ( height * distance ) + "px";
				num += distance;
				break;
			case "up":
				top = "+=" + ( height * distance ) + "px";
				num -= distance;
				break;
			case "bottom":
				top = end;
				num = totalSections;
				break;
			case "top":
				top = 0;
				num = 0;
				break;
			default: console.log("(error) wrong argument passed"); return false;
		}

		container.not(":animated").animate({marginTop : top}, duration, easing, function(){
			didScroll = true;
		});

		if(radio){turnOnRadio(num, speed);}
	}

	// 显示停留的单选按钮
	function turnOnRadio(index, duration){
		duration = duration || speed;
		radioOn.stop().animate({"top": index * radioOn.outerHeight( true )+ "px"}, speed, easing);
	}

	radio.children("li:not(" + settings.radioOn + ")").click(function(){
		var to = $(this).index();
		var dif = Math.abs( num - to );

		if(num < to){
			animateScr("down", speed, dif);
		}else if(num > to){
			animateScr("up", speed, dif);
		}
	});

	/*	
		1. 得到一个相应类型的事件和处理
		2. 启用/禁用默认键盘行为
	*/
	$(document).bind("DOMMouseScroll mousewheel keydown", function(e){
		var eType = e.type;

		now = parseInt( container.css("marginTop") );
		end = - height * ( totalSections );

		// 处理事件
		if( didScroll && isFocused ){
			// 防止多个事件处理
			didScroll = false;

			// on wheel
			if( eType == "DOMMouseScroll" || eType == "mousewheel" ){

				var mvmt = e.originalEvent.wheelDelta;
				if(!mvmt){ mvmt = -e.originalEvent.detail; }

				if(mvmt > 0){
					if( now == 0){
						didScroll = true;
					}else{
						animateScr("up", 1000, 1);
					}
				}else if(mvmt < 0){
					if( now == end ){
						didScroll = true;
					}else{
						animateScr("down", 1000, 1);
					}
				}else{
					didScroll = true; 
				}
			}
			// on keydown
			else if( eType == "keydown" ){
				if( pressedKey[e.which] ){
					e.preventDefault();
					if( pressedKey[e.which] == "up" ){
						if( now == 0 ){
							animateScr("bottom");
						}else{
							animateScr("up", speed, 1);
						}
					}else if( pressedKey[e.which]  == "down" ){
						if( now == end ){
							animateScr("top");
						}else{
							animateScr("down", speed, 1);
						}
					}else{
						animateScr( pressedKey[e.which] );
					}
				}else{
					didScroll = true;
				}
			}
		}

		// 当输入或文本区域被聚焦时，允许默认的键盘行为
		$("input, textarea").focus(function(){isFocused = false;})
							.blur(function(){isFocused = true;});
	});

}