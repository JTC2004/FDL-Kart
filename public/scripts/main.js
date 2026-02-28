//Imports:
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gameLoop from "./GameLoop.js";
import InputHandlerKB from "./inputKB.js";
import InputHandlerGP from "./inputGP.js";
import {fn_updateGame} from './game/gameplay.js';
import {fn_updateMenus} from './menu/menus.js';

//Print a message if browser doesn't support WebGL2:
	if ( WebGL.isWebGL2Available() ) {
		// Initiate function or other initializations here
		//animate();
	} 
	else {
		const warning = WebGL.getWebGL2ErrorMessage();
		document.getElementById( 'container' ).appendChild( warning );
	}


//Constants:

//Menu variables:
let menuCamera;

//Gameplay variables:
var b_gameplay = false;
var b_multiplayer = false;
var input_kb = new InputHandlerKB();
var a_inputs = [input_kb];
var a_gamepads = navigator.getGamepads();
//let renderer;

var b_fullScreen = false;
window.b_debug = true;
var str_map = "SNES MC1";
window.int_gameMode = 2;      //0 is Practice, 
//                              1 is Grand Prix, 
//                              2 is Time Trials, 
//                              3 is Adventure.

//Settings variables:
var b_trueAntiAlias = false;
var int_resolutionIndex = 4;
var int_sharpPixelIndex = 0;



//Initializing the scene:
    //3 things needed for anything: scene, camera, & renderer.
    const scene = new THREE.Scene();
    const loader = new GLTFLoader();
    var a_gameCameras = [];
    a_gameCameras.push(new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 ));	
    //1 of many types of cameras in JS.		  (FOV, aspect ratio, near (objs closer than near, or farther than far won't be rendered), far) 

    var frustumHeight = 9; // choose a consistent height
    menuCamera = new THREE.OrthographicCamera(
        (frustumHeight * (window.innerWidth / window.innerHeight)) / -2,
        (frustumHeight * (window.innerWidth / window.innerHeight)) / 2,
        frustumHeight / 2,
        frustumHeight / -2,
        0.1,
        1000
    );
    menuCamera.aspect = window.innerWidth / window.innerHeight;	
    menuCamera.position.set( 0, 0, 10 );
    menuCamera.lookAt( 0, 0, 0 );
    menuCamera.rotation.y = -1.25;


    //Renderer initialization:
	const renderer = new THREE.WebGLRenderer({
		antialias: b_trueAntiAlias,
		alpha: true
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));	//Sets ratio of CSS pixels to actual pixels. 1 is for 1080p screens, 2 is for 4K, 3 is for smartphone.
	renderer.setSize( window.innerWidth, window.innerHeight);
	document.body.appendChild( renderer.domElement );

//Event listeners:
    //Renderer resize handler:
        window.addEventListener('resize', () => {
            //Update camera:
            if(b_gameplay){
                a_gameCameras[0].aspect = window.innerWidth / window.innerHeight;
                a_gameCameras[0].updateProjectionMatrix();							//Tells three.js to update the camera.
            }
            else{
			    menuCamera.aspect = window.innerWidth / window.innerHeight;
			    menuCamera.updateProjectionMatrix();							//Tells three.js to update the camera.

                //Check fullscreen:
			    fn_checkFullscreen(menuCamera, frustumHeight);
            }
            int_resolutionIndex = 4;
    
            //Update renderer:
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));	//Order matters. Set ratio, then size.
            renderer.setSize(window.innerWidth, window.innerHeight);
    
        }, false);


        
//THE MASTER GAME LOOP:
try{
    fn_checkFullscreen(menuCamera, frustumHeight);
    gameLoop.addCallback((dt) => {
        //Handle input stuff every frame:
            //Handling changes in player count:
            if(navigator.getGamepads().length != a_gamepads.length){
                a_gamepads = navigator.getGamepads();

                //If there is a new controller, add it to the array of inputs at the front:
                if(a_gamepads.length > 0){
                    a_inputs.unshift(new InputHandlerGP(a_gamepads[0]));
                    a_gameCameras.push(new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 ));
                }
                else{
                    a_inputs = [input_kb];
                }
            }

            //console.log("a_inputs[0] = " + a_inputs[0] + ", \t" + "a_inputs = " + a_inputs);

        //Fixed update (60 hz):
        if(dt > 0){
            //Get input for gamepad(s):
            for(const input of a_inputs){
                input.fn_updateGP(a_gamepads[0]);
            }
            
            if(b_gameplay){
                b_gameplay = fn_updateGame(gameLoop.fn_getFPS());
            }
            else{
                b_gameplay = fn_updateMenus(a_inputs[0]);
            }

            //Advance input state ONCE PER FIXED UPDATE:
            for(const input of a_inputs){
                input.fn_updateLastKey();
            }
        }

        //Render every frame:
        if(b_gameplay){
            if(b_multiplayer){
                var int_i = 0;
                renderer.setScissorTest(true);      //MAKE THIS HAPPEN ONLY 1 FRAME.
                
                for (const gameCamera of a_gameCameras){
                    const w = window.innerWidth;
                    const h = window.innerHeight;

                    renderer.setViewport(w / 2 * int_i, 0, w / 2, h);
                    renderer.setScissor(w / 2 * int_i, 0, w / 2, h);
                    gameCamera.aspect = (w / 2) / h;
                    gameCamera.updateProjectionMatrix();
                    
                    renderer.render( scene, gameCamera );

                    int_i ++;
                }
            }
            else{
                renderer.render( scene, a_gameCameras[0] );
            }
        }
        else{
            renderer.render( scene, menuCamera );
        }
    });

    gameLoop.start();
}
catch{
    //HANDLE CRASH HERE
}


