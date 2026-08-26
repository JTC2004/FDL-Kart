//This is the mode select for Single Player:

//Imports:
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    //Objects:
        import Menu from "../menu.js";
        import Option from "../option.js";
    //Unique:
        import Character from "../../game/objects/character.js";
        import Kart from "../../game/objects/kart.js";

var int_frames = 0;

//Note:
//I don't need to make a separate character select class for multiplayer.
//Just make this menu behave differently when b_multiplayer is true.

export default class Menu_1B_charSelect extends Menu{

    constructor(manager, _index){
        super(manager, _index);
        this.a_connectControllers = [];

        //Menu options:
        this.a_options.push([
            new Option({
                text: "chara_Maple",
                info: "Maple",
                type: "large",
                pos: [this.fn_inRow(2.25, 0, 4) + 3, 1.5, this.f_oZ],
                scale: [.6, .6],
                onConfirm: () => this.fn_characterSelected()
            }),
            new Option({
                text: "chara_Enoki",
                info: "Enoki",
                type: "large",
                pos: [this.fn_inRow(2.25, 1, 4) + 3, 1.5, this.f_oZ],
                scale: [.6, .6],
                onConfirm: () => this.fn_characterSelected()
            }),
            new Option({
                text: "chara_Aaron",
                info: "Aaron",
                type: "large",
                pos: [this.fn_inRow(2.25, 2, 4) + 3, 1.5, this.f_oZ],
                scale: [.6, .6],
                onConfirm: () => this.fn_characterSelected()
            }),
            new Option({
                text: "chara_Rufus",
                info: "Rufus",
                type: "large",
                pos: [this.fn_inRow(2.25, 3, 4) + 3, 1.5, this.f_oZ],
                scale: [.6, .6],
                onConfirm: () => this.fn_characterSelected()
            })
        ]);
        this.a_options.push([
            new Option({
                text: "chara_(unlockable)",
                info: "(unlockable)",
                type: "large",
                pos: [this.fn_inRow(2.25, 0, 4) + 3, -1, this.f_oZ],
                scale: [.6, .6]
            }),
            new Option({
                text: "chara_(unlockable)",
                info: "(unlockable)",
                type: "large",
                pos: [this.fn_inRow(2.25, 1, 4) + 3, -1, this.f_oZ],
                scale: [.6, .6]
            }),
            new Option({
                text: "chara_(unlockable)",
                info: "(unlockable)",
                type: "large",
                pos: [this.fn_inRow(2.25, 2, 4) + 3, -1, this.f_oZ],
                scale: [.6, .6]
            }),
            new Option({
                text: "chara_(unlockable)",
                info: "(unlockable)",
                type: "large",
                pos: [this.fn_inRow(2.25, 3, 4) + 3, -1, this.f_oZ],
                scale: [.6, .6]
            }),
        ]);

        //Object additions specific to this menu:
        this.a_objects = [
            new Character([-6.3, .6, -1 + this.f_oZ], 1, 2, "Maple", 0, true),
            new Character([-4.6, -.25, .5 + this.f_oZ], 1, 2, "", 0, true),
            new Kart([-5, -1, 0 + this.f_oZ], 1, .175),
        ];

        this.a_objects[0].fn_setSpriteTile(5, 0);
        this.a_objects[1].fn_setSpriteTile(4, 1);
        this.int_charaIndex = 0;
        this.b_charIndexIncremented = false;


        this.str_menuName = "1P Character Select";
    }

    //Any components of a menu's update specific to it is added here:
    fn_extraUpdate(a_INPUTS){
        const input = a_INPUTS[0];
        
        //Set the kart rotation (doesn't work in the constructor for some reason):
        this.a_objects[2].fn_setRotation(new THREE.Vector3(0.4, 3.9, 0.2));

        this.a_objects[0].fn_menuUpdate(input, int_frames);
		this.a_objects[1].fn_menuUpdate(input, int_frames);
		
        //Updating player sprites based on input:
		if(input.fn_press_left() || input.fn_press_right() || input.fn_press_forward() || input.fn_press_back() || this.b_charIndexIncremented){
            
            this.a_objects[this.int_charaIndex].fn_setCharacter(this.a_options[this.dy][this.dx].fn_getCharText());
            
            //BUG: Due to optimization update introducing the sprite cache, now all instances of sprites use the same sprite tile map.
            console.log(`CHANGING SPRITE SHEET OF CHARACTER ${this.a_objects[0].fn_getCharacter()} at index 0!`);
            this.a_objects[0].fn_setSpriteTile(5, 0);
            console.log(`CHANGING SPRITE SHEET OF CHARACTER ${this.a_objects[1].fn_getCharacter()} at index 1`);
            this.a_objects[1].fn_setSpriteTile(4, 1);
            
            this.b_charIndexIncremented = false;
            
		}

        //console.log(`dX = ${this.dx}`);
        //console.log(`dY = ${this.dy}`);
        //console.log(`int_charaIndex = ${this.int_charaIndex}`);

        //If a character is selected, make pressing back de-select that character instead of going to the previous menu:
        if(this.int_charaIndex > 0){
            this.b_backOk = false;
            if(input.fn_press_drift()){
                this.fn_characterDeselected();
            }
        }
        else {
            this.b_backOk = true;
        }

        int_frames ++;
    }

    fn_characterSelected(){
        //If selecting first character, select that character:
        if(this.int_charaIndex == 0){
            //Moving the selected element:
            this.a_options[this.dy][this.dx].fn_deSelect();
            this.dx += 1;
            this.fn_overflowCheck();
            this.b_moved = true;
            
            //Incrementing variables for number of characters selected:
            this.int_charaIndex = 1;
            this.b_charIndexIncremented = true;
        }
        //Else, set the players and start the game:
        else {
            window.a_characters[0] = [this.a_objects[0].fn_getCharacter(), this.a_objects[1].fn_getCharacter()];
            this.menuManager.fn_startGameplay();
        }
    }

    fn_characterDeselected(){
        //Moving the selected element:
        this.a_options[this.dy][this.dx].fn_deSelect();
        this.dx -= 1;
        this.fn_overflowCheck();
        this.b_moved = true;

        //Clear the front driver:
        this.a_objects[this.int_charaIndex].fn_setCharacter('');
        
        //Decrementing variables for number of characters selected:
        this.int_charaIndex = 0;
        this.b_charIndexIncremented = true;
    }
}