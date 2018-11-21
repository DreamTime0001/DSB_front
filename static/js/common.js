/**
 * 返回两边不带空白字符的字符串
 * 
 * @return {}
 */
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 检查是否是整数
 * 
 * @return {}
 */
String.prototype.isInteger = function() {
	var regx = /^[-]?\d+$/;
	return regx.test(this);
}

/**
 * 判断字符串是否为正整数
 * 
 * @return {}
 */
String.prototype.isUInteger = function() {
	var regx = /^\d+$/;
	return regx.test(this);
}

/**
 * 判断字符串是否为浮点数
 * 
 * @return {}
 */
String.prototype.isFloat = function() {
	var regx = /^[-]?\d+(\.\d+)?$/;
	return regx.test(this);
}

/**
 * 判断字符串是否为正浮点数
 * 
 * @return {}
 */
String.prototype.isUFloat = function() {
	var regx = /^\d+(\.\d+)?$/;
	return regx.test(this);
}

/**
 * 判断字符串是否包含中文
 * 
 * @return {}
 */
String.prototype.hasChinese = function() {
	var regx =  /[\u4E00-\u9FA5\uF900-\uFA2D]/;
	return regx.test(this);
}

/**
 * 字符串转HTML代码
 * @return {}
 */
String.prototype.convertHTML = function() {
	return this.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
			.replaceAll(" ", "&nbsp;").replaceAll("	", "&nbsp;&nbsp;")
			.replaceAll("'",	"&#39;").replaceAll("\"", "&quot;")
			.replaceAll("\r\n", "<br/>").replaceAll("\r", "<br/>")
			.replaceAll("\n", "<br/>");
}

/**
 * Email验证方法
 * 
 * @param {} email
 * @return {}
 */
String.prototype.isEmail = function() {
	var regx = /^[a-zA-Z0-9]+([\.\-_][a-zA-Z0-9]+)*@([a-zA-Z0-9]+[\.\-_]?)+[a-zA-Z0-9]+\.[A-Za-z]{2,5}$/;
	return regx.test(this);
}

/**
 * 手机号验证方法
 * 
 * @param {} mobile
 * @return {}
 */
String.prototype.isMobile = function() {
	var regx = /^1[34578]\d{9}$/;
	return regx.test(this);
}

/**
 * 获得字符串的字节长度
 * @param is3char 是否一个中文计算为3个字符。true-1中文=3字符，false-1中文=2字符。默认false
 */
String.prototype.getBytesLength = function(is3char) {
	var re = /[^\x00-\xff]/g;
	var charLength = '**';
	if(is3char) charLength = '***';
	var str_r = this.replace(re, charLength);
	return str_r.length;
}

/**
 * 循环替换字符串的方法
 * @param {} s1
 * @param {} s2
 * @return {}
 */
String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}

/**
 * 检查是否包含指定字符串的方法
 * @param {} str
 * @return {}
 */
String.prototype.contains = function(str) {
	return this.indexOf(str) >= 0;
}

/**
 * 设置方法中this指向的作用域
 * eg:
 * 	function man(){
 * 		this.name = "manName";
 * 		this.showName = function(){
 * 			alert(this.name);
 * 		};
 * 	}
 * 
 * 	var n = new man(); 
 * 	n.showName(); //输出"manName"
 * 	n.showName.domain({name:"haha"})(); //输出"haha"
 * 
 * @param {} object
 * @return {}
 */
Function.prototype.domain = function(object) {
	var __method = this;
	return function() {
		__method.apply(object, arguments);
	};
}


