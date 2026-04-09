//This is the parent class for the map in a scene.
import * as THREE from 'three';
import { Octree } from 'three/addons/math/Octree.js';

//Essentials imports:
	import { fn_getScene } from "../main.js";
	import { fn_getRenderer } from "../main.js";
	import { fn_getLoader } from "../main.js";

//Object imports:
	import Checkpoint from "./objects/checkpoint.js";
	import Pipe from "./objects/pipe.js";
	import ItemBox from "./objects/itemBox.js";
	import ItemPotRow from "./objects/itemPotRow.js";
	//Essentials:
		let scene;
		let renderer;
		let loader;

	
	//Variables:
		let str_map;
		let f_mapScale;
		let v_mapPos;
		let f_mapRot;
		let int_numKeys;

		//Models for the map itself:
		let geoModel;
		let offroadModel;
		let nonSolidModel;
		let skyboxModel;

		let b_hasGeo;
		let b_hasOffroad;
		let b_hasNonSolid;
		let b_hasSkybox;

export default class Map{

	constructor(_str_map, worldOctree, offroadOctree){
		//Essentials:
			scene = fn_getScene();
			renderer = fn_getRenderer();
			loader = fn_getLoader();
		
		str_map = _str_map;
		f_mapScale = 1.0;
		v_mapPos = new THREE.Vector3(0, 60, 0);
		f_mapRot = 0.0;

		//A light is required for MeshPhongMaterial to be seen.
		//From a tutorial:
		function fn_addLight( position, _intensity ) {

			const color = 0xfffde6;
			const fillLight1 = new THREE.HemisphereLight( color, 0x77756a, 3 );
			fillLight1.position.set( 2, 2, 1 );
			scene.add( fillLight1 );

		}
		fn_addLight( [ - 3, 1, 1 ], 2.4);

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
			else if(str_map == "FDL Circuit"){
				f_mapScale = 1.0;
				v_mapPos = new THREE.Vector3(29, 4, 77);
				f_mapRot = 3.14;
			}
		
		//Loading a 3D model (followed this tutorial https://youtu.be/WBe3xrV4CPM?si=qzzC8TYFBhorqRcs):
		//THIS IS AN ASYNC METHOD:
		function fn_loadModel(model, _str_modelName, _b_visible, octree){
			return new Promise((resolve, reject) => {
				loader.load( `assets/models/maps/${str_map}/${_str_modelName}.glb`, 
					( gltf ) => {
						
						model = gltf.scene;
						model.position.set(0,0,0);
						model.scale.set(f_mapScale, f_mapScale, f_mapScale);
						model.rotation.set(0, f_mapRot, 0);
						model.visible = _b_visible;
						
						if(_str_modelName == 'geo' || _str_modelName == 'offroad')
						{
							model.updateMatrixWorld(true);
							octree.fromGraphNode( model );
						}
						
						scene.add( model );
						resolve(true);
					}, 
					undefined, ( error ) => {
						//console.error( error );
						reject(false);
					} 
				);
			});
		}
		async function addModels() {
			b_hasGeo = await fn_loadModel(geoModel, 'geo', true, worldOctree);
			b_hasOffroad = await fn_loadModel(offroadModel, 'offroad', false, offroadOctree);
			b_hasSkybox = await fn_loadModel(skyboxModel, 'skybox', true);
		}
		addModels();
	}

