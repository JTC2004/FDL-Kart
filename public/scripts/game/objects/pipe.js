import * as THREE from 'three';
import Obj from "../object.js";

export default class Pipe extends Obj{
	//Tutorial for adding sprites: https://threejs.org/docs/#api/en/objects/Sprite 	

	constructor(a_xyz, _worldScale, _localScale){
		super(a_xyz, _worldScale, false, true, _localScale * 2);
		this.fn_addSprite([0,0,0], [1,1,1], 'objects/pipe');
				
		//Add a shadow:
		this.fn_addSimpleShadow(.48, .45, 0.9);
		
		//Add hitbox (cylinder):
		this.fn_addColliderCylinder([0,0,0], [.325, .325, .9]);
	}	
	
	//Overriden functions:
		fn_getType(){
			return "pipe";
		}
}