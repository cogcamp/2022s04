var mainScene = new Phaser.Scene("mainScene");

mainScene.create = function() {
    // 初期設定を実行する
    this.config();
    
    
    // ボール作成
    this.createBall();
    
    // パドル作成
this.createPaddle();
    
    // スペースキーのクリックでボール発射
    this.input.keyboard.on('keydown-SPACE', function(event) {
        if (this.paddle.isStart) {
            this.ball.setVelocity(this.ballSpeedX, this.ballSpeedY);
        this.paddle.isStart = false;
        }
    
    },this);
    
    // ブロック作成
    this.createBlocks();
    
    // ライフのテキスト表示
    this.lifeText = this.add.text(30, 20, 'ライフ :' + this.life, {
        front: '20px Open Sans',
        fill: '#ff000'
});
};

mainScene.update = function() {
    // ボールがシーンの最下部に到達した
    if (this.ball.y >= this.game.config.height - this.ball.width / 2) {
        this.failToHit();
    }
    
    // キーボードのカーソルオブジェクトを取得
    var cursors = this.input.keyboard.createCursorKeys();
    var x = 0;
    if(cursors.right.isDown) {
        x = this.paddle.x + this.paddleSpeed;
        this.paddle.x = Phaser.Math.Clamp(x, 52, 748);
    }
    if(this.paddle.isStart) {
        this.ball.setPosition(this.paddle.x, 500);
    }
  if(cursors.left.isDown) {
      x = this.paddle.x - this.paddleSpeed
      this.paddle.x = Phaser.Math.Clamp(x, 52, 748);
  } 
  if(this.paddle.isStart){
      this.ball.setPosition(this.paddle.x, 500);
  } 
};

mainScene.config = function() {
    // 背景色の設定
    this.cameras.main.setBackgroundColor('#cccccc');
    
    // パドルの移動速度
    this.paddleSpeed = 10;
    
    // ボール発射の加速度
    this.ballSpeedX = 0;
    this.ballSpeedY = -300;
    
    // ライフ
    this.life = 3;
};

mainScene.createBall = function() {
    // ボール作成
    this.ball = this.physics.add.image(400, 500, 'ball1');
    this.ball.setDisplaySize(22,22);
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);
};

mainScene.createPaddle = function() {
     // パドル作成
     this.paddle = this.physics.add.image(400, 550, 'paddle1');
     this.paddle .setDisplaySize(104,24);
     this.paddle.setImmovable();
     this.paddle.isStart = true;
     this.physics.add.collider(this.paddle, this.ball, this.hitPaddle, null, this)
    
};

mainScene.hitPaddle = function (paddle, ball) {
    // ボールにX方向の角度を設定
    var diff = 0;
    if (ball.x < paddle.x) {
        diff = paddle.x - ball.x;
        ball.setVelocityX(-10 * diff);
    }else if (ball.x > paddle.x) {
        diff = ball.x -paddle.x;
        ball.setVelocityX(10 * diff)
    
    } else {
        ball.setVelocityX(0);
    }
};

mainScene.createBlocks = function() {
    // 横10列、縦6行並べる
    var blockColors = [ 'yellow1', 'green1', 'yellow1', 'green1', 'yellow1', 'green1' ];
    this.blocks = this.physics.add.staticGroup();
    for(var i = 0; i < 6; i++) {
        for( var j = 0; j < 10; j++) {
            var color = blockColors[i];
            var block = this.blocks.create(80 + j * 64, 80 + i * 32, color);
            block.setOrigin(0,0);
            block.setDisplaySize(64, 32);
            block.refreshBody();
        }
    }
    this.physics.add.collider(this.ball, this.blocks, this.hitBlock, null, this);
};

mainScene.hitBlock = function (ball, block) {
    // 衝突したブロックを削除
    block.destroy();
    // ブロックの残りを判定
    if (this.blocks.countActive() == 0) {}
};

mainScene.gameClear = function() {
    // ゲームクリア
    alert("おめでとうございます");
    // スタートシーンに移動
    this.scene.start("startScene");
};

mainScene.failToHit =  function () {
    // ボールを打ち返すことに失敗
    this.ball.setVelocity(0);
    this.paddle.isStart = true;
    // ライフを減らす
    this.life--;
    this.lifeText.text = 'ライフ：' + this.life;
    // ライフが0になると
    if(this.life <= 0) {
        // 0.5秒後にゲームオーバー
        this.time.addEvent({
            duration: 500,
            callback: this.gameOver,
            loop: false,
            callbackScope: this,
        });
    }
};

mainScene.gameOver = function() {
    // ゲームオーバー
    alert("Game Over");
    // スタートシーンに移動
    this.scene.start("startScene");
};
