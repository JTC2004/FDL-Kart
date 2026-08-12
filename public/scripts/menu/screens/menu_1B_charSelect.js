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

export default class Menu_1B_charSelect extends Menu{

    constructor(manager){
        super(manager);
        this.a_connectControllers = [];

        //Menu options:
        this.a_options.push([
            new Option({
                text: "chara_Maple",
                info: "Maple",
                type: "large",
                pos: [this.fn_inRow(2.25, 0, 4) + 3, 1.5, 0],
                scale: [.6, .6],
                onConfirm: () => this.fn_characterSelected()
            }),
            new Option({
                text: "chara_Enoki",
                info: "Enoki",
                type: "large",
                pos: [this.fn_inRow(2.25, 1, 4) + 3, 1.5, 0],
                scale: [.6, .6],
                onConfirm: () => this.fn_characterSelected()
            }),
            new Option({
                text: "chara_Aaron",
                info: "Aaron",
                type: "large",
                pos: [this.fn_inRow(2.25, 2, 4) + 3, 1.5, 0],
                scale: [.6, .6],
                onConfirm: () => this.fn_characterSelected()
            }),
            new Option({
                text: "chara_Rufus",
                info: "Rufus",
                type: "large",
                pos: [this.fn_inRow(2.25, 3, 4) + 3, 1.5, 0],
                scale: [.6, .6],
                onConfirm: () => this.fn_characterSelected()
            })
        ]);
        this.a_options.push([
            new Option({
                text: "chara_(unlockable)",
                info: "(unlockable)",
                type: "large",
                pos: [this.fn_inRow(2.25, 0, 4) + 3, -1, 0],
                scale: [.6, .6]
            }),
            new Option({
                text: "chara_(unlockable)",
                info: "(unlockable)",
                type: "large",
                pos: [this.fn_inRow(2.25, 1, 4) + 3, -1, 0],
                scale: [.6, .6]
            }),
            new Option({
                text: "chara_(unlockable)",
                info: "(unlockable)",
                type: "large",
                pos: [this.fn_inRow(2.25, 2, 4) + 3, -1, 0],
                scale: [.6, .6]
            }),
            new Option({
                text: "chara_(unlockable)",
                info: "(unlockable)",
                type: "large",
                pos: [this.fn_inRow(2.25, 3, 4) + 3, -1, 0],
                scale: [.6, .6]
            }),
        ]);

        //Object additions specific to this menu:
        this.a_objects = [
            new Character([-5.5, .6, -1], 1, 2, "Maple", 0, true),
            new Character([-5, -0.4, 1], 1, 2, "", 0, true),
            new Kart([-5, -1, 0], 1, .2)
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
        this.a_objects[2].fn_setRotation(new THREE.Vector3(.4, 3.49066, 0));

        this.a_objects[0].fn_menuUpdate(input, int_frames);
		this.a_objects[1].fn_menuUpdate(input, int_frames);
		
        //Updating player sprites based on input:
		if(input.fn_press_left() || input.fn_press_right() || input.fn_press_forward() || input.fn_press_back() || this.b_charIndexIncremented){
            if(this.a_options[this.dy][this.dx].fn_isSelected()){
                this.a_objects[this.int_charaIndex].fn_setCharacter(this.a_options[this.dy][this.dx].fn_getCharText());
                this.a_objects[0].fn_setSpriteTile(5, 0);  //Sets what frame to hold still on for back character.
                this.a_objects[1].fn_setSpriteTile(4, 1);  //Sets what frame to hold still on for front character.
                this.b_charIndexIncremented = false;
            } 
		}

        console.log("--------------------");

        int_frames ++;
    }

    fn_characterSelected(){
        if(this.int_charaIndex == 0){
            this.a_options[this.dy][this.dx].fn_deSelect();
            this.dx += 1;
            this.fn_overflowCheck();
            this.b_moved = true;

            this.int_charaIndex = 1;
            this.b_charIndexIncremented = true;

            console.log("Incrementing dX");
        }
        else {
            manager.fn_startGameplay();
        }
    }
}