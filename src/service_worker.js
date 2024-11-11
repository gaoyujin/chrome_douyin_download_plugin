let postUrl = 'https://example.com/api'

// 发送代码
function sendDownloadUrl(url) {
  // 这里调用后端接口
  // console.log('body', body)
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

// background.js
chrome.downloads.onCreated.addListener(function (downloadItem) {
  console.log('Download created:', downloadItem)

  sendDownloadUrl(downloadItem.url)
  // 这里可以添加你希望在下载创建时执行的操作
})

chrome.downloads.onChanged.addListener(function (downloadDelta) {
  console.log('Download changed:', downloadDelta)
  // 这里可以添加你希望在下载状态变化时执行的操作
  // 比如更新UI显示下载进度、下载完成后执行某些操作等
})
