import http from '@/common/http/'
import Vue from "vue"
/**
 * 数字格式化
 * @param num
 * @returns {string}
 */
const numberFormat = function(num, count, str) {
	return !stringEmpty(num) ? formatMoney(num, stringEmptyReplace(count, 2), '', '', '') : stringEmptyReplace(str, '---');
};
/**
 *  为空判断
 * @param str
 * @returns {boolean}
 */
const stringEmpty = function(str) {
	if (typeof(str) != 'undefined' && str != null && str != '') {
		return false;
	}
	return true;
};
/**
 * 数字转为钱
 * @param places
 * @param symbol
 * @param thousand
 * @param decimal 
 * @returns {string}
 */
const formatMoney = function(number, places, symbol, thousand, decimal) {

	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol !== undefined ? symbol : "$";
	thousand = thousand || ",";
	decimal = decimal || ".";
	var negative = number < 0 ? "-" : "",
		i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;
	return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" +
		thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};
/**
 * 空串返回 defaultStr
 * @param str
 * @param defaultStr
 * @returns {*}
 */
const stringEmptyReplace = function(str, defaultStr) {
	if (typeof(str) != 'undefined' && str != null && str != '' && str != 'null' && str != 'NULL') {
		return str;
	}
	return defaultStr;
};

var WU = {
	uploadFile(url, file, success, path) {
		uni.showLoading({
			title: '上传中...'
		})
		if (WU.isEmpty(path)) {
			path = 'businessCard'
		}
		uni.uploadFile({
			url: http.config.baseUrl + url,
			filePath: file,
			header: http.config.headers,
			name: 'file',
			formData: {
				path_id: path
			},
			success: e => {
				uni.hideLoading();
				e = JSON.parse(e.data);
				if ((e.code = '0000')) {
					success(e.data);
					WU.toast('上传成功');
				} else {
					WU.toast('上传失败');
				}
			}
		});
	},
	version: '',
	test(e) {
		console.log("test " + e);
	},
	numberFormat: function (e, s, d) {
		try {
			return numberFormat(e, s, d);
		} catch (e) {
			return d;
		}
	},
	gics: '',
	pageStr: (page) => {
		return "?cPage=" + page.cPage + "&&pSize=" + page.pSize;
	},
	isEmpty: function isEmpty(obj) {
		return obj == undefined || obj == null || obj == "undefined" || obj == "null" || typeof obj == "string" && obj.trim() ==
			"";
	},
	isEmptyTo(obj, tep = '---') {
		return WU.isEmpty(obj) ? tep : obj;
	},
	isNotEmpty(obj) {
		return !WU.isEmpty(obj);
	},
	// arr原始数组，name 根据分组的字段
	group: function(arr, name) {
		var map = {},
			dest = [];
		for (var i = 0; i < arr.length; i++) {
			var ai = arr[i];
			ai[name] = ai[name] == null ? '其他' : ai[name];
			if (!map[ai[name]]) {
				dest.push({
					groupname: ai[name],
					item: [ai]
				});
				map[ai[name]] = ai;
			} else {
				for (var j = 0; j < dest.length; j++) {
					var dj = dest[j];
					if (dj.groupname == ai[name]) {
						dj.item.push(ai);
						break;
					}
				}
			}
		}
		return dest;
	},
	// 保留小数点之后几位数   取绝对值
	reservedDecimal: function(val, digit) {
		if (this.isEmpty(val)) {
			return '0';
		}
		return Math.abs(Number(val)).toFixed(digit);
	},
	// 保留小数点之后几位数   不取绝对值
	reservedDecimalOnAbs: function(val, digit) {
		if (this.isEmpty(val)) {
			return '0';
		}
		return Number(val).toFixed(digit);
	},
	user: function() {
		var user = uni.getStorageSync("user");
		if (WU.isEmpty(user)) {
			uni.reLaunch({
				url: '/pages/template/ucenter/register'
			})
			return {};
		} else {
			// #ifdef APP-PLUS
			plus.navigator.closeSplashscreen()
			// #endif
			return user;
		}
		/* 
		var mark = uni.getStorageSync("mark")
		if (mark == true) {
			uni.reLaunch({
				url: "/pages/index/index"
			})
		} else {
			var user = uni.getStorageSync("user");
			if (WU.isEmpty(user)) {
				uni.reLaunch({
					url: '/pages/template/ucenter/register'
				})
				return {};
			} else {
				return user;
			}
		} */
	},
	toast: function toast(msg) {
		uni.showToast({
			title: msg,
			icon: "none"
		});
	},
	systemInfo: uni.getSystemInfoSync(),
	showModel: function(title, msg, success) {
		if (WU.systemInfo.platform == "android") {
			uni.showModal({
				title: title,
				content: msg,
				cancelText: '确认',
				confirmText: '取消',
				success: (res) => {
					if (res.confirm) {} else if (res.cancel) {
						success();
					}
				}
			})
		} else {
			uni.showModal({
				title: title,
				content: msg,
				success: (res) => {
					if (res.confirm) {
						success();
					} else if (res.cancel) {}
				}
			})
		}
	},

	/**
	 * 日期格式化
	 * 使用 dateFtt("yyyy-MM-dd hh:mm:ss",e)
	 * @param fmt 格式化
	 * @param date 时间，可为空
	 * @returns {*}
	 */
	dateFtt: function dateFtt(fmt = 'yyyy-MM-dd', date) {
		if (WU.isEmpty(date)) {
			date = new Date();
		}
		var o = {
			"M+": date.getMonth() + 1, //月份
			"d+": date.getDate(), //日
			"h+": date.getHours(), //小时
			"m+": date.getMinutes(), //分
			"s+": date.getSeconds(), //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k])
				.substr(("" + o[k]).length));
		}
		return fmt;
	},

	dateForm: function dateFtt(e, str) {
		if (Wu.isEmpty(str)) {}
		str.forEach(s => {
			e = e.replace(s, "-")
		})
		return e;
	},

	/**
	 * 由于ios获取  new Date('xxxx-xx-xx')为空
	 * 将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
	 * @param startDiffTime
	 * @constructor
	 */
	GetDateDiff: function GetDateDiff(startDiffTime) {
		startTime = startDiffTime.replace(/\-/g, "/");
		return startTime;
	},

	vueFlush: function vueFlush(array) {
		array.push([]);
		array.pop();
	},
	arrayAppendToArray: function arrayAppendToArray(toArray, array) {
		for (var i in array) {
			toArray.push(array[i]);
		}
	},
	clearArray: function clearArray(array) {
		array.splice(0, array.length);
	},
	rewriteArray: function rewriteArray(toArray, array) {
		toArray.splice(0, toArray.length);
		for (var i in array) {
			toArray.push(array[i]);
		}
	},

	getDateAndLine: function getDateAndLine(value) {
		if (value == null || value == "null") {
			return "---";
		} else if ((value + "").indexOf('-') != -1) {
			return (value + "").substring(0, 10);
		} else {
			var now = new Date(value * 1),
				y = now.getFullYear(),
				m = now.getMonth() + 1,
				d = now.getDate();
			return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " ";
		}
	},
	dateFormartByYMD: function dateFormartByYMD(year, month, day, separator) {
		separator = separator ? separator : "";
		return year + separator + (month < 10 ? "0" + month : month) + separator + (day < 10 ? "0" + day : day);
	},
	dateFormartByYMDAndLine: function dateFormartByYMDAndLine(year, month, day, separator) {
		return this.dateFormartByYMD(year, month, day, "-");
	}
};

