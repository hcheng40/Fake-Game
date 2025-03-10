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
            align: 'center'
        }

        if (game.gameMode == 'Mode1') {
            this.add.text(game.config.width / 2, game.config.width / 2 - 300, 'Use < > to move left/right\n▲ to jump\n▼ to duck', this.textConfig).setOrigin(0.5)
        } else if (game.gameMode = 'Mode2') {
            this.add.text(game.config.width / 2, game.config.width / 2 - 300, 'Use < > to move left/right\n▲ to jump\nZ to shoot', this.textConfig).setOrigin(0.5)
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