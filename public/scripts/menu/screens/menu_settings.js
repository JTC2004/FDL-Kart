//This is the mode select for Single Player:

//Imports:
    //Objects:
        import Menu from "../menu.js";
        import Option from "../option.js";
    //Arrow settings:
        import { fn_settingMaxResolution } from "../../main.js";
        import { fn_settingSharpPixels } from "../../main.js";
        import {fn_getSetting} from "../../main.js";

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
        
        this.str_menuName = "1P Game Mode";
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