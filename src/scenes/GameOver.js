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
        keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)

        // showing credits or not
        this.showCredits = false

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
        this.pressKeyText = this.add.text(game.config.width / 2, game.config.height / 2 + 400, 'Press (R) to restart or (M) to the menu', scoreConfig).setOrigin(0.5)
    
        scoreConfig.fontSize = '35px'
        this.pressKeyCredits = this.add.text(game.config.width / 2 + 400, game.config.height / 2 + 300, 'Press (C) to see credits', scoreConfig).setOrigin(0.5)
        
        // credits
        this.creditsRec = this.add.rectangle(0, 0, game.config.width, game.config.height, '#000000').setOrigin(0).setDepth(1).setAlpha(0.85).setVisible(false)
        scoreConfig.fontSize = '70px'
        scoreConfig.color = '#FFFFFF'
        scoreConfig.strokeThickness = 0
        this.credits = this.add.text(game.config.width / 2, game.config.height / 2 - 360, 'CREDITS', scoreConfig).setOrigin(0.5).setDepth(2).setVisible(false)
        scoreConfig.fontSize = '35px'
        this.creditsText = this.add.text(game.config.width / 2, game.config.height / 2 + 50, 'Music:\nhttps://www.fesliyanstudios.com/royalty-free-music\n\nCode reference:\nhttps://phaser.io/examples/v3.85.0\nhttps://github.com/nathanaltice\n\nFake game source:\nhttps://www.youtube.com/watch?v=zr_r2duvxic\n\nSound effects:\nhttps://sfxr.me\n\nImages:\nhttps://phineasandferb.fandom.com/wiki/Gaming_the_System', scoreConfig).setOrigin(0.5).setDepth(2).setVisible(false)
        this.pressKeyReturn = this.add.text(game.config.width / 2 + 400, game.config.height / 2 + 450, 'Press (C) to return', scoreConfig).setOrigin(0.5).setDepth(2).setVisible(false)
    }

    update() {
        // restart
        if (Phaser.Input.Keyboard.JustDown(keyR) && !this.showCredits) {
            this.scene.start('playScene')
        }
        // to menu
        if (Phaser.Input.Keyboard.JustDown(keyM) && !this.showCredits) {
            this.scene.start('menuScene')
        }
        // credits
        if (Phaser.Input.Keyboard.JustDown(keyC)) {
            this.gameOverText.visible = !this.gameOverText.visible
            this.scoreText.visible = !this.scoreText.visible
            this.pressKeyText.visible = !this.pressKeyText.visible
            this.pressKeyCredits.visible = !this.pressKeyCredits.visible
            this.creditsRec.visible = !this.creditsRec.visible
            this.credits.visible = !this.credits.visible
            this.creditsText.visible = !this.creditsText.visible
            this.pressKeyReturn.visible = !this.pressKeyReturn.visible
            this.showCredits = !this.showCredits
        }
    }
}