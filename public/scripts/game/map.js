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
	import OOB from "./objects/OOB.js";
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
		const int_numLaps = 4;

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
				f_mapScale = 2.5;
				v_mapPos = new THREE.Vector3(36,8,-3);
				b_hasGeo = true;	b_hasOffroad = false;	b_hasNonSolid = false;	b_hasSkybox = false;
			}
			else if(str_map == "MC1"){
				f_mapScale = 1.2;
				v_mapPos = new THREE.Vector3(40, 9, 25);
				b_hasGeo = true;	b_hasOffroad = true;	b_hasNonSolid = false;	b_hasSkybox = true;
			}
			else if(str_map == "FDL Circuit"){
				f_mapScale = 1.0;
				v_mapPos = new THREE.Vector3(29, 4, 60);
				f_mapRot = 3.14;
				b_hasGeo = true;	b_hasOffroad = true;	b_hasNonSolid = true;	b_hasSkybox = false;
			}
	}	

	async addModels(worldOctree, offroadOctree) {
		if(b_hasGeo) await this.fn_loadModel(geoModel, 'geo', true, worldOctree);
		if(b_hasOffroad) await this.fn_loadModel(offroadModel, 'offroad', false, offroadOctree);
		if(b_hasNonSolid) await this.fn_loadModel(nonSolidModel, 'notSolid', true, offroadOctree);
		if(b_hasSkybox) await this.fn_loadModel(skyboxModel, 'skybox', true);
	}

	//Loading a 3D model (followed this tutorial https://youtu.be/WBe3xrV4CPM?si=qzzC8TYFBhorqRcs):
	//THIS IS AN ASYNC METHOD:
	fn_loadModel(model, _str_modelName, _b_visible, octree){
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

	//Add checkpoints & background:
	fn_addCheckpoints(a_checkpoints){
		if(str_map == "MC1"){
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
		else if(str_map == "FDL Circuit"){
			renderer.setClearColor( 0x74bcff, 1);
			
			//Adding Checkpoints:
				//Goal:
				a_checkpoints.push(new Checkpoint([30, 8, 50], 1, [.2, 16, 60], 1.5708, true, 0));
				a_checkpoints[0].fn_setGoal();
				a_checkpoints[0].fn_setNextKey(43);	//Number here is endex of next key checkpoint

				//First stretch:
				a_checkpoints.push(new Checkpoint([30, 8, 40], f_mapScale, [.2, 16, 60], 1.5708, false, 1));
				a_checkpoints.push(new Checkpoint([30, 8, 30], f_mapScale, [.2, 16, 60], 1.5708, false, 2));
				a_checkpoints.push(new Checkpoint([30, 8, 20], f_mapScale, [.2, 16, 60], 1.5708, false, 3));
				a_checkpoints.push(new Checkpoint([30, 8, 10], f_mapScale, [.2, 16, 60], 1.5708, false, 4));
				a_checkpoints.push(new Checkpoint([30, 8, 0], f_mapScale, [.2, 16, 60], 1.5708, false, 5));
				a_checkpoints.push(new Checkpoint([30, 8, -10], f_mapScale, [.2, 16, 60], 1.5708, false, 6));
				a_checkpoints.push(new Checkpoint([30, 8, -20], f_mapScale, [.2, 16, 60], 1.5708, false, 7));
				a_checkpoints.push(new Checkpoint([30, 6, -30], f_mapScale, [.2, 16, 60], 1.5708, false, 8));
				a_checkpoints.push(new Checkpoint([30, 6, -40], f_mapScale, [.2, 16, 60], 1.5708, false, 9));
				a_checkpoints.push(new Checkpoint([30, 6, -50], f_mapScale, [.2, 16, 60], 1.5708, false, 10));

				//Under bridge:
				a_checkpoints.push(new Checkpoint([30, 5, -60], f_mapScale, [.2, 16, 70], 1.5708, false, 11));
				a_checkpoints.push(new Checkpoint([30, 5, -70], f_mapScale, [.2, 16, 70], 1.5708, false, 12));
				a_checkpoints.push(new Checkpoint([30, 5, -80], f_mapScale, [.2, 16, 70], 1.5708, false, 13));
				//Past bridge:
				a_checkpoints.push(new Checkpoint([30, 5, -90], f_mapScale, [.2, 16, 70], 1.5708, false, 14));
				a_checkpoints.push(new Checkpoint([30, 5, -100], f_mapScale, [.2, 16, 70], 1.5708, false, 15));
				a_checkpoints.push(new Checkpoint([30, 5, -110], f_mapScale, [.2, 16, 70], 1.5708, false, 16));
				a_checkpoints.push(new Checkpoint([30, 5, -120], f_mapScale, [.2, 16, 70], 1.5708, false, 17));
				a_checkpoints.push(new Checkpoint([30, 5, -130], f_mapScale, [.2, 16, 70], 1.5708, false, 18));
				a_checkpoints.push(new Checkpoint([30, 5, -140], f_mapScale, [.2, 16, 70], 1.5708, false, 19));
				a_checkpoints.push(new Checkpoint([30, 5, -150], f_mapScale, [.2, 16, 70], 1.5708, false, 20));
				a_checkpoints.push(new Checkpoint([30, 5, -160], f_mapScale, [.2, 16, 70], 1.5708, false, 21));
				//U-turn:
				a_checkpoints.push(new Checkpoint([40, 8, -190], f_mapScale, [.2, 16, 60], 0, false, 22));
				a_checkpoints.push(new Checkpoint([50, 9, -190], f_mapScale, [.2, 16, 60], 0, false, 23));
				a_checkpoints.push(new Checkpoint([60, 10, -190], f_mapScale, [.2, 16, 90], 0, false, 24));
				a_checkpoints.push(new Checkpoint([70, 12, -190], f_mapScale, [.2, 16, 90], 0, false, 25));
				a_checkpoints.push(new Checkpoint([80, 16, -190], f_mapScale, [.2, 16, 90], 0, false, 26));
				a_checkpoints.push(new Checkpoint([90, 16, -190], f_mapScale, [.2, 16, 90], 0, false, 27));
				a_checkpoints.push(new Checkpoint([100, 16, -190], f_mapScale, [.2, 16, 60], 0, false, 28));

				//Top of East hill:
				a_checkpoints.push(new Checkpoint([110, 18, -90], f_mapScale, [.2, 16, 80], -1.5708, false, 37));
				a_checkpoints.push(new Checkpoint([110, 18, -100], f_mapScale, [.2, 16, 80], -1.5708, false, 36));
				a_checkpoints.push(new Checkpoint([110, 18, -110], f_mapScale, [.2, 16, 80], -1.5708, false, 35));
				a_checkpoints.push(new Checkpoint([110, 18, -120], f_mapScale, [.2, 16, 80], -1.5708, false, 34));
				a_checkpoints.push(new Checkpoint([110, 18, -130], f_mapScale, [.2, 16, 80], -1.5708, false, 33));
				a_checkpoints.push(new Checkpoint([110, 18, -140], f_mapScale, [.2, 16, 80], -1.5708, false, 32));
				a_checkpoints.push(new Checkpoint([120, 18, -150], f_mapScale, [.2, 16, 60], -1.5708, false, 31));
				a_checkpoints.push(new Checkpoint([120, 18, -160], f_mapScale, [.2, 16, 60], -1.5708, false, 30));
				a_checkpoints.push(new Checkpoint([120, 18, -170], f_mapScale, [.2, 16, 40], -1.5708, false, 29));

				//Top of bridge:
				a_checkpoints.push(new Checkpoint([110, 22, -65], f_mapScale, [.2, 16, 50], 3.14, false, 38));
				a_checkpoints.push(new Checkpoint([100, 22, -65], f_mapScale, [.2, 16, 50], 3.14, false, 39));
				a_checkpoints.push(new Checkpoint([90, 22, -65], f_mapScale, [.2, 16, 50], 3.14, false, 40));
				a_checkpoints.push(new Checkpoint([80, 22, -65], f_mapScale, [.2, 16, 50], 3.14, false, 41));
				a_checkpoints.push(new Checkpoint([70, 22, -65], f_mapScale, [.2, 16, 50], 3.14, false, 42));
				a_checkpoints.push(new Checkpoint([60, 22, -65], f_mapScale, [.2, 16, 50], 3.14, true, 43));
				a_checkpoints[43].fn_setNextKey(69);
				a_checkpoints.push(new Checkpoint([50, 22, -68], f_mapScale, [.2, 16, 40], 3.14, false, 44));
				a_checkpoints.push(new Checkpoint([40, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 45));
				a_checkpoints.push(new Checkpoint([30, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 46));
				a_checkpoints.push(new Checkpoint([20, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 47));
				a_checkpoints.push(new Checkpoint([10, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 48));
				a_checkpoints.push(new Checkpoint([0, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 49));
				a_checkpoints.push(new Checkpoint([-10, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 50));
				a_checkpoints.push(new Checkpoint([-20, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 51));
				a_checkpoints.push(new Checkpoint([-30, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 52));
				a_checkpoints.push(new Checkpoint([-40, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 53));
				a_checkpoints.push(new Checkpoint([-50, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 54));
				a_checkpoints.push(new Checkpoint([-60, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 55));
				a_checkpoints.push(new Checkpoint([-70, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 56));
				a_checkpoints.push(new Checkpoint([-80, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 57));
				a_checkpoints.push(new Checkpoint([-90, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 58));
				a_checkpoints.push(new Checkpoint([-100, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 59));
				a_checkpoints.push(new Checkpoint([-110, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 60));
				a_checkpoints.push(new Checkpoint([-120, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 61));
				a_checkpoints.push(new Checkpoint([-130, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 62));
				a_checkpoints.push(new Checkpoint([-140, 22, -68], f_mapScale, [.2, 16, 35], 3.14, false, 63));

				//Top of west hill:
				a_checkpoints.push(new Checkpoint([-150, 18, -49], f_mapScale, [.2, 48, 120], -1.5708, false, 64));
				a_checkpoints.push(new Checkpoint([-150, 18, -40], f_mapScale, [.2, 48, 120], -1.5708, false, 65));
				a_checkpoints.push(new Checkpoint([-150, 18, -30], f_mapScale, [.2, 48, 120], -1.5708, false, 66));
				a_checkpoints.push(new Checkpoint([-150, 18, -20], f_mapScale, [.2, 48, 120], -1.5708, false, 67));
				a_checkpoints.push(new Checkpoint([-150, 18, -10], f_mapScale, [.2, 48, 120], -1.5708, false, 68));
				a_checkpoints.push(new Checkpoint([-150, 18, 0], f_mapScale, [.2, 48, 120], -1.5708, true, 69));
				a_checkpoints[69].fn_setNextKey(88);
				a_checkpoints.push(new Checkpoint([-150, 18, 10], f_mapScale, [.2, 48, 120], -1.5708, false, 70));
				a_checkpoints.push(new Checkpoint([-150, 18, 20], f_mapScale, [.2, 48, 120], -1.5708, false, 71));
				a_checkpoints.push(new Checkpoint([-150, 18, 30], f_mapScale, [.2, 48, 120], -1.5708, false, 72));
				a_checkpoints.push(new Checkpoint([-150, 18, 40], f_mapScale, [.2, 48, 120], -1.5708, false, 73));
				a_checkpoints.push(new Checkpoint([-150, 18, 50], f_mapScale, [.2, 48, 120], -1.5708, false, 74));
				a_checkpoints.push(new Checkpoint([-150, 18, 60], f_mapScale, [.2, 48, 120], -1.5708, false, 75));
				a_checkpoints.push(new Checkpoint([-150, 18, 70], f_mapScale, [.2, 48, 120], -1.5708, false, 76));

				//Wood bridge:
				a_checkpoints.push(new Checkpoint([-150, 18, 100], f_mapScale, [.2, 32, 120], 0, false, 77));
				a_checkpoints.push(new Checkpoint([-140, 18, 100], f_mapScale, [.2, 32, 120], 0, false, 78));
				a_checkpoints.push(new Checkpoint([-130, 18, 100], f_mapScale, [.2, 32, 120], 0, false, 79));
				a_checkpoints.push(new Checkpoint([-120, 18, 105], f_mapScale, [.2, 32, 120], 0, false, 80));
				a_checkpoints.push(new Checkpoint([-110, 18, 110], f_mapScale, [.2, 32, 120], 0, false, 81));
				a_checkpoints.push(new Checkpoint([-95, 18, 120], f_mapScale, [.2, 32, 120], 0, false, 82));
				a_checkpoints.push(new Checkpoint([-95, 16, 120], f_mapScale, [.2, 32, 120], 0, false, 83));
				a_checkpoints.push(new Checkpoint([-80, 8, 125], f_mapScale, [.2, 16, 120], 0, false, 84));
				a_checkpoints.push(new Checkpoint([-70, 8, 125], f_mapScale, [.2, 16, 120], 0, false, 85));
				a_checkpoints.push(new Checkpoint([-60, 8, 125], f_mapScale, [.2, 16, 120], 0, false, 86));
				a_checkpoints.push(new Checkpoint([-50, 8, 125], f_mapScale, [.2, 16, 120], 0, false, 87));
				a_checkpoints.push(new Checkpoint([-40, 8, 125], f_mapScale, [.2, 16, 120], 0, true, 88));
				a_checkpoints[88].fn_setNextKey(0);
				a_checkpoints.push(new Checkpoint([-30, 8, 125], f_mapScale, [.2, 16, 120], 0, false, 89));
				a_checkpoints.push(new Checkpoint([-20, 8, 125], f_mapScale, [.2, 16, 120], 0, false, 90));
				a_checkpoints.push(new Checkpoint([-10, 8, 125], f_mapScale, [.2, 16, 120], 0, false, 91));
				a_checkpoints.push(new Checkpoint([0, 8, 100], f_mapScale, [.2, 16, 80], 0, false, 92));
				a_checkpoints.push(new Checkpoint([10, 8, 120], f_mapScale, [.2, 16, 40], 0, false, 93));
				a_checkpoints.push(new Checkpoint([20, 8, 120], f_mapScale, [.2, 16, 40], 0, false, 94));
				

				//Ending stretch:
				a_checkpoints.push(new Checkpoint([30, 8, 100], f_mapScale, [.2, 16, 60], 1.5708, false, 95));
				a_checkpoints.push(new Checkpoint([30, 8, 90], f_mapScale, [.2, 16, 60], 1.5708, false, 96));
				a_checkpoints.push(new Checkpoint([30, 8, 80], f_mapScale, [.2, 16, 60], 1.5708, false, 97));
				a_checkpoints.push(new Checkpoint([30, 8, 70], f_mapScale, [.2, 16, 60], 1.5708, false, 98));
				a_checkpoints.push(new Checkpoint([30, 8, 60], f_mapScale, [.2, 16, 60], 1.5708, false, 99));

				
				
				int_numKeys = 4;
		}
		else{
			renderer.setClearColor( 0x74bcff, 1);
			int_numKeys = 0;
		}
	}

	fn_addObjectsStatic(a_objects, worldOctree){
		if(str_map == "MC1"){
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
		//If mode isn't Time_Trials, add item boxes.
		//if(window.int_gameMode != 2){
			if(str_map == "MC1"){
				a_objects.push(new ItemPotRow([-53, 7.1, -61], f_mapScale, 6, .85, 2, 1, a_objectsDSOC));
				a_objects.push(new ItemPotRow([-46, 7.1, 9.7], f_mapScale, 3, 1.5, 2, 1, a_objectsDSOC));
			}
			else if(str_map == "FDL Circuit"){
				a_objects.push(new ItemPotRow([37, 3.9, -70], f_mapScale, 6, 2, 0, 1, a_objectsDSOC));
				a_objects.push(new ItemPotRow([16, 5.1, -126], f_mapScale, 2, 3, 2, 1, a_objectsDSOC));
				a_objects.push(new ItemPotRow([-142, 15.3, 6], f_mapScale, 5, 3, 0, 1, a_objectsDSOC));
				a_objectsDSOC.push(new OOB([45, 20, -46], 1, [5, 10, 15]));
				a_objectsDSOC.push(new OOB([54, 20, -42], 1, [15, 10, 5]));
				a_objectsDSOC.push(new OOB([66, 20, -34], 1, [30, 10, 10]));
				a_objectsDSOC.push(new OOB([110, 20, -25], 1, [70, 10, 5]));
			}
		//}
	}

	fn_animate(){
		if(skyboxModel && str_map != "MC1"){
			skyboxModel.rotation.y += 0.0004;
		}
	}
	
	fn_clear(){

	}

	fn_getMapPos(i, a_checkpoints){	//Used for getting player position
		return [
				v_mapPos.x + i * 2.5, 
				v_mapPos.y, 
				v_mapPos.z
			]
	}

	fn_getNumKeys(){
		return int_numKeys;
	}

	fn_getNumLaps(){
		return int_numLaps;
	}

	fn_hasGeo(){
		return b_hasGeo;
	}
	
	fn_hasOffroad(){
		return b_hasOffroad;
	}
}