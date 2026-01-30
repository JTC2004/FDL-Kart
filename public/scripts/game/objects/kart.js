import * as THREE from 'three';
import Obj from "../object.js";

export default class Kart extends Obj{
	//Tutorial for adding sprites: https://threejs.org/docs/#api/en/objects/Sprite 	

	constructor(_scene, a_xyz, _worldScale, _localScale, _loader){
		super(_scene, a_xyz, _worldScale, false, false, _localScale);
		this.fn_addModel(_scene, [0,0,0], [1,1,1], _loader, 'GoKart');

		this.v_baseRotation = new THREE.Vector3(0,0,0);
		
		
		
	}	
	
	//Overriden functions:
		fn_update(){
			//console.log(`v_baseRotation = (${this.v_baseRotation.x}, ${this.v_baseRotation.y} ,${this.v_baseRotation.z})`);
			this.fn_setRotation(this.v_baseRotation);
		}
	
		fn_getType(){
			return "kart";
		}

		fn_setBaseRotation(_newBaseRot){
			this.v_baseRotation = _newBaseRot;
		}
}