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

// 读取account_id_list
const account_id_list = getLocalStorage('root_life_account_id')
const start_date = getToday(7)
const end_date = getToday()

// 判断是否触发逻辑
const isTrigger = () => {
  const endTime = localStorage.getItem('download_bill_end_date')
  if (!endTime) {
    return true
  }

  const time1 = new Date(end_date)
  const time2 = new Date(endTime)

  if (time1.getTime() > time2.getTime()) {
    return true
  }
  return false
}

// 导出账单的地址
const loadUrl = `https://life.douyin.com/life/settle/v1/bill/download_bill_async/?account_id_list=${account_id_list}&start_date=${start_date}&end_date=${end_date}&biz_type=1&access=%7B%22need_statices%22:true,%22need_detail%22:true,%22need_date_statices%22:true,%22need_zero_bill%22:true%7D&from_app=false&biz_type_list=[1]&root_life_account_id=${account_id_list}`
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
      if (subMenus[i].textContent.includes('财务对账')) {
        subMenus[i].click()
        break
      }
    }
  }
}

// 导出账单的表单操作
const billForm = (btnExtra) => {
  const form = document.getElementsByClassName(
    'byted-modal-content-inner-wrapper'
  )

  if (!form || form.length === 0) {
    return
  }
  for (let i = 0; i < form.length; i++) {
    const spanElement = form[i].getElementsByTagName('span')

    if (spanElement && spanElement.length > 0) {
      for (let i = 0; i < spanElement.length; i++) {
        if (spanElement[i].innerText.includes('订单类型')) {
          const parent = spanElement[i].parentElement
          if (parent) {
            const nextElement = parent.nextElementSibling
            console.log('nextElement', nextElement)
            if (nextElement) {
              const checkboxElements = nextElement.getElementsByTagName('input')
              console.log('checkboxElements', checkboxElements)
              if (checkboxElements && checkboxElements.length > 0) {
                checkboxElements[0].click()

                fetch(loadUrl)
                  .then(() => {
                    if (btnExtra) {
                      localStorage.setItem('download_bill_end_date', end_date)
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
            }
          }
          break
        }
      }
    }
  }
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
    try {
      setTimeout(() => {
        console.log('settleDownload', 'inject_message_settleDownload')
        const btnElements = document.getElementsByClassName('bt--q2Xcs')

        if (btnElements && btnElements.length > 0) {
          for (let i = 0; i < btnElements.length; i++) {
            if (btnElements[i].textContent.includes('下载')) {
              btnElements[i].click()
              break
            }
          }
        }
      }, 700)
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
            if (elements[i].textContent.includes('财务管理')) {
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
            if (btnElements[i].textContent.includes('查看导出记录')) {
              btnAction = btnElements[i]
              break
            }
          }

          for (let i = 0; i < btnElements.length; i++) {
            if (btnElements[i].textContent.includes('导出账单')) {
              btnElements[i].click()
              billForm(btnAction)
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
