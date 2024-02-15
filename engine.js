class Game {
    constructor() {
        
        this.window = document.createElement("div")

        document.body.appendChild(this.window)
        this.window.setAttribute("class", "game_window")
        this.window.textContent = "test"
        this.GameObjects = []
        this.Rooms =  []
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
            switch (e.button) {
                
            }
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
    constructor(name) {
       this.x = 0
       this.y = 0
       this.sprite = new Sprite(name)
    }
    
    draw() {
        this.sprite.x = this.x
        this.sprite.y = this.y
        this.sprite.draw()
    }

    
   // addSprite(sprite) {

    //}
}

class Sprite {
    constructor(name) {
      //  this.parent = parent
        this.row = 1
        this.col = 1
        this.speed = 0
        this.container = document.createElement("div")
        this.container.setAttribute("class", "game_object")
        this.container.style.position = 'absolute'; 
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
        
    }
    
    draw() { // to be executed in the gamedraw loop, (with a constant tickrate)
        let delay_target = Math.floor(60 / this.speed)
          
        let size = this.getSize()  
        console.log(this.x)
        this.container.style.left = this.x + "px"
        this.container.style.top = this.y + "px"

        this.container.style.width =  size.width + "px"
        this.container.style.height = size.height + "px"
       
        this.container.style.backgroundImage = `url(${this.image.src})`;
        
        this.container.style.backgroundPosition = String(this.image_step * size.width) + 'px ' + String(Math.floor(this.image_step % this.row * size.height)) + 'px';
        
        this.delay += 1 
        if (delay_target == this.delay) {
            this.delay = 0 
            this.image_step = (this.image_step + 1) % (this.col * this.row)
            console.log(this.container.style.backgroundPosition)
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

}

export {Game, GameObject, CollideBox, Sprite}