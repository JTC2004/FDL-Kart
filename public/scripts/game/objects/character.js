import * as THREE from 'three';
import Obj from "../object.js";

export default class Character extends Obj{
	//Tutorial for adding sprites: https://threejs.org/docs/#api/en/objects/Sprite 	

	constructor(_scene, a_xyz, _worldScale, _localScale, _str_name){
		super(_scene, a_xyz, _worldScale, false, true, _localScale * 1.5);
		
		this.str_name = _str_name;
		
		this.fn_addSprite(_scene, [0,0,0], [1,1,1], this.str_name + ' gremlin (transp)');
	}	
	
	//Overriden functions:
		fn_update(){

		}

		fn_getType(){
			return "character";
		}
}