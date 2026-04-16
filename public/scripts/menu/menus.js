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

		import Kart from "../game/objects/kart.js";
		import Character from "../game/objects/character.js";



	//Objects:
		import Option from "./option.js";
	

//Variables:
	//Essentials:
		let scene;
		let renderer;
		let loader;
		let camera;
		let a_inputs;

	var b_isInitialized = false;

	var str_currentMenu = "Main";
	str_currentMenu = "1P Character Select";

	var str_parentMenu = "";
	var str_lastMenu = "";
	var a_options = [];
	var a_selected = [0, 0];
	var a_prevSelected = [-1, -1];
	var b_slideIn = true;
	let kart;
	let a_characters;
	let int_charIndex = 0;
	var int_frames = 0;

	//console.log("str_currentMenu = " + str_currentMenu);


//Initializing the scene:
function fn_initializeMenus(){
		document.getElementById("img_itemSlot0-0").style.display = "none";
		document.getElementById("img_itemSlot0-1").style.display = "none";
		document.getElementById("img_itemSlot0-2").style.display = "none";
	
		scene = fn_getScene();
		renderer = fn_getRenderer();
		loader = fn_getLoader();
		camera = fn_getMenuCamera();
		a_inputs = fn_getInputs();

		//Render background:
		//renderer.setClearColor( 0x40aaf2, 1);
		renderer.setClearColor( 0x006492, 1);

		//A light is required for MeshPhongMaterial to be seen:
		/*const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
		directionalLight.position.set (1, 1, 3);
		directionalLight.position.z = 3;
		scene.add(directionalLight);*/

		//Debug mode:
		if(window.b_debug){
			str_currentMenu == "start";	//Game Mode for debug.
		}
}