/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).format("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).format("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).format("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 * 
 * @param {} fmt
 * @return {}
 */
Date.prototype.format = function(fmt) {
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, // 小时
		"H+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds() // 毫秒
	};
	var week = {
		"0" : "\u65e5",
		"1" : "\u4e00",
		"2" : "\u4e8c",
		"3" : "\u4e09",
		"4" : "\u56db",
		"5" : "\u4e94",
		"6" : "\u516d"
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

/**
 * 将日期转换为距离当前多久的时间描述<br>
 * 如：刚刚，昨天，2小时之前等
 * @param date
 * @return 距离当前多久
 */
function prettyDate(date) {
    if (date == null || !date instanceof Date) return null;
    var diff = new Date().getTime() - date.getTime();
    if (diff < 0) {
        return "\u672a\u6765";
    } else if (diff < 60000) { // 一分钟之内
        return "\u521a\u521a";
    } else if (diff < 3600000) { // 一小时之内
        return Math.floor(diff / 60000) + "\u5206\u949f\u524d";
    } else if (diff < 86400000) { // 一天之内
        return Math.floor(diff / 3600000) + "\u5c0f\u65f6\u524d";
    } else if (diff < 172800000) { // 二天之内
        return "\u6628\u5929";
    } else if (diff < 604800000) { // 一周之内
        return Math.floor(diff / 86400000) + "\u5929\u524d";
    } else if (diff < 1209600000) { // 两周之内
        return "\u4e0a\u4e2a\u661f\u671f";
    } else if (diff < 2592000000) { // 一个月之内
        return Math.floor(diff / 604800000) + "\u661f\u671f\u524d";
    } else if (diff < 5184000000) { // 两个月之内
        return "\u4e0a\u4e2a\u6708";
    } else if (diff < 31536000000) { // 一年之内
        return Math.floor(diff / 2592000000) + "\u4e2a\u6708\u524d";
    } else if (diff < 63072000000) { // 两年之内
        return "\u53bb\u5e74";
    } else { // 两年之前
        return Math.floor(diff / 31536000000) + "\u5e74\u524d";
    }
}

/**
 * 将null转换为空字符串方法
 * 
 * @param {} str
 * @param {} d 默认值
 * @return {}
 */
function defaultStr(str, d) {
	return str == null || str.trim() == "" ? (typeof(d) == "undefined" ? "" : d) : str;
}

/**
 * 将字符串转整数字，若字符串不符合格式，则返回0
 * 
 * @param {} str
 * @return {}
 */
function str2Int(str) {
	return !(str+"").isInteger() ? 0 : parseInt(str, 10);
}

/**
 * 将字符串转浮点数，若字符串不符合格式，则返回0
 * 
 * @param {} str
 * @return {}
 */
function str2Float(str) {
	return !(str+"").isFloat() ? 0 : parseFloat(str);
}

/**
 * 字符串转日期方法
 * 支持格式:
 * 1.yyyy-MM-dd
 * 2.yyyy/MM/dd
 * 3.MM-dd-yyyy
 * 4.MM/dd/yyyy
 * 5.MM-dd-yy 该格式年份为19yy
 * 6.MM/dd/yy 该格式年份为19yy
 * 
 * @param {} dateStr
 * @return {}
 */
function toDate(dateStr) {
	try {
		if (/(^\d{4}([\-\/]\d{1,2}){2}$)|(^(\d{1,2}[\-\/]){2}\d{2,4}$)/.test(dateStr)) {
			return new Date(dateStr.replaceAll("-", "/"));
		} else {
			return null;
		}
	} catch (e) {
		alert("toDate:" + e.message);
	}
}

/**
 * 关闭页面方法
 * 
 * @param isCloseTop:boolean 是否关闭整个框架页面:false-否(默认)，true-是。
 */
function closePage(isCloseTop) {
	if (isCloseTop) {
		window.top.opener = null;
		window.top.open('', '_self');
		window.top.close();
	} else {
		window.opener = null;
		window.open('', '_self');
		window.close();
	}
}

/**
 * 将表单form转换为对象
 * 用于JS2JAVA的传递，比如DWR
 * 
 * @param {} f form对象
 * @return {}
 */
function form2Object(f) {
	var fElement = new Object();
	var fElements = f.elements;
	for (var e = fElements.length - 1; e >= 0; e--) {
		if (fElements[e].name != "") {
			fElement[fElements[e].name] = fElements[e].value;
		}
	}
	return fElement;
}

/**
 * 动态加载脚本、样式表
 * 
 * @param {} filename
 * @param {} filetype
 */
function loadScript(filename, filetype) {
	if (filetype == "js") {
		var fileref = document.createElement("script");
		fileref.setAttribute("type", "text/javascript");
		fileref.setAttribute("src", filename);
	} else if (filetype == "css") {
		var fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", filename);
	} else if (filetype == "vbs") {
		var fileref = document.createElement("script");
		fileref.setAttribute("type", "text/vbscript");
		fileref.setAttribute("src", filename);
	}
	if (typeof fileref != "undefined") {
		document.getElementsByTagName("head")[0].appendChild(fileref);
	}
}

/**
 * 指定下拉框的选项选择
 * 
 * @param {} selectObj
 * @param {} chooseValue
 */
function chooseOption(selectObj,chooseValue){
	var haveFound=0;
	for(var i=0;i<selectObj.options.length;i++){
		if(selectObj.options[i].value==chooseValue){
			selectObj.selectedIndex=i;
			haveFound=1;
			break;
		}
	}
	if(haveFound!=1){
		newOption=document.createElement("OPTION");
		newOption.text=chooseValue;
		newOption.value=chooseValue;
		selectObj.options.add(newOption);
		selectObj.selectedIndex=selectObj.options.length-1;
	}
}

/**
 * 根据allValue对象的属性值自动填写页面上对应表单的输入框或下拉菜单等控件
 * sequence为要自动填入的表单序列号或表单名字，不填则默认为0
 * eg:
 * var formObj = new Object();
 * formObj.elm1 = 'elm1';
 *
 * 1.autoChoose(formObj);
 * 2.autoChoose(formObj,1);
 * 3.autoChoose(formObj,'formName');
 * 
 * @param {} allValue
 * @param {} sequence
 */
function autoChoose(allValue,sequence){
	if(sequence == undefined){
		sequence = 0;
	}
	var form=document.forms[sequence];
	var eleArr=form.elements;    // 将表单中的所有元素放入数组
	var selectValue,checkValue,inputValue,strArr,objArr;
	for(var i = 0; i < eleArr.length; i++){
		if(eleArr[i].autoInput!=null && eleArr[i].autoInput=="false") continue;
		//自动选择下拉菜单
		if(eleArr[i].tagName=="SELECT"){    
			selectValue=allValue[eleArr[i].name].toString();
			if(selectValue!=null){
				objArr=eval("form[\""+eleArr[i].name+"\"]");
				if(objArr.item(0)!=null && objArr.item(0).name!=null){ //若该名字的对象有多个
					strArr="";
					if(selectValue!=null){
						strArr=selectValue.split("#");   //将字符串拆成数组
					}
					for(var j=0;j<objArr.length;j++){
						if(eleArr[i]==objArr.item(j)){   //比较对象数组中每个对象和当前对象是否相同
						if(strArr[j]!=null){
							if(strArr[j]=="_"){
								chooseOption(eleArr[i],"");
								}else{
									chooseOption(eleArr[i],strArr[j]);
									}
							}else{
								chooseOption(eleArr[i],"");	
							}
						}
					}
				}else{
					if(selectValue!=null){
						var strArr=selectValue.split("#");   //将字符串拆成数组
						for(var j=0;j<strArr.length;j++){
							chooseOption(eleArr[i],strArr[j]);
						}
					}
				}
			}
		}

		//自动选择checkbox和radio
		if(eleArr[i].tagName=="INPUT" && (eleArr[i].type=="checkbox" || eleArr[i].type=="radio")){
			checkValue=allValue[eleArr[i].name].toString();
			if(checkValue!=null && checkValue!=""){
				checkValueArr=checkValue.split("#");  //将字符串拆成数组
				for(var j=0;j<checkValueArr.length;j++){
					if(checkValueArr[j]==eleArr[i].value){
						eleArr[i].checked=true;
						break;  //匹配的话跳出循环
					}else{
						eleArr[i].checked=false;
					}			
				}
			}else{
				if(checkValue=="")eleArr[i].checked=false;
			}
		}

		//自动填写text、hidden、password
  		if(eleArr[i].tagName=="INPUT" && (eleArr[i].type=="text" || eleArr[i].type=="hidden" || eleArr[i].type=="password")){
			inputValue=allValue[eleArr[i].name].toString();  
			if(inputValue!=null){
				if((count=eval("form[\""+eleArr[i].name+"\"]").length)!=null){ //若该名字的对象有多个	
					strArr="";
					if(inputValue!=null){
						strArr=inputValue.split("#");   //将字符串拆成数组
					}
					objArr=eval("form[\""+eleArr[i].name+"\"]");
					for(j=0;j<objArr.length;j++){
						if(eleArr[i]==objArr.item(j)){   //比较对象数组中每个对象和当前对象是否相同
							if(strArr[j]!=null){
								if(strArr[j]=="_"){
									eleArr[i].value="";
								}else{
									eleArr[i].value=strArr[j];
								}
							}else{
								eleArr[i].value="";
							}
						}
					}
				}else{
					if(inputValue!=null){
						if(inputValue!="_"){
							eleArr[i].value=inputValue;
						}else{
							eleArr[i].value="";
						}
					}
				}
			}
		}

		if(eleArr[i].tagName=="TEXTAREA"){
			inputValue=allValue[eleArr[i].name].toString();
			if(inputValue!=null){
				eleArr[i].value=inputValue;
			}
		}
	} //填写一个控件结束
}

/**
 * 判断新身份证出生年月的合法性
 * 
 * @param {} card
 * @return {Boolean}
 */
function isNewBirthday(card) {
	var y = parseInt(card.substring(6, 10), 10);
	var m = parseInt(card.substring(10, 12), 10);
	var d = parseInt(card.substring(12, 14), 10);
	if (y < 1900 || m < 1 || m > 12 || d < 1 || d > 31
			|| ((m == 4 || m == 6 || m == 9 || m == 11) && d > 30)
			|| (m == 2 && ((y % 4 > 0 && d > 28) || d > 29))) {
		return false;
	} else {
		return true;
	}
}

/**
 * 判断旧身份证出生年月的合法性
 * 
 * @param {} card
 * @return {Boolean}
 */
function isBirthday(card) {
	var y = parseInt(card.substring(6, 8), 10);
	var m = parseInt(card.substring(8, 10), 10);
	var d = parseInt(card.substring(10, 12), 10);
	if (m < 1 || m > 12 || d < 1 || d > 31
			|| ((m == 4 || m == 6 || m == 9 || m == 11) && d > 30)
			|| (m == 2 && (((y + 1900) % 4 > 0 && d > 28) || d > 29))) {
		return false;
	} else {
		return true;
	}
}

/**
 * 判断身份证是否合法
 * 
 * @param {} card
 * @return {Boolean}
 */
function convertCardID(card) {
	if (null == card)
		return false;
	var xx = [2, 4, 8, 5, 10, 9, 7, 3, 6, 1, 2, 4, 8, 5, 10, 9, 7];
	var yy = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
	var mm = 0;
	if (card.length == 15) {
		if (isBirthday(card)) {
			return true;
		} else {
			return false;
		}
	} else if (card.length == 18) {
		var gg = new Array;
		for (var i = 1; i < 18; i++) {
			var j = 17 - i;
			gg[i - 1] = parseInt(card.substring(j, j + 1), 10);
		}
		for (var i = 0; i < 17; i++) {
			mm += xx[i] * gg[i];
		}
		mm = mm % 11;
		var c = card.charAt(17);
		if (c.toUpperCase() == yy[mm] && isNewBirthday(card))
			return true;
		else
			return false;
	} else {
		return false;
	}
}

/**
 * 身份证得到生日
 * 
 * @param {} sId
 * @return {String}
 */
function getBirthdayByCardID(sId) {
	var len = sId.length;
	if (len == 0) {
		return "";
	} else if (len == 15) {
		return "19" + sId.substr(6, 2) + "-" + sId.substr(8, 2) + "-" + sId.substr(10, 2);
	} else if (len == 18) {
		return sId.substr(6, 4) + "-" + sId.substr(10, 2) + "-" + sId.substr(12, 2);
	}
}

/**
 * 身份证得到性别
 * 
 * @param {} sId
 * @return {String}
 */
function getSexByCardID(sId) {
	var len = sId.length;
	if (len == 0) {
		return "";
	} else if (len == 15) {
		return sId.substr(14, 1) % 2 ? "男" : "女"
	} else if (len == 18) {
		return sId.substr(16, 1) % 2 ? "男" : "女"
	}
}

/**
 * 从当前日期计算出给定范围的日期值（添加减少能选的日期范围）
 * 
 * @param {} d 范围[整数]
 * @return {}
 */
function addDays(d) {
	var newDate = new Date();
	newDate.setDate(newDate.getDate() + d);
	return newDate.format('yyyy-MM-dd');
}

/**
 * 从指定日期计算出给定范围的日期值（添加减少能选的日期范围）
 * 
 * @param {} date 指定日期
 * @param {} d 范围[整数]
 * @return {}
 */
function dateAddDays(date, d) {
	var ndate = toDate(date);
	ndate.setDate(ndate.getDate() + (d - 1));
	return ndate.format('yyyy-MM-dd');
}

/**
 * 计算跟今天的日期差（天）
 * 
 * @param {} date
 * @return {}
 */
function dayDiffToday(date){
	var newDate = new Date();
	var oldDate = toDate(date);
	return parseInt((Math.abs(oldDate - newDate) / 86400000).toFixed(0), 10);
}

/**
 * 计算日期天数差，该计算忽略时间差
 * 
 * @param {} date 第一个日期，字符串格式
 * @param {} date2 第二个日期，字符串格式
 * @return {} 相差天数，若返回0，则表示参数错误或是同一天
 */
function dayDiff(date, date2){
	var fdate = toDate(date).getTime();
	var sdate = toDate(date2).getTime();
	return parseInt((Math.abs(fdate - sdate) / 86400000).toFixed(0), 10);
}

/**
 * 对表格使用隔行换色的方法
 * 页面初始化方法中调用有效
 * 
 * @param {} options 参数非必需
 * 	-tableId 需要使用隔行换色表格的Id，多个Id用,间隔 默认"listTable"
 * 	-oddColor 奇数行颜色代码 默认不设置
 * 	-evenColor 偶数行颜色代码 默认"#fafafa"
 * 	-overColor 指针悬浮颜色代码 默认"#f1f5fe"
 */
function stripeRows(options) {
	this.defaults = {
		tableId : "listTable",
		oddColor : "",
		evenColor : "#f9f9f9",
		overColor : "#f2f8fd"//"#f1f5fe"
	};
	if (options) {
		for (var i in options) {
			this.defaults[i] = options[i];
		}
	}
	var ids = this.defaults.tableId.split(/\s*,(?:\s*,*)*/);
	for(var h = ids.length - 1; h >= 0; h --) {
		var tr = document.getElementById(ids[h]).getElementsByTagName('tr');
		for (var i = 0; i < tr.length; i++) {
			var tr1 = tr[i];
			if (i % 2 == 1) {
				if(this.defaults.oddColor != "") tr1.style.backgroundColor = this.defaults.oddColor;
			}else{
				tr1.style.backgroundColor = this.defaults.evenColor;
			}
			tr1.onmouseover = function() {
				return function() {
					this.style.backgroundColor = defaults.overColor;
				}
			}();
			tr1.onmouseout = function ww() {
				var bgColor = tr1.style.backgroundColor;
				return function() {
					this.style.backgroundColor = bgColor;
				}
			}();
		}
	}
}

/**
 * 身份证得到生日和性别
 *
 * @param {} sId
 * @return {String}
 */

function getBirthdaySex(sId){ //身份证获取生日和性别
    var json = {};
    var len = sId.length;
    if (len == 0) {
        return "";
    } else if (len == 15) {
        json.birthday = "19" + sId.substr(6, 2) + "-" + sId.substr(8, 2) + "-" + sId.substr(10, 2);
        json.sex = sId.substr(14, 1) % 2 ? 0 : 1;
    } else if (len == 18) {
        json.birthday = sId.substr(6, 4) + "-" + sId.substr(10, 2) + "-" + sId.substr(12, 2);
        json.sex = sId.substr(16, 1) % 2 ? 0 : 1;
    }
    return json;
}

Date.prototype.getMaxDay = function() {
	var _newDate = new Date(this.getFullYear(), this.getMonth(), this.getDate());
	_newDate.setMonth(_newDate.getMonth() + 1);
	_newDate.setDate(0);
	$_days = _newDate.getDate();
	delete _newDate;
	return $_days;
};

/**
 * 添加对象半透明蒙版
 */
jQuery.prototype.overlay = function(wait) {
	$(this).each(function(){
		var $this = $(this);
		var top = $this.position().top + parseInt($this.css('margin-top').replace('px', ''));
		var left = $this.position().left + parseInt($this.css('margin-left').replace('px', ''));
		$this.removeOverlay().append(
			$("<div/>").addClass("overlay").css({
				"background-color" : "#000",
				"filter" : "alpha(opacity = 20)",
				"-moz-opacity" : "0.2",
				"opacity" : "0.2",
				"position" : "absolute",
				"width" : $this.width() + 1,
				"height" : $this.height() + 1,
				"top" : top,
				"left" : left,
				"z-index" : 100
			})
		);
		if (wait) {
			var img = $('<img src="static/img/wait.gif"/>').addClass("overlay").appendTo($this);
			img.css({
				"position" : "absolute",
				"top" : top + ($this.height() - img.height()) / 2,
				"left" : left + ($this.width() - img.width()) / 2,
				"z-index" : 101
			})
		}
	});
	return this;
}
/**
 * 移除半透明蒙版
 */
jQuery.prototype.removeOverlay = function() {
	$(this).find('.overlay').remove();
	return this;
}

// 判断元素是否属于该数组
function in_arr (element,list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] == element) {
            return true;
        }
    }
    return false;
};