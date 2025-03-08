class Bullet extends Phaser.Physics.Arcade.Image {
    fire(x, y, vx, vy, direction) {
        this.enableBody(true, x, y, true, true)
        this.setVelocity(direction * vx, vy + 50)
    }

    onCreate() {
        this.disableBody(true, true)
        this.body.collideWorldBounds = true
        this.body.onWorldBounds = true
        this.body.setAllowGravity(false)
    }

    onWorldBounds() {
        this.disableBody(true, true)
    }
}

class Bullets extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, config) {
        super(
            world,
            scene,
            { ...config, classType: Bullet, createCallback: Bullets.prototype.onCreate }
        )
    }

    fire(x, y, vx, vy, direction) {
        const bullet = this.getFirstDead(false)
        if (bullet) {
            bullet.fire(x, y, vx, vy, direction)
        }
    }

    onCreate(bullet) {
        bullet.onCreate()
    }
}