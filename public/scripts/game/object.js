//This is the parent class for all objects in a scene.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//Essentials:
	import { fn_getScene } from "../main.js";
	import { fn_getLoader } from "../main.js";
	//Essentials:
		let scene;
		let loader;

export default class Obj{

	constructor(a_xyz, _worldScale, _DSOC, _solid, _localScale){
		//Essentials:
			scene = fn_getScene();
			loader = fn_getLoader();
		
		this.f_x = a_xyz[0] * _worldScale;
		this.f_y = a_xyz[1] * _worldScale;
		this.f_z = a_xyz[2] * _worldScale;
		this.f_scale = _localScale;

		//Potentially make mesh, model, sprite, etc an array.
		
		//DSOC means Do Somethig On Collision.
		this.b_DSOC = _DSOC;
		this.b_solid = _solid;

		//Animation variables:
		//Animation variables:
		this.a_currentTile = [0, 0];
		this.int_numTilesTall = 0;
	}
	
	//Adds a mesh to the object:
	fn_addBox(a_offset, a_multip, _color){
		this.geometry = new THREE.BoxGeometry( this.f_scale * a_multip[0], this.f_scale * a_multip[1], this.f_scale * a_multip[2] );
		this.material = new THREE.MeshPhongMaterial( { color: _color } );
		this.box = new THREE.Mesh( this.geometry, this.material );
		scene.add( this.box );
		this.box.position.set(this.f_x + a_offset[0], this.f_y + a_offset[1], this.f_z + a_offset[2]);
		
		//Create bounding box:
		this.boundingBox = new THREE.Box3().setFromObject(this.box);
	}
	
	//Adds a transparent mesh to the object:
	fn_addBoxTransp(a_offset, a_multip, _color, _opacity){
		this.geometry = new THREE.BoxGeometry( this.f_scale * a_multip[0], this.f_scale * a_multip[1], this.f_scale * a_multip[2] );
		this.material = new THREE.MeshPhongMaterial( { color: _color, transparent: true, opacity: _opacity } );
		this.box = new THREE.Mesh( this.geometry, this.material );
		scene.add( this.box );
		this.box.position.set(this.f_x + a_offset[0], this.f_y + a_offset[1], this.f_z + a_offset[2]);
		
		//Create bounding box:
		this.boundingBox = new THREE.Box3().setFromObject(this.box);
	}
	
