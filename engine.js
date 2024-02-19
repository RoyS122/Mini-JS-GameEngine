const fs = require("fs");

class Game {
    constructor() {
        
        this.window = document.createElement("div")

        document.body.appendChild(this.window)
        this.window.setAttribute("class", "game_window")
        this.GameObjects = []
        this.Rooms =  []
        this.tilemaps = []
        this.CurrentRoom = 0

        this.inputs = {};
        this.mouse = {x: 0, y: 0}

        document.addEventListener('keydown', (e) => {
            this.inputs[e.key] = true; 
        }, false);
        document.addEventListener('keyup', (e) => {
            this.inputs[e.key] = false;
        }, false);
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        })
        document.addEventListener('mouseevent', (e) => {
            
        })

    }

    startGameLoop() {
        window.requestAnimationFrame(() => this.gameLoop())
    }

    addObject(go, room=undefined) {
        
        if (room == undefined) {
            var id = this.GameObjects.push(go) - 1 
          
            this.GameObjects[id].onCreate()
            this.window.appendChild(this.GameObjects[id].sprite.container)
        }else{
            var id = this.Rooms[room].gameObjects.push(go) - 1
            this.Rooms[room].gameObjects[id].onCreate()
            this.window.appendChild(this.Rooms[room].gameObjects[id].container)
        }
        
        
    }
    addTileMap(tm, room=undefined){
           
        if (room == undefined) {
            var id = this.tilemaps.push(tm) - 1 
            
            this.window
            this.window.appendChild(this.tilemaps[id].container)
        }else{
            var id = this.Rooms[room].gameObjects.push(go) - 1
            this.Rooms[room].gameObjects[id].onCreate()
            this.window.appendChild(this.Rooms[room].gameObjects[id].container)
        }
    }

    gameLoop() {
        
        for(let i = 0; i < this.GameObjects.length; i ++) { // running through the list of objects they are not in a specific room
            // Draw
            this.GameObjects[i].draw()
            // Step Events
            this.GameObjects[i].onStep()
            // On kill event
            if(this.GameObjects[i].kill == true) {
                this.GameObjects[i].onKill() 
            }
        }

        if(this.Rooms.length) { // if the list of room is empty skip the running through of room's objects
            for(let i = 0; i < this.Rooms[this.CurrentRoom].gameObjects; i ++) {
                // Draw Events
                this.Rooms[this.CurrentRoom].gameObjects[i].sprite.draw()
    
                // Step Events
                this.Rooms[this.CurrentRoom].gameObjects[i].onStep()
    
            
                if(this.Rooms[this.CurrentRoom].gameObjects[i].kill == true) {
                    this.Rooms[this.CurrentRoom].gameObjects[i].onKill() 
                }
            }
        }
        
      
        window.requestAnimationFrame(() => this.gameLoop())
    }
    keyboardCheck(key) {
        return this.inputs[key]
    }
    
    
}

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

class GameObject {
    constructor(name = "") {
       this.x = 0
       this.y = 0
       this.sprite = new Sprite(name)

       this.collision = new CollideBox(0, 0, 0, 0)

       this.sprite.image.onload = () => {
        this.sprite.loaded = true;
        console.log("image loaded")
        if (this.collision.fit_to_sprite){
            this.collision.x = 0
            this.collision.y = 0
            this.collision.width = this.sprite.getSize().width
            this.collision.height = this.sprite.getSize().height
        }
        this.kill = false
    }
      
    }
    
    draw() {
        this.sprite.x = this.x
        this.sprite.y = this.y
        this.sprite.draw()
    }

    onStep() {

    }

    onCreate() {

    }
    
    collideWith(box,x,y) {
            if (box instanceof GameObject) {
                return (
                    (x + this.collision.x < box.x + box.collision.width) &&
                    (x + this.collision.x + this.collision.width > box.x + box.collision.x) &&
                    (y + this.collision.y < box.y + box.collision.height) &&
                    (y + this.collision.y + this.collision.height > box.y + box.collision.y)
                )
            }
            return (
                (x + this.collision.x < box.x + box.width) &&
                    (x + this.collision.x + this.collision.width > box.x + box.x) &&
                    (y + this.collision.y < box.y + box.height) &&
                    (y + this.collision.y + this.collision.height > box.y + box.y)
            )
    }
        
    
   // addSprite(sprite) {

    //}
}

