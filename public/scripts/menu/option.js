//This is the class for all menu elements in a scene.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { fn_changeSettings } from '../main.js';
import { fn_getSetting } from '../main.js';
import { fn_getMenuCamera } from '../main.js';

//Essentials:
    import { fn_getScene } from "../main.js";

let scene;

export default class Option{

    constructor(_menu, [_x, _y, _z], [_w, _h], _text, _borderStyle){
        scene = fn_getScene();

        this.f_x = _x;
        this.f_y = _y;
        this.f_z = _z;
        this.f_width = _w * 3.5;
        this.f_height = _h * 3.5;

        this.str_menu = _menu;
        this.str_text = _text;
        this.str_goTo = "";
        this.str_info = "";
        this.selected = false;
        this.b_enabled = true;

        this.b_static = false;
        this.b_arrows = false;
        this.a_options = [];
        this.int_optionIndex = 0;
        this.str_optionTextTop = "0%";
        this.str_optionTextLeft = "0%";

        //this.iX = _iX;
        //this.iY = _iY;

            

        //Border:
            this.spr_border = this.fn_newSprite('borders/'+ _borderStyle);
            
            this.spr_border.scale.set(this.f_width, this.f_height, 1);  //3rd param is ignored for sprites, but still required.
            this.spr_border.position.set(this.f_x, this.f_y, this.f_z);
            this.spr_border.material.color.setRGB(1.5, 1.5, 1.5);
            scene.add( this.spr_border );
        //Text
            this.spr_text = this.fn_newSprite('text/'+ _text);
            
            this.spr_text.scale.set(this.f_width, this.f_height, 1);  //3rd param is ignored for sprites, but still required.
            this.spr_text.position.set(this.f_x, this.f_y, this.f_z + 0.01);
            scene.add( this.spr_text );
        //Select
            this.spr_highlight = this.fn_newSprite('borders/'+ _borderStyle +'_h');
            
            this.spr_highlight.scale.set(this.f_width, this.f_height, 1);  //3rd param is ignored for sprites, but still required.
            this.spr_highlight.position.set(this.f_x, this.f_y, this.f_z);
            scene.add( this.spr_highlight );
            this.spr_highlight.visible = false;


        //Properties unique to each button:
        if(_text.includes("chara_")){
            if(_text != "chara_(unlockable)"){
                this.str_goTo = "start";
            }
            this.str_info = _text.substring(6);
        }
        else if(_text == "Single Play"){
            this.str_goTo = "Single Play/Game Mode";
            this.str_info = "Unlock characters & fill out your license.";
            fn_changeSettings("Multiplayer false");
        }
            else if(_text == "Items_On"){
                this.str_goTo = "1";
                this.str_info = "Race against the clock for the best time! (random items on the track)";

                this.b_arrows = true;
                this.a_options = ["Slow", "Normal", "FAST"];
                this.int_optionIndex = fn_getSetting(_text);
            }
            else if(_text == "No_Items"){
                this.str_goTo = "2";
                this.str_info = "Race against the clock for the best time! (no items on the track)";

                this.b_arrows = true;
                this.a_options = ["Slow", "Normal", "FAST"];
                this.int_optionIndex = fn_getSetting(_text);
            }
            else if(_text == "Practice"){
                this.str_goTo = "0";
                this.str_info = "Freely use save-states and rewind to practice shortcuts.";
            }
        else if(_text == "Split-Screen"){
            this.str_goTo = "4";
            this.str_info = "Play with multiple people at once!";
        }
            else if(_text == "Connect_Controllers"){
                fn_changeSettings("Multiplayer true");
                this.str_goTo = "start";
                this.str_info = "";
                scene.remove( this.spr_highlight );

                this.b_arrows = true;
                this.a_options = ["Slow", "Normal", "FAST"];
                this.int_optionIndex = fn_getSetting(_text);
                //this.b_static = true;
                //this.spr_text.material.color.setRGB(.9, .9, .9);
            }
        else if(_text == "Settings"){
            this.str_goTo = "Settings";
            this.str_info = "Change graphics settings to improve performance.";
        }
            else if(_text == "Resolution"){
                this.b_arrows = true;
                this.a_options = ["192p", "250p", "480p", "720p", "Default", "1080p", "1440p", "2160p"];
                this.int_optionIndex = fn_getSetting(_text);
                //console.log("int_optionIndex for " + _text + " is " + this.int_optionIndex);
                

                //Readjust resolution size when window resized:
                window.addEventListener("resize", () => {
                    this.int_optionIndex = fn_getSetting(_text);
                });
            }
            else if(_text == "SharpPixels"){
                this.b_arrows = true;
                this.int_optionIndex = fn_getSetting(_text);
                this.a_options = ["OFF", "ON"];
            }
        else if(_text == "How to Play"){
            this.str_goTo = "How to Play";
            this.str_info = "View the keyboard & gamepad controls.";
        }
            else if(_text == "Controls (gamepad)" || _text == "Controls (keyboard)"){
                scene.remove( this.spr_highlight );
                this.b_static = true;
                //this.spr_text.material.color.setRGB(1.2, 1.2, 1.2);
            }
        else{
            this.b_enabled = false;
            this.spr_border.material.color.setRGB(.4, .4, .4);
            this.spr_text.material.color.setRGB(.4, .4, .4);
            
        }


        //Adding arrows:
        if(this.b_arrows){
            this.spr_arrowR = this.fn_newSprite('arrow_R');
            this.spr_arrowR.scale.set(1, 1, 1);  //3rd param is ignored for sprites, but still required.
            this.spr_arrowR.position.set(this.f_x + this.f_width * .4, this.f_y, this.f_z + .1);
            

            this.spr_arrowL = this.fn_newSprite('arrow_L');
            this.spr_arrowL.scale.set(1, 1, 1);  //3rd param is ignored for sprites, but still required.
            this.spr_arrowL.position.set(this.f_x + this.f_width * .15, this.f_y, this.f_z + .1);
            
            //Alternative locations
            if(this.str_text == "Connect_Controllers"){
                this.spr_arrowR.position.set(this.f_x + this.f_width * .15, this.f_y + this.f_width * .3, this.f_z + .1);
                this.spr_arrowL.position.set(this.f_x - this.f_width * .15, this.f_y + this.f_width * .3, this.f_z + .1);
            }
            
            scene.add( this.spr_arrowR );
            scene.add( this.spr_arrowL );
        }
    }

