<template>
  <div style="flex-direction: column;">
    <TBB :tabItems="tabItems" @tabBarOnClick="tabBarOnClick"></TBB>
  </div>
</template>

<script>
  var modal = weex.requireModule('modal')
  var navigator = weex.requireModule('navigator')
  var getBaseURL = require('./UrlTools.js').getBaseURL
  var getBaseImageUrl = require('./UrlTools.js').getBaseImageUrl
  var PlatformTools = require('./PlatformTools.js')
  let SocketN = require('./SocketN.js')
  let stream = weex.requireModule('stream')
  let apis = require('./apis.json')
  let UnionPay = weex.requireModule('unionPay')

  module.exports = {
    data: function () {
      return {
        openid:'',
        dir: 'examples',
        tabItems: [
          {
            index: 0,
            title: '订水',
            titleColor: '#000000',
            icon: '',
            image: 'imgs/tab-home0.png',
            selectedImage: 'imgs/tab-home.png',
            src: 'pages/main.js',
            visibility: 'visible',
          },
          {
            index: 1,
            title: '订单',
            titleColor: '#000000',
            icon: '',
            image: 'imgs/tab-order0.png',
            selectedImage: 'imgs/tab-order.png',
            src: 'pages/order.js',
            visibility: 'hidden',
          },
          {
            index: 2,
            title: '我的',
            titleColor: '#000000',
            icon: '',
            image: 'imgs/tab-me0.png',
            selectedImage: 'imgs/tab-me.png',
            src: 'pages/me.js',
            visibility: 'hidden',
          }
        ],
      }
    },
    components: {
      TBB: require('./comp/TBB.vue')
    },
    created: function() {
      PlatformTools.getItem('userKey', result => {
        if(result.result === 'success' && result.data) {
          this.startWebSocketTask(result.data)
        }
      })
      var baseURL = getBaseURL()
      let baseImageUrl = getBaseImageUrl()
      for(var i = 0; i < this.tabItems.length; i++) {
        var tabItem = this.tabItems[i];
        tabItem.image = baseImageUrl + tabItem.image
        tabItem.selectedImage = baseImageUrl + tabItem.selectedImage
        tabItem.src = baseURL + tabItem.src;
      }
    },
    mounted: function() {
        PlatformTools.getItem('userKey', result => {
          if(result.result === 'success' && result.data && result.data != '') {
            this.openid = result.data
          }
        })
    },
    methods: {
      tabBarOnClick: function (e) {
        let index = e.index
        if(index === 0) {
          PlatformTools.setUp('主页', true)
        } else if (index === 1) {
          PlatformTools.setUp('订单', true)
        } else if (index === 2) {
          PlatformTools.setUp('我的', true)
        }
      },
      startWebSocketTask: function(openid) {
        var self = this
        UnionPay.printLog('start+' + openid)
        SocketN.startWS(openid, {
          onconnecting: function() {
            UnionPay.printLog('connecting...')
            console.log('connecting...')
            // self.onopeninfo = 'connecting...'
          },
          onopen: function(e) {
            UnionPay.printLog('websocket open')
            console.log('websocket open')
            // self.onopeninfo = 'websocket open';
          },
          onmessage: function(e) {
            console.log(e.data)
            UnionPay.printLog('onmessage' + JSON.stringify(e))
            // self.onmessage = e.data;
          },
          onerror: function(e) {
            console.error(e.data)
            UnionPay.printLog('onerror' + JSON.stringify(e))
            // self.onerrorinfo = e.data;
          },
          onclose: function(e) {
          UnionPay.printLog('onclose' + JSON.stringify(e))
            console.log(e.code)
            // self.onopeninfo = '';
            // self.oncloseinfo = e.code;
          },
          cnotify: function(data) {
            let order = data.data
            let type = ['大桶水', '中桶水', '小桶水']
            let str = '您订购的' + order.num + '桶[' + type[order.type] + ']即将配送'
            modal.alert({
              message: str,
              okTitle: '确定'
            }, _ => {
              if(!self.openid || self.openid === '') {
                modal.toast({
                  message:'无法获取用户信息',
                  duration: 1
                })
              } else {
                stream.fetch({
                  method:'GET',
                  url:apis.ok_client + '/' + order._id + '/' + self.openid
                })
              }
            })
          }
        })
      }
    }
  }
</script>
