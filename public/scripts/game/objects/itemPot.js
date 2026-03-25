import * as THREE from 'three';
import Obj from "../object.js";

export default class ItemPot extends Obj{

	constructor(a_xyz, _worldScale, _localScale){
		//Adds the cube to the scene:
			super(a_xyz, _worldScale, false, false, _localScale);

			this.fn_addBox([0,0,0], [1,1,1], 0x00ffff, false);
			this.fn_addSpriteSheets([0,0,0], [1.8, 1.8, 1.8], "objects/Item_Pot_frame_", 1);
			
			this.f_amplitude = 0.004;
			this.f_respawnTime = 1.00;
			this.f_respawnTimer = 0.0;

			//Animation variables:
			this.int_wiggleIndex = 1;
			this.int_wiggleIncrement = 1;

			this.f_glow = 1.0;
			//if(this.boundingBox){
			//	console.log("Item pot created w/ bounding box!");
			//}
		
	}
	
	//Overidden functions:
		fn_getType(){
			return "item box";
		}

		fn_DSOC(player){
			if(this.f_respawnTimer == 0.0){
				console.log(`Item box collided with player ${player.fn_getPlayerIndex()}!`);
				this.f_respawnTimer = this.f_respawnTime;
				this.sprite.visible = false;
			}
		}
		
		fn_animate(_frames){
			//Animate the box if spawned:
			if(this.f_respawnTimer == 0.0){
				//Sprite 'wiggle':
				if(_frames % 5 == 0){
					this.fn_changeSpriteSheet(this.int_wiggleIndex);
					this.int_wiggleIndex += this.int_wiggleIncrement;

					if(this.int_wiggleIndex > 2){
						this.int_wiggleIncrement = -1;
						this.int_wiggleIndex = 1;
					}
					if(this.int_wiggleIndex < 0){
						this.int_wiggleIncrement = 1;
						this.int_wiggleIndex = 1;
					}
				}

				//Sprite glow:
				this.sprite.material.color.setRGB(
					(Math.sin(performance.now() * 0.003) + 2.75) / 1.35,  
					(Math.sin(performance.now() * 0.003) + 2.75) / 1.35,
					((Math.sin(performance.now() * 0.003) + 2.75) / 1.35) * 1.4
				);
				
				//Make box slightly bob up and down (ChatGPT helped):
				this.fn_addY(this.f_amplitude * Math.sin(performance.now() * 0.0003 * Math.PI * 2.0));
			}
			//Else, count down respawn time:
			else if(this.f_respawnTimer > 0){
				this.f_respawnTimer -= 1 / 60;
			}
			else{
				this.f_respawnTimer = 0.0;
				this.sprite.visible = true;
			}
			
			
		}
}