import * as THREE from 'three';
import Obj from "../object.js";

export default class Kart extends Obj{
	//Tutorial for adding sprites: https://threejs.org/docs/#api/en/objects/Sprite 	

	constructor(_scene, a_xyz, _worldScale, _localScale, _loader){
		super(_scene, a_xyz, _worldScale, false, false, _localScale);
		this.fn_addModel(_scene, [0,0,0], [1,1,1], _loader, 'GoKart');

		this.v_baseRotation = new THREE.Vector3(0,0,0);
		this.f_kartRotate = 0;
		this.f_kartRotateIncrement = 0.015;
		this.f_kartRotateMax = 0.09;
		this.f_driftOffset = 0;
		this.f_driftOffsetMax = 0.24;
		
		
	}	
	
	//Overriden functions:
		fn_update(input, _f_turning, _f_driftingDirec){
			//console.log(`v_baseRotation = (${this.v_baseRotation.x}, ${this.v_baseRotation.y} ,${this.v_baseRotation.z})`);
			

			//If holding left or right, have kart rotate slightly in that direction:
			if((this.f_kartRotate < 0 && !input.fn_hold_right()) || input.fn_hold_left()){
				this.f_kartRotate += this.f_kartRotateIncrement;
			}
			if((this.f_kartRotate > 0 && !input.fn_hold_left()) || input.fn_hold_right()){
				this.f_kartRotate -= this.f_kartRotateIncrement;
			}
			//Margin when kart rotation is close enough to 0, set it to 0:
			if(this.f_kartRotate < this.f_kartRotateIncrement && this.f_kartRotate > -this.f_kartRotateIncrement ){
				this.f_kartRotate = 0.0;
			}
				//Limits on how far kart can rotate:
				if(this.f_kartRotate > this.f_kartRotateMax + this.f_kartRotateIncrement){
					this.f_kartRotate = this.f_kartRotateMax + this.f_kartRotateIncrement;
				}
				if(this.f_kartRotate < -this.f_kartRotateMax){
					this.f_kartRotate = -this.f_kartRotateMax;
				}

			//If drfitng, make kart rotate more:
			if(_f_driftingDirec != 0){
				if(_f_driftingDirec == 1){
					this.f_driftOffset += 0.03;

					if(this.f_driftOffset > this.f_driftOffsetMax){
						this.f_driftOffset = this.f_driftOffsetMax;
					}
				}
				if(_f_driftingDirec == -1){
					this.f_driftOffset -= 0.03;

					if(this.f_driftOffset < -this.f_driftOffsetMax){
						this.f_driftOffset = -this.f_driftOffsetMax;
					}
				}

				this.f_kartRotateIncrement = 0.03;
				this.f_kartRotateMax = 0.12;
			}
			else {
				if(this.f_driftOffset > 0){
					this.f_driftOffset -= 0.03;
				}
				else if(this.f_driftOffset < 0){
					this.f_driftOffset += 0.03;
				}

				this.f_kartRotateIncrement = 0.015;
				this.f_kartRotateMax = 0.06;
			}

			console.log(`f_driftOffset = ${this.f_driftOffset}`);

			this.v_baseRotation.y += this.f_kartRotate + this.f_driftOffset;
			this.fn_setRotation(this.v_baseRotation);
		}
	
		fn_getType(){
			return "kart";
		}

		fn_setBaseRotation(_newBaseRot){
			this.v_baseRotation = _newBaseRot;
		}
}