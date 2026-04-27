//This is the parent class for all objects in a scene.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//Essentials:
	import { fn_getScene } from "../main.js";
	import { fn_getLoader } from "../main.js";
	//Essentials:
		let scene;
		let loader;

export default class ItemSlots{

	constructor(_num){
		//Essentials:
			scene = fn_getScene();
			loader = fn_getLoader();

		this.int_playerNum = _num;
		this.img_item0 = document.getElementById(`img_item${this.int_playerNum}-0`);
		this.img_item1 = document.getElementById(`img_item${this.int_playerNum}-1`);

		this.a_items = [3, 0];			//Index 0 is always the active item slot.
		this.a_rollTimer = [0.0, 0.0];
		this.f_rollTime = 2.00;
		this.f_swapTimer = 0.0;

		//Animation variables:
		this.int_wiggleIndex = 1;
		this.int_wiggleIncrement = 1;

		//Item indexes:
		//	- 0 = no item
		//	- 1 = Ice Cream 1x
		//	- 2 = Ice Cream 2x
		//	- 3 = Ice Cream 3x

		this.int_numItems = 3;			//Increase this as more items are added.
		
	}
	
	//Update the image every frame:
	fn_update(_frames){
		//Update image here:
			if(_frames % 5 == 0){
				if(this.a_items[0] > 0){
					this.img_item0.src = `assets/sprites/gameplay/items/${this.a_items[0]}_frame${this.int_wiggleIndex}.png`;
					this.img_item0.style.display = "block";
				}
				else{
					this.img_item0.style.display = "none";
				}
				
				if(this.a_items[1] > 0){
					this.img_item1.src = `assets/sprites/gameplay/items/${this.a_items[1]}_frame${this.int_wiggleIndex}.png`;
					this.img_item1.style.display = "block";
				}
				else{
					this.img_item1.style.display = "none";
				}


				//Lineart wiggle:
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

		//Counting down roulette timer:
		for(let i = 0; i < 2; i++){
			if(this.a_rollTimer[i] == 0){
				//Do something idle.
			}
			//Else, count down time of roulette roll:
			else if(this.a_rollTimer[i] > 0){
				this.a_rollTimer[i] -= 1 / 60;
				
				this.a_items[i] += 1;
				if(this.a_items[i] > this.int_numItems){
					this.a_items[i] = 1;
				}
			}
			//Got item:
			else{
				this.a_rollTimer[i] = 0.0;
				this.a_items[i] = Math.floor(Math.random() * 3) + 1;
				//console.log(`Got item ${this.a_items[0]}!`);
			}
		}
		//Got item:
		

		//Swap timer:
		if(this.f_swapTimer > 0.0){
			this.f_swapTimer -= 1/60;
			if(this.f_swapTimer <= 0.0){
				this.f_swapTimer = 0.0;
			}
		}

		this.a_prevItems = this.a_items;
	}

	//When called, cycle the roulette of the active slot based on the player's position:
	fn_roll(){
		this.a_rollTimer[0] = this.f_rollTime;
	}

	//Swap the items in the 2 slots:
	fn_swap(){
		if(this.f_swapTimer == 0){
			[this.a_items[0], this.a_items[1]] = [this.a_items[1], this.a_items[0]];
			[this.a_rollTimer[0], this.a_rollTimer[1]] = [this.a_rollTimer[1], this.a_rollTimer[0]];
			this.f_swapTimer = 0.2;
		}
	}

	//What happens when the current item is used:
	fn_use(player){
		//Make it so item can only be used if the active slot isn't rolling:
		if(this.a_rollTimer[0] == 0.0){
			if(this.a_items[0] == 1){
				player.fn_addSpeedBoost("T");
				this.a_items[0] = 0;
			}
			else if(this.a_items[0] == 2){
				player.fn_addSpeedBoost("T");
				this.a_items[0] = 1;
			}
			else if(this.a_items[0] == 3){
				player.fn_addSpeedBoost("T");
				this.a_items[0] = 2;
			}

			//console.log(`Used item ${this.a_items[0]}!`);
		}
		//Spamming the roulette:
		else if(this.a_rollTimer[0] < 1.5){
			this.a_rollTimer[0] = 1 / 60;
		}
	}
	
	fn_getActiveItem(){
		return this.a_items[0];
	}

	fn_canGetItem(){
		if(this.a_items[0] == 0 && this.a_rollTimer[0] == 0.0){
			return true;
		}
		else{
			return false;
		}
	}
}