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
		import Menu_1A_gameMode from "./screens/menu_1A_gameMode.js";
	

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
	var b_return = false;						//When true, gameplay starts.
	let fillLight1;								//The light for objects in menus.


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

		const color = 0xfffde6;
		fillLight1 = new THREE.HemisphereLight( color, 0x77756a, 3 );
		fillLight1.position.set( 2, 2, 1 );

		//Set the first menu:
		currentMenu = new Menu_0_main(this);
		//currentMenu = new Menu_1_gameMode(this);
		//currentMenu = new Menu(this);


		//Debug mode:
		if(window.b_debug){
			
		}
	}

	//The menu loop:
	fn_update(){
		//Update the current menu:
		currentMenu.fn_update(a_INPUTS, int_frames);

		//Going to previous menu if player presses B AND they are not at the top menu:
		if(a_INPUTS[0].fn_press_drift() && a_prevMenus.length > 0){
			this.fn_prevMenu();
		}


		int_frames ++;
		return b_return;
	}

	//Call this to go forwards one menu screen.
	//This method will be called inside of menu objects.
	fn_nextMenu(menu){						//The menu object here is a general/parent menu object.		
		currentMenu?.fn_exit();				//Call the function for the current menu's exit transition.
												//? mark means: if currentMenu exists, call onExit(). Otherwise, do nothing."
		a_prevMenus.push(currentMenu);
		currentMenu = menu;

        currentMenu.fn_enter();				//Call the function for the current menu's entrance transition.
	}

	//Call this to go back one menu screen.
	fn_prevMenu(){
		currentMenu?.fn_exit();
		currentMenu = a_prevMenus.pop();
		currentMenu.fn_enter();
	}

	//Call this only once when menus start:
	fn_startMenus(){
		SCENE.add( fillLight1 );
	}

	//Call this to switch to gameplay loop:
	fn_startGameplay(){
		currentMenu?.fn_exit();
		SCENE.remove( fillLight1 );
		b_return = true;
	}
}
