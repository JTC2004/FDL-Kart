//This is the class for all menu elements in a scene.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { fn_getMenuCamera } from '../main.js';

//Essentials:
    import { fn_getScene } from "../main.js";

let SCENE;

export default class Option{

    constructor(config){            //_menu, [_x, _y, _z], [_w, _h], _text, _borderStyle
        SCENE = fn_getScene();
        this.b_dummy = config.dum;
        if(this.b_dummy) return;    //If this is a dummy option, skip all.


        this.option = new THREE.Object3D();       //Represents this collective menu's XYZ coordinates.
        this.option.position.set(config.pos[0], config.pos[1], config.pos[2]);       
        this.f_width = config.scale[0] * 3.5;
        this.f_height = config.scale[1] * 3.5;

        this.str_text = config.text;                //FYI: config variables equal null if not declared.
        this.p_optionElement = document.getElementById("p_" + this.str_text);
        this.str_type = config.type;
        this.str_info = config.info;
        this.p_info = document.getElementById("info");
        this.b_selected = false;
        this.b_disabled = config.disabled;

        this.b_static = config.static;
        this.b_arrows = config.arrows;
        this.a_subOptions = config.subOptions;
        this.int_arrowIndex = config.defaultOption;
        this.str_optionTextTop = "0%";
        this.str_optionTextLeft = "0%";

        this.onConfirm = config.onConfirm;
        this.onArrow = config.onArrow;

        //this.iX = _iX;
        //this.iY = _iY;

        //Adding sprites:
            //Border:
                this.spr_border = this.fn_newSprite('borders/'+ this.str_type);
                
                this.spr_border.scale.set(this.f_width, this.f_height, 1);  //3rd param is ignored for sprites, but still required.
                this.spr_border.position.copy(this.option.position);        //USE COPY instead of clone. Clone only works with new vector3.
                this.spr_border.material.color.setRGB(1.5, 1.5, 1.5);
                SCENE.add( this.spr_border );
            //Text:
                this.spr_text = this.fn_newSprite('text/'+ this.str_text);
                
                this.spr_text.scale.set(this.f_width, this.f_height, 1);  //3rd param is ignored for sprites, but still required.
                this.spr_text.position.copy(this.option.position);
                this.spr_text.position.z += 0.01;
                SCENE.add( this.spr_text );
            //Selection highlight:
                this.spr_highlight = this.fn_newSprite('borders/'+ this.str_type +'_h');
                
                this.spr_highlight.scale.set(this.f_width, this.f_height, 1);  //3rd param is ignored for sprites, but still required.
                this.spr_highlight.position.copy(this.option.position);
                SCENE.add( this.spr_highlight );
                this.spr_highlight.visible = false;
        
            //Gray out sprites if this option is disabled:
            if(this.b_disabled){
                this.spr_border.material.color.setRGB(.4, .4, .4);
                this.spr_text.material.color.setRGB(.4, .4, .4);
            }

            //Adding arrows:
            if(this.b_arrows){
                this.spr_arrowL = this.fn_newSprite('arrow_L');
                this.spr_arrowL.scale.set(1, 1, 1);  //3rd param is ignored for sprites, but still required.
                this.spr_arrowL.position.copy(this.option.position);
                this.spr_arrowL.position.x += this.f_width * .15;

                this.spr_arrowR = this.fn_newSprite('arrow_R');
                this.spr_arrowR.scale.set(1, 1, 1);  //3rd param is ignored for sprites, but still required.
                this.spr_arrowR.position.copy(this.option.position);
                this.spr_arrowR.position.x += this.f_width * .4;
                
                //Alternative locations
                if(this.str_text == "Connect_Controllers"){
                    this.spr_arrowR.position.copy(this.option.position)
                    this.spr_arrowR.position.x += this.f_width * .15;
                    this.spr_arrowR.position.y += this.f_width * .3;
                    this.spr_arrowL.position.copy(this.option.position);
                    this.spr_arrowL.position.x -= this.f_width * .15;
                    this.spr_arrowL.position.y += this.f_width * .3;
                }
                
                this.spr_arrowL.position.z += .1;
                this.spr_arrowR.position.z += .1;

                SCENE.add( this.spr_arrowR );
                SCENE.add( this.spr_arrowL );
                this.p_optionElement.innerHTML = this.a_subOptions[this.int_arrowIndex];
                this.fn_updateLabelPosition("p_" + this.str_text);
        }
    }

