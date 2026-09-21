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

    constructor(manager, _index){
        this.menuManager = manager;             //Pointer to the menuManager that contains the menu.
        SCENE = fn_getScene();
        LOADER = fn_getLoader();
        
        this.a_options = [];                    //Contains all the options in this menu screen.
        this.a_objects = [];                    //Contains all the objects in this menu screen (there can be none).
        this.dy = 0;                        //Represents y for which object is selected on the grid.
        this.dx = 0;                        //Represents x for which object is selected on the grid.
        this.b_firstOption = false;         //First option not selected until options are initialized.
        this.b_moved = false;


        this.menu = new THREE.Object3D();       //Represents this collective menu's XYZ coordinates.
        this.menu.position.set(0, 0, 0);        //The overall menu's location (can be overridden later)

        this.str_menuName = "";
        this.b_backOk = true;               //When true, menu manager can back out of this menu.
        this.f_index = _index;                 //The index of this menu in the list of menus.
        this.f_oZ = this.f_index * -20;               //The z offset of this menu.

        this.int_transpDirec = 1;           //1 means menu should be turning opaque, -1 means menu should be turning transparent, 0 means no change.
        this.f_transp = 0.0;                //The transparency of all menu options.

        if(!this.f_index) this.f_index = 0;
        if(!this.f_oZ) this.f_oZ = 0;
    }

    //Listen to input and update every frame:
    fn_update(a_INPUTS, _b_exiting){
        //Update each of the opacities:
        if(this.int_transpDirec != 0){
            this.fn_updateOpacities();
        }
        //Don't accept user input on this menu anymore if it is being exited:
        if(_b_exiting){
            return;
        }
        
        const input = a_INPUTS[0];

        //console.log(`this.f_oZ = ${this.f_oZ}`);

        //Select first option when menu boots up:
        if(!this.b_firstOption){
            this.a_options[0][0].fn_select();
            console.log("Selecting first option.");
            this.b_firstOption = true;
        }
        
        //Player input for navigating options:
            if(input.fn_press_left() || input.fn_press_right() || input.fn_press_forward() || input.fn_press_back()) this.b_moved = true;
            if((input.fn_press_left() || input.fn_press_right()) && this.a_options[this.dy][this.dx].fn_hasArrows()) this.b_moved = false;
            if(this.b_moved){
                //console.log(`Should be changing selected element to [${this.dx}, ${this.dy}]`);
                
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
                
                this.b_moved = false;
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
            this.fn_extraUpdate(a_INPUTS);
    }
    //ANY extra components of a child menu's update is added here:
    fn_extraUpdate(a_INPUTS){
        
    }

    //Call this function for the exit animation:
    fn_exit(_b_popped){
        //console.log("HIDING ALL OPTIONS");
        //If this this option is being popped, set all options to invisible:
            for(let i = 0; i < this.a_options.length; i++){
                for(let e = 0; e < this.a_options[i].length; e++){
                    this.a_options[i][e].fn_hide(_b_popped);
                } 
            }
        //And same with the objects (if there are any):
        for(const object of this.a_objects){
            object.fn_hide();
        }
        this.fn_extraExit();
        
        this.int_transpDirec = -1;      
    }
    //Extra cleanup for a specific menu:
    fn_extraExit(){

    }

    //Call this function for the entrance animation:
    fn_enter(_b_popped){
        //Set all options to visible:
        for(let i = 0; i < this.a_options.length; i++){
            for(let e = 0; e < this.a_options[i].length; e++){
                this.a_options[i][e].fn_show(_b_popped);
            } 
        }
        //And same with the objects (if there are any):
        for(const object of this.a_objects){
            object.fn_show();
        }
        this.fn_extraEnter();

        this.int_transpDirec = 1;

        //console.log(`Entering menu ${this.str_menuName}`);
    }
    //Extra additions for a specific menu:
    fn_extraEnter(){

    }

    //Making the menu transparent or opaque:
    fn_updateOpacities(){
        this.f_transp = this.a_options[0][0].fn_getOpacity() + 0.075 * this.int_transpDirec;
        //console.log("ADJUSTING TRANSPARENCY");
        
        for(let i = 0; i < this.a_options.length; i++){
            for(let e = 0; e < this.a_options[i].length; e++){
                this.a_options[i][e].fn_setOpacity(this.f_transp);
            } 
        }

        if(Math.abs(this.f_transp) > 1){
            this.int_transpDirec = 0;
        }
    }

    //Return this menu's transparency value:
    fn_getTransp(){
        return f_transp;
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

    //Return true if ok for this menu to go back.
    fn_getBackOk(){
        return this.b_backOk;
    }

}