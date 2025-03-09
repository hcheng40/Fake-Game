class Win extends Phaser.Scene {
    constructor() {
        super('winScene')
    }

    create() {
        // background
        this.winBackground = this.add.image(0, 0, 'win').setOrigin(0)

        // keys
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)

        // display texts
        let scoreConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '130px',
            fontStyle: 'bold',
            color: '#FF0000',
            stroke: '#000000',
            strokeThickness: 25,
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                left: 15,
                right: 15,
            },
            fixedWidth: 0
        }
        this.winText = this.add.text(game.config.width / 2, game.config.height / 2 - 150, 'You win !!', scoreConfig).setOrigin(0.5)
        scoreConfig.fontSize = '60px'
        this.add.text(game.config.width / 2, game.config.height / 2 + 400, 'Press (R) to restart or (M) to the menu', scoreConfig).setOrigin(0.5)
    }

    update() {
        // restart
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.start('playScene')
        }
        // to menu
        if (Phaser.Input.Keyboard.JustDown(keyM)) {
            this.scene.start('menuScene')
        }
    }
}