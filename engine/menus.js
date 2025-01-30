import { TextObject } from "./textobject.js"

/**
 * A Game Menu(With things like buttons and Texts) 
 * WIP(Checkboxes and slidebars)
 * @class
 */
class Menu {
	constructor(w, h, title, pause_require = true, key = undefined, z = 15) {
		this.pauseRequired = pause_require;
		this.key = key;
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

		/** @type {Array<HTMLButtonElement>} */
		this.buttons = [];

		/** @type {Array<TextObject>} */
		this.texts = [];

		/** @type {Array<HTMLInputElement>} */
		this.inputs = [];

		/** @type {Array<HTMLLabelElement>} */
		this.labels = [];

	}

	/**
	* A method to add a button to the menu 
	* @param {string} title - The title of the button
	* @param {function} funct - The function to execute on click of the button
	*/
	addButton(title, funct) {
		let b_id = this.buttons.push(document.createElement("button"));

		this.buttons[b_id - 1].textContent = title;
		this.buttons[b_id - 1].onclick = funct;
		this.buttons[b_id - 1].style.zIndex = this.z + 1
		this.container.appendChild(this.buttons[b_id - 1])
	}

	/**
	* A method to add a textfield on the menu
	* @param {string} content - The content of the textfield
	*/
	addText(content) {
		let t_id = this.texts.push(document.createElement("p"))
		this.texts[t_id - 1].style.zIndex = this.z + 1
		this.texts[t_id - 1].textContent = content
		this.container.appendChild(this.texts[t_id - 1])
	}

	/**
	* A method to add a button to the menu 
	* @param {string} label - The title of the button
	* @param {string} type - Type of input
	* @param {Type} attemptedOutput - Type of the attempted output
	* @param {function(any)} outputFunct - The function handled on change of the argment inputed is the input of the field
	*/
	addInput(label, type, outputFunct) {
		let input_id = this.inputs.push(document.createElement("input"));

		let lab_id = this.labels.push(document.createElement("label"));

		this.inputs[input_id - 1].type = type;
		this.inputs[input_id - 1].id = "id_input_" + input_id.toString();
		this.inputs[input_id - 1].addEventListener("change", outputFunct);

		this.labels[lab_id - 1].htmlFor = this.inputs[input_id - 1].id;
		this.labels[lab_id - 1].textContent = label;

		this.container.appendChild(this.labels[lab_id - 1]);
		this.container.appendChild(this.inputs[input_id - 1]);
	}

}


export { Menu }