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
		
		this.object = new THREE.Object3D();									//Tracks the 3D space of this object.
		this.object.position.set(
			a_xyz[0] * _worldScale, 
			a_xyz[1] * _worldScale, 
			a_xyz[2] * _worldScale
		);

		this.f_scale = _localScale;

		//Potentially make mesh, model, sprite, etc an array.
		
		//DSOC means Do Somethig On Collision.
		this.b_DSOC = _DSOC;
		this.b_solid = _solid;

		//Animation variables:
		this.a_currentTile = [0, 0];
		this.int_numTilesTall = 0;
	}
	
	//Adds a mesh to the object:
	fn_addBox(a_offset, a_multip, _color, _visible){
		this.geometry = new THREE.BoxGeometry( this.f_scale * a_multip[0], this.f_scale * a_multip[1], this.f_scale * a_multip[2] );
		this.material = new THREE.MeshPhongMaterial( { color: _color } );
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		scene.add( this.mesh );
		this.mesh.position.set(
			this.object.position.x + a_offset[0], 
			this.object.position.y + a_offset[1], 
			this.object.position.z + a_offset[2]
		);
		if(!_visible){
			this.mesh.visible = false;
		}
		
		//Create bounding box:
		this.boundingBox = new THREE.Box3().setFromObject(this.mesh);
		this.boundingBox.visible = false;
	}
	
	//Adds a transparent mesh to the object:
	fn_addBoxTransp(a_offset, a_multip, _color, _opacity, _visible){
		this.geometry = new THREE.BoxGeometry( this.f_scale * a_multip[0], this.f_scale * a_multip[1], this.f_scale * a_multip[2] );
		this.material = new THREE.MeshPhongMaterial( { color: _color, transparent: true, opacity: _opacity } );
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		scene.add( this.mesh );
		this.mesh.position.set(
			this.object.position.x + a_offset[0], 
			this.object.position.y + a_offset[1], 
			this.object.position.z + a_offset[2]
		);
		if(!_visible){
			this.mesh.visible = false;
		}
		
		//Create bounding box:
		this.boundingBox = new THREE.Box3().setFromObject(this.mesh);
		this.boundingBox.visible = false;
	}
	
	//Adds a mesh from a GLTF model:
	fn_addModel(a_offset, a_multip, _modelName, onLoad){
		this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ visible: false }));
		loader.load( 'assets/models/objects/'+ _modelName +'.glb',		//I should make a method for this. 
			( gltf ) => {
				
				this.mesh = gltf.scene;
				this.mesh.position.set(
					this.object.position.x + a_offset[0], 
					this.object.position.y + a_offset[1], 
					this.object.position.z + a_offset[2]
				);
				this.mesh.scale.set(this.f_scale * a_multip[0], this.f_scale * a_multip[1], this.f_scale * a_multip[2]);
				this.mesh.visible = true;
				
				this.mesh.updateMatrixWorld(true);
				scene.add( this.mesh );
				
				//Create bounding box:
				this.boundingBox = new THREE.Box3().setFromObject(this.mesh);
				this.boundingBox.visible = false;
				
				if (onLoad) onLoad(this.mesh);		//Set rotation AFTER model is loaded.

				//console.log(`ADDED MODEL ${_modelName} at (${this.object.position.x},${this.object.position.y},${this.object.position.z})!`);
			}, 
			undefined, function ( error ) {
				console.error( error );
			} 
		);
	}
	
	//Adds a single sprite to the object:
	fn_addSprite(a_offset, a_multip, str_spriteName){
		this.spriteMap = new THREE.TextureLoader().load( 'assets/sprites/gameplay/'+ str_spriteName +'.png' );
		this.spriteMap.colorSpace = THREE.SRGBColorSpace;
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
			this.object.position.x + a_offset[0], 
			this.object.position.y + a_offset[1], 
			this.object.position.z + a_offset[2]
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
		this.spriteMap.colorSpace = THREE.SRGBColorSpace;
		
		this.spriteMaterial = new THREE.SpriteMaterial({ 
			map: this.spriteMap,
			transparent: true,	
			alphaTest: 0.5,			//Helps discard transparent pixels.
			color: 0xffffff
		});
		this.sprite = new THREE.Sprite( this.spriteMaterial );
		
		this.sprite.scale.set(this.f_scale * a_multip[0], this.f_scale * a_multip[1], this.f_scale * a_multip[2] );
		this.sprite.position.set(
			this.object.position.x + a_offset[0], 
			this.object.position.y + a_offset[1], 
			this.object.position.z + a_offset[2]
		);
		scene.add( this.sprite );
	}

	//Adds sprite sheet w/ 'wiggle' frames to the object:
	fn_addSpriteSheets(a_offset, a_multip, str_spriteName, _int_numTilesTall){
		//Clean up the sprites if this function hasn't been called for the first time:
		if (this.sprite) {
			scene.remove(this.sprite);              // remove from scene
			this.sprite.material.dispose();         // dispose material

			if (this.sprite.material.map) {
				this.sprite.material.map.dispose(); // dispose texture (optional if already handled)
			}

			this.sprite = null;
		}

		if(this.a_spriteMaps){
			for (const map of this.a_spriteMaps) {
				map.dispose();
			}
		}
		this.a_spriteMaps = [];
		
		this.int_numTilesTall = _int_numTilesTall;
		
		this.a_spriteMaps = [
			new THREE.TextureLoader().load('assets/sprites/gameplay/'+ str_spriteName +'0.png'),
			new THREE.TextureLoader().load('assets/sprites/gameplay/'+ str_spriteName +'1.png'),
			new THREE.TextureLoader().load('assets/sprites/gameplay/'+ str_spriteName +'2.png')
		];

		//this.spriteMap = new THREE.TextureLoader().load('assets/sprites/gameplay/'+ str_spriteName +'.png');
		
		this.int_spriteMapsIndex = 1;
		for(const spriteMap of this.a_spriteMaps){
			spriteMap.repeat.set(1/this.int_numTilesTall, 1/this.int_numTilesTall);
			spriteMap.offset.x = 0;
			spriteMap.offset.y = 1 - 1/this.int_numTilesTall;
			spriteMap.colorSpace = THREE.SRGBColorSpace;
		}
		
		this.spriteMaterial = new THREE.SpriteMaterial({ 
			map: this.a_spriteMaps[this.int_spriteMapsIndex],
			transparent: true,	
			alphaTest: 0.5,			//Helps discard transparent pixels.
			color: 0xffffff
		});
		this.sprite = new THREE.Sprite( this.spriteMaterial );
		
		this.sprite.scale.set(this.f_scale * a_multip[0], this.f_scale * a_multip[1], this.f_scale * a_multip[2] );
		this.sprite.position.set(
			this.object.position.x + a_offset[0], 
			this.object.position.y + a_offset[1], 
			this.object.position.z + a_offset[2]
		);
		scene.add( this.sprite );
	}
	
	//Add bounding cylinder to the object:
	fn_addColliderSphere(a_offset, a_multip){
		this.colliderGeom = new THREE.CylinderGeometry( this.f_scale * a_multip[0], this.f_scale * a_multip[1], this.f_scale * a_multip[2], 16); 
		this.colliderMat = new THREE.MeshBasicMaterial( {color: 0xffff00} ); 
		this.colliderMesh = new THREE.Mesh( this.colliderGeom, this.colliderMat );
		scene.add( this.colliderMesh );
		this.colliderMesh.position.set(
			this.object.position.x + a_offset[0], 
			this.object.position.y + a_offset[1], 
			this.object.position.z + a_offset[2]
		);
		this.colliderMesh.visible = false;
	}
	
	//Add a simple cyllindrical shadow to the object:
	fn_addSimpleShadow(f_offset, f_multip, f_opacity){
		this.shadowMaterial = new THREE.LineBasicMaterial( {color: 0x000000});
		this.shadowMaterial.opacity = f_opacity;	//0.9
		
		this.shadowGeometry = new THREE.CircleGeometry(this.f_scale * f_multip, 32); 
		this.shadow = new THREE.Mesh( this.shadowGeometry, this.shadowMaterial ); 
		scene.add( this.shadow );
		this.shadow.position.set(
			this.object.position.x,
			this.object.position.y - f_offset * this.f_scale, 
			this.object.position.z
		);
		this.shadow.rotation.x = -1.5708;
	}
	
	
	//Getters:
		fn_getType(){
			return "object";
		}

		fn_getPos(){
			return this.object.position;
		}

		fn_getRotation(){
			return this.mesh.rotation;
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
			this.object.position.copy(v_xyz);

			if(this.mesh){		this.mesh.position.copy(v_xyz);	}
			if(this.sprite){	this.sprite.position.copy(v_xyz);	}
		}

		fn_addPos(_f_x = 0, _f_y = 0, _f_z = 0,){
			this.object.position.x += + _f_x;
			this.object.position.y += + _f_y;
			this.object.position.z += + _f_z;

			if(this.mesh){		this.mesh.position.copy(this.object.position);		}
			if(this.sprite){	this.sprite.position.copy(this.object.position);	}
		}

		fn_setRotation(v_xyz){
			if(this.mesh){		
				//Rotation can't use the .copy() method because it's a Euler Vector3 (for some reason)
				this.mesh.rotation.x = v_xyz.x;
				this.mesh.rotation.y = v_xyz.y;
				this.mesh.rotation.z = v_xyz.z;	
			}
		}

		fn_setScale(v_xyz){
			if(this.mesh){		
				this.mesh.scale.copy(v_xyz);	
			}
			if(this.sprite){	this.sprite.scale.copy(v_xyz)}
		}

		fn_getSpriteScale(){
			return this.sprite.scale;
		}

		fn_setSpriteTile(_x, _y){
			//x negative to pos is left to right.
			//y negative to pos is up to down.	this.int_spriteMapsIndex
			this.a_currentTile = [_x, _y];
			
			if(this.a_spriteMaps){
				for(const spriteMap of this.a_spriteMaps){
					spriteMap.offset.x = this.a_currentTile[0]/this.int_numTilesTall;
					spriteMap.offset.y = 1 - (this.a_currentTile[1] + 1)/this.int_numTilesTall;
				}
			}
			else if(this.spriteMap){
				this.spriteMap.offset.x = this.a_currentTile[0]/this.int_numTilesTall;
				this.spriteMap.offset.y = 1 - (this.a_currentTile[1] + 1)/this.int_numTilesTall;
			}
		}
		fn_flipSprite(_int_newFlip){
			const tileSize = 1 / this.int_numTilesTall;

			if(this.a_spriteMaps){
				for(const spriteMap of this.a_spriteMaps){
					spriteMap.repeat.x = _int_newFlip * tileSize;
					spriteMap.offset.x =
					(this.a_currentTile[0] + Math.abs((1 - _int_newFlip) / 2)) * tileSize;
				}
			}
			else if(this.spriteMap){
				this.spriteMap.repeat.x = _int_newFlip * tileSize;
				this.spriteMap.offset.x =
				(this.a_currentTile[0] + Math.abs((1 - _int_newFlip) / 2)) * tileSize;
			}
		}
		fn_changeSpriteSheet(_int_i){
			this.sprite.material.map = this.a_spriteMaps[_int_i];
			this.sprite.material.needsUpdate = true;	
		}
	
	//Methods that execute every frame:
		fn_animate(_frames){
			
		}
		
		//Use this for checking for non-octree collisions:
		fn_meshCollisionCheck(player){			
			if(this.boundingBox.intersectsSphere(player.fn_getHitbox())){
				this.fn_DSOC(player);
				return true;
			}
			else{
				return false;
			}
		}

		//Do something on collision (override this with child):
		fn_DSOC(player){
			return this.b_DSOC;
		}
	
	
}