	//Add checkpoints & background:
	fn_addCheckpoints(a_checkpoints){
		if(str_map == "SNES MC1"){
			renderer.setClearColor( 0xe8f870, 1);
			//Adding Checkpoints:
				a_checkpoints.push(new Checkpoint([30, 14, 7], 1, [.2, 16, 40], 1.5708, true, 0));
				a_checkpoints[0].fn_setGoal();
				a_checkpoints[0].fn_setNextKey(11);
				
				a_checkpoints.push(new Checkpoint([10, 14, -36], f_mapScale, [.2, 16, 70], 0, false, 1));
				a_checkpoints.push(new Checkpoint([4, 14, -40], f_mapScale, [.2, 16, 70], 0, false, 2));
				a_checkpoints.push(new Checkpoint([-2, 14, -46], f_mapScale, [.2, 16, 70], 0, false, 3));
				a_checkpoints.push(new Checkpoint([-8, 14, -50], f_mapScale, [.2, 16, 80], 0, false, 4));
				a_checkpoints.push(new Checkpoint([-15, 14, -55], f_mapScale, [.2, 16, 70], 0, false, 5));
				a_checkpoints.push(new Checkpoint([-20, 14, -55], f_mapScale, [.2, 16, 70], 0, false, 6));
				a_checkpoints.push(new Checkpoint([-30, 14, -55], f_mapScale, [.2, 16, 70], 0, false, 7));
				a_checkpoints.push(new Checkpoint([-40, 14, -55], f_mapScale, [.2, 16, 70], 0, false, 8));
				a_checkpoints.push(new Checkpoint([-50, 14, -55], f_mapScale, [.2, 16, 70], 0, false, 9));
				a_checkpoints.push(new Checkpoint([-60, 14, -55], f_mapScale, [.2, 16, 70], 0, false, 10));
				a_checkpoints.push(new Checkpoint([-70, 14, -55], f_mapScale, [.2, 16, 70], 0, true, 11));
				a_checkpoints[11].fn_setNextKey(24);
				a_checkpoints.push(new Checkpoint([-80, 14, -55], f_mapScale, [.2, 16, 70], 0, false, 12));
				a_checkpoints.push(new Checkpoint([-90, 14, -55], f_mapScale, [.2, 16, 70], 0, false, 13));
				a_checkpoints.push(new Checkpoint([-100, 14, -65], f_mapScale, [.2, 16, 50], 0, false, 14));
				a_checkpoints.push(new Checkpoint([-110, 14, -65], f_mapScale, [.2, 16, 50], 0, false, 15));
				a_checkpoints.push(new Checkpoint([-116, 14, -65], f_mapScale, [.2, 16, 50], 0, false, 16));
				a_checkpoints.push(new Checkpoint([-122, 14, -75], f_mapScale, [.2, 16, 35], 0, false, 17));
				
				a_checkpoints.push(new Checkpoint([-137, 14, -67], f_mapScale, [.2, 16, 30], 1.5708, false, 18));
				a_checkpoints.push(new Checkpoint([-133, 14, -57], f_mapScale, [.2, 16, 35], 1.5708, false, 19));
				a_checkpoints.push(new Checkpoint([-130, 14, -48], f_mapScale, [.2, 16, 40], 1.5708, false, 20));
				a_checkpoints.push(new Checkpoint([-130, 14, -40], f_mapScale, [.2, 16, 40], 1.5708, false, 21));
				a_checkpoints.push(new Checkpoint([-130, 14, -30], f_mapScale, [.2, 16, 40], 1.5708, false, 22));
				a_checkpoints.push(new Checkpoint([-130, 14, -20], f_mapScale, [.2, 16, 40], 1.5708, false, 23));
				a_checkpoints.push(new Checkpoint([-130, 14, -10], f_mapScale, [.2, 16, 40], 1.5708, true, 24));
				a_checkpoints[24].fn_setNextKey(37);
				a_checkpoints.push(new Checkpoint([-130, 14, 0], f_mapScale, [.2, 16, 40], 1.5708, false, 25));
				a_checkpoints.push(new Checkpoint([-130, 14, 10], f_mapScale, [.2, 16, 40], 1.5708, false, 26));
				a_checkpoints.push(new Checkpoint([-130, 14, 20], f_mapScale, [.2, 16, 40], 1.5708, false, 27));
				a_checkpoints.push(new Checkpoint([-135, 14, 30], f_mapScale, [.2, 16, 33], 1.5708, false, 28));
				a_checkpoints.push(new Checkpoint([-135, 14, 40], f_mapScale, [.2, 16, 33], 1.5708, false, 29));
				
				
				a_checkpoints.push(new Checkpoint([-118, 14, 45], f_mapScale, [.2, 16, 50], 0, false, 30));
				a_checkpoints.push(new Checkpoint([-109, 14, 35], f_mapScale, [.2, 16, 70], 0, false, 31));
				a_checkpoints.push(new Checkpoint([-100, 14, 32], f_mapScale, [.2, 16, 72], 0, false, 32));
				a_checkpoints.push(new Checkpoint([-90, 14, 32], f_mapScale, [.2, 16, 72], 0, false, 33));
				a_checkpoints.push(new Checkpoint([-80, 14, 32], f_mapScale, [.2, 16, 72], 0, false, 34));
				a_checkpoints.push(new Checkpoint([-70, 14, 32], f_mapScale, [.2, 16, 72], 0, false, 35));
				a_checkpoints.push(new Checkpoint([-60, 14, 32], f_mapScale, [.2, 16, 72], 0, false, 36));
				a_checkpoints.push(new Checkpoint([-50, 14, 42], f_mapScale, [.2, 16, 95], 0, true, 37));
				a_checkpoints[37].fn_setNextKey(0);
				a_checkpoints.push(new Checkpoint([-40, 14, 42], f_mapScale, [.2, 16, 95], 0, false, 38));
				a_checkpoints.push(new Checkpoint([-30, 14, 42], f_mapScale, [.2, 16, 95], 0, false, 39));
				a_checkpoints.push(new Checkpoint([-20, 14, 42], f_mapScale, [.2, 16, 95], 0, false, 40));
				a_checkpoints.push(new Checkpoint([-10, 14, 42], f_mapScale, [.2, 16, 95], 0, false, 41));
				a_checkpoints.push(new Checkpoint([0, 14, 42], f_mapScale, [.2, 16, 95], 0, false, 42));
				a_checkpoints.push(new Checkpoint([10, 14, 42], f_mapScale, [.2, 16, 95], 0, false, 43));
				
				
				
				a_checkpoints.push(new Checkpoint([30, 14, 50], f_mapScale, [.2, 16, 40], 1.5708, false, 47));
				a_checkpoints.push(new Checkpoint([30, 14, 45], f_mapScale, [.2, 16, 40], 1.5708, false, 48));
				a_checkpoints.push(new Checkpoint([30, 14, 40], f_mapScale, [.2, 16, 40], 1.5708, false, 49));
				a_checkpoints.push(new Checkpoint([30, 14, 35], f_mapScale, [.2, 16, 40], 1.5708, false, 50));
				a_checkpoints.push(new Checkpoint([30, 14, 30], f_mapScale, [.2, 16, 40], 1.5708, false, 51));
				a_checkpoints.push(new Checkpoint([30, 14, 25], f_mapScale, [.2, 16, 40], 1.5708, false, 52));
				a_checkpoints.push(new Checkpoint([30, 14, 20], f_mapScale, [.2, 16, 40], 1.5708, false, 53));
				a_checkpoints.push(new Checkpoint([30, 14, 15], f_mapScale, [.2, 16, 40], 1.5708, false, 54));
				a_checkpoints.push(new Checkpoint([30, 14, 10], f_mapScale, [.2, 16, 40], 1.5708, false, 55));
				
				int_numKeys = 4;
		}
		else{
			renderer.setClearColor( 0x74bcff, 1);
			int_numKeys = 0;
		}
	}

