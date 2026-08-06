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
                text: "Items_On",
                info: "Race against the clock for the best time! (random items on the track)",
                type: "horizontal large",
                pos: [-3.75, 2.5, 0], 
                scale: [2.5, .5],
                arrows: true,
                subOptions: ["Slow", "Normal", "FAST"]
            })
        ]);
        this.a_options.push([
            new Option({
                text: "No_Items",
                info: "Race against the clock for the best time! (no items on the track)",
                type: "horizontal large",
                pos: [-3.75, .25, 0], 
                scale: [2.5, .5],
                arrows: true,
                subOptions: ["Slow", "Normal", "FAST"]
            })
        ]);
        this.a_options.push([
            new Option({
                text: "Practice",
                info: "Freely use save-states and rewind to practice shortcuts.",
                type: "horizontal medium",
                pos: [-5.8, -2.00, 0], 
                scale: [1.3, .45],
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