import * as THREE from 'three';
import Obj from "../object.js";

export default class ItemPot extends Obj{

	constructor(a_xyz, _worldScale, _localScale){
		//Adds the cube to the scene:
			super(a_xyz, _worldScale, false, false, _localScale);

			this.fn_addModel([0,0,0], [.8,.8,.8], "ItemBox", (model) => {
				//Randomize rotation:
				model.rotation.x = Math.random() * 2*Math.PI;
				model.rotation.y = Math.random() * 2*Math.PI;
			});
			this.fn_addBox([0,0,0], [1,1,1], 0x00ffff, false);
			this.fn_addSprite([0,0,0], [1.2, 1.2, 1.2], "mk_ques2");
			
			this.f_amplitude = 0.004;
			//if(this.boundingBox){
			//	console.log("Item pot created w/ bounding box!");
			//}
		
	}
	
	//Overidden functions:
		fn_getType(){
			return "item box";
		}

		fn_DSOC(player){
			console.log(`Item box collided with player ${player.fn_getPlayerIndex()}!`);
		}
		
		fn_animate(_frames){
			//Mesh rotation:
			if(_frames % 1 == 0){
				this.model.rotation.x += -0.011;
				this.model.rotation.y += 0.022;
			}
			
			//Make box slightly bob up and down (ChatGPT helped):
			this.fn_addY(this.f_amplitude * Math.sin(performance.now() * 0.0003 * Math.PI * 2.0));
		}
}