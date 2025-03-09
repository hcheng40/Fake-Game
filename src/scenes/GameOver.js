class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene')
    }

    create(data) {
        // background
        this.gameoverBackground = this.add.image(0, 0, 'gameover').setOrigin(0)

        // keys
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)

        // get score from play scene
        this.score = data.score

        // display texts
        let scoreConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '90px',
            fontStyle: 'bold',
            color: '#000000',
            stroke: '#AAFFDD',
            strokeThickness: 20,
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                left: 15,
                right: 15,
            },
            fixedWidth: 0
        }
        this.gameOverText = this.add.text(game.config.width / 2, game.config.height / 2 - 380, 'GAMEOVER!!', scoreConfig).setOrigin(0.5)
        if (game.gameMode == 'Mode1') {
            this.scoreText = this.add.text(game.config.width / 2, game.config.height / 2 - 250, 'Survival time: ' + this.score, scoreConfig).setOrigin(0.5)
        } else {
            this.scoreText = this.add.text(game.config.width / 2, game.config.height / 2 - 250, 'SCORE: ' + this.score, scoreConfig).setOrigin(0.5)
        }
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