	//Adds a mesh from a GLTF model:
	fn_addModel(a_offset, a_multip, _modelName, onLoad){
		this.model = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ visible: false }));
		loader.load( 'assets/models/objects/'+ _modelName +'.glb',		//I should make a method for this. 
			( gltf ) => {
				
				this.model = gltf.scene;
				this.model.position.set(this.f_x + a_offset[0], this.f_y + a_offset[1], this.f_z + a_offset[2]);
				this.model.scale.set(this.f_scale * a_multip[0], this.f_scale * a_multip[1], this.f_scale * a_multip[2]);
				this.model.visible = true;
				
				this.model.updateMatrixWorld(true);
				scene.add( this.model );
				
				//Create bounding box:
				this.boundingBox = new THREE.Box3().setFromObject(this.model);
				
				if (onLoad) onLoad(this.model);		//Set rotation AFTER model is loaded.

				//console.log(`ADDED MODEL ${_modelName} at (${this.f_x},${this.f_y},${this.f_z})!`);
			}, 
			undefined, function ( error ) {
				console.error( error );
			} 
		);
	}
	
	//Adds a single sprite to the object:
	fn_addSprite(a_offset, a_multip, str_spriteName){
		this.spriteMap = new THREE.TextureLoader().load( 'assets/sprites/gameplay/'+ str_spriteName +'.png' );
		this.spriteMaterial = new THREE.SpriteMaterial({ 
			map: this.spriteMap,
			transparent: true,	
			alphaTest: 0.5,			//Helps discard transparent pixels.
			color: 0xffffff,
		});
		this.sprite = new THREE.Sprite( this.spriteMaterial );
		
		this.sprite.scale.set(
			this.f_scale * a_multip[0], 
			this.f_scale * a_multip[1], 
			this.f_scale * a_multip[2] 
		);
		this.sprite.position.set(
			this.f_x + a_offset[0], 
			this.f_y + a_offset[1], 
			this.f_z + a_offset[2]
		);
		scene.add( this.sprite );
	}

	//Adds sprite sheet to the object:
	fn_addSpriteSheet(a_offset, a_multip, str_spriteName, _int_numTilesTall){
		this.int_numTilesTall = _int_numTilesTall;
		
		this.spriteMap = new THREE.TextureLoader().load( 'assets/sprites/gameplay/'+ str_spriteName +'.png' );
		this.spriteMap.repeat.set(1/this.int_numTilesTall, 1/this.int_numTilesTall);
		this.spriteMap.offset.x = 0;
		this.spriteMap.offset.y = 1 - 1/this.int_numTilesTall;
		
		this.spriteMaterial = new THREE.SpriteMaterial({ 
			map: this.spriteMap,
			transparent: true,	
			alphaTest: 0.5,			//Helps discard transparent pixels.
			color: 0xffffff
		});
		this.sprite = new THREE.Sprite( this.spriteMaterial );
		
		this.sprite.scale.set(this.f_scale * a_multip[0], this.f_scale * a_multip[1], this.f_scale * a_multip[2] );
		this.sprite.position.set(this.f_x + a_offset[0], this.f_y + a_offset[1], this.f_z + a_offset[2]);
		scene.add( this.sprite );
	}
	
	//Add bounding cylinder to the object:
	fn_addHitbox(a_offset, a_multip){
		this.colliderGeom = new THREE.CylinderGeometry( this.f_scale * a_multip[0], this.f_scale * a_multip[1], this.f_scale * a_multip[2], 16); 
		this.colliderMat = new THREE.MeshBasicMaterial( {color: 0xffff00} ); 
		this.colliderMesh = new THREE.Mesh( this.colliderGeom, this.colliderMat );
		scene.add( this.colliderMesh );
		this.colliderMesh.position.set(this.f_x + a_offset[0], this.f_y + a_offset[1], this.f_z + a_offset[2]);
		this.colliderMesh.visible = false;
	}
	
	//Add a simple cyllindrical shadow to the object:
	fn_addSimpleShadow(f_offset, f_multip, f_opacity){
		this.shadowMaterial = new THREE.LineBasicMaterial( {color: 0x000000});
		this.shadowMaterial.opacity = f_opacity;	//0.9
		
		this.shadowGeometry = new THREE.CircleGeometry(this.f_scale * f_multip, 32); 
		this.shadow = new THREE.Mesh( this.shadowGeometry, this.shadowMaterial ); 
		scene.add( this.shadow );
		this.shadow.position.set(this.f_x,this.f_y - f_offset * this.f_scale, this.f_z);
		this.shadow.rotation.x = -1.5708;
	}
	
	
	//Getters:
		fn_getType(){
			return "object";
		}

		fn_getPos(){
			return [this.f_x, this.f_y, this.f_z];
		}
		
		fn_getSolid(){
			return this.b_solid;
		}
		
		fn_getDSOC(){
			return this.b_DSOC;
		}
		
		fn_getCollider(){
			return this.colliderMesh;
		}
		fn_getSpriteTile(){
			return this.a_currentTile;
		}
	//Setters:
		fn_setPos(v_xyz){
			this.f_x = v_xyz.x;
			this.f_y = v_xyz.y;
			this.f_z = v_xyz.z;
			//console.log(`SETTING POS TO (${v_xyz.x}, ${v_xyz.y}, ${v_xyz.z})`);

			if(this.model){		this.model.position.copy(v_xyz);	}
			if(this.sprite){	this.sprite.position.copy(v_xyz);	}
			if(this.cube){		this.box.position.copy(v_xyz)		}
		}

		fn_setY(_f_Y){
			this.f_y = _f_Y;

			if(this.model){		this.model.position.copy(new THREE.Vector3(this.f_x, _f_Y, this.f_z));	}
			if(this.sprite){	this.sprite.position.copy(new THREE.Vector3(this.f_x, _f_Y, this.f_z));	}
			if(this.cube){		this.box.position.copy(new THREE.Vector3(this.f_x, _f_Y, this.f_z))		}
		}

		fn_addX(_f_x){
			this.f_x = this.f_x + _f_x;

			if(this.model){		this.model.position.x = this.f_x;	}
			if(this.sprite){	this.sprite.position.x = this.f_x;	}
			if(this.cube){		this.box.position.x = this.f_x;		}
		}

		fn_addY(_f_y){
			this.f_y = this.f_y + _f_y;

			if(this.model){		this.model.position.y = this.f_y;	}
			if(this.sprite){	this.sprite.position.y = this.f_y;	}
			if(this.cube){		this.box.position.y = this.f_y;		}
		}

		fn_addZ(_f_z){
			this.f_z = this.f_z + _f_z;

			if(this.model){		this.model.position.z = this.f_z;	}
			if(this.sprite){	this.sprite.position.z = this.f_z;	}
			if(this.cube){		this.box.position.z = this.f_z;		}
		}

		fn_setRotation(v_xyz){
			// /console.log(`New rotation: ${v_xyz}`);
			if(this.model){		
				this.model.rotation.x = v_xyz.x;
				this.model.rotation.y = v_xyz.y;
				this.model.rotation.z = v_xyz.z;	
			}
			if(this.cube){		this.box.rotation.copy(v_xyz)		}
		}
		fn_setSpriteTile(_x, _y){
			//x negative to pos is left to right.
			//y negative to pos is up to down.
			this.a_currentTile = [_x, _y];
			
			this.spriteMap.offset.x = this.a_currentTile[0]/this.int_numTilesTall;
			this.spriteMap.offset.y = 1 - (this.a_currentTile[1] + 1)/this.int_numTilesTall;
		}
		fn_flipSprite(_int_newFlip){
			if(!this.spriteMap) return;

			const tileSize = 1 / this.int_numTilesTall;

			this.spriteMap.repeat.x = _int_newFlip * tileSize;
			this.spriteMap.offset.x =
				(this.a_currentTile[0] + Math.abs((1 - _int_newFlip) / 2)) * tileSize;
		}
	
	//Methods that execute every frame:
		fn_animate(_frames){
			
		}
		
		//Use this for checking for non-octree collisions:
		fn_meshCollisionCheck(_playerBoundingBox){
			if(this.boundingBox.intersectsBox(_playerBoundingBox)){
				//console.log("Object collision");
				return true;
			}
			else{
				//console.log("No object collision");
				return false;
			}
			//return false;
		}
	
	
}