	fn_addObjectsStatic(a_objects, worldOctree){
		if(str_map == "SNES MC1"){
			//Adding pipes:
				a_objects.push(new Pipe([-102, 7.19, -74.5], f_mapScale, 1));
				a_objects.push(new Pipe([-102, 7.19, -65], f_mapScale, 1));
				a_objects.push(new Pipe([-116, 7.19, -66], f_mapScale, 1));
				a_objects.push(new Pipe([-116, 7.19, -81], f_mapScale, 1));
				a_objects.push(new Pipe([-119.7, 7.19, 27], f_mapScale, 1));
				a_objects.push(new Pipe([-103, 7.22, 40], f_mapScale, 1));
				a_objects.push(new Pipe([-93, 7.22, 35.5], f_mapScale, 1));
				a_objects.push(new Pipe([-52, 7.22, 21], f_mapScale, 1));
				
			//Adding solid objects to the octree:
				for(let i = 0; i < a_objects.length; i++){
					if(a_objects[i].fn_getSolid()){
						worldOctree.fromGraphNode(a_objects[i].fn_getCollider());
					}
				}
		}
	}

	fn_addObjectsDSOC(a_objects, a_objectsDSOC){
		if(str_map == "SNES MC1"){
			a_objects.push(new ItemPotRow([-53, 7.1, -61], f_mapScale, 6, .85, 1, a_objectsDSOC));
			a_objects.push(new ItemPotRow([-46, 7.1, 9.7], f_mapScale, 3, 1.5, 1, a_objectsDSOC));
		}
		else if(str_map == "FDL Circuit"){
			a_objects.push(new ItemPotRow([35, 3.8, -70], f_mapScale, 6, 1.2, 1, a_objectsDSOC));
		}
	}

	fn_animate(){
		if(skyboxModel && str_map != "SNES MC1"){
			skyboxModel.rotation.y += 0.0004;
		}
	}
	
	fn_clear(){

	}

	fn_getMapPos(i){	//Used for getting player position
		return [
				v_mapPos.x + i * 2.5, 
				v_mapPos.y, 
				v_mapPos.z
			]
	}

	fn_getNumKeys(){
		return int_numKeys;
	}

	fn_hasGeo(){
		return b_hasGeo;
	}
	
	fn_hasOffroad(){
		return b_hasOffroad;
	}
}