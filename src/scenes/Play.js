class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // console.log(game.gameMode)
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
        this.spawnRange = 150
        this.enemyReactTimer = 145
        this.direction = 1  // 1: facing right, -1: facing left
        this.enemySpeed = game.settings.gameSpeed * 10

        this.timeleft = 0
        this.score = 0
        this.health = 100
        this.gameOver = false
    }

    create() {
        // time remaining
        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '60px',
            fontStyle: 'bold',
            backgroundColor: '#C18361',
            color: '#342020',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                left: 10,
                right: 10
            },
            fixedWidth: 200,
            fixedHeight: 60
        }
        this.textBorder = this.add.rectangle(game.config.width / 2, 50, textConfig.fixedWidth + 15, textConfig.fixedHeight + 15, '0x5C4033').setOrigin(0.5).setDepth(3).setScrollFactor(0)

        // different game mode
        if (game.gameMode == 'Mode1') {
            // background
            if (game.selectedCharacter == 'Phineas') {
                this.map = this.add.image(0, 0, 'map3').setOrigin(0)
            } else {
                this.map = this.add.image(0, 0, 'map').setOrigin(0)
            }

            // platforms
            this.plats = this.add.group()
            // high
            this.createPlatform(2970, 200, 'pipe1')
            this.createPlatform(790, 240, 'pipe1')
            this.createPlatform(2200, 250, 'pipe1')
            this.createPlatform(2095, 250, 'pipe1')
            this.createPlatform(1700, 300, 'pipe1')
            this.createPlatform(230, 300, 'pipe1')
            this.createPlatform(2400, 380, 'pipe1')
            this.createPlatform(2850, 380, 'pipe1')
            this.createPlatform(900, 400, 'pipe1')
            this.createPlatform(1400, 405, 'pipe1')
            this.createPlatform(500, 500, 'pipe1')
            this.createPlatform(1100, 550, 'pipe1')
            // mid
            this.createPlatform(2450, 550, 'hybrid', 0.5)
            this.createPlatform(1800, 600, 'hybrid', 0.5)
            this.createPlatform(3000, 660, 'hybrid', 0.5)
            this.createPlatform(280, 700, 'pipe1')
            this.createPlatform(1400, 700, 'hybrid', 0.5)
            this.createPlatform(800, 800, 'hybrid', 0.5)
            // low
            this.createPlatform(2500, 800, 'wood2')
            this.createPlatform(-100, 880, 'wood2')
            this.createPlatform(1200, 880, 'wood1')
            this.createPlatform(1800, 900, 'wood2')
            this.createPlatform(2300, 950, 'wood1')
            this.createPlatform(430, 930, 'wood1')
            this.createPlatform(2850, 980, 'wood1')
            this.createPlatform(1400, 1000, 'wood1')
            this.createPlatform(950, 1030, 'wood2')
            this.createPlatform(200, 1050, 'wood1')
            this.createPlatform(2000, 1100, 'wood2')
            this.createPlatform(2800, 1180, 'wood2')
            this.createPlatform(1550, 1180, 'wood2')
            this.createPlatform(600, 1180, 'wood2')
            this.createPlatform(2400, 1280, 'wood2')
            this.createPlatform(1000, 1280, 'wood2')
            this.createPlatform(300, 1280, 'wood2')

            // character
            this.chr = this.physics.add.sprite(150, this.map.height - 200, game.selectedCharacter).setScale(0.25).setDepth(5).setFrame(0)
            if (game.selectedCharacter == 'Phineas') {
                this.chrBodySizeX = this.chr.width * 0.3
                this.chrBodySizeY = this.chr.height * 0.8
                this.chr.body.setSize(this.chrBodySizeX, this.chrBodySizeY).setCollideWorldBounds(true)
                this.chr.body.setOffset((this.chr.width * 0.8) / 2, this.chr.height * 0.2)
            } else {
                this.chrBodySizeX = this.chr.width * 0.5
                this.chrBodySizeY = this.chr.height * 0.9
                this.chr.body.setSize(this.chrBodySizeX, this.chrBodySizeY).setCollideWorldBounds(true)
                this.chr.body.setOffset((this.chr.width * 0.5) / 2, this.chr.height * 0.1)
            }

            // Create enemy group
            this.enemies = this.physics.add.group()
            this.enemies_bird = this.physics.add.group()
            this.addApple(game.gameMode)
            this.addPeach(game.gameMode)
            this.numEnemy = 20

            // play clock count down
            this.timeLeft = 60
            this.timeText = this.add.text(game.config.width / 2, 50, this.timeLeft, textConfig).setOrigin(0.5).setDepth(3).setScrollFactor(0)
            this.clock = this.time.addEvent({
                delay: 1000,
                callback: () => { if (this.start) { this.timeLeft-- } },
                callbackScope: this,
                repeat: -1
            })

        } else if (game.gameMode == 'Mode2') {
            // background
            this.map = this.add.image(0, 0, 'map2').setOrigin(0)

            // platforms
            this.plats = this.add.group()
            // high
            this.createPlatform(1700, 300, 'rock1', 0.39)
            this.createPlatform(2780, 300, 'rock1', 0.37)
            this.createPlatform(2400, 330, 'rock1', 0.34)
            this.createPlatform(2440, 330, 'rock1', 0.34)
            this.createPlatform(790, 340, 'rock1', 0.39)
            this.createPlatform(1300, 360, 'rock2', 0.26)
            this.createPlatform(220, 400, 'rock2', 0.26)
            this.createPlatform(2100, 400, 'rock2', 0.28)
            // mid
            this.createPlatform(490, 550, 'rock1', 0.39)
            this.createPlatform(1100, 550, 'rock1', 0.39)
            this.createPlatform(2400, 600, 'rock2', 0.28)
            this.createPlatform(280, 700, 'rock1', 0.39)
            this.createPlatform(1570, 700, 'rock2', 0.28)
            this.createPlatform(2180, 790, 'rock1', 0.38)
            this.createPlatform(750, 800, 'rock2', 0.28)
            // low
            this.createPlatform(1800, 900, 'rock2', 0.28)
            this.createPlatform(2580, 900, 'rock2', 0.28)
            this.createPlatform(410, 980, 'rock1', 0.39)
            this.createPlatform(1400, 1000, 'rock1', 0.39)
            this.createPlatform(950, 1070, 'rock2', 0.28)
            this.createPlatform(-50, 1100, 'rock2', 0.28)
            this.createPlatform(2000, 1100, 'rock2', 0.28)
            this.createPlatform(2200, 1100, 'rock1', 0.39)
            this.createPlatform(2800, 1180, 'rock2', 0.28)
            this.createPlatform(300, 1280, 'rock2', 0.28)
            this.createPlatform(1000, 1280, 'rock2', 0.28)
            this.createPlatform(2400, 1280, 'rock2', 0.28)


            // character
            this.chr = this.physics.add.sprite(150, this.map.height - 200, game.selectedCharacter).setScale(0.35).setDepth(5).setFrame(0)
            this.chrBodySizeX = this.chr.width * 0.4
            this.chrBodySizeY = this.chr.height * 0.95
            this.chr.body.setSize(this.chrBodySizeX, this.chrBodySizeY).setCollideWorldBounds(true)
            this.chr.body.setOffset((this.chr.width * 0.5) / 2, this.chr.height * 0.05 - 10)

            // Create enemy group
            this.enemies = this.physics.add.group()
            this.enemies_bird = this.physics.add.group()
            this.addApple(game.gameMode)
            this.addPeach(game.gameMode)
            this.numEnemy = 45

            // particle effects
            this.plasma = this.add.particles(0, 0, 'bullet', {
                alpha: { start: 1, end: 0, ease: 'Cubic.easeIn' },
                blendMode: Phaser.BlendModes.SCREEN,
                frequency: -1,
                lifespan: 300,
                radial: false,
                scale: { start: 1, end: 5, ease: 'Cubic.easeOut' }
            })
            // bullet group
            this.bullets = this.add.existing(new Bullets(this.physics.world, this, { name: 'bullets' }))
            this.bullets.createMultiple({
                key: 'bullet',
                quantity: 6
            })

            // check bullet and enemies collision
            this.physics.add.overlap(this.enemies, this.bullets, (enemy, bullet) => {
                const { x, y } = bullet.body.center
                enemy.destroy()
                this.score += 10
                this.heal()
                bullet.disableBody(true, true)
                this.plasma.emitParticleAt(x, y)
            })
            this.physics.add.overlap(this.enemies_bird, this.bullets, (enemy, bullet) => {
                const { x, y } = bullet.body.center
                enemy.destroy()
                this.score += 10
                this.heal()
                bullet.disableBody(true, true)
                this.plasma.emitParticleAt(x, y)
            })
            this.physics.world.on('worldbounds', (body) => { body.gameObject.onWorldBounds() })

            // score text
            this.scoreText = this.add.text(game.config.width / 2, 50, this.score, textConfig).setOrigin(0.5).setDepth(3).setScrollFactor(0)

        } else {
            console.log('Hacker')
        }
        
        // bgm
        this.bgm = this.sound.add('bgm', { loop: true, volume: 0.3, rate: 0.93 })
        this.bgm.play()

        // clouds
        this.cloud1 = this.physics.add.sprite(this.map.width - 90, this.map.height - 900, 'cloud1').setScale(2.5).setDepth(0)
        this.cloud2 = this.physics.add.sprite(this.map.width - 150, this.map.height - 600, 'cloud2').setScale(3).setDepth(0)
        this.cloud3 = this.physics.add.sprite(this.map.width - 600, this.map.height - 300, 'cloud3').setScale(3).setDepth(0)
        this.cloud1.body.setAllowGravity(false).setVelocityX(-100)
        this.cloud2.body.setAllowGravity(false).setVelocityX(-170)
        this.cloud3.body.setAllowGravity(false).setVelocityX(-130)
        this.cloud4 = this.physics.add.sprite(this.map.width / 2, this.map.height - 1100, 'cloud1').setScale(2).setDepth(0)
        this.cloud5 = this.physics.add.sprite(this.map.width - 900, this.map.height - 450, 'cloud2').setScale(3.4).setDepth(0)
        this.cloud6 = this.physics.add.sprite(this.map.width - 1850, this.map.height - 760, 'cloud3').setScale(2.8).setDepth(0)
        this.cloud4.body.setAllowGravity(false).setVelocityX(-200)
        this.cloud5.body.setAllowGravity(false).setVelocityX(-180)
        this.cloud6.body.setAllowGravity(false).setVelocityX(-110)

        // ground
        this.ground = this.add.group()
        for (let i = -500; i < this.map.width + 500; i += 32) {
            let groundTile = this.physics.add.sprite(i, this.map.height - 32, 'ground').setOrigin(0)
            groundTile.body.immovable = true
            groundTile.body.allowGravity = false
            this.ground.add(groundTile)
        }


        // auto spawn enemies
        this.time.addEvent({
            delay: 2000,
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
        this.healthBar = this.add.sprite(0, 0, 'healthbar').setScale(1.2).setFrame(0).setVisible(false).setDepth(4)

        // jump key
        keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        // add collider
        this.physics.add.collider(this.chr, this.ground)
        this.physics.add.collider(this.enemies, this.ground)
        this.physics.add.collider(this.chr, this.plats)
        this.physics.add.collider(this.enemies, this.plats)

        // check if overlap with enemies
        this.physics.add.overlap(this.chr, this.enemies, () => { this.takeDamage() })
        this.physics.add.overlap(this.chr, this.enemies_bird, () => { this.takeDamage() })

        // speed increase after 15 seconds
        this.clock = this.time.addEvent({ delay: 3000, callback: () => { game.settings.gameSpeed + 2 }, callbackScope: this, loop: true })


        // debug key listener (bind to D key)
        this.input.keyboard.on('keydown-D', function () {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)
    }

    update() {
        // only allow moving after the count down
        if (!this.start) {
            return
        } else {
            this.enemies.children.iterate((enemy) => { enemy.body.moves = true })
        }

        // clouds
        this.physics.world.wrap(this.cloud1, this.cloud1.width / 2)
        this.physics.world.wrap(this.cloud2, this.cloud2.width / 2)
        this.physics.world.wrap(this.cloud3, this.cloud3.width / 2)
        this.physics.world.wrap(this.cloud4, this.cloud1.width / 2)
        this.physics.world.wrap(this.cloud5, this.cloud2.width / 2)
        this.physics.world.wrap(this.cloud6, this.cloud3.width / 2)

        // duck
        if (game.gameMode == 'Mode1') {
            if (keyDOWN.isDown && this.chr.body.touching.down) {
                if (!this.isDucking) {
                    this.isDucking = true
                    if (game.selectedCharacter == 'Phineas') {
                        this.chr.anims.play('duck_Phineas')
                        this.chr.body.setSize(this.chrBodySizeX, this.chrBodySizeY * 0.7)
                        this.chr.body.setOffset((this.chr.width - this.chrBodySizeX) / 2, this.chr.height * 0.44)
                    } else {
                        this.chr.anims.play('duck_Buford')
                        this.chr.body.setSize(this.chrBodySizeX, this.chrBodySizeY * 0.7)
                        this.chr.body.setOffset((this.chr.width - this.chrBodySizeX) / 2, this.chr.height * 0.37)
                    }
                    this.chr.body.velocity.x = 0
                }
            } else if (this.isDucking) {
                this.isDucking = false
                if (game.selectedCharacter == 'Phineas') {
                    this.chr.anims.play('duck_Phineas')
                    this.chr.body.setSize(this.chrBodySizeX, this.chrBodySizeY)
                    this.chr.body.setOffset((this.chr.width - this.chrBodySizeX) / 2, this.chr.height * 0.4)
                } else {
                    this.chr.anims.play('duck_Buford')
                    this.chr.body.setSize(this.chrBodySizeX, this.chrBodySizeY)
                    this.chr.body.setOffset((this.chr.width - this.chrBodySizeX) / 2, 0)
                }
            }
        }

        // left/right movement
        if (keyLEFT.isDown && keyRIGHT.isDown && !this.isDucking && !this.isFiring) {
            this.isMoving = false
            this.chr.body.velocity.x = 0
            if (this.canJumpAgain) {
                if (game.selectedCharacter == 'Phineas') {
                    this.chr.anims.play('walk_Phineas', true)
                } else if (game.selectedCharacter == 'Buford') {
                    this.chr.anims.play('walk_Buford', true)
                } else {
                    this.chr.anims.play('walk_Candace', true)
                }
            }
        } else if (keyLEFT.isDown && !this.isDucking && !this.isFiring) {
            this.chr.body.velocity.x = -this.MOVE_VELOCITY
            this.isMoving = true
            this.direction = -1
            if (this.canJumpAgain) {
                if (game.selectedCharacter == 'Phineas') {
                    this.chr.anims.play('walk_Phineas', true)
                } else if (game.selectedCharacter == 'Buford') {
                    this.chr.anims.play('walk_Buford', true)
                } else {
                    this.chr.anims.play('walk_Candace', true)
                }
            }
        } else if (keyRIGHT.isDown && !this.isDucking && !this.isFiring) {
            this.chr.body.velocity.x = this.MOVE_VELOCITY
            this.isMoving = true
            this.direction = 1
            if (this.canJumpAgain) {
                if (game.selectedCharacter == 'Phineas') {
                    this.chr.anims.play('walk_Phineas', true)
                } else if (game.selectedCharacter == 'Buford') {
                    this.chr.anims.play('walk_Buford', true)
                } else {
                    this.chr.anims.play('walk_Candace', true)
                }
            }
        }
        if (!keyLEFT.isDown && !keyRIGHT.isDown && !this.isFiring && !this.isDucking) {
            this.isMoving = false
            this.chr.body.velocity.x = 0
            if (this.canJumpAgain) {
                if (game.selectedCharacter == 'Phineas') {
                    this.chr.anims.play('idle_Phineas')
                } else if (game.selectedCharacter == 'Buford') {
                    this.chr.anims.play('idle_Buford')
                } else {
                    this.chr.anims.play('idle_Candace', true)
                }
            }
        }

        // jump
        if (this.chr.body.touching.down) {
            this.canJumpAgain = true
        }
        if (Phaser.Input.Keyboard.JustDown(keyUP) && this.chr.body.touching.down) {
            this.chr.body.velocity.y = this.JUMP_VELOCITY
            this.canJumpAgain = false
            if (game.selectedCharacter == 'Phineas') {
                this.chr.anims.play('jump_Phineas')
            } else if (game.selectedCharacter == 'Buford') {
                this.chr.anims.play('jump_Buford')
            } else {
                this.chr.anims.play('jump_Candace')
            }
            this.sound.play('jump-sfx')
        }

        // flip character image
        if (this.direction < 0) {
            this.chr.setFlip(true, false)
            if (game.selectedCharacter == 'Candace') {
                this.chr.body.setOffset((this.chr.width * 0.7) / 2, this.chr.height * 0.05 - 10)
            } else if (game.selectedCharacter == 'Buford') {
                if (this.isDucking) {
                    this.chr.body.setOffset((this.chr.width * 0.5) / 2, this.chr.height * 0.37)
                } else {
                    this.chr.body.setOffset((this.chr.width * 0.5) / 2, this.chr.height * 0.1)
                }
            } else {
                if (this.isDucking) {
                    this.chr.body.setOffset((this.chr.width * 0.6) / 2, this.chr.height * 0.44)
                } else {
                    this.chr.body.setOffset((this.chr.width * 0.6) / 2, this.chr.height * 0.2)
                }
            }
        } else {
            this.chr.resetFlip()
            if (game.selectedCharacter == 'Candace') {
                this.chr.body.setOffset((this.chr.width * 0.5) / 2, this.chr.height * 0.05 - 10)
            } else if (game.selectedCharacter == 'Buford') {
                if (this.isDucking) {
                    this.chr.body.setOffset((this.chr.width * 0.5) / 2, this.chr.height * 0.37)
                } else {
                    this.chr.body.setOffset((this.chr.width * 0.5) / 2, this.chr.height * 0.1)
                }
            } else {
                if (this.isDucking) {
                    this.chr.body.setOffset((this.chr.width * 0.8) / 2, this.chr.height * 0.44)
                } else {
                    this.chr.body.setOffset((this.chr.width * 0.8) / 2, this.chr.height * 0.2)
                }
            }
        }

        // enemy movement
        if (game.gameMode == 'Mode1') {
            this.timeText.text = Math.floor(this.timeLeft)
            if (this.timeLeft <= 0) {
                this.bgm.stop()
                this.scene.start('winScene')
            }
        } else if (game.gameMode == 'Mode2') {
            // update score
            this.scoreText.text = Math.floor(this.score)
            // shooting
            if (Phaser.Input.Keyboard.JustDown(keyZ) && !this.isFiring && this.chr.body.touching.down) {
                this.isFiring = true
                this.isMoving = false
                this.chr.body.velocity.x = 0
                if (this.direction == 1) {
                    this.bullets.fire(this.chr.x + 10, this.chr.y - 15, 600, 0, this.direction)
                } else {
                    this.bullets.fire(this.chr.x - 10, this.chr.y - 15, 600, 0, this.direction)
                }
                this.chr.anims.play('fire_Candace', true)
                this.sound.play('shot-sfx')
                this.time.delayedCall(100, () => { this.isFiring = false })
            }

            // // enemy X movement
            // if (this.enemyReactTimer > 150) {
            //     this.enemies.children.iterate((enemy) => {
            //         if (enemy && this.start) {
            //             let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.chr.x, this.chr.y)
            //             let speed = 120
            //             let v_x = Math.cos(angle) * speed
            //             enemy.setVelocityX(v_x)
            //             if (v_x < 0) {
            //                 enemy.setFlip(true, false)
            //             } else if (v_x > 0) {
            //                 enemy.resetFlip()
            //             }
            //         }
            //     })
            //     this.enemyReactTimer = 0
            // }
            // this.enemyReactTimer++

            // this.enemies.children.iterate((enemy) => {
            //     if (enemy && this.start) {
            //         let justCollide = false
            //         // let edgeCheckX = enemy.x + (enemy.body.velocity.x > 0 ? 15 : -15)
            //         // let edgeCheckY = enemy.y + 20; // Check slightly below enemy
            //         // let frontCheckX = enemy.x + (enemy.body.velocity.x > 0 ? 20 : -20)

            //         // let onEdge = !this.plats.children.entries.some(plat =>
            //         //     plat.getBounds().contains(edgeCheckX, edgeCheckY)
            //         // )

            //         // let platformAhead = this.plats.children.entries.some(plat =>
            //         //     plat.getBounds().contains(frontCheckX, enemy.y)
            //         // )

            //         // if ((onEdge || platformAhead) && enemy.body.touching.down) {
            //         //     enemy.setVelocityY(this.JUMP_VELOCITY + 250)
            //         // }
            //     }
            // })
        }

        // destroy enemy outside the map
        this.enemies.children.iterate((enemy) => {
            if (enemy && this.start) {
                if (enemy.x >= this.map.width + 100 || enemy.x <= -100) {
                    enemy.destroy()
                }
            }
        })

        // health bar follows the character
        if (game.selectedCharacter == 'Phineas') {
            this.healthBar.x = this.chr.x - 100
        } else {
            this.healthBar.x = this.chr.x - 70
        }
        this.healthBar.y = this.chr.y - 50

        // gameover
        if (this.gameOver) {
            this.sound.play('gameover-sfx')
            this.bgm.stop()
            if (game.gameMode == 'Mode1') {
                this.surviveTime = 60 - this.timeLeft
                this.scene.start('gameOverScene', { score: this.surviveTime })
            } else {
                this.scene.start('gameOverScene', { score: this.score })
            }
        }
    }


    // funciton to create platforms
    createPlatform(x, y, key, scale = 0.8) {
        let plat = this.physics.add.sprite(x, y, key).setScale(scale).setDepth(1)
        plat.body.setImmovable(true)
        plat.body.allowGravity = false
        plat.body.checkCollision.down = false
        plat.body.checkCollision.left = false
        plat.body.checkCollision.right = false
        this.plats.add(plat)
        return plat
    }

    // functions to create enemies
    addApple(mode) {
        for (let i = 0; i < Phaser.Math.Between(2, 6); i++) {
            let x = Phaser.Math.Between(-500, this.map.width + 500)
            // reposition if spawn on the character
            while (x >= this.chr.x - this.spawnRange && x <= this.chr.x + this.spawnRange) {
                x = Phaser.Math.Between(-500, this.map.width + 500)
            }
            let y = 0
            y = Phaser.Math.Between(-200, -500)
            // if (mode == 'Mode1') {
            //     y = Phaser.Math.Between(-200, -500)
            // } else if (mode == 'Mode2') {
            //     y = Phaser.Math.Between(this.map.height / 2, this.map.height - 100)
            // }
            let enemy_apple = this.enemies.create(x, y, 'apple').setScale(0.4).setDepth(2)
            enemy_apple.body.setSize(enemy_apple.width * 0.6, enemy_apple.height * 0.8)
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
    addPeach(mode) {
        for (let i = 0; i < Phaser.Math.Between(2, 6); i++) {
            let x = Phaser.Math.Between(-500, this.map.width + 500)
            while (x >= this.chr.x - this.spawnRange && x <= this.chr.x + this.spawnRange) {
                x = Phaser.Math.Between(-500, this.map.width + 500)
            }
            let y = 0
            y = Phaser.Math.Between(-200, -500)
            // if (mode == 'Mode1') {
            //     y = Phaser.Math.Between(-200, -500)
            // } else if (mode == 'Mode2') {
            //     y = Phaser.Math.Between(this.map.height / 2, this.map.height - 100)
            // }
            let enemy_peach = this.enemies.create(x, y, 'peach').setScale(0.55).setDepth(2)
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
                { x: this.chr.x - Phaser.Math.Between(70, 200), y: this.chr.y - Phaser.Math.Between(110, 150) },
                { x: this.chr.x + Phaser.Math.Between(350, 650), y: this.chr.y - Phaser.Math.Between(100, 400) },
                { x: birdPath.getStartPoint().x + 3000, y: -200 }
            ])
            // let graphics = this.add.graphics().lineStyle(2, 0xFFFFFF, 0.75)
            // birdPath.draw(graphics)
            let enemy_bird = this.add.follower(birdPath, birdPath.getStartPoint().x, birdPath.getStartPoint().y, 'bird').setScale(1).setDepth(2)
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
            // console.log("hit")
            this.sound.play('hurt-sfx')
            this.justTakeDamage = true
            this.time.addEvent({ delay: 1000, repeat: 0, callback: () => { this.justTakeDamage = false } })
            this.chr.setTint(0xFF0000)
            this.time.addEvent({ delay: 300, callback: () => { this.chr.clearTint() } })
        } else if (this.health <= 0) {
            this.gameOver = true
        }
    }
    heal() {
        if (this.health < 100) {
            this.health += 25
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
            this.time.addEvent({ delay: 1500, repeat: 0, callback: () => { this.healthBar.setVisible(false) } })
            // console.log("heal")
        }
    }
}