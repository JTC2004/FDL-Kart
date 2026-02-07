import * as THREE from 'three';
import Obj from "../object.js";

export default class Character extends Obj{
	//Tutorial for adding sprites: https://threejs.org/docs/#api/en/objects/Sprite 	

	constructor(_scene, a_xyz, _worldScale, _localScale, _str_name, _b_driving){
		super(_scene, a_xyz, _worldScale, false, true, _localScale * 1.4);
		
		this.str_name = _str_name;
		
		this.fn_addSprite(_scene, [0,0,0], [1,1,1], this.str_name + ' gremlin (transp)');
		//this.fn_addSprite(_scene, [0,0,0], [1,1,1], 'Player_Placeholder');

		//Variables:
		this.b_driving = _b_driving;
	}	
	
	//Overriden functions:
		fn_update(_playerPos, _playerRotation, _frames){


			



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
			
		}

		fn_getType(){
			return "character";
		}
}