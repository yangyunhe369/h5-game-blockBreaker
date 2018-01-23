/* by：弦云孤赫——David Yang
** github - https://github.com/yangyunhe369
*/
// 封装打印日志方法
const log = console.log.bind(console)
// 生成图片对象方法
const imageFromPath = function (src) {
  let img = new Image()
  img.src = './images/' + src
  return img
}
// 检测页面不可见时自动暂停游戏方法
const isPageHidden = function (game) {
  let hiddenProperty = 'hidden' in document ? 'hidden' :    
      'webkitHidden' in document ? 'webkitHidden' :    
      'mozHidden' in document ? 'mozHidden' :    
      null
  let visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange')
  // 监听页面是否可见事件
  document.addEventListener(visibilityChangeEvent, function () {
    if (!document[hiddenProperty]) {  // 可见状态
      setTimeout(function () {
        game.state = game.state_RUNNING
      }, 100)
    } else { // 不可见状态
      game.state = game.state_STOP
    }
  })
}
// 图片素材路径
const allImg = {
  background: 'background.jpg',
  paddle: 'paddle.png',
  ball: 'ball.png',
  block1: 'block001.png',
  block2: 'block002.png',
}