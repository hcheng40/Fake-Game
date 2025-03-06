class Select extends Phaser.Scene {
    constructor() {
        super('selectScene')
    }

    create() {
        // text at the top
        let selectConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '60px',
            fontStyle: 'bold',
            color: '#FFFFFF',
            align: 'center'
        }
        this.add.text(game.config.width / 2, 150, 'Select Your Character', selectConfig).setOrigin(0.5)

        // character list
        this.characters = [
            { key: 'apple', name: 'Apple' },    // index 0
            { key: 'peach', name: 'Peach' },    // index 1
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
        this.characters.forEach((chr, index) => {
            let text = this.add.text(startX, startY + index * 100, chr.name, {
                fontFamily: 'Comic Sans MS',
                fontSize: '45px',
                color: '#FFFFFF',
                align: 'center',
                fixedWidth: 250
            })
            this.characterTexts.push(text)
        })

        // text at the bottom
        selectConfig.fontSize = '40px'
        this.add.text(game.config.width / 2, 850, 'Press Z to Start', selectConfig).setOrigin(0.5)

        // select
        this.input.keyboard.on('keydown-UP', () => { this.changeSelection(-1) })
        this.input.keyboard.on('keydown-DOWN', () => { this.changeSelection(1) })

        // start game
        this.input.keyboard.on('keydown-Z', () => {
            game.selectedCharacter = this.characters[this.Index].key
            this.scene.start('playScene')
        })
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
            this.chrImage.setTexture(this.characters[this.Index].key)
        }

        // update text style
        this.characterTexts.forEach((text, index) => {
            if (index == this.Index) {
                text.setText(`< ${this.characters[index].name} >`).setStyle({ fontStyle: 'bold' })
            } else {
                text.setText(this.characters[index].name).setStyle({ fontStyle: 'normal' })
            }
        })
    }
}
