//app.js
var req = require("./common/request.js")
var api = require("./api.js");
var data = require("./common/data.js")
App({
  onLaunch: function () {

    let that = this;
    that.checkLoginStatus();
    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus: function () {
    let that = this;
    // 获取登录标志变量
    let isLogin = wx.getStorageSync("isLogin");
    if (isLogin) {
      // 如果已经登录, 检查Session是否过期
      // 微信默认session时间为2小时
      wx.checkSession({
        success: function () {
          // 从本地存储中获存储的登录用户的信息
          let userStorageInfo = wx.getStorageSync("userInfo");
          if (userStorageInfo) {
            // 如果userStorageInfo 不为空
            that.globalData.userInfo = JSON.parse(userStorageInfo);
          } else {
            that.showInfo("登录信息缺失");
            console.error("登录信息字段缺失");
            that.doLogin();
          }
        },
        fail: function () {
          that.doLogin();
        }
      });
    } else {
      that.doLogin();
    }
  },

  /**
   * 登录处理函数
   */
  doLogin: function () {
    let that = this;
    wx.login({
      success: function (loginRes) {
        wx.getUserInfo({
          success: function (infoRes) {
            var loginParam = api.Api.loginParam(loginRes.code, infoRes.rawData, infoRes.signature, infoRes.encryptedData, infoRes.iv);
            console.log("loginParam ==> " + JSON.stringify(loginParam));
            var param = req.Request.params(data.Data.requestType.POST, data.Data.requestUrl.baseUrl + data.Data.requestUrl.loginUrl, JSON.stringify(loginParam));
            req.Request.myWxRequet(param).then(res => {
              console.log("after login ==>>")
              console.log(res);
              if (res.data.code == 200) {
                wx.setStorageSync("isLogin", true);
                wx.setStorageSync("token", res.data.data);
              }
            });
          }
        });
      }
    });
  }
})