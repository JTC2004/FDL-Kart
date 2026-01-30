//This file contains the game logic.

//Bugs to fix:
// 	- Not handling multiple inputs well while drifting. 
//	- Progress when going backwards in a track.


//Imports:
	import * as THREE from 'three';
	import WebGL from 'three/addons/capabilities/WebGL.js';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	
	import { Octree } from 'three/addons/math/Octree.js';
	import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';
	
//Class imports:
	import Player from "./player.js";
	//Objects:
		import Checkpoint from "./objects/checkpoint.js";
		import Pipe from "./objects/pipe.js";
		import ItemBox from "./objects/itemBox.js";
		import ItemBoxRow from "./objects/itemBoxRow.js";

//Variable initializations:
	const a_objects = [];
	const a_checkpoints = [];
	
	const worldOctree = new Octree();		//Collision detector initialization.
	const offroadOctree = new Octree();		//Offroad detector initialization.
	
	var f_mapScale = 1;
	var v_mapPos = new THREE.Vector3(0, 60, 0);
	let int_numKeys;
	
	var b_updateHUD = true;
	var b_playerDone = false;
	let player1;
	let offroadModel;
	let courseModel;
	let skyboxModel;

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
	


//This method runs once when gameplay is started:	
function fn_initializeGame(scene, camera, renderer, str_map){
	//A light is required for MeshPhongMaterial to be seen.
	//From a tutorial:
	function fn_addLight( position, _intensity ) {

		const color = 0xfffde6;
		const fillLight1 = new THREE.HemisphereLight( color, 0x77756a, 3 );
		fillLight1.position.set( 2, 2, 1 );
		scene.add( fillLight1 );

	}
	fn_addLight( [ - 3, 1, 1 ], 2.4);

	//Displaying username:
	//Do AJAX call to get name from getName.php, and append it to p_name.
	str_url = "scripts/getName.php";
	request = new XMLHttpRequest();
	request.open("GET", str_url, true);
	request.onreadystatechange = fn_displayName;
	request.send(null);

	
	//Map scale:
	if(str_map == "testcourse1"){
		f_mapScale = 2;
		v_mapPos = new THREE.Vector3(36,8,-3);
	}
	else if(str_map == "N64 Mario Raceway"){
		f_mapScale = .75;
		v_mapPos = new THREE.Vector3(-220, 35, -35);
	}
	else if(str_map == "N64 Block Fort"){
		f_mapScale = 1.25;
		v_mapPos = new THREE.Vector3(0, 60, 85);
	}
	else if(str_map == "SNES MC1"){
		f_mapScale = 1.2;
		v_mapPos = new THREE.Vector3(40, 20, 25);
	}

	//Render background:
	if(str_map == "SNES MC1"){
		renderer.setClearColor( 0xe8f870, 1);
		//Adding Checkpoints:
			a_checkpoints.push(new Checkpoint(scene, [30, 14, 7], 1, [.2, 16, 40], 1.5708, true, 0));
			a_checkpoints[0].fn_setGoal();
			a_checkpoints[0].fn_setNextKey(11);
			
			a_checkpoints.push(new Checkpoint(scene, [10, 14, -36], f_mapScale, [.2, 16, 70], 0, false, 1));
			a_checkpoints.push(new Checkpoint(scene, [4, 14, -40], f_mapScale, [.2, 16, 70], 0, false, 2));
			a_checkpoints.push(new Checkpoint(scene, [-2, 14, -46], f_mapScale, [.2, 16, 70], 0, false, 3));
			a_checkpoints.push(new Checkpoint(scene, [-8, 14, -50], f_mapScale, [.2, 16, 80], 0, false, 4));
			a_checkpoints.push(new Checkpoint(scene, [-15, 14, -55], f_mapScale, [.2, 16, 70], 0, false, 5));
			a_checkpoints.push(new Checkpoint(scene, [-20, 14, -55], f_mapScale, [.2, 16, 70], 0, false, 6));
			a_checkpoints.push(new Checkpoint(scene, [-30, 14, -55], f_mapScale, [.2, 16, 70], 0, false, 7));
			a_checkpoints.push(new Checkpoint(scene, [-40, 14, -55], f_mapScale, [.2, 16, 70], 0, false, 8));
			a_checkpoints.push(new Checkpoint(scene, [-50, 14, -55], f_mapScale, [.2, 16, 70], 0, false, 9));
			a_checkpoints.push(new Checkpoint(scene, [-60, 14, -55], f_mapScale, [.2, 16, 70], 0, false, 10));
			a_checkpoints.push(new Checkpoint(scene, [-70, 14, -55], f_mapScale, [.2, 16, 70], 0, true, 11));
			a_checkpoints[11].fn_setNextKey(24);
			a_checkpoints.push(new Checkpoint(scene, [-80, 14, -55], f_mapScale, [.2, 16, 70], 0, false, 12));
			a_checkpoints.push(new Checkpoint(scene, [-90, 14, -55], f_mapScale, [.2, 16, 70], 0, false, 13));
			a_checkpoints.push(new Checkpoint(scene, [-100, 14, -65], f_mapScale, [.2, 16, 50], 0, false, 14));
			a_checkpoints.push(new Checkpoint(scene, [-110, 14, -65], f_mapScale, [.2, 16, 50], 0, false, 15));
			a_checkpoints.push(new Checkpoint(scene, [-116, 14, -65], f_mapScale, [.2, 16, 50], 0, false, 16));
			a_checkpoints.push(new Checkpoint(scene, [-122, 14, -75], f_mapScale, [.2, 16, 35], 0, false, 17));
			
			a_checkpoints.push(new Checkpoint(scene, [-137, 14, -67], f_mapScale, [.2, 16, 30], 1.5708, false, 18));
			a_checkpoints.push(new Checkpoint(scene, [-133, 14, -57], f_mapScale, [.2, 16, 35], 1.5708, false, 19));
			a_checkpoints.push(new Checkpoint(scene, [-130, 14, -48], f_mapScale, [.2, 16, 40], 1.5708, false, 20));
			a_checkpoints.push(new Checkpoint(scene, [-130, 14, -40], f_mapScale, [.2, 16, 40], 1.5708, false, 21));
			a_checkpoints.push(new Checkpoint(scene, [-130, 14, -30], f_mapScale, [.2, 16, 40], 1.5708, false, 22));
			a_checkpoints.push(new Checkpoint(scene, [-130, 14, -20], f_mapScale, [.2, 16, 40], 1.5708, false, 23));
			a_checkpoints.push(new Checkpoint(scene, [-130, 14, -10], f_mapScale, [.2, 16, 40], 1.5708, true, 24));
			a_checkpoints[24].fn_setNextKey(37);
			a_checkpoints.push(new Checkpoint(scene, [-130, 14, 0], f_mapScale, [.2, 16, 40], 1.5708, false, 25));
			a_checkpoints.push(new Checkpoint(scene, [-130, 14, 10], f_mapScale, [.2, 16, 40], 1.5708, false, 26));
			a_checkpoints.push(new Checkpoint(scene, [-130, 14, 20], f_mapScale, [.2, 16, 40], 1.5708, false, 27));
			a_checkpoints.push(new Checkpoint(scene, [-135, 14, 30], f_mapScale, [.2, 16, 33], 1.5708, false, 28));
			a_checkpoints.push(new Checkpoint(scene, [-135, 14, 40], f_mapScale, [.2, 16, 33], 1.5708, false, 29));
			
			
			a_checkpoints.push(new Checkpoint(scene, [-118, 14, 45], f_mapScale, [.2, 16, 50], 0, false, 30));
			a_checkpoints.push(new Checkpoint(scene, [-109, 14, 35], f_mapScale, [.2, 16, 70], 0, false, 31));
			a_checkpoints.push(new Checkpoint(scene, [-100, 14, 32], f_mapScale, [.2, 16, 72], 0, false, 32));
			a_checkpoints.push(new Checkpoint(scene, [-90, 14, 32], f_mapScale, [.2, 16, 72], 0, false, 33));
			a_checkpoints.push(new Checkpoint(scene, [-80, 14, 32], f_mapScale, [.2, 16, 72], 0, false, 34));
			a_checkpoints.push(new Checkpoint(scene, [-70, 14, 32], f_mapScale, [.2, 16, 72], 0, false, 35));
			a_checkpoints.push(new Checkpoint(scene, [-60, 14, 32], f_mapScale, [.2, 16, 72], 0, false, 36));
			a_checkpoints.push(new Checkpoint(scene, [-50, 14, 42], f_mapScale, [.2, 16, 95], 0, true, 37));
			a_checkpoints[37].fn_setNextKey(0);
			a_checkpoints.push(new Checkpoint(scene, [-40, 14, 42], f_mapScale, [.2, 16, 95], 0, false, 38));
			a_checkpoints.push(new Checkpoint(scene, [-30, 14, 42], f_mapScale, [.2, 16, 95], 0, false, 39));
			a_checkpoints.push(new Checkpoint(scene, [-20, 14, 42], f_mapScale, [.2, 16, 95], 0, false, 40));
			a_checkpoints.push(new Checkpoint(scene, [-10, 14, 42], f_mapScale, [.2, 16, 95], 0, false, 41));
			a_checkpoints.push(new Checkpoint(scene, [0, 14, 42], f_mapScale, [.2, 16, 95], 0, false, 42));
			a_checkpoints.push(new Checkpoint(scene, [10, 14, 42], f_mapScale, [.2, 16, 95], 0, false, 43));
			
			
			
			a_checkpoints.push(new Checkpoint(scene, [30, 14, 50], f_mapScale, [.2, 16, 40], 1.5708, false, 47));
			a_checkpoints.push(new Checkpoint(scene, [30, 14, 45], f_mapScale, [.2, 16, 40], 1.5708, false, 48));
			a_checkpoints.push(new Checkpoint(scene, [30, 14, 40], f_mapScale, [.2, 16, 40], 1.5708, false, 49));
			a_checkpoints.push(new Checkpoint(scene, [30, 14, 35], f_mapScale, [.2, 16, 40], 1.5708, false, 50));
			a_checkpoints.push(new Checkpoint(scene, [30, 14, 30], f_mapScale, [.2, 16, 40], 1.5708, false, 51));
			a_checkpoints.push(new Checkpoint(scene, [30, 14, 25], f_mapScale, [.2, 16, 40], 1.5708, false, 52));
			a_checkpoints.push(new Checkpoint(scene, [30, 14, 20], f_mapScale, [.2, 16, 40], 1.5708, false, 53));
			a_checkpoints.push(new Checkpoint(scene, [30, 14, 15], f_mapScale, [.2, 16, 40], 1.5708, false, 54));
			a_checkpoints.push(new Checkpoint(scene, [30, 14, 10], f_mapScale, [.2, 16, 40], 1.5708, false, 55));
			
			int_numKeys = 4;
	}
	else{
		renderer.setClearColor( 0x74bcff, 1);
	}
	

//Loading objects into the scene:
	//Loading a 3D model (followed this tutorial https://youtu.be/WBe3xrV4CPM?si=qzzC8TYFBhorqRcs):
	const loader = new GLTFLoader();
	
	loader.load( 'assets/models/maps/'+ str_map +'/main.glb',		//I should make a method for this. 
		function ( gltf ) {
			
			courseModel = gltf.scene;
			courseModel.position.set(0,0,0);
			courseModel.scale.set(f_mapScale, f_mapScale, f_mapScale);
			courseModel.visible = true;
			
			courseModel.updateMatrixWorld(true);
			worldOctree.fromGraphNode( courseModel );
			
			scene.add( courseModel );
			
		}, 
		undefined, function ( error ) {
			console.error( error );
		} 
	);
	
	
	loader.load( 'assets/models/maps/'+ str_map +'/offroad.glb', 
		function ( gltf ) {
			offroadModel = gltf.scene;
			offroadModel.position.set(0,0,0);
			offroadModel.scale.set(f_mapScale, f_mapScale, f_mapScale);
			offroadModel.visible = false;
			
			offroadModel.updateMatrixWorld(true);
			offroadOctree.fromGraphNode( offroadModel );
			
			scene.add( offroadModel );
		}, 
		undefined, function ( error ) {
			console.error( error );
		}
	);
	
	
	loader.load( 'assets/models/maps/'+ str_map +'/skybox.glb', 
		function ( gltf ) {
			skyboxModel = gltf.scene;
			skyboxModel.position.set(0,0,0);
			skyboxModel.visible = true;
			scene.add( skyboxModel );
		}, 
		undefined, function ( error ) {
			console.error( error );
		} 
	);
		
	//Adding item boxes:
		a_objects.push(new ItemBoxRow(scene, [-53, 7.1, -61], f_mapScale, loader, 6, .85, 1));
	//Adding pipes:
		a_objects.push(new Pipe(scene, [-102, 7.19, -74.5], f_mapScale, 1));
		a_objects.push(new Pipe(scene, [-102, 7.19, -65], f_mapScale, 1));
		a_objects.push(new Pipe(scene, [-116, 7.19, -66], f_mapScale, 1));
		a_objects.push(new Pipe(scene, [-116, 7.19, -81], f_mapScale, 1));
		a_objects.push(new Pipe(scene, [-119.7, 7.19, 27], f_mapScale, 1));
		a_objects.push(new Pipe(scene, [-103, 7.22, 40], f_mapScale, 1));
		a_objects.push(new Pipe(scene, [-93, 7.22, 35.5], f_mapScale, 1));
		a_objects.push(new Pipe(scene, [-52, 7.22, 21], f_mapScale, 1));
		
	//Adding solid objects to the octree:
		for(let i = 0; i < a_objects.length; i++){
			if(a_objects[i].fn_getSolid()){
				worldOctree.fromGraphNode(a_objects[i].fn_getCollider());
			}
		}


	//Adding player:
		//const input = new InputHandler();
		player1 = new Player(scene, loader, [v_mapPos.x, v_mapPos.y, v_mapPos.z], 1, a_checkpoints.length, int_numKeys, 3);
}


