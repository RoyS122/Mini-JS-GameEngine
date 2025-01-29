/**
 * A collide box
 * @class
*/
class CollideBox {
    constructor(x = 0, y = 0, w = 0, h = 0, fts = true) {
        this.x = x
        this.y = y
        this.width = w
        this.height = h
        this.fit_to_sprite = fts
    }
    clone() {
        let clone = new CollideBox(this.x, this.y, this.width, this.height, this.fit_to_sprite)
        return clone
    }
}

function checkColl(obj, to_check, x, y) {
    for (let i = 0; i < to_check.length; i++) {
        if (obj.collideWith(to_check[i], x, y)) {
            return true
        }
    }
    return false
}

export { CollideBox, checkColl };