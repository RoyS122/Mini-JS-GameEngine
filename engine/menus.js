/**
 * A Game Menu(With things like buttons and Texts) 
 * WIP(Checkboxes and slidebars)
 * @class
 */
class Menu {
	constructor(w, h, title, pause_require = true, key = undefined, z = 15) {
		this.pauseRequired = pause_require
		this.key = key
		this.z = z
		this.w = w
		this.h = h;
		this.title_obj = document.createElement("h1")
		this.title_obj.textContent = title
		this.title_obj.style.opacity = 1;
		this.title_obj.style.opacity = z + 1;
		this.container = document.createElement("div")
		this.container.className = "menu";
		this.container.style.zIndex = z
		this.container.appendChild(this.title_obj)
		this.buttons = []
        this.texts = []
	}
	
	addButton(title, funct) {
		let b_id = this.buttons.push(document.createElement("button"));
		
		this.buttons[b_id - 1].textContent = title;
		this.buttons[b_id - 1].onclick = funct;
		this.buttons[b_id - 1].style.zIndex = this.z + 1
		this.container.appendChild(this.buttons[b_id - 1])

		
	}
    
    addText(content) {
        let t_id = this.texts.push(document.createElement("p"))
        this.texts[t_id - 1].style.zIndex = this.z + 1
        this.texts[t_id - 1].textContent = content
        this.container.appendChild(this.texts[t_id - 1])
    }
	
}


export {Menu}