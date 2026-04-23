import * as THREE from 'three';
import Obj from "../object.js";
import { fn_getInputs } from "../../main.js";
let a_inputs;

export default class ConnectController extends Obj{
	//Tutorial for adding sprites: https://threejs.org/docs/#api/en/objects/Sprite 	

	constructor(a_xyz, _i){
		super(a_xyz, 1, false, true, 1);
		
		this.fn_addSpriteSheets([0,0,0], [3.5, 2.8, 1], 'hud/input', 1);
		this.fn_changeSpriteSheet(0);
		//this.sprite.visible = false;

		this.int_index = _i;
		a_inputs = fn_getInputs();
		
	}

	fn_update(){
		if(a_inputs.length <= this.int_index){
			this.sprite.visible = false;
		}
		else{
			this.sprite.visible = true;

			if(a_inputs[this.int_index].fn_getType() == 'KB'){
				this.fn_changeSpriteSheet(2);
			}
			else{
				this.fn_changeSpriteSheet(1);
			}
		}
	}
	
	//Overriden functions:
	fn_getType(){
		return "connectController";
	}
}