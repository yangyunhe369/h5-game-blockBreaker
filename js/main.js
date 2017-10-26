let _main = {
  LV: 1,                               // 初始关卡
  MAXLV: 3,                            // 最终关卡
  scene: null,                         // 场景对象
  blockList: null,                     // 所有砖块对象集合
  ball: null,                          // 小球对象
  paddle: null,                        // 挡板对象
  score: null,                         // 计分板对象
  ball_x: 491,                         // 小球默认x轴坐标
  ball_y: 432,                         // 小球默认y轴坐标
  paddle_x: 449,                       // 挡板默认x轴坐标
  paddle_y: 450,                       // 挡板默认y轴坐标
  score_x: 10,                         // 计分板默认x轴坐标
  score_y: 30,                         // 计分板默认y轴坐标
  game: null,                          // 游戏主要逻辑对象
  start: function () {
    let self = this
    /**
     * 生成场景（根据游戏难度级别不同，生成不同的砖块）
     * LV: 游戏难度级别
     */
    self.scene = new Scene(self.LV)
    // 实例化所有砖块对象集合
    self.blockList = self.scene.initBlockList()
    /**
     * 小球
     * x: x轴坐标
     * y: y轴坐标
     */
    self.ball = new Ball(self)
    /**
     * 挡板
     * x: x轴坐标
     * y: y轴坐标
     */
    self.paddle = new Paddle(self)
    /**
     * 计分板
     * x: x轴坐标
     * y: y轴坐标
     * blockList: 砖块实例化对象集合
     * blockListLen: 砖块实例化对象集合的初始数量
     */
    self.score = new Score(self)
    /**
     * 游戏主要逻辑类
     * fps: 游戏帧数
     */
    self.game = new Game(60)
    /**
     * 游戏初始化
     * paddle: 挡板
     * ball: 小球
     * blockList: 砖块集合
     * score: 计数板
     */
    self.game.init(self)
  }
}
_main.start()