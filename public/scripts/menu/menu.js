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
        /*this.a_options = [ 
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];*/
        this.a_options = [];                    //Contains all the objects in this menu screen.
        this.int_dx = 0;                        //Represents x for which object is selected on the grid.
        this.int_dy = 0;                        //Represents y for which object is selected on the grid.


        this.menu = new THREE.Object3D();       //Represents this collective menu's XYZ coordinates.
        this.menu.position.set(0, 0, 0);        //The overall menu's location (can be overridden later)
    }

    //Listen to input and update every frame:
    fn_update(a_INPUTS, _int_frames){
        const input = a_INPUTS[0];
        
        //Player input for navigating options:
            if (input.fn_press_right())     this.int_dx++;
            if (input.fn_press_left())      this.int_dx--;
            if (input.fn_press_back())      this.int_dy++;
            if (input.fn_press_forward())   this.int_dy--;

        //Make sure the selected option isn't out of bounds:
            if(this.int_dy >= this.a_options.length)                this.int_dy = 0;
            if(this.int_dy < 0)                                     this.int_dy = this.a_options.length - 1;
            if(this.int_dx >= this.a_options[this.int_dy].length)   this.int_dx = 0; 
            if(this.int_dx < 0)                                     this.int_dx = this.a_options[this.int_dy].length - 1;

        
            console.log(`Currently at coordinates [${this.int_dx}, ${this.int_dy}]`);



        //Any additional updates at the end:
            this.fn_extraUpdate();
    }

    //ANY extra components of a child menu's update is added here:
    fn_extraUpdate(){

    }

    //Call this function for the exit animation:
    fn_onExit(){

    }

    //Call this function for the entrance animation:
    fn_onEnter(){

    }



}