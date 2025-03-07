class Select extends Phaser.Scene {
    constructor() {
        super('selectScene')
    }

    create() {
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
            { key: 'apple', name: 'Phineas' },    // index 0
            { key: 'peach', name: '' },           // index 1
            { key: 'bird', name: 'Candace' },     // index 2
            // add new characters here
        ]
        this.Index = 0
        this.firstSelect = false

        // box to display selected character
        this.boxBorder = this.add.rectangle(450, 500, 330, 380, 0xAAFFDD)
        this.box = this.add.rectangle(450, 500, 300, 350, 0x000000)

        // character choices
        this.characterTexts = []
        let startX = 850
        let startY = 400
        this.characters.forEach((chr, i) => {
            let charTextConfig = this.add.text(startX, startY + i * 100, chr.name, {
                fontFamily: 'Comic Sans MS',
                fontSize: '45px',
                color: '#FFFFFF',
                align: 'center',
                fixedWidth: 250
            })
            this.characterTexts.push(charTextConfig)
        })

        this.selectConfig.fontSize = '40px'
        this.textAdded = false


        // select
        this.input.keyboard.on('keydown-UP', () => { this.changeSelection(-1) })
        this.input.keyboard.on('keydown-DOWN', () => { this.changeSelection(1) })

        // start play scene
        this.input.keyboard.on('keydown-Z', () => {
            if (this.firstSelect) {
                game.selectedCharacter = this.characters[this.Index].key
                if (game.selectedCharacter == 'apple' || game.selectedCharacter == 'peach') {
                    game.gameMode = 'Mode1'
                } else if (game.selectedCharacter == 'bird') {
                    game.gameMode = 'Mode2'
                }
                this.scene.start('playScene')
            }
        })
    }

    update() {
        if (this.firstSelect && !this.textAdded) {
            this.textAdded = true
            this.add.text(game.config.width / 2, 850, 'Press Z to Start', this.selectConfig).setOrigin(0.5)
        }
    }

    // function for changing character selection
    changeSelection(keyPressed) {
        // first time select
        if (!this.firstSelect) {
            this.Index = 0
            this.firstSelect = true
            this.chrImage = this.add.sprite(450, 500, this.characters[this.Index].key).setScale(0.75)
        } else {
            this.Index = Phaser.Math.Wrap(this.Index + keyPressed, 0, this.characters.length)
            this.chrImage.setTexture(this.characters[this.Index].key)
        }

        // update text style
        this.characterTexts.forEach((text, i) => {
            if (i == this.Index) {
                text.setText(`< ${this.characters[i].name} >`).setStyle({ fontStyle: 'bold' })
            } else {
                text.setText(this.characters[i].name).setStyle({ fontStyle: 'normal' })
            }
        })
    }
}
