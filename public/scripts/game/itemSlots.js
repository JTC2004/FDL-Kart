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

		this.a_items = [3, 1];
		this.f_rollTime = 2.00;
		this.f_rollTimer = 0.0;

		//Animation variables:
		this.int_wiggleIndex = 1;
		this.int_wiggleIncrement = 1;

		//Item indexes:
		//	- 0 = no item
		//	- 1 = Ice Cream 1x
		//	- 2 = Ice Cream 2x
		//	- 3 = Ice Cream 3x
		
	}
	
	//Update the image every frame:
	fn_update(_frames){
		if(this.f_rollTimer == 0.0){
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
			}
			
			//Animation here

		}
		//Else, count down time of roulette roll:
		else if(this.f_rollTimer > 0){
			this.f_rollTimer -= 1 / 60;
		}
		else{
			this.f_rollTimer = 0.0;
			
		}

		this.a_prevItems = this.a_items;
	}

	//When called, cycle the roulette of the active slot based on the player's position:
	fn_roll(){
		this.f_rollTimer = this.f_rollTime;
	}

	//Swap the items in the 2 slots:
	fn_swap(){
		[this.a_items[0], this.a_items[1]] = [this.a_items[1], this.a_items[0]];
	}

	//What happens when the current item is used:
	fn_use(player){
		if(this.a_items[0] == 1){
			//Apply effect of 1 ice cream.
			this.a_items[0] = 0;
		}
		else if(this.a_items[0] == 2){
			//Apply effect of 1 ice cream.
			this.a_items[0] = 1;
		}
		else if(this.a_items[0] == 3){
			//Apply effect of 1 ice cream.
			this.a_items[0] = 2;
		}

		console.log(`Used item ${this.a_items[0]}`);
	}
	
	
}