//The game loop:
export function fn_updateGame(input, scene, camera, renderer, str_map, f_fps){
	//console.log("Game is running");
	if(!b_isInitialized){
		fn_initializeGame(scene, camera, renderer, str_map);
		b_isInitialized = true;
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
				var timeButton = document.getElementById("p_time");
				timeButton.innerHTML = "TIME " + fn_formatTime(f_secs);
			}

			
			//Update objects:
			for(let i = 0; i < a_objects.length; i++){
				a_objects[i].fn_animate(int_frames);
				
			}

			//Check for player collision with checkpoints:
			for(let i = 0; i < a_checkpoints.length; i++){
				if(a_checkpoints[i].fn_getDSOC() && a_checkpoints[i].fn_meshCollisionCheck(player1.fn_getHitbox())){
					//var boundingBox = new THREE.Box3().setFromObject(player1.fn_getPlayer());
					player1.fn_checkpointUpdate(a_checkpoints[i]);
					
					b_playerDone = player1.fn_isFinished();
				}
			}
			
			//Player input:
			player1.fn_play(camera, input);
			if(window.b_debug){
				coordsButton.innerHTML = ("XYZ = (" + camera.position.x.toFixed(2) + ", " + camera.position.y.toFixed(2) + ", " + camera.position.z.toFixed(2) + ")");
			}

			//Colision:
			if(offroadModel){
				player1.fn_offroad(offroadOctree, true)
			}
			if(courseModel){
				player1.fn_collision(worldOctree, false);
			}
		
			if(skyboxModel && str_map != "SNES MC1"){
				skyboxModel.rotation.y += 0.0004;
			}
			player1.fn_update(camera, input, int_frames);
		}
		else{
			b_updateHUD = false;
		}
		if(input.fn_press_pause()){
			if(b_paused){
				b_paused = false;
			}
			else{
				b_paused = true;
			}
			console.log("Paused");
		}
		
		
	//renderer.render( scene, camera );

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