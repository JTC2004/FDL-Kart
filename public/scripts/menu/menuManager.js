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
		import Menu_Settings from "./screens/menu_settings.js";
	

//Variables:
	//Essentials:
		let SCENE;
		let RENDERER;
		let LOADER;
		let CAMERA;
		let a_INPUTS;

	var int_depth = 0;							//The depth of the menu stack.
	let currentMenu;							//Equals the current menu screen object.
	var nextMenu = null;						//Equals the next menu to transition to ONLY on the frame a transition must occur.
	let a_prevMenus = [];						//A stack of the previous menu screens visited so far.
	//var int_frames = 0;
	var b_return = false;						//When true, gameplay starts.
	var b_entering = false;						//Only equals true while transitioning into a menu menu.
	var b_exiting = false;						//Only equals true while transitioning out of a menu.
	const int_baseCameraPos = 11;
	let fillLight1;								//The light for objects in menus.
	const p_finish0 = document.getElementById("p_finish0");


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
		CAMERA.position.set( 0, 0, int_baseCameraPos );
    	CAMERA.lookAt( 0, 0, 0 );

		const color = 0xfffde6;
		fillLight1 = new THREE.HemisphereLight( color, 0x77756a, 3 );
		fillLight1.position.set( 2, 2, 1 );
		this.fn_startMenus();

		//Set the first menu:
		currentMenu = new Menu_0_main(this, 0);
		//currentMenu = new Menu_Settings(this);

		//Debug mode:
		if(window.b_debug){
			
		}
	}

	//The menu loop:
	fn_update(){
		currentMenu.fn_update(a_INPUTS);
		
		//Going to previous menu if player presses B AND they are not at the top menu:
		if(a_INPUTS[0].fn_press_drift() && currentMenu.fn_getBackOk() && a_prevMenus.length > 0){
			this.fn_prevMenu();
		}

		//Going to next menu:
		if(nextMenu){
			currentMenu?.fn_exit(false);				//Call the function for the current menu's exit transition.
												//? mark means: if currentMenu exists, call onExit(). Otherwise, do nothing."
			a_prevMenus.push(currentMenu);
			currentMenu = nextMenu;
			int_depth ++;
			b_entering = true;
			b_exiting = false;
			nextMenu = null;					//Don't forget to do this!

			currentMenu.fn_enter();				//Call the function for the current menu's entrance transition.
		}
		
		//CAMERA.position.z -= 0.3;
		/*console.log(`Menu Camera position = (
			${CAMERA.position.x},
			${CAMERA.position.y},
			${CAMERA.position.z},
		)`);*/

		//Moving the camera during menu transitions:
		if(b_entering || b_exiting){
			const f_newPos = a_prevMenus.length * -20 + int_baseCameraPos;	//New position for the camera.

			if(b_entering){
				CAMERA.position.z -= 1.5;
				a_prevMenus[int_depth - 1].fn_updateOpacities();
				
				if(CAMERA.position.z <= f_newPos){
					b_entering = false;
					CAMERA.position.z = f_newPos;
				}
			}
			else if(b_exiting){
				CAMERA.position.z += 1.5;
				
				//Stop camera movement:
				if(CAMERA.position.z >= f_newPos){
					b_exiting = false;
					CAMERA.position.z = f_newPos;
				}
			}
		}

		//Tilting menu with c-stick:
		CAMERA.rotation.y = a_INPUTS[0].fn_get_rightX() / 10;
		CAMERA.rotation.x = a_INPUTS[0].fn_get_rightY() / 10;

		//int_frames ++;
		//Update the current menu:
		return b_return;
	}

	//Call this to go forwards one menu screen.
	//This method will be called inside of menu objects.
	fn_nextMenu(menu){						//The menu object here is a general/parent menu object.		
		nextMenu = menu;
	}

	//Call this to go back one menu screen.
	fn_prevMenu(){
		currentMenu?.fn_exit(true);
		currentMenu = a_prevMenus.pop();
		currentMenu.fn_enter();
		int_depth -= 1;

		b_exiting = true;
		b_entering = false;
	}

	//Call this only once when menus start:
	fn_startMenus(){
		SCENE.add( fillLight1 );
	}

	//Call this to switch to gameplay loop:
	fn_startGameplay(){
		SCENE.remove( fillLight1 );
		b_return = true;
		currentMenu?.fn_exit(true);
		fn_clearScene();						//Might need to remove this later.
		//p_finish0.innerHTML = "Hold on a sec...";
	}
}
