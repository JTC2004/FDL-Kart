//This is the mode select for Single Player:

//Imports:
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    //Objects:
        import Menu from "../menu.js";
        import Option from "../option.js";

export default class Menu_1_gameMode extends Menu{

    constructor(manager){
        super(manager);

        this.a_options.push([
            new Option({
                text: "Connect_Controllers",
                info: "",
                type: "horizontal medium",
                pos: [-.25, .1, 0],
                scale: [3, 2.4],
                static: true,
                arrows: true,
                subOptions: ["Slow", "Normal", "FAST"]
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