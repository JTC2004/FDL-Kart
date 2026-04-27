//This file contains the game logic.

//Bugs to fix:
// 	- Not handling multiple inputs well while drifting. 
//	- Progress when going backwards in a track.


//Imports:
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	
	import { Octree } from 'three/addons/math/Octree.js';
	import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';
	
//Class imports:
	//Essentials:
		import { fn_getScene } from "../main.js";
		import { fn_getRenderer } from "../main.js";
		import { fn_getLoader } from "../main.js";
		import { fn_getCameras } from "../main.js";
		import { fn_isMultiplayer } from "../main.js";
		import { fn_getInputs } from "../main.js";
		import { fn_getMap } from "../main.js";
	//Objects:
		import Player from "./player.js";
		import Map from "./map.js";
	

//Variable initializations:
	//Essentials:
		let scene;
		let renderer;
		let loader;
		let a_cameras;
		let a_inputs;

		let b_multiplayer;
		let str_map;

	const a_objects = [];
	const a_objectsDSOC = [];
	const a_checkpoints = [];
	let map;
	
	const worldOctree = new Octree();		//Collision detector initialization.
	const offroadOctree = new Octree();		//Offroad detector initialization.
	
	var b_updateHUD = true;
	var b_playerDone = false;
	var a_players = [];

//DB stuff:
	let str_url;
	let request;

//Variable initializations for game loop:
	var int_frames = 0;
	let f_secs = 0.0001;
	var int_secsElapsed = 0;
	let timer = performance.now();
	var b_paused = false;
	var coordsButton = document.getElementById("p_coords");
	var b_isInitialized = false;
	let promise_init = null;
	


//This method runs once when gameplay is started:	
async function fn_initializeGame(){
	
	scene = fn_getScene();
	renderer = fn_getRenderer();
	loader = fn_getLoader();
	a_cameras = fn_getCameras();
	a_inputs = fn_getInputs();

	b_multiplayer = fn_isMultiplayer();
	str_map = fn_getMap();

	//Displaying username:
	//Do AJAX call to get name from getName.php, and append it to p_name.
	str_url = "scripts/getName.php";
	request = new XMLHttpRequest();
	request.open("GET", str_url, true);
	request.onreadystatechange = fn_displayName;
	request.send(null);

	map = new Map(str_map, worldOctree, offroadOctree);
	await map.addModels(worldOctree, offroadOctree);

	//Add checkpoints & background:
	map.fn_addCheckpoints(a_checkpoints);
	//Add static objects:
	map.fn_addObjectsStatic(a_objects, worldOctree);

	//Adding player(s):
	for(let i = 0; i < a_inputs.length; i++){
		a_players.push(new Player(
			i, 
			map.fn_getMapPos(i),
			window.a_characters[i],
			1, 
			a_checkpoints.length, 
			map.fn_getNumKeys(), 
			map.fn_getNumLaps()
		));

		//console.log(`window.a_characters[0] = ${window.a_characters[0]}`);
		//REMEMBER TO PUSH OTHER NON-STATIC COLLIDABLE OBJECTS AFTER PLAYERS!!
		a_objectsDSOC.push(a_players[i]);

		//Adding item slot UI for this player:
		document.getElementById(`img_itemSlot${i}-0`).style.display = "block";
		document.getElementById(`img_itemSlot${i}-1`).style.display = "block";
		document.getElementById(`img_itemSlot${i}-2`).style.display = "block";

		//If there is only 1 camera, break.
		if(b_multiplayer){
			//Multiplayer-only stuff here.
		}
		else{
			break;
		}
	}

	//Adding non-static objects:
	map.fn_addObjectsDSOC(a_objects, a_objectsDSOC);

	//Adjusting UI based on multiplayer:
	if(b_multiplayer){
		document.getElementById("p_time").style.left = "40%";
		
		//2 player:
		if(a_inputs.length < 3){
			

			document.getElementById(`p_laps0`).style.left = "2.5%";
			document.getElementById(`p_laps0`).style.top = "72%";
			document.getElementById(`p_spd0`).style.left = "2.5%";
			document.getElementById(`p_finish0`).style.left = "-25%";

			document.getElementById(`p_laps1`).style.left = "84.5%";
			document.getElementById(`p_laps1`).style.top = "72%";
			document.getElementById(`p_spd1`).style.left = "84.5%";
			document.getElementById(`p_finish1`).style.left = "25%";
		}
		//3 Players or more:
		else{
			document.getElementById("p_time").style.left = "40%";
			document.getElementById("p_time").style.top = "41%";
			
			document.getElementById(`p_laps0`).style.left = "2.5%";
			document.getElementById(`p_laps0`).style.top = "31%";
			document.getElementById(`p_laps0`).style.fontSize = "2.2vw";
			document.getElementById(`p_spd0`).style.left = "2.5%";
			document.getElementById(`p_spd0`).style.top = "37%";
			document.getElementById(`p_spd0`).style.fontSize = "2.2vw";
			document.getElementById(`p_finish0`).style.left = "-25%";
			document.getElementById(`p_finish0`).style.top = "-1%";

			document.getElementById(`p_laps1`).style.left = "84.5%";
			document.getElementById(`p_laps1`).style.top = "31%";
			document.getElementById(`p_laps1`).style.fontSize = "2.2vw";
			document.getElementById(`p_spd1`).style.left = "84.5%";
			document.getElementById(`p_spd1`).style.top = "37%";
			document.getElementById(`p_spd1`).style.fontSize = "2.2vw";
			document.getElementById(`p_finish1`).style.left = "25%";
			document.getElementById(`p_finish1`).style.top = "-1%";

			document.getElementById(`p_laps2`).style.left = "2.5%";
			document.getElementById(`p_laps2`).style.top = "81%";
			document.getElementById(`p_laps2`).style.fontSize = "2.2vw";
			document.getElementById(`p_spd2`).style.left = "2.5%";
			document.getElementById(`p_spd2`).style.top = "87%";
			document.getElementById(`p_spd2`).style.fontSize = "2.2vw";
			document.getElementById(`p_finish2`).style.left = "-25%";
			document.getElementById(`p_finish2`).style.top = "52%";

			document.getElementById(`p_laps3`).style.left = "84.5%";
			document.getElementById(`p_laps3`).style.top = "81%";
			document.getElementById(`p_laps3`).style.fontSize = "2.2vw";
			document.getElementById(`p_spd3`).style.left = "84.5%";
			document.getElementById(`p_spd3`).style.top = "87%";
			document.getElementById(`p_spd3`).style.fontSize = "2.2vw";
			document.getElementById(`p_finish3`).style.left = "25%";
			document.getElementById(`p_finish3`).style.top = "52%";
		}
	}
	
	b_isInitialized = true;
}


