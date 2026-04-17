import * as THREE from 'three';
import Obj from "../object.js";

export default class Character extends Obj{
	//Tutorial for adding sprites: https://threejs.org/docs/#api/en/objects/Sprite 	

	constructor(a_xyz, _worldScale, _localScale, _str_name, _num, _b_driving){
		super(a_xyz, _worldScale, false, true, _localScale * 1.4);	
		
		this.int_altColor = _num + 1;
		this.str_name = _str_name;
		this.f_driverBaseOffset = -0.2;		//The default distance from the steering wheel in the driving position.
		this.f_gunnerBaseOffset = 0.45;		//The default distance from the steering wheel in the driving position.
		
		this.f_rightOffset = 0.0;
		this.f_forwardOffset = 0.0;
		
		//this.fn_addSprite([0,0,0], [1,1,1], this.str_name + ' gremlin (transp)');
		this.fn_addSpriteSheets([0,0,0], [1,1,1], `characters/${_str_name}/P${this.int_altColor}_256_f`, 6);

		//State variables:
		this.b_driving = _b_driving;
		if(!this.b_driving){
			this.f_forwardOffset = this.f_gunnerBaseOffset;
		}
		else{
			this.f_forwardOffset = this.f_driverBaseOffset;
		}

		//Animation variables:
		this.int_animRate = 5;
		this.f_swapTimer = 0.0;

		this.f_tilt = 0.0;
		this.f_tiltIncrement = 0.25;
		this.f_tiltMax = 2;
		this.int_wiggleIndex = 1;
		this.int_wiggleIncrement = 1;
	}	
	
	//Overriden functions:
		fn_update(_playerPos, _playerRotation, _int_driftDirec, input, _b_done, _int_frames){
			//this.spriteMap.offset.x += 0.1;

			//Update character position:
			this.fn_setCharPos(_playerPos, _playerRotation);

			//Normal animation while not swapping:
			if(this.f_swapTimer == 0.0){
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
							//console.log(`lean = ${this.f_tilt}`);
							
							this.fn_setSpriteTile(Math.round(Math.abs(this.f_tilt + _int_driftDirec)), 0);
							this.fn_flipSprite(Math.sign(this.f_tilt));
						}
						else{
							this.fn_setSpriteTile(0, 0);
							this.fn_flipSprite(1);
						}

						/*this.int_wiggleIndex += 1;
						if(this.int_wiggleIndex > 2){
							this.int_wiggleIndex = 0;
						}*/
					}
				}
				//Driving character animation:
				else{
					
				}

				//Swapping:
				if(input.fn_press_swap()){
					this.f_swapTimer = 0.2;	
					this.fn_flipSprite(1);	
				}
			}
			//Else, swapping animation:
			else{
				//Decrement swap timer:
				this.f_swapTimer -= 1/60;			
				
				//Rotating the sprites around:
				if(!this.b_driving){
					this.f_rightOffset += 0.25;
					this.f_forwardOffset -= 0.05;
					
					if(this.f_forwardOffset < this.f_gunnerBaseOffset - 0.25){
						this.fn_setSpriteTile(1, 2);
						this.fn_flipSprite(1);	
					}
					else if(this.f_forwardOffset < this.f_gunnerBaseOffset - 0.15){
						this.fn_setSpriteTile(0, 2);
						this.fn_flipSprite(1);	
					}
					else if(this.f_forwardOffset <= this.f_gunnerBaseOffset){
						this.fn_setSpriteTile(1, 0);
						this.fn_flipSprite(0);
					}
					
				}
				else{
					this.f_rightOffset -= 0.25;	
					this.f_forwardOffset += 0.05;

					if(this.f_forwardOffset > this.f_driverBaseOffset + 0.2){
						this.fn_setSpriteTile(3, 2);
						this.fn_flipSprite(1);	
					}
					else if(this.f_forwardOffset > this.f_driverBaseOffset + 0.1){
						this.fn_setSpriteTile(2, 2);
						this.fn_flipSprite(1);	
					}
					else if(this.f_forwardOffset >= this.f_driverBaseOffset){
						this.fn_setSpriteTile(1, 0);
						this.fn_flipSprite(0);
					}
				}

				//When swapping is done:
				if(this.f_swapTimer <= 0.0){
					this.f_swapTimer = 0.0;
					this.b_driving = !this.b_driving;

					this.f_rightOffset = 0.0;
					//This needs to be AFTER driver boolean is toggled://This needs to be AFTER driver boolean is toggled:
					if(!this.b_driving){				
						this.f_forwardOffset = this.f_gunnerBaseOffset;
					}
					else{
						this.f_forwardOffset = this.f_driverBaseOffset;
					}
					this.fn_setSpriteTile(0, 0);

					if(this.b_driving){
						console.log(`${this.str_name} is driving`);
					}	
				}
			}

			//Update the sprite 'wiggle':
			if(_int_frames % this.int_animRate == 0){
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
		}

		fn_menuUpdate(input, _int_frames){
			//Update the sprite 'wiggle':
			if(_int_frames % this.int_animRate == 0){
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
		}

		fn_setCharPos(_playerPos, _playerRotation){
			this.fn_setPos(new THREE.Vector3(
				_playerPos.x 
					+ this.f_forwardOffset * Math.sin(_playerRotation)
					+ (Math.sin(this.f_rightOffset) / 3 + 0.07) * Math.cos(_playerRotation), 
				_playerPos.y + 0.1 * this.f_scale, 
				_playerPos.z 
					+ this.f_forwardOffset * Math.cos(_playerRotation)
					- (Math.sin(this.f_rightOffset) / 3 + 0.07) * Math.sin(_playerRotation), 
			));
		}

		fn_setCharacter(_str_newName){
			this.str_name = _str_newName;
			
			if(_str_newName == '' || _str_newName == '(unlockable)'){
				this.sprite.visible = false;
			}
			else{
				this.sprite.visible = true;
				this.fn_addSpriteSheets([0,0,0], [1,1,1], `characters/${this.str_name}/P${this.int_altColor}_256_f`, 6);
			}			
		}

		fn_getCharacter(){
			return this.str_name;
		}

		fn_getType(){
			return "character";
		}

		
}