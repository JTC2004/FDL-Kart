import * as THREE from 'three';
import Obj from "../object.js";

export default class ItemBox extends Obj{

	constructor(a_xyz, _worldScale, _localScale){
		//Adds the cube to the scene:
			super(a_xyz, _worldScale, false, false, _localScale);

			this.fn_addModel([0,0,0], [.8,.8,.8], "ItemBox", (model) => {
				//Randomize rotation:
				model.rotation.x = Math.random() * 2*Math.PI;
				model.rotation.y = Math.random() * 2*Math.PI;
			});
			this.fn_addBox([0,0,0], [1,1,1], 0x00ffff, false);
			this.fn_addSprite([0,0,0], [1.2, 1.2, 1.2], "objects/mk_ques2");
			
			this.f_amplitude = 0.004;
			this.f_respawnTime = 1.00;
			this.f_respawnTimer = 0.0;
		
	}
	
	//Overidden functions:
		fn_getType(){
			return "item box";
		}

		fn_DSOC(player){
			if(this.f_respawnTimer == 0.0){
				this.f_respawnTimer = this.f_respawnTime;
				this.mesh.visible = false;
				this.sprite.visible = false;
			}
		}
		
		fn_animate(_frames){
			//Animate the box if spawned:
			if(this.f_respawnTimer == 0.0){
				//Mesh rotation:
				if(_frames % 1 == 0){
					this.mesh.rotation.x += -0.011;
					this.mesh.rotation.y += 0.022;
				}
				
				//Make box slightly bob up and down (ChatGPT helped):
				this.fn_addPos(
					0,
					this.f_amplitude * Math.sin(performance.now() * 0.0003 * Math.PI * 2.0),
					0
				);
			}
			//Else, count down respawn time:
			else if(this.f_respawnTimer > 0){
				this.f_respawnTimer -= 1 / 60;
			}
			else{
				this.f_respawnTimer = 0.0;
				this.mesh.visible = true;
				this.sprite.visible = true;
			}
			
			
		}
}