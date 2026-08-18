//This is the mode select for Single Player:

//Imports:
    import * as THREE from 'three';
    //Objects:
        import Menu from "../menu.js";
        import Option from "../option.js";
    //Unique:
        import Character from "../../game/objects/character.js";
        import Kart from "../../game/objects/kart.js";
    //Arrow settings:
        import { fn_settingMaxResolution } from "../../main.js";
        import { fn_settingSharpPixels } from "../../main.js";
        import {fn_getSetting} from "../../main.js";

var int_frames = 0;

export default class Menu_Settings extends Menu{

    constructor(manager){
        super(manager);

        this.a_options.push([
            new Option({
                text: "Resolution",
                type: "horizontal large",
                pos: [-3.6, 3, 0], 
                scale: [2.5, .45],
                arrows: true,
                subOptions: ["160p", "192p", "240p", "360p", "480p", "720p", "900p", "1080p", "1440p", "4K"],
                defaultOption: fn_getSetting("Resolution"),
                onArrow: (_int_i) => {
                    fn_settingMaxResolution(_int_i);
                }
            })
        ]);
        this.a_options.push([
            new Option({
                text: "SharpPixels",
                type: "horizontal large",
                pos: [-3.6, 1, 0], 
                scale: [2.5, .45],
                arrows: true,
                subOptions: ["OFF", "ON"],
                defaultOption: fn_getSetting("Sharp Pixels"),
                onArrow: (_int_i) => {
                    fn_settingSharpPixels(_int_i);
                }
            })
        ]);

        //Object additions specific to this menu:
        this.a_objects = [
            new Character([4.1, .8, -.05], 1, 2, "Enoki", 0, true),
            new Character([4.7, -.25, .5], 1, 2, "Aaron", 0, true),
            new Kart([.8, -.15, 0], 6, .175),
        ];
        this.a_objects[0].fn_setSpriteTile(5, 0);
        this.a_objects[1].fn_setSpriteTile(4, 1);
        
        this.str_menuName = "1P Game Mode";
    }

    //Any components of a menu's update specific to it is added here:
    fn_extraUpdate(a_INPUTS){
            const input = a_INPUTS[0];
            
            //Set the kart rotation (doesn't work in the constructor for some reason):
            this.a_objects[2].fn_setRotation(new THREE.Vector3(0.4, 3, -0.15));
    
            this.a_objects[0].fn_menuUpdate(input, int_frames);
            this.a_objects[1].fn_menuUpdate(input, int_frames);


        int_frames ++;
    }

    //Extra additions for this specific menu:
    fn_extraEnter(){
        window.b_inSettingsMenu = true;
    }

    //Extra cleanup for this specific menu:
    fn_extraExit(){
        window.b_inSettingsMenu = false;
    }
}