class Sprite {
    constructor(name, z) {
      //  this.parent = parent
        this.scale = 1
        this.row = 1
        this.col = 1
        this.speed = 0
        this.container = document.createElement("div")
        this.container.setAttribute("class", "game_object")
        this.container.style.position = 'absolute'; 
        this.container.style.imageRendering = "pixelated"
        this.container.setAttribute("id", name)
        this.image = new Image()
        this.container.style.backgroundImage = "" + this.image + ""
        this.loaded = false
        this.image.onload = () => {
            this.loaded = true;
            console.log("image loaded")
           
        }
        this.image_step = 0
        this.delay = 0
        this.z = z
        
    }
    
    draw() { // to be executed in the gamedraw loop, (with a constant tickrate)
        let delay_target = Math.floor(60 / this.speed)
          
        let size = this.getSize()  
        //console.log(this.x)
        this.container.style.left = this.x + "px"
        this.container.style.top = this.y + "px"
        this.container.style.zIndex = this.z

        let w_scaled = this.image.width * this.scale
        let h_scaled = this.image.height * this.scale
        size.width = size.width * this.scale
        size.height = size.height * this.scale
        this.container.style.backgroundSize = w_scaled + "px " + h_scaled +"px"

        this.container.style.width = size.width + "px"
        this.container.style.height = size.height +"px"
        
            
        
       
        this.container.style.backgroundImage = `url(${this.image.src})`;
        
        this.container.style.backgroundPosition = String(this.image_step % this.col * size.width) + 'px ' + String(Math.floor(this.image_step / this.row) * size.height) + 'px';
        
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

    setImage(path) {
        this.loaded = false
        this.image.src = path
    }

    getSize() {
       return {width: this.image.width / this.col, height: this.image.height / this.row} 
    }
}

class CollideBox {
    constructor(x=0, y=0, w=0, h=0, fts=true) {
        this.x = x
        this.y = y
        this.width = w
        this.height = h
        this.fit_to_sprite = fts
    }

}

class TileMap {
    constructor(map = [[]], src, name = "", z = 0, col = 1, row = 1, scale = 1){
        this.scale = scale;
        this.map = map 
        this.src = src
        this.col = col
        this.row = row
        this.img = new Image()
    
        this.img.src = src
        this.container = document.createElement("div")
        this.container.id = name
        this.container.style.zIndex = z
        this.divmap = []
        this.img.onload = () => {
            console.log("map loaded")
            
            this.updateMap()
           
            console.log(this.divmap)
        }
       
    }
    
    updateMap() {
        console.log(this.map)
        for(let i = 0; i < this.divmap.length; i ++) {
            this.container.removeChild(this.divmap[i])
        }
        this.container.style.imageRendering = "pixelated"

        console.log(this.map[0].length)
        
        let tilesize = {width: this.img.width / this.col * this.scale, height: this.img.height / this.row * this.scale}
       
        this.divmap = []
        for(let i = 0; i < this.map.length; i ++) {
            console.log(i)
            for(let j = 0; j < this.map[0].length; j++){
                console.log(j)
                let temp = document.createElement("div")
                temp.style.position = "absolute";
            //    console.log(String(j * (this.img.width / this.col)))
               
                temp.style.left = String(j * tilesize.width)+ "px"
                temp.style.top = String(i * tilesize.height) + "px"
               
                console.log(`url(${this.img.src})`)
               
                temp.style.backgroundImage = `url(${this.img.src})`;
                temp.style.backgroundSize = this.img.width * this.scale + "px " + this.img.height * this.scale +"px"
               
                let backgroundPosX = "-" + String((this.map[i][j] % this.col) * tilesize.width) + 'px '
                let backgroundPosY = "-" + String(Math.floor(this.map[i][j] / this.row) * tilesize.height) + 'px'
                console.log(backgroundPosX, backgroundPosY)
                console.log("map x:", (this.map[i][j] % this.col), "map y:",Math.floor(this.map[i][j] / this.row ), this.map[i][j])
               
                temp.style.backgroundPosition = backgroundPosX + backgroundPosY;
                temp.style.width = String(tilesize.width) +"px"
                temp.style.height = String(tilesize.height) + "px"
                this.divmap.push(temp)
                this.container.appendChild(temp)
            }
        } 
        
    }
}



// class TileSet {
//     constructor(name) {
        
//     }
// }

class Menu {

}

function importMapFromJson(path) {
    var json_map = fs.open("")

    return map_data
}
export {Game, GameObject, CollideBox, Sprite, TileMap}