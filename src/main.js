console.log('Hello World!')

// 获取今天
const getToday = (num = 0) => {
  var currentDate = new Date()
  // 减去N天
  currentDate.setDate(currentDate.getDate() - num)
  var year = currentDate.getFullYear()
  var month = ('0' + (currentDate.getMonth() + 1)).slice(-2)
  var day = ('0' + currentDate.getDate()).slice(-2)

  var formattedTime = year + '-' + month + '-' + day

  return formattedTime
}

// 获取今天
const getFormatterDay = (currentDate) => {
  var year = currentDate.getFullYear()
  var month = ('0' + (currentDate.getMonth() + 1)).slice(-2)
  var day = ('0' + currentDate.getDate()).slice(-2)

  var formattedTime = year + '-' + month + '-' + day

  return formattedTime
}

// 获取localStorage 信息
const getLocalStorage = (key) => {
  const data = localStorage.getItem(key)
  if (data) {
    const dataObj = JSON.parse(data)
    const keys = Object.keys(dataObj)
    if (keys && keys.length > 0) return dataObj[keys[0]]
  }

  return undefined
}

function getCurrentWeekStart() {
  // 获取当前日期
  const now = new Date()

  // 获取当前日期是本周的第几天（0是周日，1是周一，...，6是周六）
  const dayOfWeek = now.getDay()

  // 计算本周的起始日期（周一）
  // 如果今天是周一，则起始日期就是今天，否则需要减去相应的天数
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)) // 处理周日的情况

  // 返回起始日期和结束日期
  return startOfWeek
}

// T-13--T-6的
const getSomeDay = (num = 0, isEnd = false) => {
  // 获取本周的周一
  const weekRange = getCurrentWeekStart()

  var actionDate = new Date(weekRange)
  // 减去N天
  actionDate.setDate(actionDate.getDate() - num)

  const year = actionDate.getFullYear()
  const month = ('0' + (actionDate.getMonth() + 1)).slice(-2)
  const day = ('0' + actionDate.getDate()).slice(-2)
  const endStr = isEnd ? ' 23:59:59' : ' 00:00:00'
  return `${year}-${month}-${day}` + endStr
}

// 时间转换
const timeFormat = (dateStr) => {
  // 定义日期字符串
  // var dateStr = '	2024-9-1 0:00:00'

  // 将日期字符串转换为Date对象
  // 注意：这里假设日期字符串是按照当地时间给出的，如果是UTC时间，应该使用Date.UTC()或添加时区信息
  var dateObj = new Date(dateStr.replace(/-/g, '-')) // Safari不支持直接解析这种格式的日期字符串，所以使用replace来确保兼容性

  // 获取Unix时间戳（秒）
  // 对于当地时间，getTime()返回的是毫秒数，所以需要除以1000
  var unixTimestamp = Math.floor(dateObj.getTime() / 1000)

  return unixTimestamp
}

// 读取account_id_list
const account_id_list = getLocalStorage('root_life_account_id')
const start_date = timeFormat(getSomeDay(13, false))
const flag_date = getSomeDay(6, true)
const end_date = timeFormat(flag_date)

// 判断是否触发逻辑
const isTrigger = () => {
  const endTime = localStorage.getItem('download_bill_end_date')
  if (!endTime) {
    return true
  }

  const time1 = new Date(flag_date) // 当前日期
  const time2 = new Date(endTime) // 记录日期
  console.log('time1', getFormatterDay(time1))
  console.log('time2', getFormatterDay(time2))
  if (time1.getTime() > time2.getTime()) {
    console.log('time3', '大')
    return true
  }
  console.log('time4', '小')
  return false
}

// 导出账单的地址
//const loadUrl = `https://life.douyin.com/life/settle/v1/bill/download_bill_async/?account_id_list=${account_id_list}&start_date=${start_date}&end_date=${end_date}&biz_type=1&access=%7B%22need_statices%22:true,%22need_detail%22:true,%22need_date_statices%22:true,%22need_zero_bill%22:true%7D&from_app=false&biz_type_list=[1]&root_life_account_id=${account_id_list}`
const loadUrl = `https://life.douyin.com/life/trade_view/v1/verify/download/verify_record_list/?industry=industry_common&root_life_account_id=${account_id_list}`
const param = {
  filter: {
    start_time: start_date,
    end_time: end_date,
    poi_id_list: [],
    sku_id_list: [],
    product_option: [],
    is_market: false,
    is_market_poi: false,
  },
  is_user_poi_filter: false,
  is_expend_to_poi: true,
  auth_poi_extra_filter: {},
  industry: 'industry_common',
  config_info_list: [],
  from_app: false,
  permission_common_param: {},
}

// // 绑定这个事件需要在 manifest 中设定 "run_at": "document_start"
// document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false)

// 绑定这个事件需要在 manifest 中设定 "run_at": "document_start"
document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false)

function fireContentLoadedEvent() {
  const s = document.createElement('script')
  s.src = chrome.runtime.getURL('src/xhs/rewriteXhr.js')

  const head = document.head
  console.log(head.firstChild)

  if (head.firstChild) {
    head.insertBefore(s, head.firstChild)
  } else {
    head.appendChild(s)
  }
}

