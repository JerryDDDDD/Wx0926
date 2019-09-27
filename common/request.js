var Request = {
  /**
     * 数据请求参数
     * @param type 请求类型
     * @param url 请求路径
     * @param data 请求参数
     */
  params: function (type, url, data) {
    return {
      type: type,
      url: url,
      data: data
    };
  },

  /**
   * 自定义请求
   */
  myWxRequet: function (params) {
    let token = wx.getStorageSync("token");
    return new Promise(function (resolve, reject) {
      wx.request({
        url: params.url,
        data: params.data,
        header: {
          token: token
        },
        method: params.type,
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          (res.data == "" || res.data == null) ? reject(res) : resolve(res);
        },
        fail: function (res) {
          reject(res);
        },
        complete: function (res) { },
      })
    });
  }
}

module.exports = {
  Request: Request
}