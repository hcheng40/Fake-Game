class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload() {
        // load images/tile sprites
        this.load.image('map', './assets/map.png')
        this.load.image('map2', './assets/map2.png')
        this.load.image('ground', './assets/ground.png')
        this.load.image('cloud1', './assets/cloud1.png')
        this.load.image('cloud2', './assets/cloud2.png')
        this.load.image('cloud3', './assets/cloud3.png')
        this.load.image('wood1', './assets/wood1.png')
        this.load.image('wood2', './assets/wood2.png')
        this.load.image('pipe1', './assets/pipe1.png')
        this.load.image('hybrid1', './assets/hybrid1.png')
        this.load.image('hybrid', './assets/hybrid.png')
        this.load.image('bullet', './assets/bullet2.png')
        this.load.image('menuBackground', './assets/menuBackground.png')

        // load spritesheet
        this.load.spritesheet('healthbar', './assets/healthbar.png', {
            frameWidth: 23,
            frameHeight: 107,
            startFrame: 0,
            endFrame: 4
        })
        this.load.spritesheet('apple', './assets/apple.png', {
            frameWidth: 225,
            frameHeight: 207,
            startFrame: 0,
            endFrame: 1
        })
        this.load.spritesheet('peach', './assets/peach.png', {
            frameWidth: 173,
            frameHeight: 210,
            startFrame: 0,
            endFrame: 1
        })
        this.load.spritesheet('bird', './assets/bird.png', {
            frameWidth: 159,
            frameHeight: 61,
            startFrame: 0,
            endFrame: 1
        })
        this.load.spritesheet('Candace', './assets/candace.png', {
            frameWidth: 437,
            frameHeight: 521,
            startFrame: 0,
            endFrame: 10
        })

        // load audio
        this.load.audio('jump-sfx', './assets/jump.wav')
        this.load.audio('shot-sfx', './assets/shot.wav')
        this.load.audio('hurt-sfx', './assets/hurt.wav')
        this.load.audio('score-sfx', './assets/score.wav')
        this.load.audio('gameover-sfx', './assets/gameover.wav')
        this.load.audio('select-sfx', './assets/select.wav')
        // this.load.audio('music-sfx', './assets/music.wav')
    }

    create() {
        // background
        // this.menuBackground = this.add.image(0, 0, game.config.width, game.config.height, 'menubackground').setOrigin(0)

        let menuConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '34px',
            fontStyle: 'bold',
            color: '#FFFFFF',
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
        menuConfig.fontSize = '80px'
        this.add.text(game.config.width / 2, game.config.height / 2 - 150, "Jump N' Duck", menuConfig).setOrigin(0.5)


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


        // candace animation
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