    fn_update(input){
        if(this.b_dummy) return;
        //if(this.str_info != "(unlockable)") console.log(`isSelected for element ${this.str_info} = ${this.b_selected}`);

        //When option has arrows:
        if(this.b_arrows){
            //Has arrows.
            this.fn_updateLabelPosition("p_" + this.str_text);
            this.p_optionElement.style.top = this.str_optionTextTop;
            this.p_optionElement.style.left = this.str_optionTextLeft;

            //Changing value that arrows control:
            if(this.b_selected){
                if(input.fn_press_right()){
                    this.int_arrowIndex ++;
                }
                else if(input.fn_press_left()){
                    this.int_arrowIndex -= 1;
                }

                //Bounds for arrow index:
                if(this.int_arrowIndex > this.a_subOptions.length - 1){
                    this.int_arrowIndex = 0;
                }
                else if(this.int_arrowIndex < 0){
                    this.int_arrowIndex = this.a_subOptions.length - 1;
                }

                //Update text and setting:
                if(input.fn_press_right() || input.fn_press_left()){
                    this.p_optionElement.innerHTML = this.a_subOptions[this.int_arrowIndex];
                    this.onArrow(this.int_arrowIndex, this.a_subOptions[this.int_arrowIndex]);
                }
            }

            //if(this.str_text == "Items_On") console.log(`this.int_optionIndex = ${this.int_optionIndex}`);
        }
    }

    fn_isDummy(){
        return this.b_dummy;
    }

    fn_isSelected(){
        return this.b_selected;
    }

    fn_confirm(){
        if (this.onConfirm) {
            this.onConfirm();
        }
    }

    fn_select(){        
        this.b_selected = true;
        if(!this.b_static) this.spr_highlight.visible = true;

        this.p_info.innerHTML = this.str_info;
        
        if(this.b_disabled){
            let randomInt = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
            if(randomInt == 87){
                this.p_info.innerHTML = "(It's me.)";
            }
            else{
                this.p_info.innerHTML = "(For future development...)"
            }
        }
        //If this option isn't static, brighten it and show the border.
        else if(!this.b_static){
            this.spr_border.material.color.setRGB(2.5, 2.5, 2);
        }
    }

    fn_deSelect(){
        this.b_selected = false;
        this.spr_highlight.visible = false;

        if(!this.b_disabled){
            this.spr_border.material.color.setRGB(1.5, 1.5, 1.5);
        }
    }

    //Make all of this option's elements invisible:
    fn_hide(){
        if(this.b_dummy) return;
        //console.log(`HIDING option ${this.str_text}!`);
        
        this.spr_border.visible = false;
        this.spr_text.visible = false;
        this.spr_highlight.visible = false;
        if(this.b_arrows){
            this.spr_arrowL.visible = false;
            this.spr_arrowR.visible = false;
            this.p_optionElement.innerHTML = "";
        }
        //console.log(`Hidden option ${this.str_text}`);
    }

    //Make all of this option's elements visible:
    fn_show(){
        if(this.b_dummy) return;
        this.spr_border.visible = true;
        this.spr_text.visible = true;
        if(this.b_selected){
            this.spr_highlight.visible = true;
            this.p_info.innerHTML = this.str_info;
        }
        if(this.b_arrows){
            this.spr_arrowL.visible = true;
            this.spr_arrowR.visible = true;
            this.p_optionElement.innerHTML = this.a_subOptions[this.int_arrowIndex];
            this.fn_updateLabelPosition("p_" + this.str_text);
        }
    }

    fn_getPos(){
        return this.spr_border.position;
    }

    fn_setX(_newX){
        this.f_x = _newX;

        this.spr_border.position.x = _newX;
        this.spr_text.position.x = _newX;
        this.spr_highlight.position.x = _newX;
    }

    fn_remove(){
        this.fn_removeSprite(this.spr_border, SCENE);
        this.fn_removeSprite(this.spr_text, SCENE);
        this.fn_removeSprite(this.spr_highlight, SCENE);

        if(this.b_arrows){
            this.fn_removeSprite(this.spr_arrowL, SCENE);
            this.fn_removeSprite(this.spr_arrowR, SCENE);
        }
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
        });
        return new THREE.Sprite( this.spriteMaterial );
    }

    fn_removeSprite(_spr_sprite, scene){
        scene.remove(_spr_sprite);
        _spr_sprite.material.map?.dispose();
        _spr_sprite.material.dispose();
    }

    //Use this to update HTML coordinates to match world coordinates:
    fn_updateLabelPosition(_str_labelName) {
        const label = document.getElementById(_str_labelName);

        const vector = this.option.position.clone();

        //Adjust positioning based on what p_ element we are adjusting:
        if(this.str_text == "Connect_Controllers"){
            vector.y = vector.y + 3.6;
        }
        else{
            vector.x = vector.x + 2.4;
            vector.y = vector.y + 0.45;
        }

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