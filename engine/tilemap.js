
class TileMap {
    constructor(map, z = 0, scale = 1){
        this.scale = scale;
        this.json_map = map
        this.onMapLoad = () => {}
        this.map_by_layer = [[[]]]
        this.map_loaded = false
       // this.src = src
        //this.col = col
        //this.row = row
        this.images_loaded = 0
        this.images = []
      //  console.log(map, "test")
        for(let i = 0; i < this.json_map.tilesets.length; i ++) {
            // console.log(i)
            var temp_img = {img: new Image(), min: this.json_map.tilesets[i].firstgid, max: -1}
            // console.log(temp_img)
            if(i > 0) {
                this.images[i - 1].max = temp_img.min - 1;
            }
            
            temp_img.img.src = this.json_map.tilesets[i].img_url
            // console.log(this.json_map.tilesets[i].img_url)
            // console.log(temp_img)
            temp_img.img.onload = () => {
                // console.log(this.images_loaded)
                this.images_loaded += 1;
                // console.log(this.images_loaded, this.json_map.tilesets.length)
                if (this.images_loaded == this.json_map.tilesets.length) {
                    this.updateMap()
                }
             //   console.log(this.images_loaded)
            }
            // console.log(temp_img)
            this.images.push(temp_img)
        }
        this.container = document.createElement("div")
        //this.container.id = name
        
        this.container.style.position = "absolute";
        this.container.style.zIndex = z
       
        this.divmap = []
    }
 
    updateMap() {
        // console.log(1, "update")
        // console.log(this.json_map)
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
        this.map_by_layer = map_by_layer
        this.map_loaded = true
        this.onMapLoad()
    }
    addLayer(tm) {
        // console.log(tm, "map")
        var tilesize = {width: this.json_map.tilewidth * this.scale, height: this.json_map.tileheight * this.scale}
        // console.log(tilesize)
      //  console.log(json_map)
        for(let i = 0; i < tm.length; i ++) {
            // console.log(i)
            for(let j = 0; j < tm[0].length; j++){
             //   console.log(this.map)
                if(tm[i][j] != 0) {
                    // console.log(j)
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
                        // console.log(this.json_map.tilesets[id_ts])
                    }
                    // console.log(ts)
                    // console.log(tilesize.width)
                    let row = (ts.img.height / this.json_map.tileheight)
                    let col = (ts.img.width / this.json_map.tilewidth )
                    
                    // console.log(
                        // col, row, tm[i][j], (tm[i][j] - ts.min) / row, tm[i][j] + 1 - ts.min, ts.min, Math.ceil((tm[i][j]  + 1) - ts.min)
                    // )
                    
                    temp.style.backgroundImage = `url(${ts.img.src})`;
                    temp.style.backgroundSize = ts.img.width * this.scale + "px " + ts.img.height * this.scale +"px"
                    if  (tile_value == 93) {
                        // console.log((tm[i][j] - ts.min) / row, "row perfect", ts.min, row, tm[i][j], col )
                    } 
                    let backgroundPosX = "-" + String(((tm[i][j] - ts.min) % col) * tilesize.width) + 'px '
                    let backgroundPosY = "-" + String(Math.floor((tm[i][j] - ts.min) / col) * tilesize.height) + 'px';
                    // console.log(tm[i][j], ts.min, this.col, this.row)
                    // console.log(((tm[i][j] - ts.min) % this.col) * tilesize.width, (Math.floor((tm[i][j] - ts.min) / this.row) * tilesize.height))
                    //console.log("map x:", (this.map[i][j] % this.col), "map y:",Math.floor(this.map[i][j] / this.row ), this.map[i][j])
    
                    temp.style.backgroundPosition = backgroundPosX + backgroundPosY;
                    temp.style.width = String(tilesize.width) +"px"
                    temp.style.height = String(tilesize.height) + "px"
                    this.divmap.push(temp)
                    this.container.appendChild(temp)
                }
                
            }
            
        }
        
        this.container.style.width = tm[0].length * this.scale * this.json_map.tilewidth + "px"
        this.container.style.height = tm.length * this.scale * this.json_map.tileheight + "px"
       
    }
}

export {TileMap};