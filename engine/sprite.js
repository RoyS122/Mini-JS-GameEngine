/**
 * A sprite
 * @class
 */
class Sprite {
    constructor(name, z) {
        //  this.parent = parent
        this.scale = 1
        this.row = 1
        this.col = 1
        this.speed = 0
        this.x = 0
        this.y = 0
        this.container = document.createElement("div")
        this.container.setAttribute("class", "game_object")
        this.container.style.position = 'absolute';
        this.container.style.imageRendering = "pixelated"
        this.container.setAttribute("id", name)
        this.image = new Image()
        this.container.style.backgroundImage = "" + this.image + ""
        this.loaded = false
        //    this.image.onload = () => {
        //      this.loaded = true;

        //}
        this.image_step = 0
        this.delay = 0
        this.z = z
    }

    clone() {
        let clone = new Sprite(this.name)
        clone.scale = this.scale
        clone.row = this.row
        clone.col = this.col
        clone.speed = this.speed
        clone.image_step = this.image_step

        clone.x = this.x
        clone.y = this.y
        clone.container = document.createElement("div")
        clone.container.setAttribute("class", "game_object")
        clone.container.style.position = 'absolute';
        clone.container.style.imageRendering = "pixelated"
        clone.container.setAttribute("id", this.name)
        clone.image = this.image.cloneNode(true)


        //   clone.container.style.backgroundImage = "" + clone.image + ""
        clone.loaded = false
        // clone.image.onload =

        //    clone.loaded = true;
        //           console.log("image loaded")
        //}

        clone.delay = 0

        clone.z = this.z
        return clone
    }

    draw(x, y) { // to be executed in the gamedraw loop, (with a constant tickrate)
        let delay_target = Math.floor(60 / this.speed)
        //	console.log(this.image_step, this.speed)
        let size = this.getSize()
        // console.log(this.y, this.x)
        this.container.style.transform = `translate( ${x}px, ${y}px )`;
        //  this.container.style.left = this.x + "px"
        //  this.container.style.top = this.y + "px"
        this.container.style.zIndex = this.z
        let w_scaled = this.image.width * this.scale
        let h_scaled = this.image.height * this.scale
        size.width = size.width * this.scale
        size.height = size.height * this.scale
        this.container.style.backgroundSize = w_scaled + "px " + h_scaled + "px"
        this.container.style.width = size.width + "px"
        this.container.style.height = size.height + "px"
        this.container.style.backgroundImage = `url(${this.image.src})`;
        this.container.style.backgroundPosition = "-" + String(this.image_step % this.col * size.width) + 'px ' + "-" + String(Math.floor(this.image_step / this.col) * size.height) + 'px';
        this.delay += 1
        if (delay_target == this.delay) {
            this.delay = 0
            this.image_step = (this.image_step + 1) % (this.col * this.row)
            //    console.log(this.container.style.backgroundPosition)
        }
    }
    setAnimation(col = 1, row = 1, speed = 0) {
        this.col = col;
        this.row = row;
        this.speed = speed;
    }

    /**
    * Fonction qui prend un chemin comme argument
    * @param {URL} path - Le chemin à traiter
    */
    setImage(path/** @type path */) {
        this.loaded = false
        this.image.src = path
    }
    getSize() {
        return { width: this.image.width / this.col, height: this.image.height / this.row }
    }
}

export { Sprite };