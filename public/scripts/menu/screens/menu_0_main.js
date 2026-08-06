//This is the main menu.

//Imports:
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    //Objects:
        import Menu from "../menu.js";
        import Option from "../option.js";
    //Menus:
		import Menu_1_gameMode from "./menu_1_gameMode.js";

export default class Menu_0_main extends Menu{

    constructor(manager){
        super(manager);

        this.a_options.push([
            new Option({
                text: "Single Play",
                info: "Race against the clock for the best time!",
                type: "large",
                pos: [this.fn_inRow(4.25, 0, 4), 1, 0], 
                scale: [1, 1.24],
                onConfirm: () => {
                    manager.fn_nextMenu(new Menu_1_gameMode(manager));
                    //ANY code you want to trigger when this option is selected, put here!! :D
                }
            }),
            new Option({
                text: "Split-Screen",
                info: "Race against up to 4 people at once!",
                type: "large",
                pos: [this.fn_inRow(4.25, 1, 4), 1, 0], 
                scale: [1, 1.24],
                onConfirm: () => {
                    manager.fn_nextMenu(new Menu_1_gameMode(manager));
                }
            }),
            new Option({
                text: "Online Play",
                type: "large",
                pos: [this.fn_inRow(4.25, 2, 4), 1, 0], 
                scale: [1, 1.24],
                disabled: true
            }),
            new Option({
                text: "FDL Kart Channel",
                type: "large",
                pos: [this.fn_inRow(4.25, 3, 4), 1, 0], 
                scale: [1, 1.24],
                disabled: true
            })
        ]);
        this.a_options.push([
            new Option({
                text: "Settings",
                info: "Change graphics settings to improve performance.",
                type: "horizontal medium",
                pos: [this.fn_inRow(5.8, 0, 3), -2.2, 0], 
                scale: [1.3, .35]
            }),
            new Option({
                text: "How to Play",
                info: "View the keyboard & gamepad controls.",
                type: "horizontal large",
                pos: [this.fn_inRow(5.75, 1, 3), -2.2, 0], 
                scale: [1.75, .35]
            }),
            new Option({
                dum: true
            }),
            new Option({
                text: "Records",
                type: "horizontal medium",
                pos: [this.fn_inRow(5.75, 2, 3), -2.2, 0], 
                scale: [1.3, .35],
                disabled: true
            })
        ]);
        
    }

    //ANY extra components of a child menu's update is added here:
    fn_extraUpdate(){
        //console.log("This menu is main menu!");
    }

    //Call this function for the exit animation:
    fn_onExit(){

    }

    //Call this function for the entrance animation:
    fn_onEnter(){

    }
}