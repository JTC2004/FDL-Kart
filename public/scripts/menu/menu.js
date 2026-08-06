//This is the parent class for all menu screens.

//Imports:
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    
//Essentials:
    import { fn_getScene } from "../main.js";
	import { fn_getLoader } from "../main.js";
	let SCENE;
	let LOADER;

export default class Menu{

    constructor(manager){
        
        SCENE = fn_getScene();
        LOADER = fn_getLoader();

        this.menuManager = manager;             //Pointer to the menuManager that contains the menu.
        this.a_options = [];                    //Contains all the objects in this menu screen.
        this.dy = 0;                        //Represents y for which object is selected on the grid.
        this.dx = 0;                        //Represents x for which object is selected on the grid.
        this.b_firstOption = false;         //First option not selected until options are initialized.
        this.b_moved = false;


        this.menu = new THREE.Object3D();       //Represents this collective menu's XYZ coordinates.
        this.menu.position.set(0, 0, 0);        //The overall menu's location (can be overridden later)
    }

    //Listen to input and update every frame:
    fn_update(a_INPUTS, _int_frames){
        const input = a_INPUTS[0];

        //Select first option when menu boots up:
        if(!this.b_firstOption){
            this.a_options[0][0].fn_select();
            this.b_firstOption = true;
        }
        
        //Player input for navigating options:
            if(input.fn_press_left() || input.fn_press_right() || input.fn_press_forward() || input.fn_press_back()) this.b_moved = true;
            if(this.b_moved){
                //Deselect current option,
                    if(this.a_options[this.dy][this.dx].fn_isDummy())   this.fn_dummyHandle(true, input);
                    else                                                this.a_options[this.dy][this.dx].fn_deSelect();

                //Update yx on grid,
                    if (input.fn_press_forward())   this.dy--;
                    if (input.fn_press_back())      this.dy++;
                    if (input.fn_press_left())      this.dx--;
                    if (input.fn_press_right())     this.dx++;
                    this.fn_overflowCheck();

                //And then select the new option:
                    if(this.a_options[this.dy][this.dx].fn_isDummy())   this.fn_dummyHandle(false, input);
                    else                                                this.a_options[this.dy][this.dx].fn_select();
                
            }
            //console.log(`Currently at coordinates [${this.dx}, ${this.dy}]`);

        //Player confirming an option:
            if(input.fn_press_accelerate()){
                this.a_options[this.dy][this.dx].fn_confirm();
            }


        //Update each of the options:
            for(let i = 0; i < this.a_options.length; i++){
                for(let e = 0; e < this.a_options[i].length; e++){
                    this.a_options[i][e].fn_update(input);
                } 
            }

        //Any additional updates at the end:
            this.fn_extraUpdate();
        
        //Reset variables:
            this.b_moved = false;
    }

    //ANY extra components of a child menu's update is added here:
    fn_extraUpdate(){

    }

    //Call this function for the exit animation:
    fn_onExit(){

        //Set all options to invisible:
        for(let i = 0; i < this.a_options.length; i++){
            for(let e = 0; e < this.a_options[i].length; e++){
                this.a_options[i][e].fn_hide(input);
            } 
        }
    }

    //Call this function for the entrance animation:
    fn_onEnter(){

        //Set all options to visible:
        for(let i = 0; i < this.a_options.length; i++){
            for(let e = 0; e < this.a_options[i].length; e++){
                this.a_options[i][e].fn_show(input);
            } 
        }
    }


    

    //Make sure yx isn't out of bounds:
    fn_overflowCheck(){
        if(this.dy >= this.a_options.length)            this.dy = 0;
        if(this.dy < 0)                                 this.dy = this.a_options.length - 1;
        if(this.dx >= this.a_options[this.dy].length)   this.dx = 0; 
        if(this.dx < 0)                                 this.dx = this.a_options[this.dy].length - 1;
    }

    //Handle selecting an element that is 2 blocks long:
    fn_dummyHandle(_b_deSelect, input){
        if(_b_deSelect){
            if(input.fn_press_left()){
                this.dx -= 1;
                this.fn_overflowCheck();
                this.a_options[this.dy][this.dx].fn_deSelect();
                return;
            }
            this.a_options[this.dy][this.dx - 1].fn_deSelect();
        }
        else{
            if(input.fn_press_right()){
				this.dx += 1;
				this.fn_overflowCheck();
				this.a_options[this.dy][this.dx].fn_select();
                return;
			}
			this.a_options[this.dy][this.dx - 1].fn_select();
        }
    }

    //Make coordinates in an evenly spaced row that accounts for screen size (ChatGPT helped with this):
    fn_inRow(_spacing, _spriteNum, _spriteCount){

        const totalSpan = _spacing * (_spriteCount - 1); // total width of all spacings
        const startX = -totalSpan / 2;

        return startX + _spriteNum * _spacing;
    }

}