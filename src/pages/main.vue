<template>
  <div class="wrapper">
      <div class="row">
        <div class="sider sider-a"></div>
        <div class="button" @click="buy(0)">
          <div class='v-h'></div>
          <text class="button-text">订购大桶装水</text>
          <div class='v-h'></div>
        </div>
      </div>
      <div class="row">
        <div class="sider sider-b"></div>
        <div class="button" @click="buy(1)">
          <div class='v-h'></div>
          <text class="button-text">订购中桶装水</text>
          <div class='v-h'></div>
        </div>
      </div>
      <div class="row">
        <div class="sider sider-c"></div>
        <div class="button" @click="buy(2)">
          <div class='v-h'></div>
          <text class="button-text">订购小桶装水</text>
          <div class='v-h'></div>
        </div>
      </div>
  </div>
</template>

<script>
  let navigator = weex.requireModule('navigator')
  let modal = weex.requireModule('modal')
  let UrlTools = require('../UrlTools.js')
  let PlatformTools = require('../PlatformTools.js')
  const storage = weex.requireModule('storage')
  let SimpleStore = weex.requireModule('simpleStore')
  export default {
    data: function () {
      return {
      }
    },
    methods: {
      buy: function(type) {
        navigator.push({
          url: UrlTools.getBaseURL() + 'postorder.js?type=' + type,
          animated: 'true'
        })
      }
    },
    mounted: function () {
      PlatformTools.setUp('主页', true)
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
    flex-direction: column;
    padding-top: 60px;
  }
  .button{
    flex:1;
    flex-direction: column;
    width: 100%;
    right: 0px;
    background-color: #ffffff;
    border-radius: 10px;
    margin-bottom: 2px;
  }
  .button:active {
    background-color: #eeeeee;
  }
  .row{
    height: 180px;
    flex-direction: row;
  }
  .v-h {
    flex:1;
  }
  .button-text{
    height: 80px;
    text-align: center;
    line-height: 80px;
    color: #000000;
    font-size: 35px;
  }
  .sider {
    width:20px;
  }
  .sider-a {
    background-color: #123456;
  }
  .sider-b {
    background-color: #fed657;
  }
  .sider-c {
    background-color: #97290f;
  }
  .text-right {
    text-align: center;
    padding-top: 80px;
    color: #000000;
    font-size: 28px;
  }
</style>
