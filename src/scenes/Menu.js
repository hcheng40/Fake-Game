class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload() {
        // load images/tile sprites
        this.load.image('map', './assets/map.png')
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
            color: '#A55424',
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
        this.add.text(game.config.width / 2, game.config.height / 2 + 20, '', menuConfig).setOrigin(0.5)
        this.add.text(game.config.width / 2, game.config.height / 2 + 65, '', menuConfig).setOrigin(0.5)

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        keyB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyA) || Phaser.Input.Keyboard.JustDown(keyB)) {
            game.settings = {
                gameSpeed: 3
            }
            this.scene.start('playScene')
        }
    }
}