//The menu loop:
export function fn_updateMenus(){
	
	//Initializing variables dependent on scene, camera, etc.
	if(!b_isInitialized){
		fn_initializeMenus();
		b_isInitialized = true;
	}
	const input = a_inputs[0];

	//If menu has changed, update UI elements:
	if(str_lastMenu != str_currentMenu){
		//Remove all elements from the scene:
		fn_clearScene();
		
		//Reset variables:
		a_options = [];
		a_selected = [0, 0];
		a_prevSelected = [-1, -1]
		camera.rotation.y = -1.0;
		b_slideIn = true;
		
		if(str_currentMenu == "start"){
			return true;
		}
		else if(Number.isInteger(Number(str_currentMenu))){
			//console.log("CHANGE MODE");
			window.int_gameMode = Number(str_currentMenu);

			if(window.int_gameMode > 3){
				str_currentMenu = "2P Character Select";
			}
			else{
				str_currentMenu = "1P Character Select"
			}
		}

		if(str_currentMenu == "Main"){
			camera.rotation.y = -1.24;
			str_parentMenu = "";
			a_options.push([
				new Option(str_currentMenu, [fn_inRow(4.25, 0, 4), 1, 0], [1, 1.24], "Single Play", "large"),
				new Option(str_currentMenu, [fn_inRow(4.25, 1, 4), 1, 0], [1, 1.24], "Split-Screen", "large"),
				new Option(str_currentMenu, [fn_inRow(4.25, 2, 4), 1, 0], [1, 1.24], "Online Play", "large"),
				new Option(str_currentMenu, [fn_inRow(4.25, 3, 4), 1, 0], [1, 1.24], "FDL Kart Channel", "large")
				
			]);
			a_options.push([
				new Option(str_currentMenu, [fn_inRow(5.8, 0, 3), -2.2, 0], [1.3, .35], "Settings", "horizontal medium"),
				new Option(str_currentMenu, [fn_inRow(5.75, 1, 3), -2.2, 0], [1.75, .35], "How to Play", "horizontal large"),
				'dum',
				new Option(str_currentMenu, [fn_inRow(5.75, 2, 3), -2.2, 0], [1.3, .35], "Records", "horizontal medium"),
			]);
		}
		else if(str_currentMenu == "Single Play/Game Mode"){
			str_parentMenu = "Main";
			a_options.push([
				new Option(str_currentMenu, [-3.75, 3, 0], [2.2, .42], "Grand Prix", "horizontal large"),
				'dum'
			]);
			a_options.push([
				new Option(str_currentMenu, [-3.75, 1.25, 0], [2.2, .42], "Time Trials", "horizontal large"),
				'dum'
			]);
			a_options.push([
				new Option(str_currentMenu, [-3.75, -.5, 0], [2.2, .42], "Missions", "horizontal large"),
				'dum'
			]);
			a_options.push([
				new Option(str_currentMenu, [-5.7, -2.05, 0], [1.05, .3], "Practice", "horizontal medium"),
				new Option(str_currentMenu, [-1.8, -2.05, 0], [1.05, .3], "Free Play", "horizontal medium"),
			]);
		}
		else if(str_currentMenu == "1P Character Select"){
			str_parentMenu = "Single Play/Game Mode";
			a_options.push([
				new Option(str_currentMenu, [fn_inRow(2.25, 0, 4) + 3, 1.5, 0], [.6, .6], "chara_Maple", "large"),
				new Option(str_currentMenu, [fn_inRow(2.25, 1, 4) + 3, 1.5, 0], [.6, .6], "chara_Enoki", "large"),
				new Option(str_currentMenu, [fn_inRow(2.25, 2, 4) + 3, 1.5, 0], [.6, .6], "chara_Aaron", "large"),
				new Option(str_currentMenu, [fn_inRow(2.25, 3, 4) + 3, 1.5, 0], [.6, .6], "chara_Rufus", "large")
			]);
			a_options.push([
				new Option(str_currentMenu, [fn_inRow(2.25, 0, 4) + 3, -1, 0], [.6, .6], "chara_(unlockable)", "large"),
				new Option(str_currentMenu, [fn_inRow(2.25, 1, 4) + 3, -1, 0], [.6, .6], "chara_(unlockable)", "large"),
				new Option(str_currentMenu, [fn_inRow(2.25, 2, 4) + 3, -1, 0], [.6, .6], "chara_(unlockable)", "large"),
				new Option(str_currentMenu, [fn_inRow(2.25, 3, 4) + 3, -1, 0], [.6, .6], "chara_(unlockable)", "large")
			]);

			const color = 0xfffde6;
			const fillLight1 = new THREE.HemisphereLight( color, 0x77756a, 3 );
			fillLight1.position.set( 2, 2, 1 );
			scene.add( fillLight1 );

			kart = new Kart([-5, -1, 0], 1, .2);
			a_characters = [
				new Character([-5.5, .6, -1], 1, 2, "Maple", 0, true),
				new Character([-5, -0.4, 1], 1, 2, "", 0, true),
			];
			a_characters[0].fn_setSpriteTile(5, 0);
			a_characters[1].fn_setSpriteTile(4, 1);
			int_charIndex = 0;
			//console.log(`${kart.fn_getType()}`);
		}
		else if(str_currentMenu == "2P Character Select"){
			str_parentMenu = "Main";
			a_options.push([
				new Option(str_currentMenu, [-.25, .25, 0], [3.2, 1.6], "Connect Controller", "horizontal medium"),
			]);
		}
		else if(str_currentMenu == "Settings"){
			str_parentMenu = "Main";
			a_options.push([
				new Option(str_currentMenu, [-3.6, 3, 0], [2.5, .45], "Resolution", "horizontal large"),
			]);
			a_options.push([
				new Option(str_currentMenu, [-3.6, 1, 0], [2.5, .45], "SharpPixels", "horizontal large"),
			]);
		}
		else if(str_currentMenu == "How to Play"){
			str_parentMenu = "Main";
			a_options.push([
				new Option(str_currentMenu, [-.25, 2.2, 0], [3.2, 1], "Controls (gamepad)", "horizontal large"),
			]);
			a_options.push([
				new Option(str_currentMenu, [-.25, -1.8, 0], [3.2, 1], "Controls (keyboard)", "horizontal large"),
			]);
		}
		
		str_lastMenu = str_currentMenu;
	}

	//Player input:
	if(a_options[a_selected[1]].length > 0){
		if(input.fn_press_right()){
			a_selected[0] += 1;
		}
		if(input.fn_press_left()){
			a_selected[0] -= 1;
		}
	}
	if(a_options.length > 1){
		if(input.fn_press_forward()){
			a_selected[1] -= 1;
		}
		if(input.fn_press_back()){
			a_selected[1] += 1;
		}
	}
	
	
	//Confirming an option:
	if(input.fn_press_accelerate()){
		for(let i = 0; i < a_options.length; i++){
			for(let e = 0; e < a_options[i].length; e++){
				if(typeof(a_options[i][e]) != "string" && a_options[i][e].fn_isSelected() && a_options[i][e].fn_confirm() != ""){
					str_currentMenu = a_options[i][e].fn_confirm();
					//console.log("str_currentMenu = " + str_currentMenu);
				} 
			}
		}
	}
	//Going back to previous menu:
	if(input.fn_press_drift()){
		if(str_parentMenu != ""){
			str_currentMenu = str_parentMenu;
		}
	}

	//Making sure selected doesn't overflow:
	fn_overflowCheck(a_selected);

	
	//If player moves the highlighted option:
	if(a_selected[0] !== a_prevSelected[0] || a_selected[1] !== a_prevSelected[1]){
		//console.log("a_selected = " + a_selected + "\t a_prevSelected = " + a_prevSelected);
		//De-selecting:
		if(a_prevSelected[1] > -1 && a_prevSelected[0] > -1)
		{
			//Accounting for de-selecting an option that is 2 blocks long:
			if(typeof(a_options[a_prevSelected[1]][a_prevSelected[0]]) == "string"){
				if(input.fn_press_left()){
					a_selected[0] -= 1;
					fn_overflowCheck(a_selected);
					//console.log("PUSH LEFT");
				}
				a_options[a_prevSelected[1]][a_prevSelected[0] - 1].fn_deSelect();
			}
			else{
				a_options[a_prevSelected[1]][a_prevSelected[0]].fn_deSelect();
			}
		}
		//Selecting:
		//Accounting for selecting an option that is 2 blocks long:
		if(typeof(a_options[a_selected[1]][a_selected[0]]) == "string"){
			if(input.fn_press_right()){
				a_selected[0] += 1;
				//console.log("PUSH RIGHT");
				fn_overflowCheck(a_selected);
				a_options[a_selected[1]][a_selected[0]].fn_select();
			}
			else{
				a_options[a_selected[1]][a_selected[0] - 1].fn_select();
			}
		}
		else{
			a_options[a_selected[1]][a_selected[0]].fn_select();
		}
		
		
		a_prevSelected[0] = a_selected[0];
		a_prevSelected[1] = a_selected[1];
	}

	//If an option has arrows:
	for(let i = 0; i < a_options.length; i++){
		for(let obj_option of a_options[i]){
			if(typeof(obj_option) != "string"){
				//console.log("Option has arrows.");		//Debug print.

				obj_option.fn_update(input, camera.rotation.y);
			}
		}
	}

	//Options sliding in:
	if(b_slideIn && camera.rotation.y < 0){
		camera.rotation.y += 0.04;
	}
	else{
		//Tilting menu w/ c-stick:
		b_slideIn = false;
		camera.rotation.z = input.fn_get_rightX() / 10;
		camera.rotation.x = input.fn_get_rightY() / 10;
	}

	//Kart on character select:
	if(kart){
		kart.fn_setRotation(new THREE.Vector3(.4, 3.49066, 0));
	}
	if(a_characters){
		a_characters[0].fn_menuUpdate(input, int_frames);
		a_characters[1].fn_menuUpdate(input, int_frames);
		
		if(input.fn_press_left() || input.fn_press_right() || input.fn_press_forward() || input.fn_press_back()){
			for(let i = 0; i < a_options.length; i++){
				for(let e = 0; e < a_options[i].length; e++){
					if(a_options[i][e].fn_isSelected()){
						a_characters[int_charIndex].fn_setCharacter(a_options[i][e].fn_getCharText());
						a_characters[0].fn_setSpriteTile(5, 0);
						a_characters[1].fn_setSpriteTile(4, 1);
					} 
				}
			}
		}	
	}

	//renderer.render( scene, camera );
	int_frames ++;
	return false;
}

//Make coordinates in an evenly spaced row that accounts for screen size (ChatGPT helped with this):
function fn_inRow(_spacing, _spriteNum, _spriteCount){

	const totalSpan = _spacing * (_spriteCount - 1); // total width of all spacings
	const startX = -totalSpan / 2;

	return startX + _spriteNum * _spacing;
}



//Make sure the selected option isn't out of bounds:
function fn_overflowCheck(_a){
	if(_a[1] >= a_options.length){
		//console.log("lower bound hit");
		_a[1] = 0;
	}
	if(_a[1] < 0){
		//console.log("upper bound hit");
		_a[1] = a_options.length - 1;
	}
	if(_a[0] >= a_options[_a[1]].length){
		//console.log("right bound hit");
		_a[0] = 0;
	}
	if(_a[0] < 0){
		//console.log("left bound hit");
		_a[0] = a_options[_a[1]].length - 1;
	}	
}


