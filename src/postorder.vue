<template>
  <div class="wrapper">
      <scroller class="scroller">
      <text class='pay-tip tip-head'>订单信息</text>
      <div class="row">
        <div class="order-order">
          <div class='v-h'></div>
          <text class="button-order-text">{{num}}桶{{typeStr}} 总价{{total}}元</text>
          <div class='v-h'></div>
        </div>
      </div>

      <text class='pay-tip tip-main'>选择桶装水类型</text>
      <div class="row">
        <div class="order-info" @click="pickType">
          <div class='v-h'></div>
          <text class="button-text">点击选择：{{typeStr}}</text>
          <div class='v-h'></div>
        </div>
      </div>
        <text class='pay-tip'>选择订购数量</text>
        <div class="row">
          <div class="order-num">
            <div class='v-h'></div>
            <input @input="onNumChange" ref='num' class="nums" type="number" placeholder="输入数量，默一桶" value=""/>
            <div class='v-h'></div>
          </div>
        </div>


        <text class='pay-tip tip-pay'>选择支付方式</text>
          <div class="row">
            <div class="pay-item">
              <div class='v-h'></div>
              <div class="h-container">
                <image style="width: 88px;height: 88px;" :src="getImage('alipay.png')"></image>
                <div class='pay-text' style="height: 88px;">
                  <div class='v-h v-h-top'></div>
                  <text class='pay-way'>支付宝</text>
                  <div class='v-h'></div>
                  <text class='pay-way tip'>亿万用户都在用，安全可托付</text>
                  <div class='v-h v-h-bottom'></div>
                </div>
                <div style="height: 88px;">
                  <div class='v-h'></div>
                  <image style="width: 48px;height: 48px;" :src="isAliPayUrl"  @click='changePayWay(0)'></image>
                  <div class='v-h'></div>
                </div>
              </div>
              <div class='v-h'></div>
            </div>
          </div>
          <div class="row">
            <div class="pay-item">
              <div class='v-h'></div>
              <div class="h-container">
                <image style="width: 88px;height: 88px;" :src="getImage('wxpay.png')"></image>
                <div class='pay-text' style="height: 88px;">
                  <div class='v-h v-h-top'></div>
                  <text class='pay-way'>微信支付</text>
                  <div class='v-h'></div>
                  <text class='pay-way tip'>亿万用户的选择，安全快捷</text>
                  <div class='v-h v-h-bottom'></div>
                </div>
                <div style="height: 88px;">
                  <div class='v-h'></div>
                  <image style="width: 48px;height: 48px;" :src="isWxPayUrl"  @click='changePayWay(1)'></image>
                  <div class='v-h'></div>
              </div>
              </div>
              <div class='v-h'></div>
            </div>
          </div>
        </scroller>

      <div :class="[nowSubBack]" @click="pay">
        <div class='v-h'></div>
        <text class="sb-txt">确认支付  ￥{{total}}元</text>
        <div class='v-h'></div>
      </div>
  </div>
</template>

<script>
  let modal = weex.requireModule('modal')
  const picker = weex.requireModule('picker')
  let navigator = weex.requireModule('navigator')
  let price = [2000, 1000, 500]
  let UnionPay = weex.requireModule('unionPay')
  var stream = weex.requireModule('stream')
  var globalEvent = weex.requireModule('globalEvent');
  var PayTools = require('./PayTools.js')
  var PlatformTools = require('./PlatformTools.js')
  let UrlTools = require('./UrlTools.js')
  export default {
    data: function () {
      return {
        total: 10,
        num: 1,
        index: 1,
        typeStr: '中桶水',
        types: ['大桶水', '中桶水', '小桶水'],
        isAliPay: true,
        isAliPayUrl:'',
        isWxPayUrl:'',

        nowSubBack: 'sbAli',
        openid: '',
        isPaying:false
      }
    },
    methods: {
      pay: function() {
        if(this.isPaying) return
        if(!this.openid || this.openid === '') {
          modal.alert({
            message:'无法获取用户信息',
            okTitle: '确定'
          })
          return
        }
        if(this.num > 2000 || this.num <1) {
          modal.alert({
            message:'单次购买数量不超过2000',
            okTitle: '确定'
          })
          return
        }
        if(this.index > 2 || this.index <0) {
          modal.alert({
            message:'不支持的购买类型',
            okTitle: '确定'
          })
          return
        }

        if(this.isAliPay) {
          PayTools.getAliPreOrder(this.openid, this.index, this.num, result => {
            if(result) {
              UnionPay.printLog(JSON.stringify(result))
              this.isPaying = true
              UnionPay.pay(result)
            }
          })
        } else {
          PayTools.getWxPreOrder(this.openid, this.index, this.num, result => {
            if(result) {
              UnionPay.printLog(JSON.stringify(result))
              this.isPaying = true
              UnionPay.pay(result)
            }
          })
        }
      },
      getStarCount (repo, callback) {
        return stream.fetch({
          method: 'GET',
          type: 'json',
          url: 'https://aaa.bigfacewo.com/dwssserver/prepay/ali/jsen/0/1'
        }, callback)
      },
      pickType: function() {
        picker.pick({
          index: 1,
          items: this.types
        }, event => {
          if (event.result === 'success') {
            this.index = event.data
            this.typeStr = this.types[this.index]
            this.total = this.calPrice()
          }
        })
      },
      calPrice: function() {
        let p = parseFloat(price[this.index] * this.num) / 100.0
        return p
      },
      onNumChange: function(e) {
        if(this.checkNum(e.value)) {
          this.num = parseInt(e.value)
        } else {
          this.$refs.num.value('1')
        }
        this.total = this.calPrice()
      },
      checkNum: function (txt) {
    　　var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/

    　　if (!re.test(txt)) {
  　　　　return false
    　　}
        return true
      },
      getImage: function(imageName) {
        return UrlTools.getImageBase(weex.config.bundleUrl) + '/dist/' + imageName
      },
      changePayWay: function(index) {
        if(index === 0) {
          this.nowSubBack = 'sbAli'
          this.isAliPay = true
          this.isAliPayUrl = UrlTools.getImageBase(weex.config.bundleUrl) + '/dist/checked.png'
          this.isWxPayUrl = UrlTools.getImageBase(weex.config.bundleUrl) + '/dist/check.png'
        } else {
          this.nowSubBack = 'sbWx'
          this.isAliPay = false
          this.isAliPayUrl = UrlTools.getImageBase(weex.config.bundleUrl) + '/dist/check.png'
          this.isWxPayUrl = UrlTools.getImageBase(weex.config.bundleUrl) + '/dist/checked.png'
        }
      }
    },
    mounted: function() {
      PlatformTools.getItem('userKey', result => {
        if(result.result === 'success' && result.data && result.data != '') {
          this.openid = result.data
        }
      })
      globalEvent.addEventListener("PayResult", result => {
        this.isPaying = false
        if(result) {
          if(result.code === 0) {
            modal.alert({
              message: result.msg
            }, _ => {
              navigator.pop({animated: 'true'})
            })
          } else {
            modal.alert({
              message: result.msg
            })
          }
        }
      });

      if(weex.config.env.platform !== 'iOS') {
        navigator.setNavBarTitle('订单支付')
        // navigator.clearNavBarLeftItem()
      } else {
        navigator.setNavBarTitle({title:'订单支付'})
      }
      let params = UrlTools.getParams(weex.config.bundleUrl)
      if(params.type) {
        let type = parseInt(params.type)
        this.index = type
        this.typeStr = this.types[this.index]
        this.total = this.calPrice()
      }
      this.changePayWay(0)
    }
  }
