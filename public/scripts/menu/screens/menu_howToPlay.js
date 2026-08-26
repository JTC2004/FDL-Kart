//This is the mode select for Single Player:

//Imports:
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    //Objects:
        import Menu from "../menu.js";
        import Option from "../option.js";

export default class Menu_HowToPlay extends Menu{

    constructor(manager, _index){
        super(manager, _index);

        this.a_options.push([
            new Option({
                text: "Controls (gamepad)",
                info: "",
                type: "horizontal large",
                pos: [-.25, 2.2, this.f_oZ],
                scale: [3.2, 1],
                static: true,
            })
        ]);
        this.a_options.push([
            new Option({
                text: "Controls (keyboard)",
                info: "",
                type: "horizontal large",
                pos: [-.25, -1.8, this.f_oZ],
                scale: [3.2, 1],
                static: true,
            })
        ]);
        
        this.str_menuName = "How To Play";
    }
}