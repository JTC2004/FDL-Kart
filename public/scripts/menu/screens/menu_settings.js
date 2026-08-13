//This is the mode select for Single Player:

//Imports:
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    //Objects:
        import Menu from "../menu.js";
        import Option from "../option.js";
        import Menu_1B_charSelect from "./menu_1B_charSelect.js";

export default class Menu_Settings extends Menu{

    constructor(manager){
        super(manager);

        this.a_options.push([
            new Option({
                text: "Resolution",
                info: "(change how settings works to fix this text)",
                type: "horizontal large",
                pos: [-3.6, 3, 0], 
                scale: [2.5, .45],
                arrows: true,
                subOptions: ["192p", "250p", "480p", "720p", "Default", "1080p", "1440p", "2160p"],
                defaultOption: 4,
            })
        ]);
        this.a_options.push([
            new Option({
                text: "SharpPixels",
                info: "(change how settings works to fix this text)",
                type: "horizontal large",
                pos: [-3.6, 1, 0], 
                scale: [2.5, .45],
                arrows: true,
                subOptions: ["OFF", "ON"],
                defaultOption: 0,
            })
        ]);
        
        this.str_menuName = "1P Game Mode";
    }
}