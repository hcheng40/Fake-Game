class Select extends Phaser.Scene {
    constructor() {
        super('selectScene')
    }

    create() {
        // bgm
        this.menubgm = this.sound.add('menubgm', { loop: true, volume: 0.4, rate: 0.97 })
        this.menubgm.play()

        // variables
        this.Index = 0
        this.firstSelect = false
        this.textAdded = false
        this.startShining = false

        // text at the top
        this.selectConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '60px',
            fontStyle: 'bold',
            color: '#FFFFFF',
            align: 'center'
        }
        this.add.text(game.config.width / 2, 150, 'Select Your Character', this.selectConfig).setOrigin(0.5)

        // character list
        this.characters = [
            { key: 'Phineas', name: 'Phineas' },    // index 0
            { key: 'Buford', name: 'Buford' },      // index 1
            { key: 'Candace', name: 'Candace' },    // index 2
            // add new characters here
        ]

        // box to display selected character
        this.boxBorder = this.add.rectangle(450, 500, 430, 480, 0xAAFFDD)
        this.box = this.add.rectangle(450, 500, 400, 450, 0x303030)


        // character choices
        this.characterTexts = []
        this.characters.forEach((chr, i) => {
            let charTextConfig = this.add.text(700, 400 + i * 100, chr.name, {
                fontFamily: 'Comic Sans MS',
                fontSize: '45px',
                fontStyle: 'bold',
                color: '#FFFFFF',
                stroke: '#AAFFDD',
                strokeThickness: 0,
                align: 'center',
                fixedWidth: 500
            })
            this.characterTexts.push(charTextConfig)
        })

        this.selectConfig.fontSize = '40px'

        // select
        this.input.keyboard.on('keydown-UP', () => { this.changeSelection(-1) })
        this.input.keyboard.on('keydown-DOWN', () => { this.changeSelection(1) })

        // start play scene
        this.input.keyboard.on('keydown-Z', () => {
            if (this.firstSelect) {
                game.selectedCharacter = this.characters[this.Index].key
                if (game.selectedCharacter == 'Phineas' || game.selectedCharacter == 'Buford') {
                    game.gameMode = 'Mode1'
                } else if (game.selectedCharacter == 'Candace') {
                    game.gameMode = 'Mode2'
                }
                this.menubgm.stop()
                this.scene.start('playScene')
            }
        })
    }

    update() {
        // show the text after selecting a character
        if (this.firstSelect && !this.textAdded) {
            this.textAdded = true
            this.toStart = this.add.text(game.config.width / 2, 850, 'Press Z to Start', this.selectConfig).setOrigin(0.5)
        }

        // shining text
        if (!this.startShining && this.textAdded) {
            this.time.addEvent({
                delay: 400, repeat: -1, callback: () => {
                    this.toStart.visible = !this.toStart.visible
                }
            })
            this.startShining = true
        }
    }

    // function for changing character selection
    changeSelection(keyPressed) {
        // first time select
        if (!this.firstSelect) {
            this.Index = 0
            this.firstSelect = true
            this.chrImage = this.add.sprite(450, 500, this.characters[this.Index].key).setScale(0.5)
        } else {
            this.Index = Phaser.Math.Wrap(this.Index + keyPressed, 0, this.characters.length)
            if (this.characters[this.Index].key == 'Candace') {
                this.chrImage.setTexture(this.characters[this.Index].key).setScale(0.75)
            } else if (this.characters[this.Index].key == 'Buford') {
                this.chrImage.setTexture(this.characters[this.Index].key).setScale(0.6)
            } else {
                this.chrImage.setTexture(this.characters[this.Index].key).setScale(0.5)
            }
        }

        this.sound.play('select-sfx', { volume: 0.5 })

        // update text style
        this.characterTexts.forEach((text, i) => {
            if (i == this.Index) {
                text.setText(`< ${this.characters[i].name} >`).setStyle({ color: '#000000', strokeThickness: 20 })
            } else {
                text.setText(this.characters[i].name).setStyle({ color: '#FFFFFF', strokeThickness: 0 })
            }
        })
    }
}
