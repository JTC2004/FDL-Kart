import * as THREE from 'three';
import Obj from "./object.js";

export default class Cube extends Obj{

	constructor(a_xyz, _scale){
		//Adds the cube to the scene:
			super(a_xyz, _scale, false, false);
			this.fn_addBox([0,0,0], [1,1,1], 0x00ffff, true);
	}
	
	//Overidden functions:
		fn_getType(){
			return "cube";
		}
		
		fn_animate(_frames){
			//Mesh rotation:
			if(_frames % 3 == 0){
				this.box.rotation.x += -0.006;
				this.box.rotation.y += 0.06;
			}
		}
}