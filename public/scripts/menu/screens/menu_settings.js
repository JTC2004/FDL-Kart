//This is the mode select for Single Player:

//Imports:
    //Objects:
        import Menu from "../menu.js";
        import Option from "../option.js";
    //Arrow settings:
        import { fn_settingResolution } from "../../main.js";
        import { fn_settingSharpPixels } from "../../main.js";

export default class Menu_Settings extends Menu{

    constructor(manager){
        super(manager);

        this.a_options.push([
            new Option({
                text: "Resolution",
                info: "(setting)",
                type: "horizontal large",
                pos: [-3.6, 3, 0], 
                scale: [2.5, .45],
                arrows: true,
                subOptions: ["192p", "250p", "480p", "720p", "Default", "1080p", "1440p", "2160p"],
                defaultOption: 4,
                onArrow: (_int_i, _str_subOption) => {
                    fn_settingResolution(_int_i, _str_subOption);
                }
            })
        ]);
        this.a_options.push([
            new Option({
                text: "SharpPixels",
                info: "(setting)",
                type: "horizontal large",
                pos: [-3.6, 1, 0], 
                scale: [2.5, .45],
                arrows: true,
                subOptions: ["OFF", "ON"],
                defaultOption: 0,
                onArrow: (_int_i, _str_subOption) => {
                    fn_settingSharpPixels(_int_i, _str_subOption);
                }
            })
        ]);
        
        this.str_menuName = "1P Game Mode";
    }
}