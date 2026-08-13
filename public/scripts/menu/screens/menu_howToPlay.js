//This is the mode select for Single Player:

//Imports:
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    //Objects:
        import Menu from "../menu.js";
        import Option from "../option.js";

export default class Menu_HowToPlay extends Menu{

    constructor(manager){
        super(manager);

        this.a_options.push([
            new Option({
                text: "Controls (gamepad)",
                info: "",
                type: "horizontal large",
                pos: [-.25, 2.2, 0],
                scale: [3.2, 1],
                static: true,
            })
        ]);
        this.a_options.push([
            new Option({
                text: "Controls (keyboard)",
                info: "",
                type: "horizontal large",
                pos: [-.25, -1.8, 0],
                scale: [3.2, 1],
                static: true,
            })
        ]);
        
        this.str_menuName = "How To Play";
    }
}