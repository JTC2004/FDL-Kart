import * as THREE from 'three';
import Obj from "../object.js";
import ItemPot from "./itemPot.js";

export default class ItemPotRow extends Obj{

	constructor(a_xyz, _worldScale, _num, _proximity, _rotation, _localScale, a_objectsDSOC){
		//Adds the cube to the scene:
			super(a_xyz, _worldScale, false, false);

			this.a_boxes = [];
			
            for(let i = 0; i < _num; i++){
                this.a_boxes.push(new ItemPot([a_xyz[0] - i * _proximity, a_xyz[1], a_xyz[2] + i * _rotation * _proximity], _worldScale, _localScale, a_objectsDSOC));
                a_objectsDSOC.push(this.a_boxes[i]); 
            }
			
		
	}
	
	//Overidden functions:
		fn_getType(){
			return "item box row";
		}

        fn_animate(_frames){
            this.a_boxes.forEach((obj_box) => {
                obj_box.fn_animate(_frames);
            });
        }
		
		
}