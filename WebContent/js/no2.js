/*
 * 커스텀 타이머 
 */
$.fn.extend({
    everyTime: function(interval, label, fn, times) {
        return this.each(function() {
            jQuery.timer.add(this, interval, label, fn, times)
        })
    },
    oneTime: function(interval, label, fn) {
        return this.each(function() {
            jQuery.timer.add(this, interval, label, fn, 1)
        })
    },
    stopTime: function(label, fn) {
        return this.each(function() {
            jQuery.timer.remove(this, label, fn)
        })
    }
});
$.extend({
    timer: {
        global: [],
        guid: 1,
        dataKey: "jQuery.timer",
        regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,
        powers: {
            'ms': 1,
            'cs': 10,
            'ds': 100,
            's': 1000,
            'das': 10000,
            'hs': 100000,
            'ks': 1000000
        },
        timeParse: function(value) {
            if (value == undefined || value == null) return null;
            var result = this.regex.exec(jQuery.trim(value.toString()));
            if (result[2]) {
                var num = parseFloat(result[1]);
                var mult = this.powers[result[2]] || 1;
                return num * mult
            } else {
                return value
            }
        },
        add: function(element, interval, label, fn, times) {
            var counter = 0;
            if (jQuery.isFunction(label)) {
                if (!times) times = fn;
                fn = label;
                label = interval
            }
            interval = jQuery.timer.timeParse(interval);
            if (typeof interval != 'number' || isNaN(interval) || interval < 0) return;
            if (typeof times != 'number' || isNaN(times) || times < 0) times = 0;
            times = times || 0;
            var timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {});
            if (!timers[label]) timers[label] = {};
            fn.timerID = fn.timerID || this.guid++;
            var handler = function() {
                if ((++counter > times && times !== 0) || fn.call(element, counter) === false) jQuery.timer.remove(element, label, fn)
            };
            handler.timerID = fn.timerID;
            if (!timers[label][fn.timerID]) timers[label][fn.timerID] = window.setInterval(handler, interval);
            this.global.push(element)
        },
        remove: function(element, label, fn) {
            var timers = jQuery.data(element, this.dataKey),
                ret;
            if (timers) {
                if (!label) {
                    for (label in timers) this.remove(element, label, fn)
                } else if (timers[label]) {
                    if (fn) {
                        if (fn.timerID) {
                            window.clearInterval(timers[label][fn.timerID]);
                            delete timers[label][fn.timerID]
                        }
                    } else {
                        for (var fn in timers[label]) {
                            window.clearInterval(timers[label][fn]);
                            delete timers[label][fn]
                        }
                    }
                    for (ret in timers[label]) break;
                    if (!ret) {
                        ret = null;
                        delete timers[label]
                    }
                }
                for (ret in timers) break;
                if (!ret) jQuery.removeData(element, this.dataKey)
            }
        }
    }
});
$(window).bind("unload", function() {
    jQuery.each(jQuery.timer.global, function(index, item) {
        jQuery.timer.remove(item)
    })
});;


