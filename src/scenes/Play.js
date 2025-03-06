class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        console.log(game.gameMode)
        // variables and settings
        this.JUMP_VELOCITY = -1250
        this.MOVE_VELOCITY = 400
        this.physics.world.gravity.y = 3500
        this.isMoving = false
        this.isFiring = false
        this.isDucking = false
        this.canJumpAgain = false
        this.start = false
        this.justTakeDamage = false
        this.fullHealth = false
        this.spawnRange = 300
        this.direction = 0  // 0: right, 1: left
        this.enemySpeed = 120

        this.score = 0
        this.health = 100
        this.gameOver = false
        this.enemyReactTimer = 145
    }

    create() {
        // different game mode
        if (game.gameMode == 'Mode1') {

            // background
            this.map = this.add.image(0, 0, 'map').setOrigin(0)

            // bgm
            // this.bgm = this.sound.add('bgm', { loop: true })
            // this.bgm.play()

            // platforms
            this.plats = this.add.group()
            // low
            this.createPlatform(300, 1350, 'wood2').setDepth(1)
            this.createPlatform(600, 1200, 'wood2').setDepth(1)
            this.createPlatform(1000, 1100, 'wood2').setDepth(1)
            this.createPlatform(1500, 1000, 'wood2').setDepth(1)
            this.createPlatform(2000, 900, 'wood2').setDepth(1)
            this.createPlatform(2500, 850, 'wood2').setDepth(1)
            // mid
            this.createPlatform(800, 800, 'hybrid', 0.5).setDepth(1)
            this.createPlatform(1400, 700, 'hybrid', 0.5).setDepth(1)
            this.createPlatform(1800, 600, 'hybrid', 0.5).setDepth(1)
            this.createPlatform(2300, 550, 'hybrid', 0.5).setDepth(1)
            // high
            this.createPlatform(400, 500, 'pipe1').setDepth(1)
            this.createPlatform(1000, 400, 'pipe1').setDepth(1)
            this.createPlatform(1700, 300, 'pipe1').setDepth(1)
            this.createPlatform(2200, 250, 'pipe1').setDepth(1)


            // character
            this.chr = this.physics.add.sprite(150, this.map.height - 200, '').setScale(2.5).setDepth(2)
            this.chrBodySizeX = this.chr.width * 0.6
            this.chrBodySizeY = this.chr.height
            this.chr.body.setSize(this.chrBodySizeX, this.chrBodySizeY).setCollideWorldBounds(true)

        } else if (game.gameMode == 'Mode2') {
            // codes
        } else {
            console.log('Hacker')
        }

        // clouds
        this.cloud1 = this.physics.add.sprite(this.map.width - 90, this.map.height - 900, 'cloud1').setScale(2.5).setDepth(0)
        this.cloud2 = this.physics.add.sprite(this.map.width - 150, this.map.height - 600, 'cloud2').setScale(3).setDepth(0)
        this.cloud3 = this.physics.add.sprite(this.map.width - 600, this.map.height - 300, 'cloud3').setScale(3).setDepth(0)
        this.cloud1.body.setAllowGravity(false).setVelocityX(-100)
        this.cloud2.body.setAllowGravity(false).setVelocityX(-170)
        this.cloud3.body.setAllowGravity(false).setVelocityX(-130)

        // ground
        this.ground = this.add.group()
        for (let i = -500; i < this.map.width + 500; i += 32) {
            let groundTile = this.physics.add.sprite(i, this.map.height - 32, 'ground').setOrigin(0)
            groundTile.body.immovable = true
            groundTile.body.allowGravity = false
            this.ground.add(groundTile)
        }

        // enemy animation
        this.anims.create({
            key: 'apples',
            frames: this.anims.generateFrameNumbers('apple', { start: 0, end: 1, first: 0 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'peaches',
            frames: this.anims.generateFrameNumbers('peach', { start: 0, end: 1, first: 0 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'birds',
            frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 1, first: 0 }),
            frameRate: 8,
            repeat: -1
        })

        // Create enemy group
        this.enemies = this.physics.add.group()
        this.enemies_bird = this.physics.add.group()
        this.addApple(game.gameMode, true)
        this.addPeach(game.gameMode, true)

        // auto spawn enemies
        if (game.gameMode == 'Mode1') {
            this.numEnemy = 40
        } else {
            this.numEnemy = 20
        }
        this.time.addEvent({
            delay: 4000,
            loop: true,
            callback: () => {
                if (this.enemies.countActive(true) < this.numEnemy && this.start == true) {
                    if (Phaser.Math.Between(0, 1) == 0) {
                        this.addApple(game.gameMode)
                    } else {
                        this.addPeach(game.gameMode)
                    }
                }
            }
        })
        this.time.addEvent({
            delay: 6000,
            loop: true,
            callback: () => { this.addBird() }
        })

        // cameras
        this.cameras.main.setBounds(0, 0, this.map.width, this.map.height).startFollow(this.chr, false, 0.5, 0.1)
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
        this.healthBar = this.add.sprite(0, 0, 'healthbar').setFrame(0).setVisible(false)

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
        this.physics.add.collider(this.chr, this.plats)
        this.physics.add.collider(this.enemies, this.plats)

        // check if overlap with enemies
        this.physics.add.overlap(this.chr, this.enemies, () => { this.takeDamage() })
        this.physics.add.overlap(this.chr, this.enemies_bird, () => { this.takeDamage() })

        // speed increase after 15 seconds
        // this.clock = this.time.addEvent({ delay: 3000, callback: this.onEvent, callbackScope: this, loop: true })


        // debug key listener (bind to D key)
        this.input.keyboard.on('keydown-D', function () {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)
    }

    update() {
        if (!this.start) { return }

        // clouds
        this.physics.world.wrap(this.cloud1, this.cloud1.width / 2)
        this.physics.world.wrap(this.cloud2, this.cloud2.width / 2)
        this.physics.world.wrap(this.cloud3, this.cloud3.width / 2)

        // jump
        if (Phaser.Input.Keyboard.JustDown(keyUP) && this.chr.body.touching.down) {
            this.chr.body.velocity.y = this.JUMP_VELOCITY
            this.canJumpAgain = false
        }
        if (this.chr.body.touching.down && !keyUP.isDown) {
            this.canJumpAgain = true
        }

        // duck
        if (game.gameMode == 'Mode1') {
            if (keyDOWN.isDown && this.chr.body.touching.down) {
                if (!this.isDucking) {
                    this.isDucking = true
                    // this.chr.setFrame(1)
                    this.chr.body.setSize(this.chrBodySizeX, this.chrBodySizeY * 0.5)
                    this.chr.body.setOffset((this.chr.width - this.chrBodySizeX) / 2, this.chr.height * 0.5)
                    this.chr.body.velocity.x = 0
                }
            } else if (this.isDucking) {
                this.isDucking = false
                // this.chr.setFrame(0)
                this.chr.body.setSize(this.chrBodySizeX, this.chrBodySizeY)
                this.chr.body.setOffset((this.chr.width - this.chrBodySizeX) / 2, 0)
            }
        }

        if (!this.isMoving) {
            this.chr.body.velocity.x = 0
        }

        // left/right movement
        if (keyLEFT.isDown && keyRIGHT.isDown && !this.isMoving && !this.isDucking) {
            this.isMoving = true
        } else if (keyLEFT.isDown && !this.isMoving && !this.isDucking) {
            this.chr.body.velocity.x -= this.MOVE_VELOCITY
            this.isMoving = true
            this.direction = 1
        } else if (keyRIGHT.isDown && !this.isMoving && !this.isDucking) {
            this.chr.body.velocity.x += this.MOVE_VELOCITY
            this.isMoving = true
            this.direction = 0
        }
        if (!keyLEFT.isDown || !keyRIGHT.isDown) {
            this.isMoving = false
        }

        // enemy movement
        if (game.gameMode == 'Mode1') {
            if (this.start) {
                this.enemies.children.iterate((enemy) => {
                    enemy.body.moves = true
                })
            }

            // destroy enemy that out of the map
            this.enemies.children.iterate((enemy) => {
                if (enemy && this.start) {
                    if (enemy.x >= this.map.width + 100 || enemy.x <= -100) {
                        enemy.destroy()
                    }
                }
            })
        } else if (game.gameMode == 'Mode2') {
            // enemy X movement
            if (this.enemyReactTimer > 150) {
                this.enemies.children.iterate((enemy) => {
                    if (enemy && this.start) {
                        let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.chr.x, this.chr.y)
                        let speed = 120
                        let v_x = Math.cos(angle) * speed
                        enemy.setVelocityX(v_x)
                        if (v_x < 0) {
                            enemy.setFlip(true, false)
                        } else if (v_x > 0) {
                            enemy.resetFlip()
                        }
                    }
                })
                this.enemyReactTimer = 0
            }
            this.enemyReactTimer++

            this.enemies.children.iterate((enemy) => {
                if (enemy && this.start) {
                    let justCollide = false
                    // let edgeCheckX = enemy.x + (enemy.body.velocity.x > 0 ? 15 : -15); // Check forward
                    // let edgeCheckY = enemy.y + 20; // Check slightly below enemy
                    // let frontCheckX = enemy.x + (enemy.body.velocity.x > 0 ? 20 : -20); // Slightly ahead

                    // let onEdge = !this.plats.children.entries.some(plat =>
                    //     plat.getBounds().contains(edgeCheckX, edgeCheckY)
                    // );

                    // let platformAhead = this.plats.children.entries.some(plat =>
                    //     plat.getBounds().contains(frontCheckX, enemy.y)
                    // );

                    // if ((onEdge || platformAhead) && enemy.body.touching.down) {
                    //     enemy.setVelocityY(this.JUMP_VELOCITY + 250);
                    // }
                }
            })
        }

        // health bar follows the character
        this.healthBar.x = this.chr.x - 70
        this.healthBar.y = this.chr.y - 50

        // gameover
        // if (this.gameOver) {
        //     this.sound.play('sfx-die')
        //     this.sound.play('sfx-die2')
        //     this.clock.remove()
        //     this.bgm.stop()
        //     this.scene.start('gameOverScene', { score: this.score })
        // }
    }


    // funciton to create platforms
    createPlatform(x, y, key, scale = 0.8) {
        let plat = this.physics.add.sprite(x, y, key).setScale(scale)
        plat.body.setImmovable(true)
        plat.body.allowGravity = false
        plat.body.checkCollision.down = false
        plat.body.checkCollision.left = false
        plat.body.checkCollision.right = false
        this.plats.add(plat)
        return plat
    }

    // functions to create enemies
    addApple(mode, init = false) {
        for (let i = 0; i < Phaser.Math.Between(2, 6); i++) {
            let x = Phaser.Math.Between(-500, this.map.width + 500)
            // reposition if spawn on the character
            while (x >= this.chr.x - this.spawnRange && x <= this.chr.x + this.spawnRange) {
                x = Phaser.Math.Between(-500, this.map.width + 500)
            }
            let y = 0
            if (mode == 'Mode1') {
                y = Phaser.Math.Between(-200, -500)
            } else if (mode == 'Mode2') {
                y = Phaser.Math.Between(this.map.height / 2, this.map.height - 100)
            }
            let enemy_apple = this.enemies.create(x, y, 'apple').setScale(0.4)
            enemy_apple.body.setSize(enemy_apple.width * 0.7, enemy_apple.height * 0.8)
            enemy_apple.body.setOffset((enemy_apple.width - enemy_apple.body.width) / 2, (enemy_apple.height - enemy_apple.body.height))
            if (Phaser.Math.Between(0, 1) == 0) {
                enemy_apple.setFlip(true, false)
            }
            enemy_apple.setFrame(1)
            enemy_apple.anims.play('apples')
            enemy_apple.body.moves = false
            let dir = Phaser.Math.Between(0, 1)
            if (dir == 0) {
                enemy_apple.setVelocityX(-1 * this.enemySpeed)
                enemy_apple.setFlip(true, false)
            } else {
                enemy_apple.setVelocityX(this.enemySpeed)
                enemy_apple.resetFlip()
            }
        }
    }
    addPeach(mode, init = false) {
        for (let i = 0; i < Phaser.Math.Between(2, 6); i++) {
            let x = Phaser.Math.Between(-500, this.map.width + 500)
            while (x >= this.chr.x - this.spawnRange && x <= this.chr.x + this.spawnRange) {
                x = Phaser.Math.Between(-500, this.map.width + 500)
            }
            let y = 0
            if (mode == 'Mode1') {
                y = Phaser.Math.Between(-200, -500)
            } else if (mode == 'Mode2') {
                y = Phaser.Math.Between(this.map.height / 2, this.map.height - 100)
            }
            let enemy_peach = this.enemies.create(x, y, 'peach').setScale(0.55)
            enemy_peach.body.setSize(enemy_peach.width * 0.6, enemy_peach.height * 0.8)
            enemy_peach.body.setOffset((enemy_peach.width - enemy_peach.body.width + 8) / 2, (enemy_peach.height - enemy_peach.body.height))
            if (Phaser.Math.Between(0, 1) == 0) {
                enemy_peach.setFlip(true, false)
            }
            enemy_peach.setFrame(1)
            enemy_peach.anims.play('peaches')
            enemy_peach.body.moves = false
            let dir = Phaser.Math.Between(0, 1)
            if (dir == 0) {
                enemy_peach.setVelocityX(-1 * this.enemySpeed)
                enemy_peach.setFlip(true, false)
            } else {
                enemy_peach.setVelocityX(this.enemySpeed)
                enemy_peach.resetFlip()
            }
        }
    }
    addBird() {
        for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
            let birdPath = this.add.path(this.chr.x - Phaser.Math.Between(700, 1200), this.chr.y - Phaser.Math.Between(300, 600))
            birdPath.splineTo([
                { x: this.chr.x - Phaser.Math.Between(50, 150), y: this.chr.y - Phaser.Math.Between(50, 80) },
                { x: this.chr.x + Phaser.Math.Between(350, 650), y: this.chr.y - Phaser.Math.Between(100, 400) },
                { x: birdPath.getStartPoint().x + 3000, y: -200 }
            ])
            // let graphics = this.add.graphics().lineStyle(2, 0xFFFFFF, 0.75)
            // birdPath.draw(graphics)
            let enemy_bird = this.add.follower(birdPath, birdPath.getStartPoint().x, birdPath.getStartPoint().y, 'bird').setScale(1)
            this.physics.add.existing(enemy_bird)
            enemy_bird.body.moves = false
            enemy_bird.body.setSize(enemy_bird.width * 0.9, enemy_bird.height * 0.8)
            this.enemies_bird.add(enemy_bird)
            enemy_bird.startFollow({
                duration: Phaser.Math.Between(4000, 6000),
                rotateToPath: true,
                onComplete: () => { enemy_bird.destroy() }
            })
            enemy_bird.anims.play('birds')
        }
    }

    // functions for health bar
    takeDamage() {
        if (this.health > 0 && this.justTakeDamage == false) {
            this.health -= 25
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
            this.healthBar.setVisible(true)
            this.time.addEvent({ delay: 2000, repeat: 0, callback: () => { this.healthBar.setVisible(false) } })
            console.log("hit")
            this.justTakeDamage = true
            this.time.addEvent({ delay: 2000, repeat: 0, callback: () => { this.justTakeDamage = false } })
            this.chr.setTint(0xFF0000)
            this.time.addEvent({ delay: 300, callback: () => { this.chr.clearTint() } })
        } else if (this.health <= 0) {
            this.gameOver = true
        }
    }
    // updateHealthBar() {
    //     if (this.health >= 100 && this.fullHealth == true) {
    //         this.fullHealth = false
    //         this.time.addEvent({
    //             delay: 1000, repeat: 0, callback: () => {
    //                 this.healthBarBackground.setVisible(false)
    //                 this.healthBarFill.setVisible(false)
    //             }
    //         })
    //     }
    // }
}