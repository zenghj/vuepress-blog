$(function(){
	
	var Anti_ptid = 16;
	var regLevel = 4;
	var loginLevel = 4;
	var bizId = 1199006632;
	var Anti_token = '';
	var Anti_verify_status = '';
	var Anti_bthandle = 0;
	var Anti_idcard_status = '';
	var Anti_more_info = "";
	var countdowntime = new Array();
	var countdowninfo = new Array();
	var offlineinfo = new Array();
	var Anti_lastRequestTime = 0;
	var Anti_refresh = 0;
	var Anti_refreshtimes = 0;
	var Anti_minReauestTime = 10000;//最短请求时间间隔
	var Anti_before_start = 0;
	var Anti_clearId = '';
	var Anti_before_start_text = "";
	var Anti_tmp = "";
	var Anti_countDowning = 0;
	var Anti_not_login = 0;//倒计时到终点设为1 传递一个状态 不再弹提示窗
	var Anti_veryUrl = "//h.api.4399.com/unifiedLogin/user/realname/status";
	var Anti_veryUrl2 = "//h.api.4399.com/intermodal/user/realname/status"; //验证是不是成年人
	var Anti_openClientBaseLine = 1;//客户端兜底方案 1开启 2关闭
	var Anti_clientBaselineWord = '您的网络异常，为了更好的游戏体验，请检查网络状态后重新进入游戏';
	var Anti_connectNever = 1;//从未连通过心跳包服务器0
	var Anti_connectRetryTimes = 0;//重连次数
	var Anti_connectRetryMaxTimes = 6;//最多尝试重连次数 由于errr和timeout都会触发 这边乘以2

	var Anti_self_role = 0;//1是成年 其他是0
	var Anti_get_self_role = 0;//是否获取到用户身份 获取中是1 获取到是2
	
	//游戏id
	if(typeof(nFlashId) == "undefined"){
		Anti_gid = 400;
	}else{
		Anti_gid = parseInt(nFlashId);
	}

	//获取uid
	var Anti_uid = Anti_getUidFunc();
	if(!Anti_uid){Anti_uid=0;}

	//载入UI
	append();
	
	//游戏盒点击到黑色蒙层弹出登录
	if((/4399GameCenter/gi).test(navigator.userAgent)){
		$("#shadow").click(function(){
			if($("#Anti_open").is(':hidden') &&  $("#AntiNoticeopen").is(':hidden') && $("#Anti_more").is(':hidden')){
				var Anti_uid1 = Anti_getUidFunc();
				if(!Anti_uid1){Anti_uid1=0;}
				if(Anti_uid1==0){
					$("#shadow").hide();
					Anti_showLogin();
				}
			}
		});
	}

	//初始化登录
	if("undefined" == typeof UniLogin){
		showClientDeniedForUniLoginFalse();
	}else{
		UniLogin.setUnionLoginProps({
			regLevel : regLevel,
			loginLevel : loginLevel,
			bizId:bizId,
			appId : "dev4399",
			canBack : true
		})
	}

	//心跳检测
	heartBeat();
	
	try {
        //同步游戏内的登录到页面
        window.addEventListener('message', function (e) {
            if (e.data.eventType === "loginSuccess") {
                window.Html5Model.USER.ready(function(userInfo){
                    Anti_uid = userInfo.userId;
					heartBeat();
                });
            }
            if (e.data.eventType === "logoutSuccess") {
                window.location.reload();
            }
        }, false);
    } catch (e) { }


	//函数组
	function Anti_logoutFunc(){
		if((/4399GameCenter/gi).test(navigator.userAgent)){
			try{
				window.android.onJSClickLogout();
			}catch (e) { }
		}else{
			$.ajax({
			type:"GET",
			url:"//bbs.4399.cn/m/user-hLogout?dataType=json",
			dataType:"json",
			xhrFields:{withCredentials:true},
			success:function(msg){
					if(msg['code']==100){
						Html5Model.USER.logout();
						Anti_uid = 0;
						$("#Aplayshowprompt").html($("#Aplayshowprompt").html());
						return false;
					}
				}
			});	
		}
	}
	
	function Anti_getUidFunc(){
		var uid = 0;
		var msg = window.Html5Model.USER.getUserInfo();
		if(msg){
			uid = msg.userId;
		}
		return uid;
	}

	window.Anti_showLogin = function(){
		Html5Model.USER.login(null,loginLevel,regLevel);
		if((/4399GameCenter/gi).test(navigator.userAgent)){
			//登录覆盖一个黑层
			$("#shadow").show();
		}
	}

	window.loginsuccessdo = function(uid){
		Anti_uid = uid;
		if((/4399GameCenter/gi).test(navigator.userAgent)){
			$("#shadow").hide();
		}
		heartBeat();
	}
	window.logoutsuccessdo = function(){
		Anti_uid = 0;
		Anti_close();
		heartBeat();
	}

	window.Anti_close = function(){
		$("#Anti_open").hide();
	}

	//转换函数
	function transform (data) {
		for (var key in data) {
		if (typeof data[key] === 'object') {
				transform(data[key]);
			} else if (typeof data[key] === 'string') {
				data[key] = decodeURIComponent(data[key]);
				data[key] = data[key].replace(/\\/g, '').replace(/\\"/g, '"').replace(/\+/g, ' ');
			}
		}
	}
	
	//完善身份信息
	window.wapshowPopupCertify = function(){
		try{
			var uinfo = Html5Model.USER.getUserInfo();
			unionLoginProps.clientid = uinfo.clientId;
			unionLoginProps.uid = uinfo.userId;
			unionLoginProps.token2cookie = uinfo.accessToken;
			//完善信息方法回调
			unionLoginProps.__closePopupCertifyCallback = function(){
				Anti_reauthentication();
			}
		} catch (e) { }
		if("undefined" != typeof UniLogin){
			UniLogin.showPopupCertify();
			UniLogin.setVerticalCertify();
		}
		return false;
	}
	
	//验证账号
	function Anti_reauthentication(){
		if(Anti_uid>0){
			$.ajax({
				type:"GET",
				async: false,
				url:Anti_veryUrl+"?userId="+Anti_uid+"&timestamp="+new Date().getTime(),
				dataType:"jsonp",
				callbackParameter:"callback",
				success:function(msg){
					if(msg.code==30000){
						if(msg.data.cert==1){//已验证
							Anti_lastRequestTime = 0;
							heartBeat();
							Anti_close();
						}else{
							alert("当前未获取到您的实名信息，请确认是否填写，如已确认填写请稍后重试");
							window.location.reload();
						}
					}
				}
			});	
		}
	}
	
	//申请验证
	window.openModifyRealname = function(){
		try{
			var uinfo = Html5Model.USER.getUserInfo();
			var url = 'https://h.api.4399.com/unifiedLogin/user/realname/profile?bizid='+bizId+'&userId='+Anti_uid+'&accessToken='+uinfo.accessToken+'&topbar=1&gameUrl='+window.location.href;
			window.location.href = url;
		} catch (e) { }
		
	}

	//心跳函数	
	function heartBeat(){

		var Anti_uid2 = Anti_getUidFunc();
		if(!Anti_uid2){Anti_uid2=0;}
		
		if(Anti_uid2!=Anti_uid){
			Anti_uid = Anti_uid2;
			Anti_token = "";
			Anti_verify_status = '';
			Anti_idcard_status = "";
		}
		
		//过滤10秒内的重复请求
		var Anti_difftime = new Date().getTime() - parseInt(Anti_lastRequestTime);
		
		if(Anti_uid>=0){
			if(parseInt(Anti_lastRequestTime)==0 || parseInt(Anti_difftime)>=parseInt(Anti_minReauestTime)){
				Anti_lastRequestTime = new Date().getTime();
				////var params = 'urlencode';
				var params = '';
				$.ajax({
					type:"GET",
					url:"//apps.4399.com/online/heartbeat?ptid="+Anti_ptid+"&uid="+Anti_uid+"&gid="+Anti_gid+"&token="+Anti_token+"&result_encode="+params+"&is_adult="+Anti_idcard_status+"&verify_status="+Anti_verify_status+"&refresh="+Anti_refresh+"&not_login="+Anti_not_login+"&timestamp="+new Date().getTime(),
					dataType:"jsonp",
					callbackParameter:"callback",
					timeout:3000,
					success:function(msg){
						Anti_refresh = 0;
						////transform(msg);
						showSilence(msg);
						if(msg['result']){
							var Anti_interval = parseInt(msg['result']['interval']);
							if(Anti_interval*1000<parseInt(Anti_minReauestTime)){Anti_minReauestTime=Anti_interval*1000;}
							Anti_token = msg['result']['token'];
							Anti_idcard_status = msg['result']['idcard_status'];//用户身份
							Anti_verify_status = msg['result']['verify_status'];//用户身份
						}
						if(msg.code==100){//用户不需要进行防沉迷限制，不再需要请求本接口
							Anti_connectNever = 0;
							stopBeat();
							Anti_close();
						}else if(msg.code==200){//用户需要防沉迷限制，返回剩余游戏时长，允许游戏
							Anti_connectNever = 0;
							if($("#Anti_title").html()=="网络异常提醒"){
								Anti_close();
							}
							beat(Anti_interval);
						}else if(msg.code==201){//用户需要防沉迷限制，提醒用户限制游戏倒计时，允许游戏
							Anti_connectNever = 0;
							showWindows(msg);
							beat(Anti_interval);
						}else if(msg.code==202){//倒计时
							Anti_connectNever = 0;
							showWindows(msg);
							beat(Anti_interval);
						}else if(msg.code==203){//用户需要防沉迷限制，弹窗提醒用户相关信息（如：需用户完善身份信息或者用户游戏时长超限、当前为禁止游戏时段等），禁止游戏；
							Anti_connectNever = 0;
							showWindows(msg);
							stopBeat();
							showSilence("203停止");
						}else if(msg.code==205){//强制登录
							Anti_connectNever = 0;
							Html5Model.USER.login(null,loginLevel,regLevel);
							if((/4399GameCenter/gi).test(navigator.userAgent)){
								//登录覆盖一个黑层
								$("#shadow").show();
							}
						}else if(msg.code==401){//参数异常
							showSilence("防沉迷参数异常");
							Anti_retry();
						}else if(msg.code==402){//token异常，这种状况下，建议清空token重新发送一次心跳
							Anti_token = '';
							Anti_retry();
						}else if(msg.code==403){//服务器异常
							showSilence("防沉迷服务器异常");
							Anti_retry();
						}else if(msg.code>500){//服务器错误
							Anti_retry();
						}
					},  
					error:function(XMLHttpRequest, textStatus, errorThrown) { 
						Anti_retry();
					},  
					complete : function(XMLHttpRequest,status){
						if(status=='timeout'){
							Anti_retry();
						}
					}
				});	
			}
		}
	}
	
	//异常重试
	/*
	window.Anti_retry = function(){
		if(Anti_uid>0){
			beat(60);
		}else{
			Html5Model.USER.login(null,loginLevel,regLevel);
			if((/4399GameCenter/gi).test(navigator.userAgent)){
				//登录覆盖一个黑层
				$("#shadow").show();
			}
		}
	}
	*/

	//获取用户身份
	function Anti_get_sele_role(){
		showSilence("Anti_get_self_role:"+Anti_get_self_role);
		if(Anti_get_self_role==0){
			Anti_get_self_role = 1;
			if((/4399GameCenter/gi).test(navigator.userAgent)){
				//游戏盒环境走原创接口
				$.ajax({
					type:"GET",
					url:Anti_veryUrl2+"?userId="+Anti_uid+"&timestamp="+new Date().getTime(),
					dataType:"jsonp",
					callbackParameter:"callback",
					success:function(msg){
						Anti_get_self_role = 2;
						if(msg.type==1){//成年人
							Anti_self_role = 1;
							Anti_close();
						}else{
							Anti_reconnect();
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown) { 
						Anti_get_self_role = 0;
						Anti_reconnect();
					},  
					complete : function(XMLHttpRequest,status){
						Anti_get_self_role = 0;
						if(status=='timeout'){
							Anti_get_self_role = 0;
							Anti_reconnect();
						}
					}
				});	
			}else{//wap环境走用户中心接口
				if("undefined" != typeof UniLogin){
					try{
						showSilence("请求身份接口");
						UniLogin.getValidateInfo(function(res){
							showSilence("res:"+res);
							showSilence("res.code:"+res.code);
							showSilence("res.result.idcard_state:"+res.result.idcard_state);
							showSilence("res.result.validateState:"+res.result.validateState);
							if(res==0){//接口请求超时
								Anti_reconnect();
								Anti_get_self_role = 0;
							}else{
								if(res.code==300){
									if(res.result.idcard_state==3 && res.result.validateState==1){
										Anti_self_role = 1;
										Anti_get_self_role = 2;
										Anti_close();
									}else if(res.code==3006){//未登陆
										Anti_get_self_role = 0;
										showClientDeniedShowLogin();
									}else{
										Anti_get_self_role = 2;
										Anti_reconnect();
									}
								}else{
									Anti_get_self_role = 0;
									Anti_reconnect();
								}
							}
						});
					}catch(e){
						Anti_get_self_role = 0;
						showClientDeniedForUniLoginFalse();
					}
				}else{
					Anti_get_self_role = 0;
					showClientDeniedForUniLoginFalse();
				}	
			}
		}else if(Anti_get_self_role == 2){
			if(Anti_self_role==1){
				Anti_close();
			}else{
				Anti_reconnect();
			}
		}
	}

	window.Anti_retry = function(){
		if(Anti_uid>0){
			if(Anti_openClientBaseLine==1){
				Anti_get_sele_role();
			}
		}else{
			if(Anti_openClientBaseLine==1){
				showClientDeniedShowLogin();
			}
		}
	}

	function Anti_reconnect(){
		//如果从没有连通过心跳包服务器 则马上弹出挡板
		if(Anti_connectNever==1){
			//挡板
			showClientDenied();
		}else{
			//重试N次后弹出挡板
			if(Anti_connectRetryTimes<Anti_connectRetryMaxTimes){
				Anti_connectRetryTimes++;
				beat(20);
			}else{
				//挡板
				showClientDenied();
			}
		}
	}
	
	//重试
	window.Anti_resumeNext = function(){
		$("#Antibutton").html('<a onclick="return false;">正在尝试重连...</a>').show();
		Anti_lastRequestTime = 0;
		heartBeat();
	}

	//客户端处理登录
	window.Anti_showLoginClient = function(){
		Anti_lastRequestTime = 0;
		Anti_close();
		Anti_showLogin();
	}
	
	//客户端弹出登录框面板
	function showClientDeniedShowLogin(){
		$("#Anti_title").html("网络异常提醒");
		$("#Anti_content").html('<p align="center">当前网络出现异常，未检测到登录账号，请重新登录</p>');
		$("#Antibutton").html('<a onclick="Anti_showLoginClient();return false;">登录</a>').show();
		$("#Anti_more,#AntiTipMore,#Anti_tips,.countDown").hide();
		$("#Anti_open,#Anti_mask").show();
	}
	
	//客户端拒绝面板
	function showClientDenied(){
		$("#Anti_title").html("网络异常提醒");
		$("#Anti_content").html('<p align="center">'+Anti_clientBaselineWord+'</p>');
		$("#Antibutton").html('<a onclick="Anti_resumeNext();return false;">重试</a>').show();
		$("#Anti_more,#AntiTipMore,#Anti_tips,.countDown").hide();
		$("#Anti_open,#Anti_mask").show();
	}

	//载入用户中心js错误
	function showClientDeniedForUniLoginFalse(){
		$("#Anti_title").html("网络异常提醒");
		$("#Anti_content").html('<p align="center">'+Anti_clientBaselineWord+'</p>');
		$("#Antibutton").html('<a onclick="Anti_hqshjg();return false;">刷新</a>').show();
		$("#Anti_more,#AntiTipMore,#Anti_tips,.countDown").hide();
		$("#Anti_open,#Anti_mask").show();
	}
	
	//未认证账号刷新认证状态
	window.Anti_hqshjg = function(){
		window.location.reload();
	}
	
	//完善账号
	window.Anti_wssfxx = function(){
		if(Anti_uid>0){
			wapshowPopupCertify();
		}
	}
	
	//页面切换监听
	 function visibilityChange (func) {
		// 各种浏览器兼容
		var hidden, visibilityChange
		if (typeof document.hidden !== 'undefined') {
		  hidden = 'hidden'
		  visibilityChange = 'visibilitychange'
		} else if (typeof document.mozHidden !== 'undefined') {
		  hidden = 'mozHidden'
		  visibilityChange = 'mozvisibilitychange'
		} else if (typeof document.msHidden !== 'undefined') {
		  hidden = 'msHidden'
		  visibilityChange = 'msvisibilitychange'
		} else if (typeof document.webkitHidden !== 'undefined') {
		  hidden = 'webkitHidden'
		  visibilityChange = 'webkitvisibilitychange'
		}
		// 添加监听器，在title里显示状态变化
		document.addEventListener(
		  visibilityChange,
		  () => func(document[hidden]),
		  false
		)
	}

	visibilityChange((hide) => {
	   if (hide) {
			Anti_countDowning = 0;
			Anti_lastRequestTime = 0;
			clearInterval(Anti_clearId);
			//alert("唤醒");
			heartBeat();
		} 
	});
	
	
	//确定框
	window.Anti_exit_popup = function(){
		Anti_close();
	}
	
	//唤起登录
	window.Anti_login = function(){
		Html5Model.USER.login(null,loginLevel,regLevel);
		if((/4399GameCenter/gi).test(navigator.userAgent)){
			//登录覆盖一个黑层
			$("#shadow").show();
		}
		Anti_lastRequestTime = 0;
	}
	
	//返回首页
	window.Anti_go_to_main = function(){
		if((/4399GameCenter/gi).test(navigator.userAgent)){
			try{
				android.jumpToHomePage("main");
			}catch (e) { }
		}else{
			window.location.href = "//h.4399.com";
		}
	}
	

	//切换账号
	window.Anti_switch_account = function(){
		Anti_uid = "";
		Anti_token = "";
		Anti_idcard_status = "";
		Anti_verify_status = "";
		Anti_logoutFunc();
		Anti_showLogin();
	}
	
	//验证身份
	window.Anti_refresh_idcard = function(){
		Anti_idcard_status = "";
		Anti_verify_status = "";
		Anti_refresh = 1;
		
		if(Anti_refreshtimes==0){
			Anti_reauthentication();
			Anti_refreshtimes = 1;
		}
		
		alert("刷新身份成功");
	}
	
	window.Anti_Tip_exit_popup = function(){
		$("#AntiNoticeopen").hide();
	}
	
	//倒计时读秒
	window.Anti_secoundCoverMinute = function(){
		var strs = '';

		Anti_before_start --;
		
		var days = Math.floor(Anti_before_start / (60 * 60 * 24)) + '';
		
		var hours = Math.floor((Anti_before_start - days*86400) / (60 * 60)) + '';
		if(hours.length == 1){
			hours = '0' + hours;
		}
		var mins = (Math.floor((Anti_before_start / 60) % 60)) + '';
		if(mins.length == 1){
			mins = '0' + mins;
		}
		var secs = Math.floor(Anti_before_start % 60) + '';
		if(secs.length == 1){
			secs = '0' + secs;
		}
		if(days>0){
			strs = strs + days +'天';
		}
		if(hours>0){
			strs = strs + hours + '时';
		}else{
			if(days>0){
				strs = strs + hours + '时';
			}
		}
		if(mins>0){
			strs = strs + mins + '分';
		}else{
			if(hours>0){
				strs = strs + mins + '分';
			}
		}
		strs = strs + secs + '秒';
		
		if(Anti_before_start_text.indexOf('before_start')==-1){//显示文案
			$("#Anti_beforeCount").html(Anti_before_start_text).show();
		}else{//显示倒计时
			if(!Anti_tmp){
				Anti_tmp = $("#Anti_beforeCount").html().split("%before_start%");
			}
			$("#Anti_beforeCount").html(Anti_tmp);
			$("#Anti_beforeCount em").html(strs);
		}
		showSilence("countdown"+strs);
		
		if(Anti_before_start == 0){
			showSilence("countdown:finish");
			clearInterval(Anti_clearId);
			Anti_close();
			Anti_token = "";
			Anti_verify_status = "";
			Anti_idcard_status = "";
			Anti_not_login = 1;
			heartBeat();
			return;
		}
	}
	
	function showWindows(msg){
		
		var Anti_interval = msg['result']['interval'];
		var Anti_token = msg['result']['token'];
		var Anti_time_remaining = msg['result']['time_remaining'];//游戏剩余秒数
		
		$("#Anti_beforeCount").hide();
		
		//常规弹窗
		if(msg['result']['pop_config']){
			var Anti_title = msg['result']['pop_config'][0]['title'];//标题
			var Anti_content = msg['result']['pop_config'][0]['content'];
			//var Anti_tips = msg['result']['pop_config'][0]['tips'];// 温馨提示内容可能为空，若为空时，隐藏“温馨提示”显示区域。
			var Anti_buttons = msg['result']['pop_config'][0]['buttons'];//按钮
			if(msg['result']['pop_config'][0]['before_start_text']){
				Anti_before_start_text = msg['result']['pop_config'][0]['before_start_text'];//按钮
			}
			if(msg['result']['pop_config'][0]['before_start']){
				Anti_before_start = parseInt(msg['result']['pop_config'][0]['before_start']);
			}
			var Anti_buttonstr = "";
			
			var Anti_more_link = msg['result']['pop_config'][0]['link'];
			if(Anti_more_link){
				Anti_more_link_name = Anti_more_link['name'];
				Anti_more_link_url = Anti_more_link['url'];
				Anti_more_info = '<span onclick="Anti_showmore(\''+Anti_more_link_url+'\');return false;">'+Anti_more_link_name+'</span>';
				if(Anti_more_info){
					$("#Anti_tips").html(Anti_more_info);
					$("#Anti_tips").show();
				}
				showSilence("Anti_more_info"+Anti_more_info);
			}
		
			if(Anti_buttons){
				for(var i=0;i<Anti_buttons.length;i++){
					var Anti_buttons_name = Anti_buttons[i]['name'];
					var Anti_buttons_func = Anti_buttons[i]['func'];
					var Anti_buttons_urlinfo = Anti_buttons[i]['url_info'];
				}
			}

			$("#Anti_title").html(Anti_title);
			$("#Anti_content").html(Anti_content);
			$("#Anti_open,#Anti_mask").show();
			showSilence("----------------"+Anti_before_start_text+"---------------------");
			showSilence("----------------"+Anti_before_start+"---------------------");
			//如果文本中含有占位符 则显示倒计时 否则就在后台默默倒数
			if(Anti_before_start_text){
				//倒计时读秒
				if(Anti_before_start>0 && Anti_countDowning==0){
					Anti_countDowning = 1;
					Anti_clearId = setInterval('Anti_secoundCoverMinute()' , 1000);
					$("#Anti_beforeCount").html(Anti_before_start_text.replace("%before_start%","时间正在读取中...")).show();
				}
			}
			$("#Anti_open").show();
			
			if(Anti_buttons){
				for(var i=0;i<Anti_buttons.length;i++){
					var Anti_buttons_name = Anti_buttons[i]['name'];
					var Anti_buttons_func = Anti_buttons[i]['func'];
					if(i==0){
						Anti_buttonstr += '<a onclick="Anti_'+Anti_buttons_func+'();return false;">'+Anti_buttons_name+'</a>';
					}else{
						Anti_buttonstr += '<a class="bt2" onclick="Anti_'+Anti_buttons_func+'();return false;">'+Anti_buttons_name+'</a>';
					}
				}
				if(Anti_buttonstr){
					$("#Antibutton").html(Anti_buttonstr).show();
				}
			}
		}
		
		//倒计时
		if(msg['result']['countdown']){
			var Anti_countdown = msg['result']['countdown'];
			if(Anti_countdown){
				for(var i=0;i<Anti_countdown.length;i++){
					var Anti_countdown_link_name = Anti_countdown[i]['link']['name'];
					var Anti_countdown_link_url = Anti_countdown[i]['link']['url'];
					var Anti_countdown_seconds = Anti_countdown[i]['final']['time'];
					var Anti_countdown_content = Anti_countdown[i]['content'];
					//倒计时时间
					var Anti_countdown_moment = Anti_countdown[i]['moment'];
					var myArray = {
						"moment" : Anti_countdown_moment,
						"linkname" : Anti_countdown_link_name,
						"linkurl" : Anti_countdown_link_url,
						"seconds" : Anti_countdown_seconds,
						"content" : Anti_countdown_content
					};
					if(Anti_countdown_moment>0){
						if($.inArray(Anti_countdown_moment,countdowntime)==-1){
							countdowntime.push(Anti_countdown_moment);
							countdowninfo.push(myArray);
						}
					}
				}
			}
		}
		
		//时间达到弹窗offline
		if(msg['result']['offline']){
			var Anti_buttonstr3 = "";
			var Anti_offline = msg['result']['offline'];
			var Anti_title_offline = Anti_offline['title'];
			var Anti_content_offline = Anti_offline['content'];
			var Anti_tips_offline = Anti_offline['tips'];
			var Anti_buttons_offline = Anti_offline['buttons'];
			if(Anti_buttons_offline){
				for(var j=0;j<Anti_buttons_offline.length;j++){
					var Anti_buttons_name = Anti_buttons_offline[j]['name'];
					var Anti_buttons_func = Anti_buttons_offline[j]['func'];
					if(j==0){
						Anti_buttonstr3 += '<a onclick="Anti_'+Anti_buttons_func+'();return false;">'+Anti_buttons_name+'</a>';
					}else{
						Anti_buttonstr3 += '<a class="bt2" onclick="Anti_'+Anti_buttons_func+'();return false;">'+Anti_buttons_name+'</a>';
					}
				}
			}
			
			offlineinfo = {
				"title" : Anti_title_offline,
				"content" : Anti_content_offline,
				"tips" : Anti_tips_offline,
				"buttons" : Anti_buttonstr3
			}
			
			showSilence("************ offline ************");
			showSilence(offlineinfo);
			showSilence("************ offline ************");
		}
		
		
		showSilence("************ countdowninfo-before ************");
		showSilence(countdowninfo);
		showSilence("************ countdowninfo-before ************");
		
		
		//显示可能的倒计时弹窗
		if(countdowninfo.length>0){
			showSilence("目前剩余倒计时弹窗数："+countdowninfo.length);
			for(var a=0;a<countdowninfo.length;a++){
				showSilence("目前剩余时间："+parseInt(Anti_time_remaining));
				showSilence("弹窗记录的时间数："+parseInt(countdowninfo[a]['moment']));
				if(parseInt(Anti_time_remaining)<=parseInt(countdowninfo[a]['moment']) && parseInt(Anti_time_remaining)>0){
					showSilence("匹配到弹出条件"+parseInt(countdowninfo[a]['moment']));
					$("#AntiTipContent").html(countdowninfo[a]['content']);
					$("#AntiTipMore").html(countdowninfo[a]['linkname']);
					$("#AntiTipMore").attr('href',countdowninfo[a]['linkurl']);
					Anti_close();
					$("#AntiNoticeopen").show();
					setTimeout(Anti_Tip_exit_popup,countdowninfo[a]['seconds']*1000);
					countdowninfo[a]['moment'] = -1;
				}
			}
		}
		
		showSilence("************ countdowninfo-after ************");
		showSilence(countdowninfo);
		showSilence("************ countdowninfo-after ************");
		
		
		showSilence("************ offlineinfo ************");
		showSilence(offlineinfo);
		showSilence("************ offlineinfo ************");
		
		//offline弹窗
		if(offlineinfo.length>0){
			if(Anti_time_remaining<=0){
				$("#Anti_title").html(offlineinfo['title']);
				$("#Anti_content").html(offlineinfo['content']);
				$("#Anti_open").show();
				if(offlineinfo['tips']){
					$("#Anti_tips").html(offlineinfo['tips']);
					$("#Anti_tips").show();
				}
				if(offlineinfo['buttons']){
					$("#Antibutton").html(offlineinfo['buttons']).show();
				}
			}
		}
		
	}
	

	function beat(interval){
		interval = parseInt(interval);
		showSilence(interval);
		if(interval>0){
			stopBeat();
			if(interval*1000<parseInt(Anti_minReauestTime)){Anti_minReauestTime=interval*1000;}
			Anti_bthandle = setInterval(heartBeat,interval*1000);//1000
		}else{
			stopBeat();
		}
	}
	
	function stopBeat(){
		clearInterval(Anti_bthandle);
	}


	function showSilence(str){
		try{
			console.info(str);
		}catch(e){}
	}

	window.Anti_showmore = function(Anti_more_link_url){
		$("#Anti_more_links").attr('src',Anti_more_link_url);
		$("#Anti_more").show();
	}
	
	window.Anti_closemore = function(){
		$("#Anti_more").hide();
	}
	
	//UI初始化
	function append() {
		var cssText='*{padding:0;margin:0;}.miPopWp{width:100%;height:100%;background-color:rgba(0,0,0,0.5);position:absolute;top:0;left:0;}.miTime{width:310px;height:44px;overflow:hidden;background:rgba(0,0,0,0.5);border-radius:0 22px 22px 0;position:absolute;left:0;top:15px;padding:0 8px}.miTime .text{float:left;width:170px;height:44px;font-size:12px;color:#fff;display:table}.miTime .text p{display:table-cell;vertical-align:middle;line-height:16px}.miTime .link{float:left;width:90px;height:44px;overflow:hidden;text-align:center;line-height:44px;font-size:14px;font-weight:bold;color:#ff9f15}.miTime .close{background:url(/images/newAnti2/mitimehide.png) no-repeat;position:initial;background-size:100% 100%;float:right;width:24px;height:24px;overflow:hidden;line-height:99;margin-top:10px}.miTip{width:315px;overflow:hidden;position:fixed;top:50%;left:50%;margin:-120px 0 0 -158px}.miTip .top{background:url(/images/newAnti2/mitip-top.png) no-repeat;background-size:100% 100%;height:38px;overflow:hidden}.miTip .popHide{float:right;width:32px;height:32px;overflow:hidden;line-height:99;margin-top:2px}.miTip .con{background:url(/images/newAnti2/mitip-con.png) repeat-y;background-size:100% auto;padding:0 24px;overflow:hidden}.miTip .f28{font-size:14px;margin-top:10px;line-height:20px}.miTip .f28 span{color:#ff5151}.miTip .f24{font-size:12px;margin-top:10px;line-height:18px}.miTip .Cred{color:#ff5151}.miTip .btn{height:32px;overflow:hidden;text-align:center;line-height:0;font-size:0;margin-top:15px}.miTip .btn a{background:#36d7a0;display:inline-block;vertical-align:top;width:110px;height:32px;overflow:hidden;line-height:32px;font-size:14px;color:#fff;border-radius:16px;margin:0 8px}.miTip .btn a.bt2{background:#ff9f15}.miTip .bot{background:url(/images/newAnti2/mitip-bot.png) no-repeat;background-size:100% 100%;height:17px;overflow:hidden;}.miTip .link{font-size:14px;line-height:20px;}.miTip .link span{color:#3D94EE;}.countDown{background:#eee;border-radius:5px;padding:8px;text-align:center;margin-top:8px;font-size:16px;font-style:normal;color:#999;font-weight:bold;}.countDown p{font-size:14px;}.countDown em{font-style:normal;color:#42CD81;font-size:18px;line-height:1.6;}@media only screen and (max-width:1024px) and (max-height:500px) and (orientation:landscape){.miTip{width:400px;margin-left:-200px;margin-top:-140px;}.miTip .top{background:url(/images/newAnti2/mitip-top-big.png) no-repeat;background-size:400px 38px;height:36px;}.miTip .con{background:url(/images/newAnti2/mitip-con-big.png) repeat-y;background-size:400px auto;}.miTip .bot{background:url(/images/newAnti2/mitip-bot-big.png) no-repeat;background-size:100% 100%;}}';
		var cssTxt2 = '.noteArea{position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;box-sizing:border-box;padding-top:48px;z-index:5;background:#fff}.title-bar{width:100%;height:48px;line-height:48px;background-color:#3d94ee;font-size:16px;text-align:center;color:#fff;position:fixed;left:0;top:0}.title-bar .left{position:absolute;left:10px;top:0}.title-bar .bar-btn,.title-bar .left{padding-left:10px;padding-right:10px;font-size:14px;color:#fff;cursor:pointer}.title-bar .left{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkI1OTY2MUNFOURBQjExRTdBODhCQTUzRTFGOTVCMTVCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkI1OTY2MUNGOURBQjExRTdBODhCQTUzRTFGOTVCMTVCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjU5NjYxQ0M5REFCMTFFN0E4OEJBNTNFMUY5NUIxNUIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjU5NjYxQ0Q5REFCMTFFN0E4OEJBNTNFMUY5NUIxNUIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5pxwFzAAAAoUlEQVR42qzVYQ7AEAwFYNzhuZ/72U6z+1hZf4igZZq8LCa+kGE2pWROluNnoEQKNgzw2FBaeYaUO331UMDvNAGPyXWV1XKHrzq0KJoxvgZX0S7Wglp0iPVACZ1iI3CEitgM7M1GxCSwRUUsx21s5PnR2lwyVpcMxUeBFsTCtoEEYmNjYwTix9FDC+LA5YAaPH59BUpcxGo0smHs6V/AK8AAEfgZer70l8UAAAAASUVORK5CYII=) no-repeat 0;background-size:11px;padding-left:16px!important}.title-bar .title{text-align:center;line-height:48px;line-height:48px}.noteCon{width:100%;height:100%;box-sizing:border-box}';
		
		var csstxt = cssText+cssTxt2;
		
		var mipop='<div class="miPopWp" style="display: none;z-index:9999" id="Anti_open">'+
		'<div class="miTip">'+
		'<div class="top"><h1 id="Anti_title" style="display:none;"></h1><a class="popHide" id="Anticlose" href="#" onclick="return false;">关闭</a></div>'+
		'<div class="con">'+
		'<div class="f28" id="Anti_content">'+
		'</div>'+
		'<div class="link" id="Anti_tips"></div>'+
		
		'<div class="countDown" style="display:none" id="Anti_beforeCount"></div>'+
        '<div class="countDown" style="display:none">当前已限制游戏</div>'+
		
		'<div class="btn" id="Antibutton">'+
		'</div>'+
		'</div>'+
		'<div class="bot"></div>'+
		'</div>'+
		'</div>';
		var miTime='<div class="miTime" id="AntiNoticeopen" style="display: none;z-index:9999">'+
		'<div class="text">'+
		'<p id="AntiTipContent"></p>'+
		'</div>'+
		'<a class="link" href="" id="AntiTipMore"></a>'+
		'<a class="close" href="" onclick="Anti_Tip_exit_popup();return false;">关闭</a>'+
		'</div>';
		
		
		var fullS = '<div class="noteArea" id="Anti_more" style="display: none;z-index:9999">'+
		'<div class="title-bar">'+
		'<div class="title">防沉迷详情</div>'+
		'<a class="left" onclick="Anti_closemore();return false;">关闭</a>'+
		'<a class="right"></a>'+
		'</div>'+
		'<div class="noteCon">'+
		'<iframe src="" id="Anti_more_links" frameborder="0" width="100%" height=" 100%"></iframe>'+
		'</div>'+
		'</div>';
		

		var head = document.head || document.getElementsByTagName('head')[0];
		var body = document.body ||document.getElementsByTagName("body")[0];
		var style = document.createElement('style');
		style.innerHTML = csstxt;
		head.appendChild(style);

		var node1 = document.createElement("div");
		var node2 = document.createElement("div");
		var node3 = document.createElement("div");
		node1.innerHTML = mipop;   
		node2.innerHTML = miTime;
		node3.innerHTML = fullS;
		body.append(node1);
		body.append(node2);
		body.append(node3);
	}
});
	if(window.location.host=="www.4399.com" || window.location.host=="h.4399.com"  || window.location.host=="zuopin.4399.com" || window.location.host=="h.api.4399.com" || window.location.host=="zxwyouxi.com"){
		//屏蔽F12
		$(document).keydown(function(event){
			if(event.keyCode==123){
				if(event.preventDefault){
					event.preventDefault();
				}else{
					window.event.returnValue == false;
				}
			}
		}); 
		//屏蔽ctrl+shift+i
		$(document).keydown(function(event){
		　　if(event.ctrlKey && event.shiftKey && event.keyCode==73){
				if(event.preventDefault){
					event.preventDefault();
				}else{
					window.event.returnValue == false;
				}
		　　}
		});
		// 为右键添加自定义事件，可以禁用
		$(document).ready(function(){
			$(document).bind("contextmenu",function(e){
				return false;
			});
		});


		//疯狂调试模式
		setInterval(function(){
			check();
		}, 2000);
		var check = function(){
			function doCheck(a){
				if (('' + a / a)['length'] !== 1 || a % 20 === 0){
					(function() {}['constructor']('debugger')());
				} else {
					(function() {}['constructor']('debugger')());
				}
				doCheck(++a);
			}
			try {
				doCheck(0);
			}catch(err){}
		};
		check();


		function consoleOpenCallback() {
			alert('关闭调试窗');
			window.location.reload();
		}

		var Anti_numtots = 0;
		(function () {
			window._windon_handler = setInterval( function() {
				var before = new Date();
				debugger;
				var after = new Date();
				if (after.getTime() - before.getTime() > 100) {
					if (after.getTime() - before.getTime() > 2000) {
						consoleOpenCallback();
						clearInterval(_windon_handler);
					}else{
						Anti_numtots++;
						if(Anti_numtots>=2){
							consoleOpenCallback();
							clearInterval(_windon_handler);
						}
					}
				}else{
					Anti_numtots = 0;
				}
			}, 1000)
		})();
	}