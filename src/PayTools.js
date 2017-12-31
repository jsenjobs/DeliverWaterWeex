
let apis = require('./apis.json')
let stream = weex.requireModule('stream')

exports.getAliPreOrder = function(id, type, num, callback) {
  stream.fetch({
    method: 'GET',
    type: 'json',
    url: apis.getAliPreOrder + '/' + id + '/' + type + '/' + num
  }, res => {
    if(res.ok && res.data && res.data.code === 0 && res.data.data) {
      callback({platform:'ali', orderStr: res.data.data})
    } else {
      callback()
    }
  })
}

exports.getWxPreOrder = function(id, type, num, callback) {
  callback({platform:'wx', orderStr:'hold'})
  return
  stream.fetch({
    method: 'GET',
    type: 'json',
    url: apis.getWxPreOrder + '/' + id + '/' + type + '/' + num
  }, res => {
    if(res.ok && res.data && res.data.code === 0) {
      callback({platform:'wx', data: res.data})
    } else {
      callback()
    }
  })
}
