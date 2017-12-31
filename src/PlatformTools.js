
let navigator = weex.requireModule('navigator')
let SimpleStore = weex.requireModule('simpleStore')
const storage = weex.requireModule('storage')
let modal = weex.requireModule('modal')

exports.formatDate = function(date, format) {
	var o = {
		"M+" : date.getMonth()+1, //month
		"d+" : date.getDate(), //day
		"h+" : date.getHours(), //hour
		"m+" : date.getMinutes(), //minute
		"s+" : date.getSeconds(), //second
		"q+" : Math.floor((date.getMonth()+3)/3), //quarter
		"S" : date.getMilliseconds() //millisecond
	}
	if(/(y+)/.test(format)) format=format.replace(RegExp.$1, (date.getFullYear()+"").substr(4- RegExp.$1.length));
	for(var k in o)
		if(new RegExp("("+ k +")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length==1? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	return format;
}

exports.setUp = function(title, clear = false) {

    if(weex.config.env.platform !== 'iOS') {
      navigator.setNavBarTitle(title)
      if(clear)
        navigator.clearNavBarLeftItem()
    } else {
      navigator.setNavBarTitle({title:title})
    }

}

exports.getItem = function(key, callback) {
    if(weex.config.env.platform !== 'iOS') {
      storage.getItem(key, callback)
    } else {
      SimpleStore.getItem(key, callback)
    }
}

exports.setItem = function(key, value, callback) {
    if(weex.config.env.platform !== 'iOS') {
      storage.setItem(key, value, callback)
    } else {
      SimpleStore.setItem(key, value, callback)
    }
}

exports.removeItem = function(key, callback) {
    if(weex.config.env.platform !== 'iOS') {
      storage.removeItem(key, callback)
    } else {
      SimpleStore.removeItem(key, callback)
    }
}