//When in menus, change camera's distance from UI when fullscreen:
function fn_checkFullscreen(menuCamera, frustumHeight){
	if(!b_gameplay){
		//var info = document.getElementById("info");
		
		//If window is in fullscreen, zoom the camera in by changing frustumHeight):
		if (menuCamera.aspect > 1.7 && menuCamera.aspect < 1.8){	
			frustumHeight = 10.5;
			//console.log("FULLSCREEN");
			b_fullScreen = true;
		}
		else{
			frustumHeight = 9;
			//console.log("Not fullscreen");
			b_fullScreen = false;
		}
		//info.innerHTML = "b_fullScreen = " + b_fullScreen;

		//Prevent strething if aspect ratio is widescreen:
		if(menuCamera.aspect >= 1.7){
			menuCamera.left = (-frustumHeight * menuCamera.aspect) / 2;
			menuCamera.right = (frustumHeight * menuCamera.aspect) / 2;
			menuCamera.top = frustumHeight / 2;
			menuCamera.bottom = -frustumHeight / 2;
			menuCamera.updateProjectionMatrix();
		}
    }
}

//Used for rebuilding the renderer:
/*function fn_initializeRenderer(){
    renderer = new THREE.WebGLRenderer({
		antialias: b_trueAntiAlias,
		alpha: true
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));	//Sets ratio of CSS pixels to actual pixels. 1 is for 1080p screens, 2 is for 4K, 3 is for smartphone.
	renderer.setSize( window.innerWidth, window.innerHeight);
	document.body.appendChild( renderer.domElement );
}*/

//This function is called in option.js to update its value.
export function fn_getSetting(str_text){
        if (str_text == "Resolution"){
            return int_resolutionIndex;
        }
        else if(str_text == "SharpPixels"){
            return int_sharpPixelIndex;
        }
}

//This function is called in option.js to change a value here.
export function fn_changeSettings(str_text, int_index, str_option){
        const p_info = document.getElementById("info");
        const canvas = renderer.domElement;

        if(str_text == "Resolution"){
            int_resolutionIndex = int_index;
            
            if (int_index == 4){
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.setSize(window.innerWidth, window.innerHeight);
                p_info.innerHTML = "Resolution set to the size of your browser window (" + window.innerWidth + " x " + window.innerHeight +").";
            }
            else{
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.setSize(str_option.slice(0, -1) / 9 * 16, str_option.slice(0, -1), false);
                var str_WxH = "(" + Math.ceil(str_option.slice(0, -1) / 9 * 16) + " x " + str_option.slice(0, -1) + ")";

                //renderer.setPixelRatio(1);
                if(str_option.slice(0, -1) > window.innerHeight){
                    p_info.innerHTML = "WARNING: Game resolution higher than browser resolution!";
                }
                else if(int_index == 7){
                    p_info.innerHTML = "4K " + str_WxH + ". Will reset on window resize.";
                }
                else if(int_index == 6){
                    p_info.innerHTML = "Resolution of Switch 2 games " + str_WxH + ". Will reset on window resize.";
                }
                else if(int_index == 5){
                    p_info.innerHTML = "Full HD " + str_WxH + ". Will reset on window resize.";
                }
                else if(int_index == 3){
                    p_info.innerHTML = "Resolution of Wii U games " + str_WxH + ". Will reset on window resize.";
                }
                else if(int_index == 2){
                    p_info.innerHTML = "Resolution of GCN & Wii games " + str_WxH + ". Will reset on window resize.";
                }
                else if(int_index == 1){
                    p_info.innerHTML = "Resolution of 3DS games " + str_WxH + ". Will reset on window resize.";
                }
                else if(int_index == 0){
                    p_info.innerHTML = "Resolution of DS games " + str_WxH + ". Will reset on window resize.";
                }
                else {
                    p_info.innerHTML = "Resolution " + str_WxH + ". Will reset on window resize.";
                }
            }
        }
        else if(str_text == "SharpPixels"){
            int_sharpPixelIndex = int_index;

            if(int_index == 0){
                canvas.style.imageRendering = "auto";
                p_info.innerHTML = "Smoother image.";
            }
            else if(int_index == 1){
                canvas.style.imageRendering = "pixelated";
                p_info.innerHTML = "More pixelated image.";
            }
        }
        else if(str_text == "Multiplayer true"){
            b_multiplayer = true;
        }
        else if(str_text == "Multiplayer false"){
            b_multiplayer = false;
        }
}

//General-purpose clear scene function by ChatGPT:
export function fn_clearScene(scene) {
    console.log("CLEARED SCENE");

    while (scene.children.length > 0) {
        const object = scene.children[0];

        scene.remove(object);

        // Dispose geometry
        if (object.geometry) {
            object.geometry.dispose();
        }

        // Dispose material(s)
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
            } else {
                object.material.dispose();
            }
        }
    }
}

//GLOBAL GETTERS & SETTERS:
//DO THIS FOR MORE ESSENTIALS SO I DON'T HAVE TO PASS IN A MILLION PARMETERS TO EVERY OBJECT:
//The essential objects (are REFERENCES):
    export function fn_getScene(){
        return scene;
    }

    export function fn_getRenderer(){
        return renderer;
    }

    export function fn_getLoader(){
        return loader;
    }

    export function fn_getCameras(){
        return a_gameCameras;
    }
    export function fn_getMenuCamera(){
        return menuCamera;
    }

    export function fn_getInputs(){
        return a_inputs;
    }
    export function fn_getInput(_int_i){
        return a_inputs[_int_i];
    }

//Useful primatives (get COPIED):
    export function fn_isMultiplayer(){
        return b_multiplayer;
    }

    export function fn_getMap(){
        return str_map;
    }

//Settings variables:
    