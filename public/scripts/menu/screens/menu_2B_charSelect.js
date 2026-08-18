//This is the mode select for Single Player:

//Imports:
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    //Objects:
        import Menu from "../menu.js";
        import Option from "../option.js";
    //Unique:
        import ConnectController from '../../game/objects/connectController.js';
        import { fn_setMultiplayer } from '../../main.js';
        import Menu_1B_charSelect from "./menu_1B_charSelect.js";
        import { fn_getInputs } from "../../main.js";
    //Arrow settings:
        import { fn_settingCC } from "../../main.js";


let a_INPUTS;

export default class Menu_2B_charSelect extends Menu{

    constructor(manager){
        super(manager);
        a_INPUTS = fn_getInputs();

        //Menu options:
        this.a_options.push([
            new Option({
                text: "Connect_Controllers",
                info: "",
                type: "horizontal medium",
                pos: [-.25, .1, 0],
                scale: [3, 2.4],
                static: true,
                arrows: true,
                subOptions: ["Slow", "Normal", "FAST"],
                defaultOption: 1,
                onConfirm: () => {
                    if(a_INPUTS.length > 1){
                        window.int_gameMode = 4;
                        manager.fn_startGameplay();
                    }

                    //Set player characters here:
                    window.a_characters[0] = ['Enoki', 'Maple'];
                    window.a_characters[1] = ['Aaron', 'Rufus'];
                    window.a_characters[2] = ['Maple', 'Aaron'];
                    window.a_characters[3] = ['Rufus', 'Enoki'];
                },
                onArrow: (_int_i) => {
                    fn_settingCC(_int_i);
                }
            })
        ]);

        //Extra additions for this screen:
        this.a_objects = [
            new ConnectController([-2.4, 1.2, 0.05], 0),
            new ConnectController([1.85, 1.2, 0.05], 1),
            new ConnectController([-2.4, -1.85, 0.05], 2),
            new ConnectController([1.85, -1.85, 0.05], 3)
        ];

        this.str_menuName = "2P Character Select";
    }

    //ANY extra components of a child menu's update is added here:
    fn_extraUpdate(a_INPUTS){
        //Update the controller icons:
        for(const object of this.a_objects){
			object.fn_update();
		}
    }

    //Unique loads for this menu:
    fn_extraEnter(){
        for(const object of this.a_objects){
			object.fn_update();
		}
        fn_setMultiplayer(true);        //Entering multiplayer menu.
    }

}