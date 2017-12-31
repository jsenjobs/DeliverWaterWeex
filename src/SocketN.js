let apis = require('./apis.json')
var webSocket = weex.requireModule('webSocket')
let modal = weex.requireModule('modal')
let openid = null
let stat = false
let instance = false
let loginData = '{}'
exports.startWS = function(id, callback) {
  if(!id || !callback) return
  openid = id
  loginData = JSON.stringify({type: 'clogin', id: openid})
  // modal.toast({message:loginData})
  checkStat(callback)
  // webSocket.WebSocket(apis.webSocket,'')

  webSocket.onopen = function(e) {
    stat = true
    startHB()
    login()
    if (callback.onopen) {
      callback.onopen(e)
    }
  }
  webSocket.onerror = function(e) {
    // webSocket.close()
    stat = false
    instance = false
    if(callback.onerror) {
      callback.onerror(e)
    }
  }
  webSocket.onclose = function(e)  {
    stat = false
    instance = false
    if(callback.onclose) {
      callback.onclose(e)
    }
  }
  webSocket.onmessage = function(e) {
    let data = e.data
    if(callback.onmessage) {
      callback.onmessage(e)
    }
    try {
      data = JSON.parse(data)
      if(data.type === 'cnotify') {
        if(callback.cnotify) {
          callback.cnotify(data)
          webSocket.send(ok_cnotify)
        }
      }
    } catch(e) {
      console.error('not json data')
    }
  }
}

function checkStat(callback) {
  if (!stat && !instance) {
    instance = true
    webSocket.WebSocket(apis.webSocket,'')
    if(callback.onconnecting) {
      callback.onconnecting()
    }
  }
  setInterval(_ => {
    if(!stat && !instance) {
      instance = true
      webSocket.WebSocket(apis.webSocket,'')
      if(callback.onconnecting) {
        callback.onconnecting()
      }
    }
  }, 10000)
}

let hbTask = null
const hbdata = JSON.stringify({ type: 'ping', data: 'hb' })
const ok_cnotify = JSON.stringify({ type: 'ok_cnotify', data: 'ok' })
function startHB() {
  if(hbTask != null) {
    clearInterval(hbTask)
    hbTask = null
  }
  hbTask = setInterval(_ => {
    if(!stat) {
      clearInterval(hbTask)
      hbTask = null
      return
    }
    webSocket.send(hbdata)
  }, 60000)
}

function login() {
  if(!stat) return
  webSocket.send(loginData)
}
