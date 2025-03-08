class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload() {
        // load assets
        this.load.path = "./assets/"

        // load images/tile sprites
        this.load.image('map', 'img/map.png')
        this.load.image('map2', 'img/map2.png')
        this.load.image('ground', 'img/ground.png')
        this.load.image('cloud1', 'img/cloud1.png')
        this.load.image('cloud2', 'img/cloud2.png')
        this.load.image('cloud3', 'img/cloud3.png')
        this.load.image('wood1', 'img/wood1.png')
        this.load.image('wood2', 'img/wood2.png')
        this.load.image('pipe1', 'img/pipe1.png')
        this.load.image('hybrid1', 'img/hybrid1.png')
        this.load.image('hybrid', 'img/hybrid.png')
        this.load.image('bullet', 'img/bullet.png')
        this.load.image('menuBackground', 'img/menuBackground.png')

        // load spritesheet
        this.load.spritesheet('healthbar', 'img/healthbar.png', {
            frameWidth: 23,
            frameHeight: 107,
            startFrame: 0,
            endFrame: 4
        })
        this.load.spritesheet('apple', 'img/apple.png', {
            frameWidth: 225,
            frameHeight: 207,
            startFrame: 0,
            endFrame: 1
        })
        this.load.spritesheet('peach', 'img/peach.png', {
            frameWidth: 173,
            frameHeight: 210,
            startFrame: 0,
            endFrame: 1
        })
        this.load.spritesheet('bird', 'img/bird.png', {
            frameWidth: 159,
            frameHeight: 61,
            startFrame: 0,
            endFrame: 1
        })
        this.load.spritesheet('Candace', 'img/candace.png', {
            frameWidth: 437,
            frameHeight: 521,
            startFrame: 0,
            endFrame: 10
        })
        this.load.spritesheet('Phineas', 'img/Phineas.png', {
            frameWidth: 640,
            frameHeight: 720,
            startFrame: 0,
            endFrame: 4
        })
        this.load.spritesheet('Buford', 'img/Buford.png', {
            frameWidth: 396,
            frameHeight: 630,
            startFrame: 0,
            endFrame: 4
        })

        // load audio
        this.load.audio('jump-sfx', 'sfx/jump.wav')
        this.load.audio('shot-sfx', 'sfx/shot.wav')
        this.load.audio('hurt-sfx', 'sfx/hurt.wav')
        this.load.audio('score-sfx', 'sfx/score.wav')
        this.load.audio('gameover-sfx', 'sfx/gameover.wav')
        this.load.audio('select-sfx', 'sfx/select.wav')
        // this.load.audio('music-sfx', 'sfx/music.wav')

    }

    create() {
        // background
        this.menuBackground = this.add.image(0, 0, 'menuBackground').setOrigin(0)

        let menuConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '34px',
            fontStyle: 'bold',
            color: '#000000',
            stroke: '#AAFFDD',
            strokeThickness: 20,
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }
        // display menu text
        this.continue = this.add.text(game.config.width / 2, game.config.height / 2 + 300, 'Press Any Key To Continue', menuConfig).setOrigin(0.5)
        this.time.addEvent({
            delay: 400, repeat: -1, callback: () => {
                this.continue.visible = !this.continue.visible
            }
        })
        menuConfig.stroke = '#FFFFFF'
        menuConfig.fontSize = '120px'
        this.add.text(game.config.width / 2, game.config.height / 2 - 270, "Jump 'N Duck", menuConfig).setOrigin(0.5)
        
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

        // Phineas animation
        this.anims.create({
            key: 'idle_Phineas',
            frames: this.anims.generateFrameNumbers('Phineas', { start: 0, end: 0, first: 0 }),
            frameRate: 15,
            repeat: -1
        })
        this.anims.create({
            key: 'jump_Phineas',
            frames: this.anims.generateFrameNumbers('Phineas', { start: 3, end: 3, first: 3 }),
            frameRate: 15,
            repeat: -1
        })
        this.anims.create({
            key: 'walk_Phineas',
            frames: this.anims.generateFrameNumbers('Phineas', { start: 1, end: 2, first: 1 }),
            frameRate: 15,
            repeat: -1
        })
        this.anims.create({
            key: 'duck_Phineas',
            frames: this.anims.generateFrameNumbers('Phineas', { start: 4, end: 4, first: 4 }),
            frameRate: 15,
            repeat: -1
        })

        // Buford animation
        this.anims.create({
            key: 'idle_Buford',
            frames: this.anims.generateFrameNumbers('Buford', { start: 0, end: 0, first: 0 }),
            frameRate: 15,
            repeat: -1
        })
        this.anims.create({
            key: 'jump_Buford',
            frames: this.anims.generateFrameNumbers('Buford', { start: 3, end: 3, first: 3 }),
            frameRate: 15,
            repeat: -1
        })
        this.anims.create({
            key: 'walk_Buford',
            frames: this.anims.generateFrameNumbers('Buford', { start: 1, end: 2, first: 1 }),
            frameRate: 15,
            repeat: -1
        })
        this.anims.create({
            key: 'duck_Buford',
            frames: this.anims.generateFrameNumbers('Buford', { start: 4, end: 4, first: 4 }),
            frameRate: 15,
            repeat: -1
        })

        // Candace animation
        this.anims.create({
            key: 'idle_Candace',
            frames: this.anims.generateFrameNumbers('Candace', { start: 0, end: 0, first: 0 }),
            frameRate: 15,
            repeat: -1
        })
        this.anims.create({
            key: 'jump_Candace',
            frames: this.anims.generateFrameNumbers('Candace', { start: 10, end: 10, first: 10 }),
            frameRate: 15,
            repeat: -1
        })
        this.anims.create({
            key: 'walk_Candace',
            frames: this.anims.generateFrameNumbers('Candace', { start: 2, end: 9, first: 2 }),
            frameRate: 15,
            repeat: -1
        })
        this.anims.create({
            key: 'fire_Candace',
            frames: this.anims.generateFrameNumbers('Candace', { start: 1, end: 1, first: 1 }),
            frameRate: 15,
            repeat: -1
        })


        this.input.keyboard.on('keydown', () => {
            game.settings = { gameSpeed: 10 }
            this.sound.play('select-sfx', { volume: 0.5 })
            this.scene.start('selectScene')
        })
    }

    update() {

    }
}
