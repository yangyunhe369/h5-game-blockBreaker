/* by：弦云孤赫——David Yang
** github - https://github.com/yangyunhe369
*/
// 游戏主要运行逻辑
class Game {
  constructor (main) {
    let g = {
      main: main,                                                   // 游戏主函数
      actions: {},                                                  // 记录按键动作
      keydowns: {},                                                 // 记录按键keycode
      state: 1,                                                     // 游戏状态值，初始默认为1
      state_START: 1,                                               // 开始游戏
      state_RUNNING: 2,                                             // 游戏开始运行
      state_STOP: 3,                                                // 暂停游戏
      state_GAMEOVER: 4,                                            // 游戏结束
      state_UPDATE: 5,                                              // 游戏通关
      canvas: document.getElementById("canvas"),                    // canvas元素
      context: document.getElementById("canvas").getContext("2d"),  // canvas画布
      timer: null,                                                  // 轮询定时器
      fps: main.fps,                                                // 动画帧数，默认60
    }
    Object.assign(this, g)
  }
  // 绘制页面所有素材
  draw (paddle, ball, blockList, score) {
    let g = this
    // 清除画布
    g.context.clearRect(0, 0, g.canvas.width, g.canvas.height)
    // 绘制背景图
    g.drawBg()
    // 绘制挡板
    g.drawImage(paddle)
    // 绘制小球
    g.drawImage(ball)
    // 绘制砖块
    g.drawBlocks(blockList)
    // 绘制分数
    g.drawText(score)
  }
  // 绘制图片
  drawImage (obj) {
    this.context.drawImage(obj.image, obj.x, obj.y)
  }
  // 绘制背景图
  drawBg () {
    let bg = imageFromPath(allImg.background)
    this.context.drawImage(bg, 0, 0)
  }
  // 绘制所有砖块
  drawBlocks (list) {
    for (let item of list) {
      this.drawImage(item)
    }
  }
  // 绘制计数板
  drawText (obj) {
    this.context.font = '24px Microsoft YaHei'
    this.context.fillStyle = '#fff'
    // 绘制分数
    this.context.fillText(obj.text + obj.allScore, obj.x, obj.y)
    // 绘制关卡
    this.context.fillText(obj.textLv + obj.lv, this.canvas.width - 100, obj.y)
  }
  // 游戏结束
  gameOver () {
    // 清除定时器
    clearInterval(this.timer)
    // 清除画布
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // 绘制背景图
    this.drawBg()
    // 绘制提示文字
    this.context.font = '48px Microsoft YaHei'
    this.context.fillStyle = '#fff'
    this.context.fillText('游戏结束', 404, 226)
  }
  // 游戏晋级
  goodGame () {
    // 清除定时器
    clearInterval(this.timer)
    // 清除画布
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // 绘制背景图
    this.drawBg()
    // 绘制提示文字
    this.context.font = '48px Microsoft YaHei'
    this.context.fillStyle = '#fff'
    this.context.fillText('恭喜晋级下一关卡', 308, 226)
  }
  // 游戏通关
  finalGame () {
    // 清除定时器
    clearInterval(this.timer)
    // 清除画布
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // 绘制背景图
    this.drawBg()
    // 绘制提示文字
    this.context.font = '48px Microsoft YaHei'
    this.context.fillStyle = '#fff'
    this.context.fillText('恭喜通关全部关卡', 308, 226)
  }
  // 注册事件
  registerAction (key, callback) {
    this.actions[key] = callback
  }
  // 小球碰撞砖块检测
  checkBallBlock (g, paddle, ball, blockList, score) {
    let p = paddle, b = ball
    // 小球碰撞挡板检测
    if (p.collide(b)) {
      // 当小球运动方向趋向挡板中心时，Y轴速度取反，反之则不变
      if (Math.abs(b.y + b.h/2 - p.y + p.h/2) > Math.abs(b.y + b.h/2 + b.speedY - p.y + p.h/2)) {
        b.speedY *= -1
      } else {
        b.speedY *= 1
      }
      // 设置X轴速度
      b.speedX = p.collideRange(b)
    }
    // 小球碰撞砖块检测
    blockList.forEach(function (item, i, arr) {
      if (item.collide(b)) { // 小球、砖块已碰撞
        if (!item.alive) { // 砖块血量为0时，进行移除
          arr.splice(i, 1)
        }
        // 当小球运动方向趋向砖块中心时，速度取反，反之则不变
        if ((b.y < item.y && b.speedY < 0) || (b.y > item.y && b.speedY > 0)) {
          if (!item.collideBlockHorn(b)) {
            b.speedY *= -1
          } else { // 当小球撞击砖块四角时，Y轴速度不变
            b.speedY *= 1
          }
        } else {
          b.speedY *= 1
        }
        // 当小球撞击砖块四角时，X轴速度取反
        if (item.collideBlockHorn(b)) {
          b.speedX *= -1
        }
        // 计算分数
        score.computeScore()
      }
    })
    // 挡板移动时边界检测
    if (p.x <= 0) { // 到左边界时
      p.isLeftMove = false
    } else {
      p.isLeftMove = true
    }
    if (p.x >= 1000 - p.w) { // 到右边界时
      p.isRightMove = false
    } else {
      p.isRightMove = true
    }
    // 移动小球
    b.move(g)
  }
  // 设置逐帧动画
  setTimer (paddle, ball, blockList, score) {
    let g = this
    let main = g.main
    g.timer = setInterval(function () {
      // actions集合
      let actions = Object.keys(g.actions)
      for (let i = 0; i < actions.length; i++) {
        let key = actions[i]
        if(g.keydowns[key]) {
          // 如果按键被按下，调用注册的action
          g.actions[key]()
        }
      }
      // 当砖块数量为0时，挑战成功
      if (blockList.length == 0) {
        if (main.LV === main.MAXLV) { // 最后一关通关
          // 升级通关
          g.state = g.state_UPDATE
          // 挑战成功，渲染通关场景
          g.finalGame()
        } else { // 其余关卡通关
          // 升级通关
          g.state = g.state_UPDATE
          // 挑战成功，渲染下一关卡场景
          g.goodGame()
        }
      }
      // 判断游戏是否结束
      if (g.state === g.state_GAMEOVER) {
        g.gameOver()
      }
      // 判断游戏开始时执行事件
      if (g.state === g.state_RUNNING) {
        g.checkBallBlock(g, paddle, ball, blockList, score)
        // 绘制游戏所有素材
        g.draw(paddle, ball, blockList, score)
      } else if (g.state === g.state_START){
        // 绘制游戏所有素材
        g.draw(paddle, ball, blockList, score)
      }
    }, 1000/g.fps)
  }
  /**
   * 初始化函数
   */
  init () {
    let g = this,
        paddle = g.main.paddle,
        ball = g.main.ball,
        blockList = g.main.blockList,
        score = g.main.score
    // 设置键盘按下及松开相关注册函数
    window.addEventListener('keydown', function (event) {
     g.keydowns[event.keyCode] = true
    })
    window.addEventListener('keyup', function (event) {
      g.keydowns[event.keyCode] = false
    })
    g.registerAction = function (key, callback) {
      g.actions[key] = callback
    }
    // 注册左方向键移动事件
    g.registerAction('37', function(){
      // 判断游戏是否处于运行阶段
      if (g.state === g.state_RUNNING && paddle.isLeftMove) {
        paddle.moveLeft()
      }
    })
    // 注册右方向键移动事件
    g.registerAction('39', function(){
      // 判断游戏是否处于运行阶段
      if (g.state === g.state_RUNNING && paddle.isRightMove) {
        paddle.moveRight()
      }
    })
    window.addEventListener('keydown', function (event) {
      switch (event.keyCode) {
        // 注册空格键发射事件
        case 32 :
          if (g.state === g.state_GAMEOVER) { // 游戏结束时
            // 开始游戏
            g.state = g.state_START
            // 初始化
            g.main.start()
          } else { 
            // 开始游戏
            ball.fired = true
            g.state = g.state_RUNNING
          }
          break
        // N 键进入下一关卡
        case 78 :
          // 游戏状态为通关，且不为最终关卡时
          if (g.state === g.state_UPDATE && g.main.LV !== g.main.MAXLV) { // 进入下一关
            // 开始游戏
            g.state = g.state_START
            // 初始化下一关卡
            g.main.start(++g.main.LV)
          }
          break
        // P 键暂停游戏事件
        case 80 :
          g.state = g.state_STOP
          break
      }
    })
    // 设置轮询定时器
    g.setTimer(paddle, ball, blockList, score)
  }
}