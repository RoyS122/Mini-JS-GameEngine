import { GameObject } from "./gameobject.js"

/**
 * An object to display some texts
 * @class
*/
class TextObject extends GameObject {
    constructor(content = "") {
        super()
        this.content = content
        this.container = document.createElement("p")
        document.body.appendChild(this.container)
    }
    draw() {
        this.container.textContent = this.content
        this.container.style.transform = `translate( ${this.x}px, ${this.y}px )`;
        this.container.style.zIndex = this.z
        this.container.style.position = "absolute"
        // this.container.style.fontFamily = 
    }
}

export { TextObject };