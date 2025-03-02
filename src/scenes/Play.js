class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // variables and settings
        this.JUMP_VELOCITY = -1400
        this.MOVE_VELOCITY = 400
        this.physics.world.gravity.y = 3500
        this.isMoving = false
        this.isFiring = false
        this.start = false
    }

    create() {

        // background
        this.map = this.add.image(0, 0, 'map').setOrigin(0)

        // bgm
        // this.bgm = this.sound.add('bgm', { loop: true })
        // this.bgm.play()

        // clouds
        // this.cloud1 = this.add.sprite(0, 0, 'cloud').setOrigin(0)
        // this.cloud2 = this.add.sprite(0, 0, 'cloud').setOrigin(0)

        // ground
        this.ground = this.add.group()
        for (let i = -500; i < this.map.width + 500; i += 32) {
            let groundTile = this.physics.add.sprite(i, this.map.height - 32, '').setOrigin(0)
            groundTile.body.immovable = true
            groundTile.body.allowGravity = false
            this.ground.add(groundTile)
        }

        // character
        this.chr = this.physics.add.sprite(150, this.map.height - 200, '').setScale(2)
        this.chr.body.setCollideWorldBounds(true)

        // Create enemy group
        this.enemies = this.physics.add.group()
        for (let i = 0; i < Phaser.Math.Between(5, 15); i++) {
            let x = Phaser.Math.Between(-500, this.map.width + 500)
            // reposition if spawn on the character
            while (x >= 0 && x <= 500){
                x = Phaser.Math.Between(-500, this.map.width + 500)
            }
            let y = Phaser.Math.Between(this.map.height / 2, this.map.height - 100)
            let enemy = this.enemies.create(x, y, '').setScale(1.5)
        }

        // cameras
        this.cameras.main.setBounds(0, 0, this.map.width, this.map.height)
        this.cameras.main.startFollow(this.chr, false, 0.5, 0.1)
        this.physics.world.setBounds(0, 0, this.map.width, this.map.height)

        // countdown text
        let countdownConfig = {
            fontSize: '128px',
            fontStyle: 'bold',
            fill: '#000000'
        }
        this.countdownText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, '3', countdownConfig).setOrigin(0.5).setScrollFactor(0)
        let countdownList = ['3', '2', '1', 'GO!']
        let index = 0
        this.time.addEvent({
            delay: 1000, repeat: 3, callback: () => {
                index++
                this.countdownText.setText(countdownList[index])
            }
        })
        this.time.addEvent({ delay: 3500, repeat: 0, callback: () => { this.start = true } })

        // variables
        this.score = 0
        this.health = 100
        this.gameOver = false
        this.enemyTimer = 200


        // jump key
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        keyB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B)
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)


        // score text
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '40px',
            fontStyle: 'bold',
            backgroundColor: '#C18361',
            color: '#342020',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 150
        }
        // this.scoreText = this.add.text(15, 15, this.score, scoreConfig).setDepth(1)
        // this.scoreTextBorder = this.add.rectangle(8, 8, scoreConfig.fixedWidth + 14, 64, 0x5C4033).setOrigin(0).setDepth(0)


        // add collider
        this.physics.add.collider(this.chr, this.ground)
        this.physics.add.collider(this.enemies, this.ground)


        // speed increase after 15 seconds
        // this.clock = this.time.addEvent({ delay: 3000, callback: this.onEvent, callbackScope: this, loop: true })

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', function () {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)
    }

    update() {
        if (!this.start) { return }

        if (!this.isMoving) {
            this.chr.body.velocity.x = 0
        }

        // srolling clouds
        // this.cloud1.x -= game.settings.gameSpeed - 1
        // this.cloud2.x -= game.settings.gameSpeed - 2
        // if (this.cloud1.x <= 0 - this.cloud1.width * 15) {
        //     this.cloud1.x = game.config.width
        // }
        // if (this.cloud2.x <= 0 - this.cloud2.width * 12) {
        //     this.cloud2.x = game.config.width
        // }



        // jump
        if (Phaser.Input.Keyboard.JustDown(keyUP) && this.chr.body.touching.down) {
            this.chr.body.velocity.y = this.JUMP_VELOCITY
        }

        // duck
        // if (Phaser.Input.Keyboard.JustDown(keyDOWN) && this.chr.body.touching.down) {
        //     this.chr.body.velocity.y = this.JUMP_VELOCITY
        // }

        // left/right movement
        if (keyLEFT.isDown && keyRIGHT.isDown && !this.isMoving) {
            this.isMoving = true
        } else if (keyLEFT.isDown && !this.isMoving) {
            this.chr.body.velocity.x -= this.MOVE_VELOCITY
            this.isMoving = true
        } else if (keyRIGHT.isDown && !this.isMoving) {
            this.chr.body.velocity.x += this.MOVE_VELOCITY
            this.isMoving = true
        }
        if (!keyLEFT.isDown || !keyRIGHT.isDown) {
            this.isMoving = false
        }


        // enemy movement
        if (this.enemyTimer > 400) {
            this.enemies.children.iterate((enemy) => {
                if (enemy && this.start) {
                    let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.chr.x, this.chr.y)
                    let speed = 100
                    enemy.setVelocityX(Math.cos(angle) * speed)
                    // enemy.setVelocityY(Math.sin(angle) * speed)
                }
            })
            this.enemyTimer = 0
        }
        this.enemyTimer++

        // if (at the edge of the plat) {
        // enemy.setVelocityY = this.JUMP_VELOCITY
        // }
        

        // gameover
        // if (this.gameOver) {
        //     this.sound.play('sfx-die')
        //     this.sound.play('sfx-die2')
        //     this.clock.remove()
        //     this.bgm.stop()
        //     this.scene.start('gameOverScene', { score: this.score })
        // }
    }
}