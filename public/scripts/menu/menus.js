//This file contains the main menus.

//Imports:
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	
//Class imports:
	//import gameLoop from "../GameLoop.js";
	//import InputHandler from "../inputKB.js";

	import Option from "./option.js";

//Variables:
	var b_isInitialized = false;

	var str_currentMenu = "Main";
	var str_parentMenu = "";
	var str_lastMenu = "";
	var a_options = [];
	var a_selected = [0, 0];
	var a_prevSelected = [-1, -1];
	var b_slideIn = true;

	//console.log("str_currentMenu = " + str_currentMenu);


//Initializing the scene:
function fn_initializeMenus(renderer){

		//Render background:
		renderer.setClearColor( 0x40aaf2, 1);
		//renderer.setClearColor( 0x003e5b, 1);

		//A light is required for MeshPhongMaterial to be seen:
		/*const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
		directionalLight.position.set (1, 1, 3);
		directionalLight.position.z = 3;
		scene.add(directionalLight);*/
}

//The menu loop:
export function fn_updateMenus(input, scene, camera, renderer){
	
	//Initializing variables dependent on scene, camera, etc.
	if(!b_isInitialized){
		fn_initializeMenus(renderer);
		b_isInitialized = true;
	}

	//If menu has changed, update UI elements:
	if(str_lastMenu != str_currentMenu){
		//First, be sure to remove and unload the current menu elements:
		for(let i = 0; i < a_options.length; i++){
			for(let e = 0; e < a_options[i].length; e++){
				if(typeof(a_options[i][e]) != "string"){
					a_options[i][e].fn_remove(scene);
					//console.log("Should be removed");
				}
			}
		}

		//Reset variables:
		a_options = [];
		a_selected = [0, 0];
		a_prevSelected = [-1, -1]
		camera.rotation.y = -1.0;
		b_slideIn = true;
		
		if(Number.isInteger(Number(str_currentMenu))){
			console.log("CHANGE MODE");
			window.int_gameMode = Number(str_currentMenu);

			

			return true;
		}
		else if(str_currentMenu == "Main"){
			camera.rotation.y = -1.24;
			str_parentMenu = "";
			a_options.push([
				new Option(scene, str_currentMenu, [fn_inRow(4.25, 0, 4), 1, 0], [1, 1.24], "Single Play", "large"),
				new Option(scene, str_currentMenu, [fn_inRow(4.25, 1, 4), 1, 0], [1, 1.24], "Split-Screen", "large"),
				new Option(scene, str_currentMenu, [fn_inRow(4.25, 2, 4), 1, 0], [1, 1.24], "Online Play", "large"),
				new Option(scene, str_currentMenu, [fn_inRow(4.25, 3, 4), 1, 0], [1, 1.24], "FDL Kart Channel", "large")
				
			]);
			a_options.push([
				new Option(scene, str_currentMenu, [fn_inRow(5.8, 0, 3), -2.2, 0], [1.3, .35], "Settings", "horizontal medium"),
				new Option(scene, str_currentMenu, [fn_inRow(5.75, 1, 3), -2.2, 0], [1.75, .35], "How to Play", "horizontal large"),
				'dum',
				new Option(scene, str_currentMenu, [fn_inRow(5.75, 2, 3), -2.2, 0], [1.3, .35], "Records", "horizontal medium"),
			]);
		}
		else if(str_currentMenu == "Single Play/Game Mode"){
			str_parentMenu = "Main";
			a_options.push([
				new Option(scene, str_currentMenu, [-3.75, 3, 0], [2.2, .42], "Grand Prix", "horizontal large"),
				'dum'
			]);
			a_options.push([
				new Option(scene, str_currentMenu, [-3.75, 1.25, 0], [2.2, .42], "Time Trials", "horizontal large"),
				'dum'
			]);
			a_options.push([
				new Option(scene, str_currentMenu, [-3.75, -.5, 0], [2.2, .42], "Missions", "horizontal large"),
				'dum'
			]);
			a_options.push([
				new Option(scene, str_currentMenu, [-5.7, -2.05, 0], [1.05, .3], "Practice", "horizontal medium"),
				new Option(scene, str_currentMenu, [-1.8, -2.05, 0], [1.05, .3], "Free Play", "horizontal medium"),
			]);
		}
		else if(str_currentMenu == "Settings"){
			str_parentMenu = "Main";
			a_options.push([
				new Option(scene, str_currentMenu, [-3.6, 3, 0], [2.5, .45], "Resolution", "horizontal large"),
			]);
			a_options.push([
				new Option(scene, str_currentMenu, [-3.6, 1, 0], [2.5, .45], "SharpPixels", "horizontal large"),
			]);
		}
		else if(str_currentMenu == "How to Play"){
			str_parentMenu = "Main";
			a_options.push([
				new Option(scene, str_currentMenu, [-.25, 2.2, 0], [3.2, 1], "Controls (gamepad)", "horizontal large"),
			]);
			a_options.push([
				new Option(scene, str_currentMenu, [-.25, -1.8, 0], [3.2, 1], "Controls (keyboard)", "horizontal large"),
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

	//renderer.render( scene, camera );
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


