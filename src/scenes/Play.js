class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // variables and settings
        this.JUMP_VELOCITY = -1200
        this.MOVE_VELOCITY = 400
        this.physics.world.gravity.y = 3500
        this.isMoving = false
        this.isFiring = false
        this.start = false
        this.justTakeDamage = false
        this.fullHealth = false
        this.direction = 0  // right

        this.score = 0
        this.health = 100
        this.gameOver = false
        this.enemyTimer = 200
    }

    create() {
        // background
        this.map = this.add.image(0, 0, 'map').setOrigin(0)

        // bgm
        // this.bgm = this.sound.add('bgm', { loop: true })
        // this.bgm.play()

        // clouds
        this.cloud1 = this.physics.add.sprite(this.map.width - 90, this.map.height - 900, 'cloud1').setScale(3)
        this.cloud2 = this.physics.add.sprite(this.map.width - 150, this.map.height - 600, 'cloud2').setScale(3)
        this.cloud3 = this.physics.add.sprite(this.map.width - 600, this.map.height - 300, 'cloud3').setScale(3)
        this.cloud1.body.setAllowGravity(false).setVelocityX(-100)
        this.cloud2.body.setAllowGravity(false).setVelocityX(-170)
        this.cloud3.body.setAllowGravity(false).setVelocityX(-130)

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

        // enemy animation
        this.anims.create({
            key: 'apples',
            frames: this.anims.generateFrameNumbers('apple', { start: 0, end: 1, first: 0 }),
            frameRate: 10,
            repeat: -1
        })

        // Create enemy group
        this.enemies = this.physics.add.group()
        for (let i = 0; i < Phaser.Math.Between(5, 8); i++) {
            let x = Phaser.Math.Between(-500, this.map.width + 500)
            // reposition if spawn on the character
            while (x >= 0 && x <= 500) {
                x = Phaser.Math.Between(-500, this.map.width + 500)
            }
            let y = Phaser.Math.Between(this.map.height / 2, this.map.height - 100)
            let enemy = this.enemies.create(x, y, 'apple').setScale(0.4)
            enemy.body.setSize(enemy.width * 0.7, enemy.height * 0.8)
            enemy.body.setOffset((enemy.width - enemy.body.width) / 2, (enemy.height - enemy.body.height))
            if (Phaser.Math.Between(0, 1) == 0) {
                enemy.setFlip(true, false)
            }
            enemy.setFrame(1)
            this.time.addEvent({
                delay: 4500, repeat: 0, callback: () => {
                    enemy.anims.play('apples')
                }
            })
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

        // health bar
        this.healthBar = this.add.sprite(0, 0, 'healthbar');
        this.healthBar.setFrame(0);
        this.healthBar.setVisible(false);
        this.updateHealthBar()

        // jump key
        keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
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
        this.physics.add.collider(this.chr, this.enemies, () => { this.takeDamage() })


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

        // clouds
        this.physics.world.wrap(this.cloud1, this.cloud1.width / 2)
        this.physics.world.wrap(this.cloud2, this.cloud2.width / 2)
        this.physics.world.wrap(this.cloud3, this.cloud3.width / 2)



        // jump
        if (Phaser.Input.Keyboard.JustDown(keyUP) && this.chr.body.touching.down) {
            this.chr.body.velocity.y = this.JUMP_VELOCITY
        }

        // duck
        // if (keyDOWN.isDown && this.chr.body.touching.down) {
        //     this.chr.body.celocity.x = 0
        // } else 

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
        if (this.enemyTimer > 350) {
            this.enemies.children.iterate((enemy) => {
                if (enemy && this.start) {
                    let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.chr.x, this.chr.y)
                    let speed = 100
                    let v_x = Math.cos(angle) * speed
                    enemy.setVelocityX(v_x)
                    if (v_x < 0) {
                        enemy.setFlip(true, false)
                    } else if (v_x > 0) {
                        enemy.resetFlip()
                    }
                    // enemy.setVelocityY(Math.sin(angle) * speed)
                }
            })
            this.enemyTimer = 0
        }
        this.enemyTimer++

        // update health bar
        this.updateHealthBar()


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

    // functions for health bar
    takeDamage() {
        if (this.health > 0 && this.justTakeDamage == false) {
            this.health -= 25
            this.updateHealthBar()
            this.healthBar.setVisible(true)
            this.time.addEvent({ delay: 2000, repeat: 0, callback: () => { this.healthBar.setVisible(false) } })
            console.log("hit")
            this.justTakeDamage = true
            this.time.addEvent({ delay: 2000, repeat: 0, callback: () => { this.justTakeDamage = false } })
        } else if (this.health <= 0) {
            this.gameOver = true
        }
    }
    updateHealthBar() {
        if (this.health == 100) {
            this.healthBar.setFrame(0)
        } else if (this.health == 75) {
            this.healthBar.setFrame(1)
        } else if (this.health == 50) {
            this.healthBar.setFrame(2)
        } else if (this.health == 25) {
            this.healthBar.setFrame(3)
        } else if (this.health == 0) {
            this.healthBar.setFrame(4)
        }
        this.healthBar.x = this.chr.x - 70
        this.healthBar.y = this.chr.y - 50
        if (this.health >= 100 && this.fullHealth == true) {
            this.fullHealth = false
            this.time.addEvent({
                delay: 1000, repeat: 0, callback: () => {
                    this.healthBarBackground.setVisible(false)
                    this.healthBarFill.setVisible(false)
                }
            })
        }
    }
}