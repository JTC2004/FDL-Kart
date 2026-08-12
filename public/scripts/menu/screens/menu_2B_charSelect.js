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
                onConfirm: () => {
                    if(a_INPUTS.length > 1){
                        manager.fn_startGameplay();
                    }
                }
            })
        ]);

        //Extra additions for this screen:
        this.a_objects = [
            new ConnectController([-2.4, 1.2, 1], 0),
            new ConnectController([1.85, 1.2, 1], 1),
            new ConnectController([-2.4, -1.85, 1], 2),
            new ConnectController([1.85, -1.85, 1], 3)
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