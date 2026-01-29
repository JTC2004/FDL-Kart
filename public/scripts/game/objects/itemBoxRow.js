import * as THREE from 'three';
import Obj from "../object.js";
import ItemBox from "./itemBox.js";

export default class ItemBoxRow extends Obj{

	constructor(_scene, a_xyz, _worldScale, _loader, _num, _proximity, _localScale){
		//Adds the cube to the scene:
			super(_scene, a_xyz, _worldScale, false, false);

			this.a_boxes = new Array(_num);
			
            for(let i = 0; i < _num; i++){
                this.a_boxes.push(new ItemBox(_scene, [a_xyz[0] - i * _proximity, a_xyz[1], a_xyz[2] + i * 2 * _proximity], _worldScale, _loader, _localScale));
                //console.log("this.a_boxes[i] = " + this.a_boxes[i]);    
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