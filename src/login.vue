<template>
    <div class="wrapper">
      <text class="login-text">用户登入</text>
        <div class="login">
            <div class="input-wrapper">
                <input @input="onchangeUserNumber" class="input" type="text" placeholder="ID" autofocus="true" value=""/>
                <image class="input-img" :src="getImage('account.png')"></image>
            </div>
            <div class="input-wrapper">
                <input @input="onchangeUserPassword" class="input" type="password" placeholder="密码" value=""/>
                <image class="input-img" :src="getImage('password.png')"></image>
            </div>
            <div class="input-wrapper">
                <div class="input-login" @click="login">
                    <text class="input-login-text">登录</text>
                </div>
            </div>
            <div class="input-wrapper">
                <text class="input-forget" >忘记密码请联系管理员</text>
                <text class="input-lic">登入表示同意本软件使用协议</text>
            </div>
        </div>
    </div>
</template>

<script>
    let modal = weex.requireModule('modal')
    let stream = weex.requireModule('stream')
    let SimpleStore = weex.requireModule('simpleStore')
    let navigator = weex.requireModule('navigator')
    const storage = weex.requireModule('storage')
    let apis = require('./apis.json')
    let UrlTools = require('./UrlTools.js')
    let PlatformTools = require('./PlatformTools.js')
    module.exports = {
        data:{
            userNumber:'',
            userPassword:''
        },
        methods:{
            onchangeUserNumber:function (event) {
                this.userNumber = event.value
            },
            onchangeUserPassword:function (event) {
                this.userPassword = event.value
            },
            /*处理登录*/
            login: function () {
                if(this.userNumber.length < 1){
                    modal.toast({
                      message: '请输入登入账号',
                      duration: 0.3
                    })
                    return
                }
                if(this.userPassword.length < 1){
                    modal.toast({
                      message: '请输入登入密码',
                      duration: 0.3
                    })
                    return
                }
                this.handleLogin()
            },
            getImage: function(imageName) {
              return UrlTools.getImageBase(weex.config.bundleUrl) + '/dist/' + imageName
            },
            handleLogin: function () {
              stream.fetch({
                method: 'GET',
                type: 'json',
                url: apis.login + '/' + this.userNumber + '/' + this.userPassword
              }, res => {
                if(res.ok && res.data && res.data.code === 0) {
                    modal.toast({
                      message: '登入成功',
                      duration: 0.3
                    })
                    PlatformTools.setItem('userKey', this.userNumber)
                    PlatformTools.setItem('time', Date.now() + '')
                    PlatformTools.setItem('name', res.data.name)
                    PlatformTools.setItem('address', res.data.address)
                    navigator.open({
                      url: UrlTools.getBaseURL() + 'mainContainer.js',
                      // url: UrlTools.getUrlBase(weex.config.bundleUrl) + '/dist/mainContainer.js',
                      animated: 'true'
                    })
                } else {
                    modal.toast({
                      message: '登入失败',
                      duration: 0.3
                    })
                }
              })
            },
            getDate:function(str) {
              try{
                let strd = parseInt(str)
                return new Date(strd)
              } catch(e) {
                return null
              }
            },
            getDays: function(date) {
              return parseInt((Date.now() - date) / (1000 * 60 * 60 * 24))
            }
        },
        mounted: function() {
          // PlatformTools.setUp('登入', true)
        }
    }
    // 206
    // 89
    // 89
</script>

<style>
    .wrapper {
        background-color: #ce5959;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
    .login-text {
      width: 750px;
      padding-top: 180px;
      color: #ffffff;
      font-size: 48px;
      text-align: center;
    }
    .login{
        margin-top: 60px;
    }
    .input-wrapper{
        width: 550px;
        margin-left: 100px;
        margin-right: 100px;
        margin-bottom: 30px;
    }
    .input {
        font-size: 30px;
        height: 80px;
        width: 550px;
        padding-left: 90px;
        padding-top: 15px;
        padding-bottom: 15px;
        border-width:1px;
        border-color: #ffffff;
        border-radius:10px;
        outline: none;
        color: #ffffff;
        placeholder-color: #eeeeee;
    }
    .input-img{
        position: absolute;
        top:10px;
        left: 15px;
        width: 48px;
        height: 48px;
    }
    .input-login{
        height: 80px;
        width: 550px;
        background-color: #48c9bf;
        border-radius: 10px;
        margin-top: 40px;
    }
    .input-login-text{
        height: 80px;
        width: 550px;
        text-align: center;
        line-height: 80px;
        color: white;
        font-size: 35px;
    }
    .input-forget{
        position: absolute;
        left: 30px;
        font-size: 20px;
        color: #ffffff;
    }
    .input-lic{
        position: absolute;
        right: 30px;
        font-size: 20px;
        color: #ffffff;
    }
</style>
