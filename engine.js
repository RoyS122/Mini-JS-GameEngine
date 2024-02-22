
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
    constructor(map, z = 0, scale = 1){
        this.scale = scale;
        this.json_map = map

     
       // this.src = src
        //this.col = col
        //this.row = row
        this.images_loaded = 0
        this.images = []
        console.log(map, "test")
        for(let i = 0; i < this.json_map.tilesets.length; i ++) {
            console.log(i)
            var temp_img = {img: new Image(), min: this.json_map.tilesets[i].firstgid, max: -1}
            console.log(temp_img)
            if(i != 0 ) {
                this.images[i - 1].max = temp_img.min - 1;
            }
            
            temp_img.img.src = this.json_map.tilesets[i].img_url
            console.log(this.json_map.tilesets[i].img_url)
            console.log(temp_img)
            temp_img.img.onload = () => {
               // console.log(1)
                this.images_loaded += 1;
                console.log(this.images_loaded, this.json_map.tilesets.length)
                if (this.images_loaded == this.json_map.tilesets.length) {
                    this.updateMap()
                }
                console.log(this.images_loaded)
            }
            console.log(temp_img)
            this.images.push(temp_img)
        }
        this.container = document.createElement("div")
        //this.container.id = name
        this.container.style.zIndex = z
        this.divmap = []
    }

 
    updateMap() {
        console.log(1, "update")
        console.log(this.json_map)
        var map_by_layer = importMapFromJson(this.json_map)
        for(let i = 0; i < this.divmap.length; i ++) {
            this.container.removeChild(this.divmap[i])
        }
        this.container.style.imageRendering = "pixelated"

       // console.log(this.map[0].length)


        this.divmap = []
        
        for(let m = 0; m < map_by_layer.length; m ++) {
            this.addLayer(map_by_layer[m])
        }
    }

    addLayer(tm) {
        console.log(tm, "map")
        var tilesize = {width: this.json_map.tilewidth * this.scale, height: this.json_map.tileheight * this.scale}
        console.log(tilesize)
      //  console.log(json_map)
        for(let i = 0; i < tm.length; i ++) {
            console.log(i)
            for(let j = 0; j < tm[0].length; j++){
             //   console.log(this.map)
                if(tm[i][j] != 0) {
                    console.log(j)
                    let temp = document.createElement("div")
                    temp.style.position = "absolute";
                    //    console.log(String(j * (this.img.width / this.col)))

                    temp.style.left = String(j * tilesize.width)+ "px"
                    temp.style.top = String(i * tilesize.height) + "px"

                 //   console.log(`url(${this.img.src})`)   
                    var tile_value = tm[i][j]
                    
                    let ts = this.images[0]
                    for(let id_ts = 0; tile_value > ts.max && ts.max != -1; id_ts ++){
                        ts = this.images[id_ts]
                    }
                    console.log(ts)

                    let row = ts.img.height / this.json_map.tileheight
                    let col = ts.img.width / this.json_map.tilewidth

                    console.log(ts.img.src)
                    temp.style.backgroundImage = `url(${ts.img.src})`;
                    temp.style.backgroundSize = ts.img.width * this.scale + "px " + ts.img.height * this.scale +"px"
                     
                    let backgroundPosX = "-" + String(((tm[i][j] - ts.min) %    col) * tilesize.width) + 'px '
                    let backgroundPosY = "-" + String(Math.floor((tm[i][j] - ts.min) / row) * tilesize.height) + 'px'
                    console.log(tm[i][j], ts.min, this.col, this.row)
                    console.log(((tm[i][j] - ts.min) % this.col) * tilesize.width, (Math.floor((tm[i][j] - ts.min) / this.row) * tilesize.height))
                    //console.log("map x:", (this.map[i][j] % this.col), "map y:",Math.floor(this.map[i][j] / this.row ), this.map[i][j])
    
                    temp.style.backgroundPosition = backgroundPosX + backgroundPosY;
            
                    temp.style.width = String(tilesize.width) +"px"
                    temp.style.height = String(tilesize.height) + "px"
                    this.divmap.push(temp)
                    this.container.appendChild(temp)
                }
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


async function importJson(path) {
    return fetch(path)
    .then(response => {
      // Vérifiez si la requête a réussi
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Parse la réponse en JSON
    })
    .then(data => {
      console.log(data);
      return data // Ici, vous avez accès à vos données JSON
      // Faites quelque chose avec vos données JSON
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });

}
async function importMAPJsonFromFile(path) {
    var json = await importJson(path)
    console.log(json)
    for(let i = 0; i < json.tilesets.length; i ++) {
        console.log(resolveUrl(path, json.tilesets[i].source))
        
        json.tilesets[i].tsj = await importJson(resolveUrl(path, json.tilesets[i].source))
        json.tilesets[i].img_url = resolveUrl(path, resolveUrl(json.tilesets[i].source, json.tilesets[i].tsj.image))
        
    }
    console.log(json, "map")
    return json
}

function importMapFromJson(json) {
        
        let map_arr = json.layers.map(layer => layer);
        console.log(map_arr);
        let map_splited = []
        for(let i = 0; i < map_arr.length; i ++) {
            let current_layer = []
            for(let j = 0; j < map_arr[i].height; j ++) {
                console.log("row: ", j)
                let current_row = []
                for(let l = 0; l < map_arr[i].width; l ++) {
                    //console.log("col :", )
                    console.log()
                    current_row.push(map_arr[i].data[j * map_arr[i].width + l])
                    console.log(j * map_arr[i].width + l, map_arr[i].data[j * map_arr[i].width + l])
                }
                console.log(current_row)
                current_layer.push(current_row)
            }
            map_splited.push(current_layer)
            

        }
        
        return map_splited;
    
}

function resolveUrl(base, relative) {
    var stack = base.split("/"),
        parts = relative.split("/");
    stack.pop(); // Enlever le fichier courant (ou vide) de l'URL de base pour obtenir le dossier
    for (var i = 0; i < parts.length; i++) {
        if (parts[i] == ".")
            continue; // Ignorer le segment actuel
        if (parts[i] == "..")
            stack.pop(); // Remonter d'un niveau dans l'arborescence
        else
            stack.push(parts[i]); // Ajouter le segment au chemin final
    }
    return stack.join("/");
}


export {Game, GameObject, CollideBox, Sprite, TileMap, importJson, importMAPJsonFromFile}