// 子菜单操作
const subMenuEvent = (element) => {
  if (
    !element ||
    !element.parentElement ||
    !element.parentElement.parentElement
  ) {
    return
  }

  const subMenus = element.parentElement.parentElement.getElementsByClassName(
    'life-core-menu-item-2'
  )
  console.log('subMenus', subMenus)
  if (subMenus && subMenus.length > 0) {
    for (let i = 0; i < subMenus.length; i++) {
      if (subMenus[i].textContent.includes('核销明细')) {
        subMenus[i].click()
        break
      }
    }
  }
}

// // 导出账单的表单操作
// const billForm = (btnExtra) => {
//   const form = document.getElementsByClassName(
//     'byted-modal-content-inner-wrapper'
//   )

//   if (!form || form.length === 0) {
//     return
//   }
//   for (let i = 0; i < form.length; i++) {
//     const spanElement = form[i].getElementsByTagName('span')

//     if (spanElement && spanElement.length > 0) {
//       for (let i = 0; i < spanElement.length; i++) {
//         if (spanElement[i].innerText.includes('订单类型')) {
//           const parent = spanElement[i].parentElement
//           if (parent) {
//             const nextElement = parent.nextElementSibling
//             console.log('nextElement', nextElement)
//             if (nextElement) {
//               const checkboxElements = nextElement.getElementsByTagName('input')
//               console.log('checkboxElements', checkboxElements)
//               if (checkboxElements && checkboxElements.length > 0) {
//                 checkboxElements[0].click()

//                 fetch(loadUrl)
//                   .then(() => {
//                     if (btnExtra) {
//                       localStorage.setItem(
//                         'download_bill_end_date',
//                         getSomeDay(6, true)
//                       )
//                       btnExtra.click()
//                     }
//                   })
//                   .catch((error) => {
//                     console.error(
//                       'There has been a problem with your fetch operation:',
//                       error
//                     )
//                     // 可以在这里添加用户反馈机制
//                   })
//               }
//             }
//           }
//           break
//         }
//       }
//     }
//   }
// }

// 触发导出接口
const triggerExport = (btnExtra) => {
  fetch(loadUrl, {
    method: 'POST', // 指定为POST请求
    body: JSON.stringify(param), // 将数据转换为JSON字符串并作为请求体发送
  })
    .then(() => {
      if (btnExtra) {
        localStorage.setItem('download_bill_end_date', flag_date)
        btnExtra.click()
      }
    })
    .catch((error) => {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      )
      // 可以在这里添加用户反馈机制
    })
}

// 发送代码
function sendDownloadUrl(url) {
  // 这里调用后端接口
  console.log('body', body)
  fetch(postUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: url,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error))
}

window.addEventListener('message', function (event) {
  if (
    event.data &&
    event.data.type &&
    event.data.type === 'inject_message_settleDownload'
  ) {
    const endTime = localStorage.getItem('download_bill_end_date')
    try {
      const isDownload = localStorage.getItem('download_bill_download')
      console.log('isDownload', isDownload, endTime)
      if (!isDownload || endTime !== isDownload) {
        setTimeout(() => {
          console.log('settleDownload', 'inject_message_settleDownload')
          const btnElements = document.getElementsByClassName('bt--q2Xcs')

          if (btnElements && btnElements.length > 0) {
            for (let i = 0; i < btnElements.length; i++) {
              if (btnElements[i].textContent.includes('下载')) {
                btnElements[i].click()
                localStorage.setItem('download_bill_download', endTime)
                break
              }
            }
          }
        }, 700)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (!isTrigger()) {
    return
  }

  if (
    event.data &&
    event.data.type &&
    event.data.type === 'inject_message_menusJson'
  ) {
    try {
      setTimeout(() => {
        const elements = document.getElementsByClassName(
          'life-core-submenu-header'
        )
        console.log('menusJson', elements)
        if (elements && elements.length > 0) {
          for (let i = 0; i < elements.length; i++) {
            if (elements[i].textContent.includes('订单管理')) {
              elements[i].click()
              subMenuEvent(elements[i])
              break
            }
          }
        }
      }, 700)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (
    event.data &&
    event.data.type &&
    event.data.type === 'inject_message_queryStatistics'
  ) {
    try {
      let btnAction = undefined
      setTimeout(() => {
        const btnElements = document.getElementsByClassName(
          'byted-can-input-grouped'
        )

        if (btnElements && btnElements.length > 0) {
          for (let i = 0; i < btnElements.length; i++) {
            if (btnElements[i].textContent.includes('导出记录')) {
              btnAction = btnElements[i]
              break
            }
          }

          for (let i = 0; i < btnElements.length; i++) {
            if (btnElements[i].textContent.includes('导出数据')) {
              btnElements[i].click()
              triggerExport(btnAction)
              break
            }
          }
        }
      }, 700)
    } catch (error) {
      console.error('Error:', error)
    }
  }
})
