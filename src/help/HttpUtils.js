let apis = require('../apis.json')
let ModalUtils = require('./ModalUtils.js')
let modal = weex.requireModule('modal')
let stream = weex.requireModule('stream')

exports.getWaitOrders = function(openid, callback) {
  stream.fetch({
    method: 'GET',
    type: 'json',
    url: apis.listNoOrder + '/' + openid
  }, res => {
    if(res.ok) {
      if (res.data.code === 0) {
        callback(res.data.data.reverse())
      } else {
        ModalUtils.mod(res.data.msg)
      }
    } else {
      ModalUtils.mod('无法获取信息')
    }
  })
}

exports.getAllOrders = function(openid, callback) {
  stream.fetch({
    method: 'GET',
    type: 'json',
    url: apis.listAllOrders + '/' + openid
  }, res => {
    if(res.ok) {
      if (res.data.code === 0) {
        callback(res.data.data.reverse())
      } else {
        ModalUtils.mod(res.data.msg)
      }
    } else {
      ModalUtils.mod('无法获取信息')
    }
  })
}
