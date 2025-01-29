import { Sprite } from "./sprite.js"
import { CollideBox } from "./collisions.js"
import { Game } from "./game.js"
/**
 * Game object, is the core elements of the game (player, obstacle, collectable ...) 
 * @class
 */
class GameObject {
    constructor(name = "") {
        this.fitToCameraOptimisation = false
        this.x = 0
        this.y = 0

        /** @type {Game} */
        this.currentGame = null;

        /** @type {Sprite} */
        this.sprite = new Sprite(name)

        /** @type {CollideBox} */
        this.collision = new CollideBox(0, 0, 0, 0)
        this.sprite.image.onload = () => {
            this.sprite.loaded = true;
            this.updateCollisions()
        }
        this.kill = false
    }

    clone() {
        let clone = new GameObject(this.name)
        clone.fitToCameraOptimisation = this.fitToCameraOptimisation
        clone.x = this.x
        clone.y = this.y
        clone.collision = this.collision.clone()
        clone.draw = this.draw
        clone.onStep = this.onStep
        clone.onCreate = this.onCreate
        clone.updateCollisions = this.updateCollisions
        clone.onKill = this.onKill
        clone.sprite = this.sprite.clone()

        return clone
    }

    draw() {

        this.sprite.draw(this.x, this.y)
    }
    onStep() {
    }
    onCreate() {
    }
    onKill() {
    }
    updateCollisions() {
        if (this.collision.fit_to_sprite) {
            this.collision.x = 0
            this.collision.y = 0
            this.collision.width = this.sprite.getSize().width
            this.collision.height = this.sprite.getSize().height
        }
    }

    collideWith(box, x, y) {
        if (box instanceof GameObject) {

            return (
                (x + this.collision.x * this.sprite.scale < box.x + (box.collision.x + box.collision.width) * box.sprite.scale) &&
                (x + (this.collision.x + this.collision.width) * this.sprite.scale > box.x + box.collision.x * box.sprite.scale) &&
                (y + this.collision.y * this.sprite.scale < box.y + (box.collision.y + box.collision.height) * box.sprite.scale) &&
                (y + (this.collision.y + this.collision.height) * this.sprite.scale > box.y + box.collision.y * box.sprite.scale)
            )
        }

        return (
            (x + (this.collision.x - (this.collision.width / 2)) * this.sprite.scale < box.x + box.width) &&
            (x + (this.collision.x + this.collision.width) * this.sprite.scale > box.x) &&
            (y + this.collision.y * this.sprite.scale < box.y + box.height) &&
            (y + (this.collision.y + this.collision.height) * this.sprite.scale > box.y)
        )
    }
    // addSprite(sprite) {
    //}
}

export { GameObject };