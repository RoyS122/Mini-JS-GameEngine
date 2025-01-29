class Room {
    constructor(id) {
        this.id = id
        this.gameObjects = []
    }
    addObject(go) {
        var id = this.gameObjects.push(go)
        this.gameObjects[id].onCreate()
    }
 }

 export {Room};