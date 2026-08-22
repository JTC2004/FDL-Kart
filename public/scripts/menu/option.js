//This is the class for all menu elements in a scene.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { fn_getMenuCamera } from '../main.js';

//Essentials:
    import { fn_getScene } from "../main.js";
import Menu_0_main from './screens/menu_0_main.js';

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
        this.a_arrowOffset = config.arrowOffset;
        if(!this.a_arrowOffset) this.a_arrowOffset = [0, 1];
        this.a_subOptions = config.subOptions;
        this.int_arrowIndex = config.defaultOption;
        this.str_optionTextTop = "0%";
        this.str_optionTextLeft = "0%";

        this.onConfirm = config.onConfirm;
        this.onArrow = config.onArrow;

        //Animation variables:
        this.int_idleFrameX = Math.floor(Math.random() * 1000);
        this.int_idleFrameY = Math.floor(Math.random() * 1000);
        
        this.int_arrowFrame = 0;
        this.int_pressAmount = .18;          //Value for how far arrow icon gets pushed.
        this.a_arrowPress = [0, 0];         //The number of frames elapsed for arrow press animation for each arrow.
        this.a_arrowNotEdge = [true, true];    //When each equals false, the respective arrow is grayed out.
        this.f_baseArrowBrightness = [1, 1];//Base brightness of each arrow.

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
                
                this.spr_arrowR = this.fn_newSprite('arrow_R');
                this.spr_arrowR.scale.set(1, 1, 1);  //3rd param is ignored for sprites, but still required.
                //This is just for ctrl + f-ing: fn_arrowUpdate
                
                this.fn_setArrowPos();

                SCENE.add( this.spr_arrowR );
                SCENE.add( this.spr_arrowL );
                this.p_optionElement.innerHTML = this.a_subOptions[this.int_arrowIndex];

                this.fn_updateLabelPosition("p_" + this.str_text);
                this.fn_arrowIdleAnimCheck();
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
                    var int_div = 1;
                    if(!this.a_arrowNotEdge[1]) int_div = 10;
                    else this.int_arrowIndex ++;
                    this.a_arrowPress[1] = this.int_pressAmount / int_div;
                }
                else if(input.fn_press_left()){
                    var int_div = 1;
                    if(!this.a_arrowNotEdge[0]) int_div = 10;
                    else this.int_arrowIndex -= 1;
                    this.a_arrowPress[0] = this.int_pressAmount / int_div;
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
                    this.onArrow(this.int_arrowIndex);

                    //Arrow animation check on every press:
                    this.fn_arrowIdleAnimCheck();
                }

                this.fn_arrowAnimUpdate(this.spr_arrowL, 0);
                this.fn_arrowAnimUpdate(this.spr_arrowR, 1);
                this.int_arrowFrame ++;
            }

            //if(this.str_text == "Items_On") console.log(`this.int_optionIndex = ${this.int_optionIndex}`);
        }

        this.fn_idleAnim();
        this.int_idleFrameX ++;
        this.int_idleFrameY ++;
    }
    
    //Option operations:
        fn_confirm(){
            if (this.onConfirm) {
                this.onConfirm();
            }
        }

        fn_select(){        
            this.b_selected = true;
            if(!this.b_static) this.spr_highlight.visible = true;

            this.p_info.innerHTML = this.str_info;
            //If this is a setting, set the text based on the setting:
            if(this.b_arrows){
                this.onArrow(this.int_arrowIndex);
                this.fn_arrowIdleAnimCheck();
            }
            
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

            if(this.b_arrows){
                this.spr_arrowL.position.copy(this.a_baseArrowPos[0]);
                this.spr_arrowR.position.copy(this.a_baseArrowPos[1]);
            }

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
    
    //Methods for adding and removing sprites:
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
            vector.x = vector.x + 2.6 * this.a_arrowOffset[1] + this.a_arrowOffset[0];
            vector.y = vector.y + 0.45;
        }

        // Project 3D position to screen space
        vector.project(fn_getMenuCamera());

        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;

        label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    }

    //Animation methods:
        //For arrow animation, called in fn_update():
        fn_arrowAnimUpdate(sprite, _i){
            var int_direc = 1;
            if(_i == 0) int_direc = -1;

            let f_arrowIdleAnim = 0;
            if(this.a_arrowNotEdge[_i]) f_arrowIdleAnim = (Math.sin(this.int_arrowFrame / 10) * .04);
            sprite.position.x = this.a_baseArrowPos[_i].x + (f_arrowIdleAnim + this.a_arrowPress[_i]) * int_direc; 

            //If a_arrowPress[i] got incemented by int_pressAmount, decrement it.
            if(this.a_arrowPress[_i] > 0){
                this.a_arrowPress[_i] -= .05;
                const int_brighten = this.f_baseArrowBrightness[_i] + Math.max(0, this.a_arrowPress[_i]) * 900;      //USE Math.MAX to optimize decrement checks!
                sprite.material.color.setRGB(int_brighten, int_brighten, int_brighten);
            }
        }

        //Check if the arrows should be moving:
        fn_arrowIdleAnimCheck(){
            this.a_arrowNotEdge[0] = true;     
            this.a_arrowNotEdge[1] = true;     
            this.f_baseArrowBrightness[0] = 1;
            this.f_baseArrowBrightness[1] = 1;
            
            if(this.int_arrowIndex == 0){
                this.a_arrowNotEdge[0] = false;
                this.f_baseArrowBrightness[0] = 0.3;
            } 
            if(this.int_arrowIndex == this.a_subOptions.length - 1){
                this.a_arrowNotEdge[1] = false;
                this.f_baseArrowBrightness[1] = 0.3;
            }

            this.spr_arrowL.material.color.setRGB(this.f_baseArrowBrightness[0], this.f_baseArrowBrightness[0], this.f_baseArrowBrightness[0]);
            this.spr_arrowR.material.color.setRGB(this.f_baseArrowBrightness[1], this.f_baseArrowBrightness[1], this.f_baseArrowBrightness[1]);
        }

        //The idle animation of the whole option:
        fn_idleAnim(){
            this.spr_border.position.copy(this.option.position);
            this.spr_text.position.copy(this.option.position);
            this.spr_highlight.position.copy(this.option.position);

            //Inner X is speed of oscillation, outer X is amount of oscillation!
            const f_sinX = Math.sin(this.int_idleFrameX / 30) / 30;
            const f_sinY = Math.sin(this.int_idleFrameY / 30) / 30;
            
            this.spr_border.position.x += f_sinX;
            this.spr_text.position.x += f_sinX;
            this.spr_highlight.position.x += f_sinX;
            
            this.spr_border.position.y += f_sinY;
            this.spr_text.position.y += f_sinY;
            this.spr_highlight.position.y += f_sinY;

            
            //if(this.b_arrows){
            //    fn_setArrowPos();
            //}
        }

    //Getters & setters:
        fn_setPos(_x, _y, _z){
            this.option.position.set(_x, _y, _z);

            this.spr_border.position.copy(this.option.position);
            this.spr_text.position.copy(this.option.position);
            this.spr_highlight.position.copy(this.option.position);

            if(this.b_arrows){
                fn_setArrowPos();
            }
        }

        //Update the location of arrows to match with current option.position:
        fn_setArrowPos(){
            this.spr_arrowL.position.copy(this.option.position);
            this.spr_arrowL.position.x += this.f_width * .18 * this.a_arrowOffset[1] + this.a_arrowOffset[0];

            this.spr_arrowR.position.copy(this.option.position);
            this.spr_arrowR.position.x += this.f_width * .41 * this.a_arrowOffset[1] + this.a_arrowOffset[0];
            
            //Alternative locations:
                if(this.str_text == "Connect_Controllers"){
                    this.spr_arrowR.position.copy(this.option.position)
                    this.spr_arrowR.position.x += this.f_width * .13;
                    this.spr_arrowR.position.y += this.f_width * .3;
                    this.spr_arrowL.position.copy(this.option.position);
                    this.spr_arrowL.position.x -= this.f_width * .13;
                    this.spr_arrowL.position.y += this.f_width * .3;
                }
                
            this.spr_arrowL.position.z += .1;
            this.spr_arrowR.position.z += .1;

            this.a_baseArrowPos = [
                new THREE.Vector3(0,0,0).copy(this.spr_arrowL.position),    //The base position of the left arrow before animation.
                new THREE.Vector3(0,0,0).copy(this.spr_arrowR.position)     //The base position of the right arrow before animation.
            ];
        }

        fn_isDummy(){
            return this.b_dummy;
        }

        fn_isSelected(){
            return this.b_selected;
        }

        //Return true if this option has arrows:
        fn_hasArrows(){
            return this.b_arrows;
        }

        fn_getPos(){
            return this.option.position;
        }

        //Get the character name if this option's name is "chara_characterName"
        fn_getCharText(){
            return this.str_text.substring(6);
        }
}