//Checkpoint.js

import * as THREE from 'three';
import Obj from "../object.js";

export default class Cube extends Obj{

	constructor(a_xyz, _worldScale, a_dimensions, _b_rotation, _b_key, _int_ID){
		//Adds the checkpoint to the scene:
			super(a_xyz, _worldScale, true, false, _worldScale);
			this.b_key = _b_key;
			this.b_goal = false;
			
			if(this.b_key){
				this.fn_addBoxTransp([0,0,0], a_dimensions, 0x00ff00, 0.1);
				this.mesh.visible = false;
			}
			else{
				this.fn_addBoxTransp([0,0,0], a_dimensions, 0x0026ff, 0.2);
				this.mesh.visible = false;
			}
			
			this.int_ID = _int_ID;
			this.mesh.rotation.y = _b_rotation;
			this.boundingBox = new THREE.Box3().setFromObject(this.mesh);		//Update bounding box.
			
			//Create a helper to visualize the boundingbox:
			//if(this.b_key){
			//	scene.add(new THREE.Box3Helper(this.boundingBox, 0x00ff00));
			//}
	}
	
	//New functions:
		fn_setGoal(){
			this.b_goal = true;
			return true;
		}
		
		fn_getGoal(){
			return this.b_goal;
		}
		
		fn_getKey(){
			return this.b_key;
		}
		
		fn_setNextKey(_int_nextKey){
			this.int_nextKey = _int_nextKey;
		}
		
		fn_getNextKey(){
			return this.int_nextKey;
		}
		
		fn_getID(){
			return this.int_ID;
		}
		
		fn_getMesh(){
			return this.mesh;
		}
		
		fn_getHitbox(){
			return this.boundingBox();
		}
	
	//Overidden functions:
		fn_getType(){
			return "checkpoint";
		}
		
}