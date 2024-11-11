;(function (xhr) {
  var XHR = xhr.prototype
  var open = XHR.open
  var send = XHR.send

  // 匹配字符串
  var menusJson = '/v1/web/home/menus' // 获取用户菜单
  var queryUrl = 'settle/v1/bill/query_date_statistics' // 财务对账的查询接口
  var exportUrl = 'settle/v1/download/list' // 财务对账的导出接口

  console.log('ok')
  // 对open进行patch 获取url和method
  XHR.open = function (method, url) {
    this._method = method
    this._url = url
    return open.apply(this, arguments)
  }
  // 同send进行patch 获取responseData.
  XHR.send = function () {
    this.addEventListener('load', function () {
      var myUrl = this._url ? this._url.toLowerCase() : this._url
      if (myUrl.includes(menusJson)) {
        if (this.responseType != 'blob' && this.responseText) {
          try {
            var arr = this.responseText
            console.log(myUrl, arr)
            window.postMessage(
              {
                type: 'inject_message_menusJson',
                url: this._url,
                response: arr,
              },
              '*'
            )
            console.log('加载左侧菜单: ', JSON.parse(arr))
          } catch (err) {
            console.log(err)
            console.log('Error in responseType try catch')
          }
        }
      }

      if (myUrl.includes(queryUrl)) {
        if (this.responseType != 'blob' && this.responseText) {
          try {
            var arr = this.responseText
            console.log(myUrl, arr)
            window.postMessage(
              {
                type: 'inject_message_queryStatistics',
                url: this._url,
                response: arr,
              },
              '*'
            )
            console.log('财务对账list: ', JSON.parse(arr))
          } catch (err) {
            console.log(err)
            console.log('Error in responseType try catch')
          }
        }
      }
      if (myUrl.includes(exportUrl)) {
        if (this.responseType != 'blob' && this.responseText) {
          try {
            var arr = this.responseText
            setTimeout(() => {
              window.postMessage(
                {
                  type: 'inject_message_settleDownload',
                  url: this._url,
                  response: arr,
                },
                '*'
              )
            }, 300)
          } catch (err) {
            console.log(err)
            console.log('Error in responseType try catch')
          }
        }
      }
    })
    return send.apply(this, arguments)
  }
})(XMLHttpRequest)
