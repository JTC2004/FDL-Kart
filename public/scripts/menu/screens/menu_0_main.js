//This is the main menu.

//Imports:
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    //Objects:
        import Menu from "../menu.js";
        import Option from "../option.js";

export default class Menu_0_main extends Menu{

    constructor(manager){
        super(manager);

        this.a_options.push([
            new Option("Main", [this.fn_inRow(4.25, 0, 4), 1, 0], [1, 1.24], "Single Play", "large"),
            new Option("Main", [this.fn_inRow(4.25, 1, 4), 1, 0], [1, 1.24], "Split-Screen", "large"),
            new Option("Main", [this.fn_inRow(4.25, 2, 4), 1, 0], [1, 1.24], "Online Play", "large"),
            new Option("Main", [this.fn_inRow(4.25, 3, 4), 1, 0], [1, 1.24], "FDL Kart Channel", "large")
            
        ]);
        this.a_options.push([
            new Option("Main", [this.fn_inRow(5.8, 0, 3), -2.2, 0], [1.3, .35], "Settings", "horizontal medium"),
            new Option("Main", [this.fn_inRow(5.75, 1, 3), -2.2, 0], [1.75, .35], "How to Play", "horizontal large"),
            'dum',
            new Option("Main", [this.fn_inRow(5.75, 2, 3), -2.2, 0], [1.3, .35], "Records", "horizontal medium"),
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