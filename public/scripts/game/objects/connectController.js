import * as THREE from 'three';
import Obj from "../object.js";
import { fn_getInputs } from "../../main.js";
import { fn_popInput } from "../../main.js";
let a_inputs;

export default class ConnectController extends Obj{
	//Tutorial for adding sprites: https://threejs.org/docs/#api/en/objects/Sprite 	

	constructor(a_xyz, _i){
		super(a_xyz, 1, false, true, 1);
		
		this.f_baseScaleX = 3.5;
		this.f_baseScaleY = 2.8;
		this.f_scaleIncrement = 0;

		this.fn_addSpriteSheets([0,0,0], [this.f_baseScaleX, this.f_baseScaleY, 1], 'hud/input', 1);
		this.fn_changeSpriteSheet(0);
		//this.sprite.visible = false;

		this.int_index = _i;
		a_inputs = fn_getInputs();
		
	}

	fn_update(){
		//If this input isn't in the list of inputs, don't display the sprite:
		if(a_inputs.length <= this.int_index){
			this.sprite.visible = false;
		}
		//Else, display the sprite depending on if the input is a keyboard or controller: 
		else{
			this.sprite.visible = true;

			if(a_inputs[this.int_index].fn_getType() == 'KB'){
				this.fn_changeSpriteSheet(2);
			}
			else{
				this.fn_changeSpriteSheet(1);
			}

			//If any button is pressed in the input, make the sprite puff up...
			if(a_inputs[this.int_index].fn_press()){
				this.fn_setScale(new THREE.Vector3(this.f_baseScaleX * 1.2, this.f_baseScaleY * 1.2, 0));
				this.f_scaleIncrement = 0;
			}

			//If this controller presses B or RT, disconnect it:
			if(a_inputs[this.int_index].fn_release_drift()){
				fn_popInput(this.int_index);
			}
		}

		//...and then shrink back to it's base size:
		if(this.fn_getSpriteScale().x > this.f_baseScaleX){
			this.f_scaleIncrement += 0.05;
			this.fn_setScale(new THREE.Vector3(this.f_baseScaleX * (1.2 - this.f_scaleIncrement), this.f_baseScaleY * (1.2 - this.f_scaleIncrement), 0));
		}
		else{
			this.f_scaleIncrement = 0;
		}
	}
	
	//Overriden functions:
	fn_getType(){
		return "connectController";
	}

	//Hide this controller:
	fn_hide(){
		this.sprite.visible = false;
	}
	//Show this controller:
	fn_show(){
		this.sprite.visible = true;
	}
}