var DF = function DF(fmt) {
	var _this4 = this;

	this.fmt = fmt;

	this.getInfo = function(dataStr, fmt) {
		var index = _this4.fmt.indexOf(fmt);
		if (index == -1) {
			return null;
		}

		return dataStr.substr(index, fmt.length);
	};
	/**
	 *转换成日期对象
	 */
	this.parse = function(dateStr) {
		if (dateStr.length != fmt.length) {
			throw '无效的格式';
		}
		var date = new Date();
		var info = null;
		(info = _this4.getInfo(dateStr, "yyyy")) && info && date.setFullYear(info);
		(info = _this4.getInfo(dateStr, "mm")) && info && date.setMonth(info - 1);
		(info = _this4.getInfo(dateStr, "dd")) && info && date.setDate(info);
		(info = _this4.getInfo(dateStr, "hh")) && info && date.setHours(info);
		(info = _this4.getInfo(dateStr, "mi")) && info && date.setMinutes(info);
		(info = _this4.getInfo(dateStr, "ss")) && info && date.setSeconds(info);
		//(info = this.getInfo(dateStr,"apm"))&&info&&date.setSeconds(info);
		//(info = this.getInfo(dateStr,"sss"))&&info&&date.setMilliseconds(info);
		return date;
	};
	/**
	 * 补0
	 * @param num 要补0的数字
	 * @param length 总长度
	 * @constructor
	 */
	this.fillZero = function(num, length) {
		var str = num + "";
		for (var i = str.length; i < length; i++) {
			str = "0" + str;
		}
		return str;
	};
	/**
	 * 日期对象转字符串
	 * @param date 要转换的日期对象
	 * @constructor
	 */
	this.format = function(date, ofmt) {
		if (!(date instanceof Date)) {
			date = new Date();
		}
		var fmt = ofmt || _this4.fmt;
		fmt = fmt.replace("yyyy", date.getFullYear());
		fmt = fmt.replace("mm", _this4.fillZero(date.getMonth() + 1, 2));
		fmt = fmt.replace("dd", _this4.fillZero(date.getDate(), 2));
		fmt = fmt.replace("hh", _this4.fillZero(date.getHours(), 2));
		fmt = fmt.replace("mi", _this4.fillZero(date.getMinutes(), 2));
		fmt = fmt.replace("ss", _this4.fillZero(date.getSeconds(), 2));
		fmt = fmt.replace("cw", _this4.getCNWeek(date.getDay()));
		fmt = fmt.replace("apm", date.getHours() >= 12 ? "下午" : "上午");
		//fmt = fmt.replace("sss",this.fillZero(date.getMilliseconds(),3));
		return fmt;
	};
	this.strTostr = function(dateStr, fmt) {
		return _this4.format(_this4.parse(dateStr), fmt);
	};

	this.getCNWeek = function(value) {
		var str = "";
		switch (value) {
			case 0:
				str = "日";
				break;
			case 1:
				str = "一";
				break;
			case 2:
				str = "二";
				break;
			case 3:
				str = "三";
				break;
			case 4:
				str = "四";
				break;
			case 5:
				str = "五";
				break;
			case 6:
				str = "六";
				break;
			default:
				return this.getCNWeek(new Date().getDay());
		}
		return "星期" + str;
	}
	this.setFmt = function(fmt) {
		_this4.fmt = fmt;
		return _this4.fmt;
	};

	this.getFmt = function() {
		return _this4.fmt;
	};
	return {
		parse: this.parse,
		format: this.format,
		strTostr: this.strTostr
	};
};


module.exports = {
	WU,
	DF
}
