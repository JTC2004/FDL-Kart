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


export default class Menu_2B_charSelect extends Menu{

    constructor(manager){
        super(manager);
        this.a_connectControllers = [];
        this.managerPointer = manager;

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
                //onConfirm: () => {
                //    manager.fn_nextMenu(new Menu_1B_charSelect(manager));
                //}
            })
        ]);

        //Extra additions for this screen:
        this.a_connectControllers = [
            new ConnectController([-2.4, 1.2, 1], 0),
            new ConnectController([1.85, 1.2, 1], 1),
            new ConnectController([-2.4, -1.85, 1], 2),
            new ConnectController([1.85, -1.85, 1], 3)
        ];
    }

    //ANY extra components of a child menu's update is added here:
    //Returning true here makes fn_update return true too.
    fn_extraUpdate(a_INPUTS){
        //Update the controller icons:
        for(const controller of this.a_connectControllers){
			controller.fn_update();
		}

        console.log(`a_INPUTS = ${a_INPUTS}`);

        //If player 1 presses A when there are 2 or more players, start the game:
        if(a_INPUTS[0].fn_press_accelerate() && a_INPUTS.length > 1){
            console.log("Switching to gameplay!");
            this.managerPointer.fn_startGameplay();
        }
    }

    //Call this function for the exit animation:
    fn_onExit(){

    }
    //Unique cleanup for this menu:
    fn_extraExit(){
        for(const controller of this.a_connectControllers){
			controller.fn_hide();
		}
    }


    //Call this function for the entrance animation:
    fn_onEnter(){

    }
    //Unique loads for this menu:
    fn_extraEnter(){
        for(const controller of this.a_connectControllers){
			controller.fn_update();
		}
        fn_setMultiplayer(true);        //Entering multiplayer menu.
    }

}