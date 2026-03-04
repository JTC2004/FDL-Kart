import * as THREE from 'three';
import Obj from "../object.js";

export default class Character extends Obj{
	//Tutorial for adding sprites: https://threejs.org/docs/#api/en/objects/Sprite 	

	constructor(a_xyz, _worldScale, _localScale, _str_name, _num, _b_driving){
		super(a_xyz, _worldScale, false, true, _localScale * 1.4);	
		
		this.str_name = _str_name;
		
		//this.fn_addSprite([0,0,0], [1,1,1], this.str_name + ' gremlin (transp)');
		this.fn_addSpriteSheet([0,0,0], [1,1,1], `Characters/${_str_name}/P${_num + 1}_256_Frame_2`, 6);

		//State variables:
		this.b_driving = _b_driving;

		//Animation variables:
		this.int_animRate = 5;

		this.f_tilt = 0.0;
		this.f_tiltIncrement = 0.25;
		this.f_tiltMax = 2;
	}	
	
	//Overriden functions:
		fn_update(_playerPos, _playerRotation, _int_driftDirec, input, _b_done, _int_frames){
			//this.spriteMap.offset.x += 0.1;

			//Update character position:
			if(!this.b_driving){
				this.fn_setPos(new THREE.Vector3(
					_playerPos.x + 0.45 * Math.sin(_playerRotation), 
					_playerPos.y + 0.1 * this.f_scale, 
					_playerPos.z + 0.45 * Math.cos(_playerRotation)
				));
			}
			else{
				this.fn_setPos(new THREE.Vector3(
					_playerPos.x - 0.35 * Math.sin(_playerRotation), 
					_playerPos.y + 0.1 * this.f_scale, 
					_playerPos.z - 0.35 * Math.cos(_playerRotation)
				));
			}

			//'Gunning' character animation:
			if(!this.b_driving){
				
				//Leaning with turns:
					if((this.f_tilt < 0 && !input.fn_hold_right(_b_done)) || input.fn_hold_left(_b_done)){
						this.f_tilt += this.f_tiltIncrement;
					}
					if((this.f_tilt > 0 && !input.fn_hold_left(_b_done)) || input.fn_hold_right(_b_done)){
						this.f_tilt -= this.f_tiltIncrement;
					}
					//Margin when character tilt is close enough to 0, set it to 0:
					if(this.f_tilt < this.f_tiltIncrement && this.f_tilt > -this.f_tiltIncrement ){
						this.f_tilt = 0.0;
					}
					
						//Limits on how far character can tilt:
						if(this.f_tilt > this.f_tiltMax + this.f_tiltIncrement){
							this.f_tilt = this.f_tiltMax; //+ _int_driftDirec;		//UNCOMMENT THIS WHEN I ADD 4TH TURNING SPRITE
						}
						if(this.f_tilt < -this.f_tiltMax){
							this.f_tilt = -this.f_tiltMax; //+ _int_driftDirec;
						}
						

				//Animaiton update:
				if(_int_frames % this.int_animRate == 0){
					
					//Tilting:
					if(this.f_tilt != 0){
						console.log(`lean = ${this.f_tilt}`);
						
						this.fn_setSpriteTile(Math.round(Math.abs(this.f_tilt + _int_driftDirec)), 0);
						this.fn_flipSprite(Math.sign(this.f_tilt));
					}
					else{
						this.fn_setSpriteTile(0, 0);
						this.fn_flipSprite(1);
					}
					
					
				}
			}
			//Driving character animation:
			else{

			}
			
		}

		fn_getType(){
			return "character";
		}
}