//$(document).ready(function() {
$(function() {
	
	var has3d = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());
	if (has3d) $("body").addClass("has3d");

	//setPreload();
	//pl();
	
	//$("#sceneBuffer").show();
	var leftX2 = (1280 * 2) + 'px';
	var topX2 = (720 * 2) + 'px';
	
	var currentScene;
	var isPause = false;
	
	//var scenes = [];
	//$("*[id^='s3-']").each(function(){
	//	scenes.push($(this));
	//});
	//console.log(scenes.length);
	
	var audios = {
			  audioRunMain : $("#audioRunMain")
			 ,audioRunMid : $("#audioRunMid")
			 ,audioRunEnd : $("#audioRunEnd")
			 ,audioWipeMedium : $("#audioWipeMedium")
			 ,audioZoomin : $("#audioZoomin")
			 ,audioRunning3 : $("#audioRunning3")
			 ,audioMirrorSan : $("#audioMirrorSan")
			 ,audioMirrorDrum1 : $("#audioMirrorDrum1")
			 ,audioMirrorDrum2 : $("#audioMirrorDrum2")
			 ,audioMirrorDrum3 : $("#audioMirrorDrum3")
			 ,audioBangGlass : $("#audioBangGlass")
			 ,audioBreath : $("#audioBreath")
			 ,audioClassBreak : $("#audioClassBreak")
	};
	var playingAudios = [];
	
	/*
	 * 자동 플레이 토글 
	 */
	$("#autoplay").bind("click", function() {
		//console.log("click");

        $(this).toggleClass("disabled");
        /*if ($(this).hasClass("disabled")) {
        	$.each(scenes, function(index, obj){
        		//console.log("pause");
        		$(obj).pause();
        	});

        	$.each(playingAudios, function(index, obj){
        		//console.log("pause");
        		$(obj).trigger('pause');
        	});
        } else {
        	$.each(scenes, function(index, obj){
        		//console.log("resume");
        		$(obj).resume();
        	});
        	$.each(playingAudios, function(index, obj){
        		//console.log("pause");
        		$(obj).trigger('play');
        	});
        	
        	$(document).stopTime("autoTimer");	// 자동시작 타이머 중지 
        }*/
        if ($(this).hasClass("disabled")) {
        	$(".sauAnimation").pause();
        	$(".sauAudio").trigger('pause')
        } else {
        	$(document).stopTime("autoTimer");	// 자동시작 타이머 중지 
        	$(".sauAnimation").resume();
        	$(".sauAudio").trigger('play')
        	//$(document).stopTime("autoTimer");	// 자동시작 타이머 중지 
        }
        
    });;
	
    /*
     * 사운드 뮤트 토글 
     */
	$("#sound").bind("click", function() {
        $(this).toggleClass("disabled");
        audioMuted();
    });;
    
    var audioMuted = function () {
    	$(".sauAudio").prop("muted", !$(".sauAudio").prop("muted"));
    };;
	
    /*
     * animation start
     */
	start();
	
	function ShowCustomDialog()
	{
		ShowDialogBox('Warning','Record updated successfully.','Ok','', 'GoToAssetList', null);
	}

    function ShowDialogBox(title, content, btn1text, btn2text, functionText, parameterList) {
        var btn1css;
        var btn2css;

        if (btn1text == '') {
            btn1css = "hidecss";
        } else {
            btn1css = "showcss";
        }

        if (btn2text == '') {
            btn2css = "hidecss";
        } else {
            btn2css = "showcss";
        }
        $("#lblMessage").html(content);

        $("#dialog").dialog({
            resizable: false,
            title: title,
            modal: true,
            width: '400px',
            height: 'auto',
            bgiframe: false,
            hide: { effect: 'scale', duration: 400 },

            buttons: [
                {
                    text: btn1text,
                    "class": btn1css,
                    click: function () {
                                                                
                        $("#dialog").dialog('close');

                    }
                },
                {
                    text: btn2text,
                    "class": btn2css,
                    click: function () {
                        $("#dialog").dialog('close');
                    }
                }
            ]
        });
    }
    
    /*
     * animation start
     */
    function start() {
    	$("#sound, #autoplay, #separation").animate({
            top: 23
        }, "slow");
    	
    	$("#intro").delay(1000).fadeOut("slow", function() {
            $(document).oneTime(7000, "autoTimer", function() {
                $("#autoplay").trigger("click");
                audios['audioRunMain'].trigger('pause');
            });

            s3hzs1();	/* run paradise horizontal */
//            s3s1s1();	/* vertical run */
//            s3s2();		/* diagonal slot */
//            s3hzss();	/* run horizontal sunset */
//            s3s3s1();	/* horizontal slot */
//            s3s4();		/* sand glass */
//            s3s5();		/* hit glass */
            $("#intro").remove();
        });  
    } 
    
    /* paradise horizontal run */
    var s3hzs1 = function () {
    	audios['audioRunMain'].trigger('pause');
    	//playingAudios.push(audios['audioRunMain']);
    	$("#s3-hz-s1").fadeTo(10, 1.0, function (next) {
	    	//$("#s3-hz-s1").css('visibility', 'visible');
	
	    	$("#s3-hz-s1-jp1").animate({left: '1500px'}, 6000, function() {
	    		s3s1s1();
//	    		$("#s3-hz-s1").css('visibility', 'hidden');
	    		$("#s3-hz-s1").remove();
	    	});
			$("#s3-hz-s1-tree1").animate({left: '-1100px'}, 12000);
			$("#s3-hz-s1-tree2").animate({left: '-1300px'}, 10500);
			$("#s3-hz-s1-glass").animate({left: '-1400px'}, 9500);
			
			$("#s3-hz-s1-bg").animate({left: '-600px'}, 14500, function() {
				$("#s3-hz-s1").animate({top: '-1280px'}, 3000, function() {
					//$("#s3-hz-s1").css('visibility', 'hidden');
				});
			});
    	});
    	$("#s3-hz-s1").pause();	// 첫 씬 에서 먼저 포즈한다
    };;
    
    /* vertical run */
    var s3s1s1 = function () {
    	$("#s3-s1").css('visibility', 'visible');
    	$("#s3-s1-bg").css('visibility', 'visible');
		$("#s3-s1-bg").animate({top: '0px'}, 1000, 'easeOutQuart', function() {
			s3s1s2(); 
		});
    };;
    
    var s3s1s2 = function () {
    	$("#s3-s1").css('visibility', 'visible');
    	$("#s3-s1-jp-top").css('visibility', 'visible');
    	$("#s3-s1-jp-shadow").css('visibility', 'visible');
		$("#s3-s1-jp-top").animate({top: '150px'}, 500);
		$("#s3-s1-jp-shadow").animate({top: '100px'}, 500, function() {
			$("#s3-s1").animate({top: '1440px'}, 2000, 'easeOutQuart', function() { 
				s3s2(); 
			});
		});
    };;
    
    /* diagonal slot */
	var s3s2 = function () {
		$("#s3-s2").animate({top: '0px', left: '0px'}, 1000, 'easeOutQuart', function() {
			$("#s3-s2-bg").animate({left: '312px'}, 5000);
			$("#s3-s2-drop").animate({left: '300px'}, 'slow');
			$("#s3-s2-jp-run").animate({left: '300px'}, 'slow', function() {
				$("#s3-s2").animate({top: topX2, left: leftX2}, 2000, 'easeOutQuart', function() {
					s3hzss();
				});
			});
		});
	};;
	
	/* run horizontal sunset */
	var s3hzss = function () {
		var W = $(window).width();
		$("#s3-hz-ss").fadeTo(10, 1.0, function (next) {
    		$("#s3-hz-ss").animate({left: '0px'}, 3000, function() {
    			var jp = $("#s3-hz-ss-jp");
    			jp.css({left: W/2-jp.width()/2});
    		
    			$("#s3-hz-ss-bg").animate({left: '-1000px'}, 12000);

    			$("#s3-hz-ss-d3").animate({left: '-3000px'}, 9000);
				$("#s3-hz-ss-d2").animate({left: '-5000px'}, 8000);
				$("#s3-hz-ss-d1").animate({left: '-6800px'}, 7000, function() {
					$(".s3-hz-ss").pause();
					s3s3s1();
					$("#s3-hz-ss").remove();
				});
				$("#s3-hz-ss-jpup").animate({left: '-8000px'}, 6500);
    		});
    	});
    };;
	
	/* horizontal slot */
	function s3s3s1() {
		//$("#s3-s3-s1").css('visibility', 'visible');
		$("#s3-s3-s1").fadeTo(10, 1.0, function (next) {
			$("#s3-s3-s1").animate({top: '0px', left: '0px'}, 1000, 'easeOutQuart', function() {
				$("#s3-s3-s1-jp1").css('visibility', 'visible');
				$("#s3-s3-s1-jp1").animate({left: '500px'}, 'slow', function() {
					s3s3s2();
				});
			});
		});
	}
	
	function s3s3s2() {
		$("#s3-s3-s2").fadeTo(10, 1.0, function (next) {
			$("#s3-s3-s1").remove();	// delete pre scene
			$("#s3-s3-s2-jp2").animate({left: '1200px'}, 1000, 'linear', function() {
				$("#s3-s3-s2").animate({top: '-720px'}, 'slow', function() {
					
				});
				
				s3s4(); 
			});
		});
	}
	/* use step, presenting sprite
	$( "div" ).animate({
		opacity: .5,
		height: "50%"
		}, {
			step: function( now, fx ) {
			var data = fx.elem.id + " " + fx.prop + ": " + now;
			$( "body" ).append( "<div>" + data + "</div>" );
		}
	});

	 */
	
	/* sand glass */
	function s3s4() {
		var fadeDelay = 800;	
		var scale = 2.2
		$("#s3-s4").css('visibility', 'visible');
		$("#s3-s4").animate({top: '0px'}, 'slow', function() {
			$("#s3-s4-ex-wide").delay('2000').animate({scale: scale}, 1000, function() {
				$("#s3-s4-ex-zoom").css('visibility', 'visible');
				
				$("#s3-s4-ex-zoom").animate({top: '0px'}, 1000, 'linear', function() {

					scale = 1.5
					$("#s3-s4-sand").css('visibility', 'visible');
					$("#s3-s4-sand").fadeTo(3500, 1.0, function() {
						$("#s3-s4-ex-zoom").css('visibility', 'hidden');
						$("#s3-s4-er1").fadeTo(500, 1.0, function() {
							$("#s3-s4-er2").delay( fadeDelay ).fadeTo(500, 1.0, function() {
								$("#s3-s4-er3").delay( fadeDelay ).fadeTo(500, 1.0, function() {
									$("#s3-s4-er4").delay( fadeDelay ).fadeTo(500, 1.0, function() {
										$("#s3-s4-glass").fadeTo(1500, 1.0);
										$("#s3-s4-glass-tp").fadeTo(1500, 1.0, function() {
											$("#my_camera").fadeTo(1500, 1.0).delay(3000, "fx").queue("fx", function (next) {
												s3s5();
											    next();
											});
										});
										
									});
								});
							});
						});
					});
				});
			});

		});
	}
	
	/* hit glass */
	var fadeDelay = 20;
	var delay = 1000;
	function s3s5() {
		$("#s3-s4").animate({top: '-720px'}, 'slow');
		$("#s3-s5").css('visibility', 'visible');
		$("#s3-s5").animate({top: '0px'}, 'slow').delay(delay, "fx").queue("fx", function (next) {
			s3s5s2(); 
		    next();
		});
	}
	
	function s3s5s2() {
		$("#s3-s5-b2").fadeTo(fadeDelay, 1.0).delay(delay, "fx").queue("fx", function (next) {
			s3s5s3(); 
		    next();
		});
	}
	
	function s3s5s3() {
		$("#s3-s5-b3").fadeTo(fadeDelay, 1.0).delay(delay, "fx").queue("fx", function (next) {
			s3s5s4(); 
		    next();
		});
	}
	
	function s3s5s4() {
		$("#s3-s5-b4").fadeTo(fadeDelay, 1.0).delay(delay, "fx").queue("fx", function (next) {
			s3s5s5(); 
		    next();
		});
	}
	
	function s3s5s5() {
		$("#s3-s5-b5").fadeTo(fadeDelay, 1.0).delay(delay, "fx").queue("fx", function (next) {
			s3s5s6(); 
		    next();
		});
	}
	
	function s3s5s6() {
		$("#s3-s5-b6").fadeTo(fadeDelay, 1.0).delay(delay, "fx").queue("fx", function (next) {
			s3s5s7(); 
		    next();
		});
	}
	
	function s3s5s7() {
		delay = 500;
		$("#s3-s5-b7").fadeTo(fadeDelay, 1.0).delay(delay, "fx").queue("fx", function (next) {
			s3s5s8(); 
		    next();
		});
	}
	
	function s3s5s8() {
		delay = 200;
		$("#s3-s5-b8").fadeTo(fadeDelay, 1.0).delay(delay, "fx").queue("fx", function (next) {
			s3s5s9(); 
		    next();
		});
	}
	
	function s3s5s9() {
		delay = 1000;
		$("#s3-s5-b9").fadeTo(fadeDelay, 1.0).delay(delay, "fx").queue("fx", function (next) {
			s3s5s10(); 
		    next();
		});
	}
	
	function s3s5s10() {
		var scale = 1.6
		delay = 10;
		$("#s3-s5-b10").fadeTo(fadeDelay, 1.0).delay(delay, "fx").queue("fx", function (next) {
			$("#s3-s5-b10-g0").fadeTo(fadeDelay, 1.0);
			$("#s3-s5-b10-g1").fadeTo(fadeDelay, 1.0).animate({scale: scale}, 1000);
			$("#s3-s5-b10-g2").fadeTo(fadeDelay, 1.0).animate({scale: scale}, 3000);
		    next();
		});
	}

    
	
    	
});;