//The game loop:
export function fn_updateGame(f_fps){
	//console.log("Game is running");
	
	//Start initialization ONCE:
	if(!promise_init){
		promise_init = fn_initializeGame();
		return true; // skip frame
	}
	//Wait until it's done
	if(promise_init && !b_isInitialized){
		return true; // still loading, skip update
	}

		//Displaying FPS:
			if(window.b_debug){	
				var fpsButton = document.getElementById("p_fps");
				fpsButton.innerHTML = "FPS = " + Math.round(f_fps);
			}
			
			
		if(!b_paused){
			b_updateHUD = true;

			//Update time if the player hasn't finished the race yet:
			if(!b_playerDone){
				f_secs += 1 / 60;
				//console.log("f_secs = " + f_secs);
				var timeElement = document.getElementById("p_time");
				timeElement.innerHTML = "TIME " + fn_formatTime(f_secs);
			}

			//Player actions:
			for(const player of a_players){
				//Check for player collision with checkpoints:
				for(let i = 0; i < a_checkpoints.length; i++){
					if(a_checkpoints[i].fn_getDSOC() && a_checkpoints[i].fn_meshCollisionCheck(player)){
						//var boundingBox = new THREE.Box3().setFromObject(player.fn_getPlayer());
						player.fn_checkpointUpdate(a_checkpoints[i]);
						
						b_playerDone = player.fn_isFinished();
					}
				}
				
				
				player.fn_play(worldOctree, offroadOctree);
				if(window.b_debug){
					coordsButton.innerHTML = ("XYZ = (" + 
						player.fn_getPos().x.toFixed(2) + ", " + 
						player.fn_getPos().y.toFixed(2) + ", " + 
						player.fn_getPos().z.toFixed(2) + 
					")");
				}
				
				//If collidable object collides with player, do something:
				for(let i = 0; i < a_objectsDSOC.length; i++){
					if(i == player.fn_getPlayerIndex()){
						continue;
					}

					a_objectsDSOC[i].fn_meshCollisionCheck(player); 
				}
			
				map.fn_animate();
				player.fn_update(int_frames);
			}	

			//Update objects:
			for(let i = 0; i < a_objects.length; i++){
				a_objects[i].fn_animate(int_frames);
			}
			
		}
		else{
			b_updateHUD = false;
		}
		if(a_inputs[0].fn_press_pause()){
			if(b_paused){
				b_paused = false;
			}
			else{
				b_paused = true;
			}
			console.log("Paused");
		}

	int_frames += 1;
	return true;
}

//Fime formatting function by ChatGPT:
function fn_formatTime(decimalString) {
    const totalSeconds = parseFloat(decimalString);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.round((totalSeconds % 1) * 1000);

    // Pad seconds and milliseconds
    const paddedSeconds = seconds.toString().padStart(2, '0');
    const paddedMilliseconds = milliseconds.toString().padStart(3, '0');

    return `${minutes}:${paddedSeconds}:${paddedMilliseconds}`;
}


//Debug method to display the user's name:
function fn_displayName(){
	if(window.b_debug && request.readyState == 4){	//4 makes sure that data has been gotten back.
		
		var nameButton = document.getElementById("p_name");
		//nameButton.innerHTML = "Logged in as " + request.responseText;
	}
}