</script>

<style>

  .scroller {
      position: absolute;
      top:0px;
      bottom:110px;
      left: 0px;
      right:0px;
  }
  .wrapper {
    position: absolute;
    background-color: #eeeeee;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .order-order {
    flex: 1;
    flex-direction: column;
    width: 100%;
    right: 0px;
    background-color: #ffffff;
    height:100px;
  }
  .order-info{
    flex: 1;
    flex-direction: column;
    width: 100%;
    right: 0px;
    background-color: #ffffff;
    height:100px;
  }
  .order-num{
    flex: 1;
    flex-direction: column;
    width: 100%;
    right: 0px;
    background-color: #ffffff;
    height:100px;
  }
  .nums {
    padding-left: 60px;
    padding-right: 60px;
    color: #000000;
    placeholder-color: #bbbbbb;
  }
  .pay-item {
    height:120px;
    flex: 1;
    width: 100%;
    right: 0px;
    padding-left: 40px;
    padding-right: 40px;
    background-color: #ffffff;
    margin-bottom: 2px;
  }
  .h-container {
    flex-direction: row;
  }
  .pay-text {
    flex: 1;
    padding-left: 20px;
  }
  .pay-way {
  }
  .pay-tip {
    padding-left: 20px;
    padding-top: 20px;
    padding-bottom: 8px;
    font-size: 28px;
    color: #888888;
  }
  .tip-main {
    margin-top: 40px;
  }
  .tip-head {
    margin-top: 0px;
  }
  .tip-pay {
    margin-top: 40px;
  }
  .tip {
    font-size: 22px;
  }
  .v-h-top {
    flex: 0.2;
  }
  .v-h-bottom {
    flex: 0.3;
  }
  .row{
    flex-direction: row;
  }
  .v-h {
    flex:1;
  }
  .button-text{
    padding-left: 60px;
    padding-right: 60px;
    color: #000000;
    font-size: 35px;
  }
  .button-order-text{
    padding-left: 60px;
    padding-right: 60px;
    color: #000000;
    font-size: 42px;
  }
  .submit-btn {
    position: absolute;
    bottom: 10px;
    left: 120px;
    right: 120px;
    background-color: #2595c9;

    display:block;
    box-sizing:border-box;
    font-size:18px;
    border-radius:5px;
    -webkit-tap-highlight-color:transparent;
    height: 90px;
    text-align: center;
  }
  .sbAli {
    z-index: 1000;
    position: absolute;
    bottom: 10px;
    left: 120px;
    right: 120px;
    background-color: #2595c9;

    display:block;
    box-sizing:border-box;
    font-size:18px;
    border-radius:5px;
    -webkit-tap-highlight-color:transparent;
    height: 90px;
    text-align: center;
    opacity: 1;
  }
  .sbAli:active {
    opacity: 0.8;
  }
  .sbWx {
    z-index: 1000;
    position: absolute;
    bottom: 10px;
    left: 120px;
    right: 120px;
    background-color: #48a443;

    display:block;
    box-sizing:border-box;
    font-size:18px;
    border-radius:5px;
    -webkit-tap-highlight-color:transparent;
    height: 90px;
    text-align: center;
    opacity: 1;
  }
  .bt-submit:active {
    background-color: #0A9D09;
  }
  .sb-txt {
    color:#FFFFFF;
    text-align: center;
  }
</style>