function pl() {
	$.ajax({
		type: 'GET' ,
		//url: 'http://seoularts.dothome.co.kr/seoul-art/preload.html' ,
		url: 'http://localhost:8080/no2/preload.html' ,
		xhrFields: {
			onprogress: function (e) {
				if (e.lengthComputable) {
					console.log(e.loaded / e.total * 100 + '%');
				}
			}
		} ,
		success: function (response) {
			//alert(response);
			$('#sceneBuffer').empty().html(response);
//			$("#sceneBuffer").animate({
//		        left: '250px',
//		        opacity: '0.5',
//		        height: '150px',
//		        width: '150px'
//		    });
			//$("#sceneBuffer").show();
		}
	});
}

var preloadReturn='';

function preloadRequest(url){
    $('#preloader').show();
    $.get(url, function(data) {
        $('#resultDiv').html(data);
        $('#preloader').hide();
    }).fail(function() {
        alert( 'Error occured during requesting the page' );
        $('#preloader').hide();
    });
}

function setPreload() {
    var urlPreaload = "preload.html";

    $.manageAjax.add('ajaxProfile', {
    	url: urlPreaload ,
        abortOld: true ,
        preventDoubbleRequests: true ,
        cacheResponse: true ,
        success: function(data) {
            var toLoad = retrieveImages($(data));
            var manuallyLoad = ["images/10/2.jpg", "images/10/3.jpg", "images/10/4.jpg", "images/10/5.jpg", "images/10/6.jpg", "images/10/7.jpg", "images/10/8.jpg", "images/10/9.jpg", "images/10/10.jpg", "images/10/11.jpg", "images/10/12.jpg", "images/10/13.jpg", "images/10/14.jpg", "images/10/15.jpg", "images/10/16.jpg", "images/10/17.jpg", "images/10/18.jpg", "images/10/19.jpg", "images/10/20.jpg", "images/10/21.jpg", "images/10/22.jpg", "images/10/23.jpg", "images/10/24.jpg"];
            var finalLoad = toLoad.concat(manuallyLoad);
            $("#scrollContainer").empty().html(data);
            var toLoad = retrieveImages($("#scrollContainer"));
            $.preload(toLoad, {
                onComplete: function(callback) {
                    $("#progress").css({
                        width: (callback.done / callback.total) * 100 + "%"
                    });
                },
                onFinish: function() {
                    console.log("start");
                    start();
                }
            });
        }
    });
}	// setPreload

/*
 * 웹캠 셋팅 
 */
function setWebcam() {
	Webcam.set({
		width: 1280,
		height: 720,
		image_format: 'jpeg',
		jpeg_quality: 90
	});
	Webcam.attach( '#my_camera' );
}