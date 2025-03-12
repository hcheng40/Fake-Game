// Hao-Tien Cheng
// Fake Game: Jump 'N Duck
// 2025/3/11
//
// Credits: 
//          Music:              https://www.fesliyanstudios.com/royalty-free-music
//
//          Code reference:     https://phaser.io/examples/v3.85.0
//                              https://github.com/nathanaltice
//
//          Fake game source:   https://www.youtube.com/watch?v=zr_r2duvxic
//
//          Sound effects:      https://sfxr.me
//                              (I create the sound effects myself with this website.)
//
//          Images:             https://phineasandferb.fandom.com/wiki/Gaming_the_System
//                              (I create the assets by editing the original images.)
//
//
// My game uses at least five of Phaser's major components: 
//          physics systems, cameras, particle effects, text objects, and animations.



let config = {
    type: Phaser.AUTO,
    width: 1360,
    height: 960,
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Menu, Select, Tutorial, Play, GameOver, Win]
}

let game = new Phaser.Game(config)

// keys
let keyZ, keyM, keyR, keyC, keyUP, keyDOWN, keyLEFT, keyRIGHT
let mouseX, mouseY, cursors
