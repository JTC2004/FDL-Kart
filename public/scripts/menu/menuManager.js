//This file contains the main menus.

//Imports:
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	//import ItemBox from "../game/objects/itemBox.js";
	import Object from "../game/object.js";
	
//Class imports:
	//Essentials:
		import { fn_getScene } from "../main.js";
		import { fn_clearScene } from "../main.js";
		import { fn_getRenderer } from "../main.js";
		import { fn_getLoader } from "../main.js";
		import { fn_getMenuCamera } from "../main.js";
		import { fn_getInputs } from "../main.js";


	//Objects:
		import Option from "./option.js";
		import Menu from "./menu.js";
	//Menus:
		import Menu_0_main from "./screens/menu_0_main.js";
		import Menu_1_gameMode from "./screens/menu_1_gameMode.js";
	

//Variables:
	//Essentials:
		let SCENE;
		let RENDERER;
		let LOADER;
		let CAMERA;
		let a_INPUTS;

	let currentMenu;							//Equals the current menu screen object.
	let a_prevMenus = [];						//A stack of the previous menu screens visited so far.
	var int_frames = 0;


export default class MenuManager{
	
	constructor(){
		document.getElementById("img_itemSlot0-0").style.display = "none";
		document.getElementById("img_itemSlot0-1").style.display = "none";
		document.getElementById("img_itemSlot0-2").style.display = "none";
	
		SCENE = fn_getScene();
		RENDERER = fn_getRenderer();
		LOADER = fn_getLoader();
		CAMERA = fn_getMenuCamera();
		a_INPUTS = fn_getInputs();

		//Render background:
		//renderer.setClearColor( 0x40aaf2, 1);
		RENDERER.setClearColor( 0x006492, 1);

		//A light is required for MeshPhongMaterial to be seen:
		/*const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
		directionalLight.position.set (1, 1, 3);
		directionalLight.position.z = 3;
		scene.add(directionalLight);*/

		//Set the first menu:
		//currentMenu = new Menu_0_main(this);
		currentMenu = new Menu_1_gameMode(this);
		//currentMenu = new Menu(this);


		//Debug mode:
		if(window.b_debug){
			
		}
	}

	//The menu loop:
	fn_update(){
		//Update the current menu:
		currentMenu.fn_update(a_INPUTS, int_frames);




		int_frames ++;
		return false;
	}

	//Call this to go forwards one menu screen.
	//This method will be called inside of menu objects.
	fn_nextMenu(menu){						//The menu object here is a general/parent menu object.
		currentMenu?.fn_onExit();				//Call the function for the current menu's exit transition.
												//? mark means: if currentMenu exists, call onExit(). Otherwise, do nothing."
		
		a_prevMenus.push(currentMenu);
		currentMenu = menu;

        currentMenu.fn_onEnter();				//Call the function for the current menu's entrance transition.
	}

	//Call this to go back one menu screen.
	fn_prevMenu(){
		
	}
}
