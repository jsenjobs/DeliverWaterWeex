<template>
  <div class="wrapper">
    <div class="row">
      <div class='v-h'></div>
      <text class="text-info">所有订单</text>
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
              <text :class="['ok_pay', order.style]" style="padding:20px;">{{order.statStr}}</text>
            </div>
      </div>
    </scroller>
  </div>
</template>

<script>
import apis from './apis.json'
let modal = weex.requireModule('modal')
let stream = weex.requireModule('stream')
let PlatformTools = require('./PlatformTools.js')
let Constants = require('./help/Constants.js')
let HttpUtils = require('./help/HttpUtils.js')
let ModalUtils = require('./help/ModalUtils.js')

  export default {
    data: function () {
      return {
        noOrderData:[],
        openid: ''
      }
    },
    methods: {
      ok_pay: function(index) {
        stream.fetch({
          method:'GET',
          type: 'json',
          url: apis.orderFinished + '/' + this.noOrderData[index].id
        }, res => {
          if(res.ok) {
            this.noOrderData.splice(index, 1)
              modal.toast({
                message:'确认收货'
              })
          } else {
            modal.toast({
              message:'请求出错'
            })
          }
        })
      },
      getNoOrders: function() {
        if(this.openid && this.openid !== '') {
          HttpUtils.getAllOrders(this.openid, data => {
            this.parserData(data)
          })
        }
      },
      getStat: function(stat) {
        if(stat === 0) {
          return '已完成'
        } else if (stat === 1) {
          return '等待收货'
        } else if (stat === 2) {
          return '等待接单'
        } else {
          return '未知-' + stat
        }
      },
      parserData: function(datas) {
        this.noOrderData = []
        datas.forEach(order => {
          //          {type:'大桶水', num:6, fee:'120', date:'2017年12月21日 14时3分58秒'},
          let stat = order.stat
          let statStr = '未知-' + stat
          let style = 'st-wait'
          if(stat === 0) {
            statStr = '已完成'
            style = 'st-waita'
          } else if (stat === 1) {
            statStr = '等待收货'
            style = 'st-waitb'
          } else if (stat === 2) {
            statStr = '等待接单'
            style = 'st-waitc'
          }
          this.noOrderData.push({
            id: order._id,
            type: Constants.types[order.type],
            num: order.num,
            fee: order.fee,
            date: PlatformTools.formatDate(new Date(order.date), 'yy年MM月dd日 hh时mm分ss秒'),
            statStr: statStr,
            style: style
          })
        })
      }
    },
    mounted: function () {
      PlatformTools.setUp('所有订单')
      PlatformTools.getItem('userKey', result => {
        if(result.result === 'success' && result.data && result.data != '') {
          this.openid = result.data
          this.getNoOrders()
        } else {
          ModalUtils.mod('无法获取用户信息')
        }
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
  .ok_pay {
    box-sizing:border-box;
    font-size:26px;
    border-radius:5px;
    -webkit-tap-highlight-color:transparent;
    color: #ffffff;
    opacity: 0.4;
  }
  .st-wait {
    background-color: #eb8c1d;
  }
  .st-waita {
    background-color: #48a443;
  }
  .st-waitb {
    background-color: #43a2a4;
  }
  .st-waitc {
    background-color: #a44355;
  }
</style>
