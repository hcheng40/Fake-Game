class Bullet extends Phaser.Physics.Arcade.Image {
    // fire bullet
    fire(x, y, vx, vy, direction) {
        this.enableBody(true, x, y, true, true)
        this.setVelocity(direction * vx, vy + 50)
    }

    // basic attributes
    onCreate() {
        this.disableBody(true, true)
        this.body.collideWorldBounds = true
        this.body.onWorldBounds = true
        this.body.setAllowGravity(false)
    }

    // when bullet hits the world bounds
    onWorldBounds() {
        this.disableBody(true, true)
    }
}

class Bullets extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, config) {
        super(world, scene, { ...config, classType: Bullet, createCallback: Bullets.prototype.onCreate }
        )
    }

    // get bullet and fire
    fire(x, y, vx, vy, direction) {
        const bullet = this.getFirstDead(false)
        if (bullet) { bullet.fire(x, y, vx, vy, direction) }
    }

    // create bullets
    onCreate(bullet) {
        bullet.onCreate()
    }
}