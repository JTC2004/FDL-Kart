//This is the mode select for Single Player:

//Imports:
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    //Objects:
        import Menu from "../menu.js";
        import Option from "../option.js";
        import ConnectController from '../../game/objects/connectController.js';

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
                scale: [.6, .6]
            }),
            new Option({
                text: "chara_Enoki",
                info: "Enoki",
                type: "large",
                pos: [this.fn_inRow(2.25, 1, 4) + 3, 1.5, 0],
                scale: [.6, .6]
            }),
            new Option({
                text: "chara_Aaron",
                info: "Aaron",
                type: "large",
                pos: [this.fn_inRow(2.25, 2, 4) + 3, 1.5, 0],
                scale: [.6, .6]
            }),
            new Option({
                text: "chara_Rufus",
                info: "Rufus",
                type: "large",
                pos: [this.fn_inRow(2.25, 3, 4) + 3, 1.5, 0],
                scale: [.6, .6]
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

    }

    //ANY extra components of a child menu's update is added here:
    fn_extraUpdate(a_INPUTS){
        
    }

    //Call this function for the exit animation:
    fn_onExit(){

    }
    //Unique cleanup for this menu:
    fn_extraExit(){
        
    }


    //Call this function for the entrance animation:
    fn_onEnter(){

    }
    //Unique loads for this menu:
    fn_extraEnter(){
        
    }

}