    fn_update(input, rotation){
        //When option has arrows:

        //console.log(rotation > -1.25);
        if(this.b_arrows && rotation > -1.00){
            //console.log(this.str_text + " has arrows.");
            this.fn_updateLabelPosition("p_" + this.str_text, new THREE.Vector3(this.f_x, this.f_y, this.f_z));

            const p_optionElement = document.getElementById("p_" + this.str_text);
                
            p_optionElement.style.top = this.str_optionTextTop;
            p_optionElement.style.left = this.str_optionTextLeft;
        
            p_optionElement.innerHTML = this.a_options[this.int_optionIndex];

            if(this.selected){
                if(input.fn_press_right()){
                    this.int_optionIndex ++;
                }
                else if(input.fn_press_left()){
                    this.int_optionIndex -= 1;
                }

                fn_changeSettings(this.str_text, this.int_optionIndex, p_optionElement.innerHTML);
            }

            if(this.int_optionIndex > this.a_options.length - 1){
                this.int_optionIndex = 0;
            }
            else if(this.int_optionIndex < 0){
                this.int_optionIndex = this.a_options.length - 1;
            }

            if(input.fn_press_drift()){
                p_optionElement.innerHTML = "";
            }
        }
    }

    fn_isSelected(){
        return this.selected;
    }

    fn_select(){
        this.selected = true;
        if(this.spr_highlight){
            this.spr_highlight.visible = true;
        }
        if(this.b_enabled && !this.b_static){
            this.spr_border.material.color.setRGB(2.5, 2.5, 2);
        }
        var info = document.getElementById("info");
        if(this.str_menu == "Main" || this.str_menu == "1P Character Select"){
            info.innerHTML = this.str_info;
            
            if(this.str_info == ""){
                let randomInt = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
                if(randomInt == 87){
                    info.innerHTML = "(It's me.)";
                }
                else{
                    info.innerHTML = "(For future development...)"
                }
            }
        }
        else{
            info.innerHTML = "";
        }
    }

    fn_deSelect(){
        this.selected = false;
        if(this.spr_highlight){
            this.spr_highlight.visible = false;
        }
        if(this.b_enabled){
            this.spr_border.material.color.setRGB(1.5, 1.5, 1.5);
        }
    }

    fn_confirm(){
        return this.str_goTo;
    }

    fn_getPosition(){
        return this.spr_border.position;
    }

    fn_setX(_newX){
        this.f_x = _newX;

        this.spr_border.position.x = _newX;
        this.spr_text.position.x = _newX;
        this.spr_highlight.position.x = _newX;
    }

    fn_remove(){
        this.fn_removeSprite(this.spr_border, scene);
        this.fn_removeSprite(this.spr_text, scene);
        this.fn_removeSprite(this.spr_highlight, scene);

        if(this.b_arrows){
            this.fn_removeSprite(this.spr_arrowL, scene);
            this.fn_removeSprite(this.spr_arrowR, scene);
        }

        //console.log("removed");
    }

    fn_newSprite(_str_name){
        this.spriteMap = new THREE.TextureLoader().load( 'assets/sprites/UI/'+ _str_name + '.png' );
        this.spriteMap.colorSpace = THREE.SRGBColorSpace;
        this.spriteMaterial = new THREE.SpriteMaterial({ 
            map: this.spriteMap, 
            transparent: true, 
            alphaTest: 0.5,			//Helps discard transparent pixels.
            color: 0xffffff,
            depthTest: false,
            depthWrite: false,
            renderOrder: 0
        });
        return new THREE.Sprite( this.spriteMaterial );
    }

    fn_removeSprite(_spr_sprite, scene){
        scene.remove(_spr_sprite);
        _spr_sprite.material.map?.dispose();
        _spr_sprite.material.dispose();
    }

    //Use this to update HTML coordinates to match world coordinates:
    fn_updateLabelPosition(_str_labelName, worldPos) {
        const label = document.getElementById(_str_labelName);
        worldPos.x = worldPos.x + 2.4;
        worldPos.y = worldPos.y + 0.45;

        //Alternate positioning:
        if(this.str_text == "Connect_Controllers"){
            worldPos.x = worldPos.x - 2.4;
            worldPos.y = worldPos.y + 3.2;
        }

        const vector = worldPos.clone();

        // Project 3D position to screen space
        vector.project(fn_getMenuCamera());

        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;

        label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    }

    fn_getCharText(){
        return this.str_text.substring(6);
    }
}