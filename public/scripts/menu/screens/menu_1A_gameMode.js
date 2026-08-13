//This is the mode select for Single Player:

//Imports:
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    //Objects:
        import Menu from "../menu.js";
        import Option from "../option.js";
        import Menu_1B_charSelect from "./menu_1B_charSelect.js";
    //Arrow settings:
        import { fn_settingCC } from "../../main.js";

export default class Menu_1A_gameMode extends Menu{

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
                subOptions: ["Slow", "Normal", "FAST"],
                defaultOption: 1,
                onConfirm: () => {
                    window.int_gameMode = 1;
                    manager.fn_nextMenu(new Menu_1B_charSelect(manager));
                },
                onArrow: (_int_arrowIndex) => {
                    fn_settingCC(_int_arrowIndex);
                }
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
                subOptions: ["Slow", "Normal", "FAST"],
                defaultOption: 1,
                onConfirm: () => {
                    window.int_gameMode = 2;
                    manager.fn_nextMenu(new Menu_1B_charSelect(manager));
                },
                onArrow: (_int_arrowIndex) => {
                    fn_settingCC(_int_arrowIndex);
                }
            })
        ]);
        this.a_options.push([
            new Option({
                text: "Practice",
                info: "Freely use flight, save-states, and rewind to practice shortcuts.",
                type: "horizontal medium",
                pos: [-5.8, -2.00, 0], 
                scale: [1.3, .45],
                onConfirm: () => {
                    window.int_gameMode = 0;
                    manager.fn_nextMenu(new Menu_1B_charSelect(manager));
                }
            })
        ]);
        
        this.str_menuName = "1P Game Mode";
    }
}