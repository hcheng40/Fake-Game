class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload() {
        // load images/tile sprites
        this.load.image('map', './assets/map.png')
        this.load.image('ground', './assets/ground.png')
        this.load.image('cloud1', './assets/cloud1.png')
        this.load.image('cloud2', './assets/cloud2.png')
        this.load.image('cloud3', './assets/cloud3.png')
        


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



        // load audio
        // this.load.audio('', './assets/.wav')
    }

    create() {
        // background
        // this.Background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'menubackground').setOrigin(0)

        let menuConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '34px',
            fontStyle: 'bold',
            // backgroundColor: '#C3B594',
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
        this.add.text(game.config.width / 2, game.config.height / 2 + 20, 'Press Any Key To Start', menuConfig).setOrigin(0.5)
        this.add.text(game.config.width / 2, game.config.height / 2 + 65, '', menuConfig).setOrigin(0.5)

        this.input.keyboard.on('keydown', () => {
            game.settings = { gameSpeed: 3 };
            this.scene.start('playScene');
        })
    }

    update() {

    }
}
