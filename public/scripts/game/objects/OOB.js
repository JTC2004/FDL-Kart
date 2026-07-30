import * as THREE from 'three';
import Obj from "../object.js";

export default class OOB extends Obj{

	constructor(a_xyz, _scale, _a_scale){
		//Adds the cube to the scene:
			super(a_xyz, _scale, true, true, 1);
			this.fn_addBoxTransp([0,0,0], _a_scale, 0xff0000, 0.5, false);
	}
	
	//Overidden functions:
		fn_getType(){
			return "OOB";
		}

		fn_DSOC(player){
			player.fn_setOOB(true);
			return this.b_DSOC;
		}
		
}