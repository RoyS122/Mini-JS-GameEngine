import { GameObject } from "./gameobject.js"
import { CollideBox } from "./collisions.js"
/**
 * Représente le moteur de jeu.
 * @class
 */
class Game {
    /**
   * Crée une instance du jeu.
   * @param {number} [cameraWidth=720] - Largeur de la caméra.
   * @param {number} [cameraHeight=500] - Hauteur de la caméra.
   * @param {number} [fps_target=60] - FPS cible.
   */
    constructor(cameraWidth = 720, cameraHeight = 500, fps_target = 60) {
        /** @type {number} */
        this.cameraY = 0
        /** @type {number} */
        this.cameraX = 0
        /** @type {number} */
        this.lastFrameTime = 0
        /** @type {number} */
        this.minDeltatime = 1000
        /** @type {number} */
        this.targetFPS = fps_target
        /** @type {number} */
        this.targetDeltaTime = Math.floor(1000 / this.targetFPS)

        /** @type {number} */
        this.cameraWidth = cameraWidth
        /** @type {number} */
        this.cameraHeight = cameraHeight

        /** @type {HTMLElement} */
        this.window = document.createElement("div")
        document.body.appendChild(this.window)
        this.window.setAttribute("class", "game_window")
        this.window.style.maxWidth = cameraWidth.toString() + "px"
        this.window.style.maxHeight = cameraHeight.toString() + "px"
        this.window.style.width = cameraWidth.toString() + "px"
        this.window.style.height = cameraHeight.toString() + "px"
        this.window.style.position = "absolute";
        this.window.style.overflow = "hidden";

        /** @type {Array<GameObject>} */
        this.GameObjects = [];
        this.menus = []
        this.Rooms = []
        this.tilemaps = []
        this.objAreInKilling = 0
        this.inputs_buffer = {}
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.fps = 0;
        this.lastSecond = 0;
        this.lastSecond = 0;
        //	this.object_kill_count = 0
        this.currentMenu = undefined
        this.currentmap = 0
        this.CurrentRoom = 0
        this.framerateBuffer = []
        this.inputs = {};
        this.mouse = { x: 0, y: 0 }
        document.addEventListener('keydown', (e) => {
            console.log(e.key, e.code)
            this.inputs_buffer[e.key] = !this.inputs[e.key];
            this.inputs[e.key] = true;

            this.inputs_buffer[e.code] = !this.inputs[e.code];
            this.inputs[e.code] = true;
        }, false);
        document.addEventListener('keyup', (e) => {
            this.inputs[e.key] = false;
            this.inputs_buffer[e.key] = false;

            this.inputs[e.code] = false;
            this.inputs_buffer[e.code] = false;

        }, false);
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        })
        document.addEventListener('mouseevent', (e) => {
        })
    }
    checkAllKillsReady() {

        for (let i = 0; i < this.GameObjects.length; i++) {
            if (this.GameObjects[i].kill == true) {
                return false
            }
        }
        return true
    }
    startGameLoop() {
        this.lastFrameTime = 1
        window.requestAnimationFrame((timestamp) => this.gameLoop(timestamp))
    }
    addObject(go, room = undefined) {
        if (room == undefined) {

            var id = this.GameObjects.push(go) - 1
            this.GameObjects[id].currentGame = this;
            if (this.GameObjects[id].onCreate !== undefined) {
                this.GameObjects[id].onCreate()
            }

            if (this.GameObjects[id].sprite.container !== undefined) {

                this.window.appendChild(this.GameObjects[id].sprite.container)
            }
        } else {
            var id = this.Rooms[room].gameObjects.push(go) - 1
            this.Rooms[room].gameObjects[id].onCreate()
            this.window.appendChild(this.Rooms[room].gameObjects[id].container)
        }
    }
    nextMap() {
        if (this.currentmap !== undefined) {
            this.window.removeChild(this.tilemaps[this.currentmap].container)
            this.currentmap += 1;
            this.window.appendChild(this.tilemaps[this.currentmap].container)
        }
    }

    changeMap(id) {
        if (this.currentmap !== undefined) {
            this.window.removeChild(this.tilemaps[this.currentmap].container)
            this.currentmap = id;
            this.window.appendChild(this.tilemaps[id].container)
        }
    }
    addTileMap(tm, room = undefined) {
        if (room == undefined) {
            var id = this.tilemaps.push(tm) - 1

            if (id == 0) {
                this.currentmap = 0
                this.window.appendChild(this.tilemaps[id].container)
            }


        } else {
            var id = this.Rooms[room].gameObjects.push(go) - 1
            this.Rooms[room].gameObjects[id].onCreate()
            this.window.appendChild(this.Rooms[room].gameObjects[id].container)
        }
    }
    addMenu(menu) {
        this.menus.push(menu)
    }

    showMenu(menu) {
        //let n = menu.container.cloneNode(true)
        this.currentMenu = document.body.appendChild(menu.container)
        this.pause = menu.pauseRequired
        //if (this.currentMenu == true) {
        this.window.style.opacity = 0.8
        //}
    }
    exitMenu() {
        this.currentMenu.remove()
        this.currentMenu = false
        this.pause = false
        this.window.style.opacity = 1
    }
    gameLoop(timestamp) {

        window.requestAnimationFrame((timestamp) => this.gameLoop(timestamp))

        let deltaTime = timestamp - this.lastFrameTime;

        if (deltaTime < this.targetDeltaTime) {
            // Trop tôt pour la prochaine mise à jour selon le cap des FPS.
            this.buffer_key = this.inputs;
            return;
        }

        if (timestamp - this.lastSecond >= 1000) {
            // Mise à jour du FPS (nombre de frames dans la dernière seconde)
            this.fps = this.frameCount;
            // Réinitialisation du compteur de frames
            this.frameCount = 0;
            // Mise à jour du dernier moment où les FPS ont été calculés
            this.lastSecond = timestamp;
        }
        this.frameCount++;

        this.menus.forEach((menu) => {
            // Vérifier si la touche a été pressée une seule fois
            if (this.inputs_buffer[menu.key]) {
                if (!this.currentMenu) {
                    this.showMenu(menu);
                } else {
                    this.currentMenu.escape()
                }
                this.inputs_buffer[menu.key] = false
            }
        });



        if (!this.pause) {


            for (let i = 0; i < this.GameObjects.length; i++) { // running through the list of objects they are not in a specific room
                // Draw

                if (this.GameObjects[i].fitToCameraOptimisation == true) {
                    if (this.checkInScreen(this.GameObjects[i])) {
                        this.GameObjects[i].draw()
                        // Step Events
                        this.GameObjects[i].onStep()
                    }
                } else {
                    this.GameObjects[i].draw()
                    // Step Events
                    this.GameObjects[i].onStep()
                }


            }
            if (this.Rooms.length) { // if the list of room is empty skip the running through of room's objects
                for (let i = 0; i < this.Rooms[this.CurrentRoom].gameObjects; i++) {
                    // Draw Events
                    this.Rooms[this.CurrentRoom].gameObjects[i].sprite.draw()
                    // Step Events
                    this.Rooms[this.CurrentRoom].gameObjects[i].onStep()

                    if (this.Rooms[this.CurrentRoom].gameObjects[i].kill == true) {
                        this.Rooms[this.CurrentRoom].gameObjects[i].onKill()
                    }
                }
            }

        }
        for (let i = this.GameObjects.length - 1; i >= 0; i--) {
            if (this.GameObjects[i].kill == true) {
                this.GameObjects[i].onKill();

                if (this.GameObjects[i] instanceof TextObject) {
                    //console.log(this.GameObjects[i])
                    this.GameObjects[i].container.remove();
                } else {
                    this.GameObjects[i].sprite.container.remove();
                }


                this.objAreInKilling -= 1
                this.GameObjects[i].kill == false;
                deleteFromArray(this.GameObjects, i)// Utiliser splice directement pour supprimer l'élément
            }
        }

        this.lastFrameTime = timestamp - (deltaTime % this.targetDeltaTime)

    }
    keyboardCheck(key) {
        return this.inputs[key]
    }
    killObject(obj) {
        obj.kill = true
        this.objAreInKilling += 1
    }
    checkInScreen(gO) {


        return (gO.x + gO.sprite.getSize().width * gO.sprite.scale + 10 > this.cameraX && gO.x - gO.sprite.getSize().width / 2 < this.cameraX + this.cameraWidth)
    }

}

export { Game };