// Hao-Tien Cheng
// Fake Game: Jump 'N Duck

// credits: https://www.fesliyanstudios.com/royalty-free-music
//          https://phaser.io/examples/v3.85.0
//          https://www.youtube.com/watch?v=zr_r2duvxic
//          https://phineasandferb.fandom.com/wiki/Gaming_the_System



let config = {
    type: Phaser.AUTO,
    width: 1360,
    height: 960,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Menu, Select, Play, GameOver, Win]
}

let game = new Phaser.Game(config)

// keys
let keyZ, keyM, keyR, keyUP, keyDOWN, keyLEFT, keyRIGHT
let mouseX, mouseY, cursors
