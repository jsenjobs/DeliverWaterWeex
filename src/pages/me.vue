<template>
  <div class="wrapper">
      <div class="row">
        <div class='v-h'></div>
        <text class="text-info">手机号码：{{openid}}</text>
        <div class='v-h'></div>
      </div>
      <div class="row">
        <div class='v-h'></div>
        <text class="text-info">用户名字：{{name}}</text>
        <div class='v-h'></div>
      </div>
      <div class="row">
        <div class='v-h'></div>
        <div>
          <text class="text-info">送货地址：</text>
          <text class="text-info text-address">{{address}}</text>
        </div>
        <div class='v-h'></div>
      </div>
      <div class="row" style="margin-top:40px;">
        <div class='v-h'></div>
        <text class="text-info text-mail">联系电话：17682490309</text>
        <div class='v-h'></div>
      </div>
      <div class="row">
        <div class='v-h'></div>
        <text class="text-info text-mail">版本信息：V1.0.1</text>
        <div class='v-h'></div>
      </div>

        <div class="sbuttonHis" @click="logout">
          <div class='v-h'></div>
          <text class="sb-txt">退出登入</text>
          <div class='v-h'></div>
        </div>


      <text class="text-right">Copyright(C) 2017 Chaos.</text>

  </div>
</template>

<script>
let PlatformTools = require('../PlatformTools.js')
let UrlTools = require('../UrlTools.js')
let navigator = weex.requireModule('navigator')
let modal = weex.requireModule('modal')
  export default {
    data: function () {
      return {
        openid:'',
        name:'',
        address: ''
      }
    },
    methods: {
      logout: function() {
        modal.confirm({
          message:'确定要退出吗？',
          okTitle: '退出',
          cancelTitle: '取消'
        }, value => {
          if(value === '退出') {
            PlatformTools.removeItem('userKey')
            PlatformTools.removeItem('time')
            PlatformTools.removeItem('name')
            PlatformTools.removeItem('address')
            navigator.open({
              url: UrlTools.getBaseURL()+ 'login.js',
              animated: 'true',
              login: 'true'
            })
          }
        })
        /*
        navigator.open({
          url: UrlTools.getUrlBase(weex.config.bundleUrl) + '/dist/login.js',
          animated: 'true'
        })
        */
      }
    },
    mounted: function () {
      PlatformTools.getItem('userKey', result => {
        if(result.result === 'success' && result.data) this.openid = result.data
      })
      PlatformTools.getItem('name', result => {
        if(result.result === 'success' && result.data) this.name = result.data
      })
      PlatformTools.getItem('address', result => {
        if(result.result === 'success' && result.data) this.address = result.data
      })
    }

  }
</script>

<style>


  .wrapper {
    background-color: #eeeeee;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding-top: 60px;
  }
  .row{
    margin-bottom: 2px;
    background-color: #ffffff;
    flex-direction: column;
  }
  .v-h {
    flex:1;
  }
  .text-info {
    text-align: left;
    padding: 40px;
  }
  .text-address {
    font-size: 24px;
    padding-top: 0px;
    padding-left: 44px;
  }
  .text-mail {
    padding-top: 26px;
    padding-bottom: 26px;
  }
  .text-right {
    text-align: center;
    padding-top: 80px;
    color: #000000;
    font-size: 28px;
  }

  .sbuttonHis {
    margin: 20px 50px 20px 60px;
    background-color: #c9254d;
    box-sizing:border-box;
    font-size:18px;
    border-radius:5px;
    -webkit-tap-highlight-color:transparent;
    height: 90px;
    text-align: center;
  }
  .sbuttonHis:active {
    background-color: ##b9153d;
  }
  .sb-txt {
    color:#FFFFFF;
    text-align: center;
  }
</style>
