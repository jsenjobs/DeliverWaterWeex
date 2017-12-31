<template>
  <div class="wrapper" ref="showOrder" @viewappear='viewappear'>
    <div class="row">
      <div class='v-h'></div>
      <text class="text-info">未完成订单</text>
      <div class='v-h'></div>
    </div>
    <scroller class="scroller">

      <div class='order' v-for="(order, index) in noOrderData" :ref="'item'+index">
        <div class="order-line">
          <text style="padding:20px;font-size: 42px;">{{order.type}}</text>
        </div>
          <div class="order-line">
            <text style="padding:20px;">购买数量：{{order.num}}桶</text>
            <div class="v-h"></div>
            <button style="padding:20px;">金额：{{order.fee}}元</button>
          </div>
            <div class="order-line">
              <text style="padding:20px;font-size:22px;">时间：{{order.date}}</text>
              <div class="v-h"></div>
              <text :class="[getClass(order.stat)]" style="padding:20px;" @click='ok_pay(index)'>{{order.stat === 1 ? '确认收货':'等待接单'}}</text>
            </div>
      </div>
        <div class="sbuttonHis" @click="showAllOrder">
          <div class='v-h'></div>
          <text class="sb-txt">查看所有历史订单</text>
          <div class='v-h'></div>
        </div>
    </scroller>
  </div>
</template>

<script>
import apis from '../apis.json'
let stream = weex.requireModule('stream')
let navigator = weex.requireModule('navigator')
let PlatformTools = require('../PlatformTools.js')
let UrlTools = require('../UrlTools.js')
let Constants = require('../help/Constants.js')
let HttpUtils = require('../help/HttpUtils.js')
let ModalUtils = require('../help/ModalUtils.js')

  export default {
    data: function () {
      return {
        noOrderData:[],
        openid:''
      }
    },
    methods: {
      getClass(stat) {
        if(stat === 1) {
          return 'ok-pay'
        }
        return 'ok-wait'
      },
      showAllOrder: function() {
          navigator.push({
            url: UrlTools.getBaseURL() + 'allorders.js',
            animated: 'true'
          })
      },
      ok_pay: function(index) {
        if(this.noOrderData[index].stat === 1) {
          stream.fetch({
            method:'GET',
            type: 'json',
            url: apis.orderFinished + '/' + this.noOrderData[index].id
          }, res => {
            if(res.ok) {
              this.noOrderData.splice(index, 1)
              ModalUtils.mod('确认收货')
            } else {
              ModalUtils.mod('请求出错')
            }
          })
        } else {
          ModalUtils.mod('等待接单')
        }
      },
      getNoOrders: function() {
        if(this.openid && this.openid !== '') {
          HttpUtils.getWaitOrders(this.openid, data => {
            this.parserData(data)
          })
        }
      },
      parserData: function(datas) {
        this.noOrderData = []
        datas.forEach(order => {
          this.noOrderData.push({
            id: order._id,
            type: Constants.types[order.type],
            num: order.num,
            fee: order.fee,
            stat: order.stat,
            date: PlatformTools.formatDate(new Date(order.date), 'yy年MM月dd日 hh时mm分ss秒')
          })
        })
      },
      viewappear: function() {
        this.getNoOrders()
      }
    },
    mounted: function () {
      PlatformTools.getItem('userKey', result => {
        if(result.result === 'success' && result.data && result.data != '') {
          this.openid = result.data
        } else {
          ModalUtils.mod('无法获取用户信息')
        }
      })
    },
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
    padding: 28px 40px 28px 40px;
  }
  .order {
    margin-bottom: 2px;
    background-color: #ffffff;
    flex-direction: column;
    margin-bottom: 2px;
    padding: 20px 40px 20px 40px;
  }
  .order-line {
    flex-direction: row;
  }

  .sbuttonHis {
    margin: 20px 50px 20px 60px;
    background-color: #2595c9;
    box-sizing:border-box;
    font-size:18px;
    border-radius:5px;
    -webkit-tap-highlight-color:transparent;
    height: 90px;
    text-align: center;
    opacity: 1;
  }
  .sbuttonHis:active {
    opacity: 0.8;
  }
  .sb-txt {
    color:#FFFFFF;
    text-align: center;
  }
  .ok-pay {
    background-color: #48a443;
    box-sizing:border-box;
    font-size:26px;
    border-radius:5px;
    -webkit-tap-highlight-color:transparent;
    color: #ffffff;
  }
  .ok-pay:active {
    background-color: #389433;
  }
  .ok-wait {
    background-color: #a44355;
    box-sizing:border-box;
    font-size:26px;
    border-radius:5px;
    -webkit-tap-highlight-color:transparent;
    color: #ffffff;
  }
  .ok-wait:active {
    background-color: #943345;
  }
</style>
