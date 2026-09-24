//This is the main menu.

//Imports:
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    //Objects:
        import Menu from "../menu.js";
        import Option from "../option.js";
    //Menus:
		import Menu_1A_gameMode from "./menu_1A_gameMode.js";
		import Menu_2B_charSelect from "./menu_2B_charSelect.js";
		import Menu_Settings from "./menu_settings.js";
		import Menu_HowToPlay from "./menu_howToPlay.js";
    //Unique:
        import { fn_setMultiplayer } from '../../main.js';

export default class Menu_0_main extends Menu{

    constructor(manager, _index){
        super(manager, _index);

        this.a_options.push([
            new Option({
                text: "Single Play",
                info: "Race against the clock for the best time!",
                type: "large",
                pos: [this.fn_inRow(4.25, 0, 4), 1 + this.f_oY, this.f_oZ], 
                scale: [1, 1.24],
                onConfirm: () => {
                    manager.fn_nextMenu(new Menu_1A_gameMode(manager, this.f_index + 1));
                    //ANY code you want to trigger when this option is selected, put here!! :D
                }
            }),
            new Option({
                text: "Split-Screen",
                info: "Race against up to 4 people at once!",
                type: "large",
                pos: [this.fn_inRow(4.25, 1, 4), 1 + this.f_oY, this.f_oZ], 
                scale: [1, 1.24],
                onConfirm: () => {
                    manager.fn_nextMenu(new Menu_2B_charSelect(manager, this.f_index + 1));
                }
            }),
            new Option({
                text: "Online Play",
                type: "large",
                pos: [this.fn_inRow(4.25, 2, 4), 1 + this.f_oY, this.f_oZ], 
                scale: [1, 1.24],
                disabled: true
            }),
            new Option({
                text: "FDL Kart Channel",
                type: "large",
                pos: [this.fn_inRow(4.25, 3, 4), 1 + this.f_oY, this.f_oZ], 
                scale: [1, 1.24],
                disabled: true
            })
        ]);
        this.a_options.push([
            new Option({
                text: "Settings",
                info: "Change graphics settings to improve performance.",
                type: "horizontal medium",
                pos: [this.fn_inRow(5.8, 0, 3), -2.2 + this.f_oY, this.f_oZ], 
                scale: [1.3, .35],
                onConfirm: () => {
                    manager.fn_nextMenu(new Menu_Settings(manager, this.f_index + 1));
                }
            }),
            new Option({
                text: "How to Play",
                info: "View the keyboard & gamepad controls.",
                type: "horizontal large",
                pos: [this.fn_inRow(5.75, 1, 3), -2.2 + this.f_oY, this.f_oZ], 
                scale: [1.75, .35],
                onConfirm: () => {
                    manager.fn_nextMenu(new Menu_HowToPlay(manager, this.f_index + 1));
                }
            }),
            new Option({
                dum: true
            }),
            new Option({
                text: "Records",
                type: "horizontal medium",
                pos: [this.fn_inRow(5.75, 2, 3), -2.2 + this.f_oY, this.f_oZ], 
                scale: [1.3, .35],
                disabled: true
            }),
            /*new Option({
				text: "A",
				info: "",
				type: "horizontal medium",
				pos: [8.25, -3.7, this.f_oZ], 
				scale: [1.5, .225],
				specialInput: () => this.fn_extraUpdate(),
				//specialInput: () => a_INPUTS[0].fn_press_accelerate()
			}),
            new Option({
				text: "B",
				info: "",
				type: "horizontal medium",
				pos: [8.25, -4.55, this.f_oZ], 
				scale: [1.5, .225],
                specialInput: () => this.fn_extraUpdate(),
				//specialInput: () => a_INPUTS[0].fn_press_accelerate()
			})*/
        ]);
        
        this.str_menuName = "Main";
    }

    //Call this function for anything extra for this menu's entrance animation:
    fn_extraEnter(){
        fn_setMultiplayer(false);       //No longer in multiplayer menu.
    }
}