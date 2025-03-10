class Tutorial extends Phaser.Scene {
    constructor() {
        super('tutorialScene')
    }

    create() {
        // // bgm
        // this.menubgm = this.sound.add('menubgm', { loop: true, volume: 0.4, rate: 0.97 })
        // this.menubgm.play()

        // text at the top
        this.textConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '60px',
            fontStyle: 'bold',
            color: '#FFFFFF',
            align: 'left'
        }
        this.add.text(game.config.width / 2, 150, 'How to Play', this.textConfig).setOrigin(0.5)

        if (game.gameMode == 'Mode1') {
            this.add.text(game.config.width / 2 - 200, game.config.width / 2 - 390, '← : move left', this.textConfig).setOrigin(0)
            this.add.text(game.config.width / 2 - 200, game.config.width / 2 - 290, '→ : move right', this.textConfig).setOrigin(0)
            this.add.text(game.config.width / 2 - 200, game.config.width / 2 - 190, ' ↑ : jump', this.textConfig).setOrigin(0)
            this.add.text(game.config.width / 2 - 200, game.config.width / 2 - 90, ' ↓ : duck', this.textConfig).setOrigin(0)
        } else if (game.gameMode = 'Mode2') {
            this.add.text(game.config.width / 2 - 200, game.config.width / 2 - 390, '← : move left', this.textConfig).setOrigin(0)
            this.add.text(game.config.width / 2 - 200, game.config.width / 2 - 290, '→ : move right', this.textConfig).setOrigin(0)
            this.add.text(game.config.width / 2 - 200, game.config.width / 2 - 190, ' ↑ : jump', this.textConfig).setOrigin(0)
            this.add.text(game.config.width / 2 - 200, game.config.width / 2 - 90, 'Z : shoot', this.textConfig).setOrigin(0)
        }

        this.add.text(game.config.width / 2, 850, 'Press Z to Start', this.textConfig).setOrigin(0.5)

        this.input.keyboard.on('keydown-Z', () => {
            // this.menubgm.stop()
            this.scene.start('playScene')
        })
    }

    update() {

    }
}