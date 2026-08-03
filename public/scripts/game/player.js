import * as THREE from 'three';
import { Capsule } from 'three/addons/math/Capsule.js';

import Kart from "./objects/kart.js";
import Character from "./objects/character.js";

//Essentials:
	import { fn_getScene } from "../main.js";
	import { fn_getRenderer } from "../main.js";
	import { fn_getLoader } from "../main.js";
	import { fn_getCameras } from "../main.js";
	import { fn_isMultiplayer } from "../main.js";
	import { fn_getInputs } from "../main.js";

//Declaring constants:
	//Essentials:
		let SCENE;
		let RENDERER;
		let LOADER;
		let a_CAMERAS;
		let a_INPUTS;

		let b_MULTIPLAYER;

	const b_showCapsule = false;

export default class Player{

	constructor(_num, [_x, _y, _z], [_ch1, _ch2], _scale, _numChecks, _numKeys, _int_numLaps){
		//Essentials:
			SCENE = fn_getScene();
			RENDERER = fn_getRenderer();
			LOADER = fn_getLoader();
			a_CAMERAS = fn_getCameras();
			a_INPUTS = fn_getInputs();
		
			b_MULTIPLAYER = fn_isMultiplayer();
		//Scale:
			this.f_radius = _scale * .7;													//Radius of the player's collisions.
			this.f_scale = _scale;															//The scale of the player.
		//Add the player to the scene:
			this.int_PLAYER_NUM = _num;

			this.player = new THREE.Object3D();												//The player's position & translation.
																							//DOESN'T NEED TO BE A SPHERE FOR OBJECT COLLISIONS!!
			SCENE.add( this.player );
			this.player.position.set(_x, _y, _z);

			this.boundingSphere = new THREE.Sphere(this.player.position.clone(), this.f_radius);	//Used for collisions with non-octree objects:

		//Collision capsule:
			this.worldCollider = new Capsule( new THREE.Vector3( _x, _y, _z ), new THREE.Vector3( _x, _y + this.f_radius, _z ), this.f_radius );	//Collider with the map.
			this.worldCollider.visible = true;
		if(b_showCapsule){
			//Visualize collision capsule:
				this.capsuleGeom = new THREE.CapsuleGeometry(this.f_radius, this.f_radius * .35, 8, 16);
				this.capsuleMat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
				this.capsuleMesh = new THREE.Mesh(this.capsuleGeom, this.capsuleMat);			//Mesh to visualize the collision capsule.
				SCENE.add(this.capsuleMesh);
			//Visualize where collision capsule top and bottom are:
				this.visGeometry = new THREE.SphereGeometry( .1, 6, 6);	
				this.startVis = new THREE.Mesh( this.visGeometry, new THREE.MeshPhongMaterial( { color: 0x00ff00 } ));
				this.endVis = new THREE.Mesh( this.visGeometry, new THREE.MeshPhongMaterial( { color: 0xff0000 }  ));
				SCENE.add(this.startVis);
				SCENE.add(this.endVis);
		} 
		
		//Code for player sprites & model(s):
			this.a_characters = [
				new Character([_x, _y, _z], 1, 1, _ch1, _num, false),
				new Character([_x, _y, _z], 1, 1, _ch2, _num, true)
			];

			this.obj_kart = new Kart([_x, _y, _z], 1, .1);
		
		//Player states:
			//Flying:
				this.b_flying = false;															//When true, player is in free-cam mode.
				this.f_flySpd = .75;														//Speed the camera moves while flying.
			//Jummping & falling:
				this.f_GRAVITY_RATE = 0.02;
				this.f_BASE_GRAVITY = .14;
				this.f_gravity = this.f_BASE_GRAVITY;										//Rate the player moves down per frame.
				this.f_jumpHeight = -0.125;
				this.b_jumping = false;															//Equals true while jumping.
				this.f_jumpStartY = 0.0;														//Used to offset camera when player jumps.
				this.f_jumpOffset = 0.0;
			//Charge-jumping:
				this.b_chargeJumping = false;													//Equals true while in the air only from a charge jump.
				this.b_chargingJump = false;													//Equals true when charging a jump.
				this.f_jumpCharge = 0.0;														//Once this reaches a value, player will jumpafter releasing drift button.
				this.f_chargeJumpHeight = -0.425;
			//Collision:
				this.b_hitWall = false;															//True when collider collides w/ a wall.
				this.b_hitPlayer = false;														//True when bounding box collides with another player's bounding box.
				this.b_onGround = false;														//Player is on ground when true.
				this.b_prevOnGround = false;
				this.b_firstLanded = false;														//Equals true ONLY the first frame player lands on ground.
			//Drifting:
				this.b_drifting = false;														//True when player is drifting.
				this.b_prevBrakeDrifting = false;
				this.b_standstill = false;														//True when player is standstill drifitng.
				this.b_inOffroad = false;														//True when collider is in offroad.
				this.b_offroadEnable = true;													//True when player can be slowed by offroad.
				this.b_reverse = false;															//True when the player is braking or reversing.
			//Respawning:
				this.f_respawnTimer = 0.0;
				this.b_OOB = false;																//True if player touches out-of-bounds detection.
				this.b_idle = false;															//True if the player isn't in control. 
				this.v_respawnPos = new THREE.Vector3(_x, _y + 4, _z);											//Where the player respawns.
				this.f_respawnDirec = 0.0;														//The direction the player faces when respawning.

		//Movement variables:
			//Stats:
				this.f_STAT_SPEED = 3;														//@ 150cc, stat 3 is ~78kmh.
				this.f_STAT_ACCELERATION = 3;
				this.f_STAT_HANDLING = 3;
				this.f_STAT_WEIGHT = 3;
				this.f_STAT_MINITURBO = 3;
				this.f_STAT_TRACTION = 3;
			//Speed & acceleration:
				this.int_CC = window.int_CC;	
						this.f_BASE_MAX_SPEED = .0043 * this.int_CC + 0.105 + this.f_STAT_SPEED * .01;	//The player's max speed.	
				this.f_maxSpeed = this.f_BASE_MAX_SPEED;										//The current max speed.
				this.f_speed = 0.0;																//The current amount the player moves forwards per frame.
				this.f_pushedBack = 1.0;													//Equals negative when player is rebounding from a wall or player collision.
				this.v_pushForward = new THREE.Vector3(0,0,0);								//How much a player gets pushed by another player by collisions.
				this.f_pushedDirec = 0.0;													//Direction the player gets pushed.
				this.f_BASE_ACCELETATION = this.f_STAT_ACCELERATION * 0.0017;
				this.f_acceleration = this.f_BASE_ACCELETATION;								//The amount of speed the player gains while accelerating.
			//Steering:
				this.f_steeringSpeedOffset = 0.001;
				this.b_steeringBounceBack = false;
				this.f_BASE_MAX_TURNING = this.f_STAT_HANDLING * 0.007;											//Max turning speed.
				this.f_maxTurning = this.f_BASE_MAX_TURNING;
				this.f_turning = 0.0;															//The amount the player rotates per frame.
				this.f_turningDirec = 0;
			//Drifting:
				this.f_driftingDirec = 0;
				this.f_MAX_DRIFT_SLIDE = 0.55;												//Modifier for how much player slides when starting a drift (multiplied by f_speed).
				this.f_maxDriftSlideHit = false;												//Used to add an ease-in to drift sliding.
				this.f_driftSlideDecrement = 0.004;												//How quickly the slide goes away during a drift.
				this.f_driftSlideMin = 0.01;													//Minimum slide during a drift (varies depending on directoin).
				this.f_driftSlide = this.f_driftSlideMin;											//How much player initially slides during a drift.
				this.f_minBrakeDriftSpd = 0.3;													//Player has to be going faster than this speed to brake-drift.
			//Mini-turbos / speed boosts:
				this.f_MTcharge = 0.0;															//Float that increases the longer a mini-turbo is charged.
				this.str_MT = "";																//Equals "MT#" when a mini-turbo is charged (# being the level of MT).
				this.f_speedBoost = 0.0;														//Additional speed from a boost or mini-turbo.
				this.f_speedBoostTimer = 0.0;													//How long a speed boost lasts.
				this.cameraRef = a_CAMERAS[this.int_PLAYER_NUM];
				this.f_FOV = this.cameraRef.fov;
				this.f_baseFOV = this.cameraRef.fov;

				//Adjusting FOV for 2-player vertical split-screen:
				if(a_INPUTS.length == 2){
					this.f_baseFOV = this.f_baseFOV + 10;
					this.cameraRef.fov = this.f_baseFOV;
					this.cameraRef.updateProjectionMatrix();
				}


		//For checking laps:
			this.b_finished = false;														//True if the player has completed all the laps.
			this.b_inOrder = true;															//True if the player is passing the key checkpoints in order.
			this.int_NUM_LAPS = _int_numLaps;													//Total # of laps.
			this.int_lap = 1;																//This player's current lap.
			this.int_lapProgress = 0;													//Number of checkpoints passed in the current lap.
			this.int_totalProgress = 0;													//Total number of checkpoints passed in the race.
			this.int_NUM_CHECKS = _numChecks;														//Total # of checkpoints.
			
			this.int_NUM_KEYS = _numKeys;														//Total # of key checkpoints.
			this.int_keysPassed = 0;														//Number of key checkpoints passed.
			this.int_expectedKey = 0;														//Index of the next expected key checkpoint.
			this.int_lastKey = -1;															//Index of the last key checkpoint passed.
			

		//HUD variables:
			this.p_hudLaps = document.getElementById(`p_laps${this.int_PLAYER_NUM}`);
			if(window.int_gameMode > 0){
				this.p_hudLaps.innerHTML = "LAP " + this.int_lap + " / " + this.int_NUM_LAPS;
			}
			this.p_hudSpd = document.getElementById(`p_spd${this.int_PLAYER_NUM}`);
			this.p_hudFinish = document.getElementById(`p_finish${this.int_PLAYER_NUM}`);
		
			this.str_speedometerTextColor = "white";
			this.str_speedometerBorderColor = "black";
			this.str_lastTextColor = "";

			this.str_spd = '';
			this.str_lastSpd = '';
	}
	
	//Function for player input and movement:
	fn_play(worldOctree, offroadOctree, _int_frames){		
		const input = a_INPUTS[this.int_PLAYER_NUM];
		const f_cosY = Math.cos(this.player.rotation.y);
		const f_sinY = Math.sin(this.player.rotation.y);
		const camera = this.cameraRef;

		//Cache input reads once per frame instead of calling these repeatedly below:
		const b_holdForward = input.fn_hold_forward(this.b_idle);
		const b_holdBack = input.fn_hold_back(this.b_idle);
		const b_holdLeft = input.fn_hold_left(this.b_idle);
		const b_holdRight = input.fn_hold_right(this.b_idle);
		const b_holdItem = input.fn_hold_item(this.b_idle);
		const b_holdRear = input.fn_hold_rear(this.b_idle);
		const b_holdAccelerate = input.fn_hold_accelerate(this.b_idle);
		const b_holdDrift = input.fn_hold_drift(this.b_idle);
		const b_pressDrift = input.fn_press_drift(this.b_idle);

		if(input.fn_press_fly(this.b_idle) && (window.b_debug || window.int_gameMode == 0)){
			var infoParagraph = document.getElementById("info");
			if(this.b_flying){
				//infoParagraph.innerHTML = "Use Space to accelerate, WASD to steer, & J to drift/brake.<br /> Press f to toggle free cam.";
				infoParagraph.innerHTML = "";
				this.b_flying = false;
			}
			else{
				this.b_flying = true;
				infoParagraph.innerHTML = "Use A to ascend, B to descend. Use LT or X to rotate.<br /> Free cam mode.";
				this.f_speed = 0.0;
				camera.rotation.set(0,0,0);
				//camera.position.set( -54, 120, 114 );
				//camera.lookAt(-40, 0, -20);
			}
		}
		
		if(this.b_flying){
			//Horizontal movement:
				if(b_holdForward){
					//camera.position.z -= 1;
					this.player.position.z -= f_cosY * this.f_flySpd;
					this.player.position.x -= f_sinY * this.f_flySpd;
				}
				if(b_holdBack){
					//camera.position.z += 1;
					this.player.position.z += f_cosY * this.f_flySpd;
					this.player.position.x += f_sinY * this.f_flySpd;
				}
				if(b_holdLeft){		//Slide camera left.
					//camera.rotation.y += .02;
					this.player.position.z += f_sinY * this.f_flySpd;
					this.player.position.x -= f_cosY * this.f_flySpd;
				}
				if(b_holdRight){		//Slide camera right.
					//camera.rotation.y -= .02;
					this.player.position.z -= f_sinY * this.f_flySpd;
					this.player.position.x += f_cosY * this.f_flySpd;
				}
			//Rotation:	
				if(b_holdItem){
					this.player.rotation.y += this.f_BASE_MAX_TURNING + .005;
				}
				if(b_holdRear){
					this.player.rotation.y -= this.f_BASE_MAX_TURNING + .005;
				}
			
			//Vertical movement:
				if(b_holdAccelerate){
					this.player.position.y += .4;
				}
				if(b_holdDrift){
					this.player.position.y -= .4;
				}
		}
		else{			
			this.b_standstill = false;
			
			//Drifting:
				if(b_holdDrift && b_holdAccelerate){
					if(this.f_speed <= 0.05	){
						this.b_standstill = true;
						
						if(this.f_speed < 0){
							this.f_speed += 0.001;
						}
					}
					
					//If holding left or right after landing, start drift:
					if(this.b_firstLanded && this.f_turningDirec != 0){
						this.b_drifting = true;	//Put this line back in the above if statement if there are drifting issues.
					}
					//Else, start charge-jump:
					else if(this.b_firstLanded && !this.b_standstill){
						this.b_chargingJump = true;
					}

					if(this.f_driftingDirec == 0){
						this.f_driftingDirec = this.f_turningDirec
					}
				}
				//Cases where a drift ends:
				else if(!b_holdDrift){
					this.b_drifting = false;
				}
				//Min speed for brake-drifting:
				if(!b_holdAccelerate && this.f_speed < this.f_minBrakeDriftSpd){
					this.b_drifting = false;
					this.b_chargingJump = false;
				}

				//Jumping:
					if(this.b_onGround || (this.b_jumping && this.player.position.y - this.f_jumpStartY < 0)){
						this.b_jumping = false;
						//this.b_chargeJumping = false;		//Uncomment this (and comment out the other b_chargeJumping = false statement) to make it so b_chargeJumping stays true during the entire air time.
						this.f_jumpStartY = 0.0;
					}
					//Start of a jump:
					if(b_holdAccelerate && b_pressDrift && this.b_onGround && this.f_speed > 0.05){
						this.f_gravity = this.f_jumpHeight;
						this.b_jumping = true;
						this.f_jumpStartY = this.player.position.y;
						this.b_drifting = false;
					}
				//Charge-jumping:
				if(this.b_chargingJump){
					this.f_jumpCharge += 0.025;
				}
				if(!b_holdDrift && this.f_jumpCharge > 1.0){
					if(this.b_onGround){
						this.f_gravity = this.f_chargeJumpHeight;
					}
					else{
						this.f_gravity = this.f_chargeJumpHeight *.9;
					}
					this.f_jumpCharge = 0.0;
					this.b_chargeJumping = true;
				}
				//Cases where a charge-jump ends:
				else if(!b_holdDrift){
					this.b_chargingJump = false;
					this.f_jumpCharge = 0.0; 
				}
				
			
			//Accelerating:
				if(this.b_onGround || this.f_gravity < 0){
					if(b_holdAccelerate && !this.b_standstill){
						this.f_speed += this.f_acceleration;
						this.b_reverse = false;
					}
					else if(!b_holdAccelerate && b_holdDrift){	//Brake/reverse
						this.f_speed -= 0.015;
						this.b_reverse = true;
					}
					else
					{
						this.f_speed -= 0.006;
						this.b_reverse = false;
					}
				}
				//In the air:
				else if(!this.b_onGround){		
					//Lose speed when in the air (not jumping):
					this.f_speed -= 0.0012;
				}
			//Limits on speed:
				//Hit max speed:
				if(this.f_speed > this.f_maxSpeed + this.f_speedBoost)
				{
					this.f_speed = this.f_maxSpeed + this.f_speedBoost;
				}
				//Hit min speed while not in reverse:
				if(this.f_speed < 0 && !b_holdDrift)
				{
					this.f_speed = 0;
				}
				//Standstill:
				if(this.f_speed < 0 && b_holdDrift && b_holdAccelerate)
				{
					this.f_speed = 0;
					this.f_driftingDirec = 0;
				}//Reverse:
				else if(this.f_speed < -0.2 && b_holdDrift){
					this.f_speed = -0.2;
				}
				//When in offRoad:
				if(this.b_inOffroad){
					if(this.f_speed < this.f_BASE_MAX_SPEED / 2){
						this.f_maxSpeed = this.f_BASE_MAX_SPEED / 2;
					}
					else{
						this.f_speed -= this.f_acceleration * 6;
					}
				}
				else{
					this.f_maxSpeed = this.f_BASE_MAX_SPEED;
				}

				//Update HUD for speed (using if statements so DOM isn't updated when is doesn't need to):
				this.str_spd = (Math.abs(Math.trunc(this.f_speed * 100))).toString();
				if(this.str_spd != this.str_lastSpd){
					if(Math.abs(this.f_speed * 100) < 10){
						this.str_spd = "0" + this.str_spd;
					}
					
					this.p_hudSpd.innerHTML = this.str_spd + " kmh";
					this.str_lastSpd = this.str_spd;
				}
				if(this.str_speedometerTextColor !== this.str_lastTextColor) {
					//Adjust HUD color based on MT charge:
					this.p_hudSpd.style.color = this.str_speedometerTextColor;
					this.p_hudSpd.style.textShadow = `-.18vw -.18vw 0 ${this.str_speedometerBorderColor},
													.18vw -.18vw 0 ${this.str_speedometerBorderColor},
													-.18vw  .18vw 0 ${this.str_speedometerBorderColor},
													.18vw  .18vw 0 ${this.str_speedometerBorderColor}`
				}

			//Steering:	
				if((b_holdLeft || b_holdRight) && (this.f_speed !== 0 || this.b_standstill)){
					if(b_holdLeft){
						this.f_turningDirec = 1;
					}
					if(b_holdRight){
						this.f_turningDirec = -1;
					}
					
					this.f_turning += 0.0013 * this.f_turningDirec;
					//Limit how far player can turn:
						//Player can turn full range when not drifitng, but only this.f_driftingDirec to 0 while drifting.
						if( !this.b_standstill){
							if(this.f_driftingDirec == 1 && this.f_turning < 0){
								this.f_turning = 0;
							}
							if(this.f_driftingDirec == -1 && this.f_turning > 0){
								this.f_turning = 0;
							}
						}
						//Force a decay towards 0 to prevent 'snapping' after a drift:
						this.f_turning = Math.max(
							-this.f_maxTurning,
							Math.min(this.f_turning, this.f_maxTurning)
						);
					
					//Loss of speed when turning (doesn't occur during a speed boost):		(NEED TO MAKE THIS ACCOUNT FOR CC)
					if(!this.b_drifting && this.b_onGround && this.f_speedBoostTimer == 0.0 && !this.b_hitWall){
						if(this.b_steeringBounceBack && this.f_acceleration + this.f_steeringSpeedOffset < this.f_BASE_ACCELETATION){
							this.f_acceleration += this.f_steeringSpeedOffset;
							this.f_steeringSpeedOffset *= 1.00075;						//% of the value that decays.
						}
						else{
							this.f_acceleration -= this.f_steeringSpeedOffset;
							this.f_steeringSpeedOffset *= .003;						//% of the vaue that decays.
						}
						if(this.f_steeringSpeedOffset < 0.00005){
							this.b_steeringBounceBack = true;
						}
					}
					else{	//Account for when user starts drifting while turning:
						this.f_acceleration = this.f_BASE_ACCELETATION;
					}
				}
				else{	//When not steering:
					this.f_turningDirec = 0;
					if(this.f_turning < 0.001 && this.f_turning > -0.001){	//If steering speed is close to 0, make it 0.
						this.f_turning = 0;
					}
					else if (this.f_turning > 0){	//Else, decrease steering rate.
						this.f_turning -= 0.0018;
					}
					else if (this.f_turning < 0){
						this.f_turning += 0.0018;
					}
					this.b_steeringBounceBack = false;
					this.f_steeringSpeedOffset = this.f_speed * 0.01;
					this.f_acceleration = this.f_BASE_ACCELETATION;
				}
						
			//Steering while drifting:
				if(this.b_drifting){		
					//If drifitng, can turn tighter.
					this.f_maxTurning = this.f_BASE_MAX_TURNING * 1.1; 
					
					//Slide-ing:
					this.player.position.z -= f_sinY * this.f_driftSlide * this.f_driftingDirec;
					this.player.position.x += f_cosY * this.f_driftSlide * this.f_driftingDirec;
					
					//When steering into drift, have player slide less & charge MT faster:
					if(this.f_turningDirec == this.f_driftingDirec){	//Holding into drift.
						this.f_driftSlideMin = 0.01;
						this.f_MTcharge += 0.025;
					}
					else if(this.f_turningDirec == 0){					//Not holding a direction.
						this.f_driftSlideMin = 0.15;
						this.f_MTcharge += 0.012;
					}
					else{												//Holding away from drift.
						this.f_driftSlideMin = 0.25;
						this.f_MTcharge += 0.004;
					}

					//If max drift slide hasn't been hit yet, ease into the max drift slide.
					if(!this.f_maxDriftSlideHit){
						this.f_driftSlide += 0.05;
						if(this.f_driftSlide > this.f_MAX_DRIFT_SLIDE * this.f_speed){
							this.f_driftSlide = this.f_MAX_DRIFT_SLIDE * this.f_speed;
							this.f_maxDriftSlideHit = true;
							//SIDE MAX HIT here
						}
					}
					//Else, trend drift slide towards minimum drift slide:
					else{
						if(this.f_driftSlide > this.f_driftSlideMin){
							this.f_driftSlide -= this.f_driftSlideDecrement;
						}
						else if(this.f_driftSlide < this.f_driftSlideMin){
							this.f_driftSlide += this.f_driftSlideDecrement;
						}
					}
				}
				else if(this.b_standstill){
					this.f_maxTurning = this.f_BASE_MAX_TURNING * 1.2; 
					
					//Standstill mini-turbos:
					if(this.f_turningDirec != 0){
						this.f_MTcharge += 0.015;
					}
					else{
						this.f_MTcharge += 0.011;
					}
				}
				else{
					//Apply mini-turbo:
					if(this.str_MT && b_holdAccelerate){
						this.fn_addSpeedBoost(this.str_MT);
						this.str_MT = "";
					}

					//Reset drifting variables:
					this.fn_stopDrifting();
				}

			//Mini-turbo charge & charge-jump:
				if(this.f_MTcharge > 4.0){
					this.str_MT = "MT3";
					this.str_speedometerTextColor = "violet";
					this.str_speedometerBorderColor = "pink";
				}
				else if(this.f_MTcharge > 2.0){
					this.str_MT = "MT2";
					this.str_speedometerTextColor = "#E68B00";
					this.str_speedometerBorderColor = "#FFD091";
				}
				else if(this.f_MTcharge > 1.0){
					this.str_MT = "MT1";
					this.str_speedometerTextColor = "#72B5FC";
					this.str_speedometerBorderColor = "cyan";
				}
				else if(this.f_jumpCharge > 1.0){
					this.str_speedometerTextColor = "lightgray";
					this.str_speedometerBorderColor = "white";
				}
				else{
					this.str_speedometerTextColor = "white";
					this.str_speedometerBorderColor = "black";
				}
			//Speed boosts & mini-turbos:
				if(this.f_speedBoostTimer > 0.0){
					this.f_speedBoostTimer -= 1.0/60.0;

					//Also adjust camera FOV:
					if(this.f_speedBoost >= .2 && this.cameraRef.fov < this.f_FOV){
						this.cameraRef.fov += 2;
						this.cameraRef.updateProjectionMatrix();
					}

					//Make it so acceleration doesn't depend on stats during a speed boost.
				}
				else if(this.f_speedBoost > 0.0){
					this.f_speedBoost -= 0.01 / this.f_STAT_WEIGHT;	//The larger weight, the longer a speed boost is maintained.
				
					if(this.cameraRef.fov > this.f_baseFOV){
						this.cameraRef.fov -= 0.5;
						this.cameraRef.updateProjectionMatrix();
					}
				}
				else{
					this.f_speedBoost = 0.0;
					this.f_speedBoostTimer = 0.0;
					this.b_offroadEnable = true;
				}
			
			//Gravity:
				this.f_gravity += this.f_GRAVITY_RATE;
				if(this.f_gravity > 1.05){
					this.f_gravity = 1.05;
				}
				if(this.f_gravity > 0.0){
					this.b_chargeJumping = false;
				}

			//Actually move the player (if speed is high enough, increment in smaller steps at a time to avoid clipping):
			this.b_inOffroad = false;		//This needs to be here.
			this.int_substeps = 1;
			if(this.f_speed > 1.5){
				this.int_substeps = 3;
			}
			else if(this.f_speed > .7 || this.f_gravity > .7 || this.v_pushForward.length() > .7){
				this.int_substeps = 2;
			}
			const f_divSubsteps = 1 / this.int_substeps;		//Equals 1 if 1 substep, equals 1/2 if 2 substeps, equals 1/3 if 3 substeps, etc.
			for (let i = 1; i <= this.int_substeps; i++) {
				
				//Update player's position:
					this.player.position.x -= f_sinY * this.f_speed * this.f_pushedBack * (f_divSubsteps);
					this.player.position.z -= f_cosY * this.f_speed * this.f_pushedBack * (f_divSubsteps);

					this.player.position.y -= this.f_gravity * (f_divSubsteps);
					this.player.rotation.y += this.f_turning * (f_divSubsteps);	//turning

					//Apply push to the player from other players:
					this.player.position.addScaledVector(this.v_pushForward, f_divSubsteps);
					
				//Update world collider:
					this.worldCollider.start.set(this.player.position.x, this.player.position.y, this.player.position.z);
					this.worldCollider.end.set(this.worldCollider.start.x, this.worldCollider.start.y + this.f_radius * .35, this.worldCollider.start.z);

					//Decay push back:
					if(this.f_pushedBack >= 1.0){
						this.f_pushedBack = 1.0;
					}
					else{
						this.f_pushedBack += 0.07;
					}
					//Decay push forwards:						//v_pushForward.set
					if(this.v_pushForward.length() > 0.02){		//Note: use LENGTH instead of just x or y to prevent directional bias!
						this.v_pushForward.multiplyScalar(0.95);
					}
					else{
						this.v_pushForward.x = 0;
						this.v_pushForward.z = 0;
					}
					
					
					this.b_onGround = false;
					this.b_firstLanded = false;

				//Collision checks:
					this.fn_offroad(offroadOctree, _int_frames, true);
					this.fn_collision(worldOctree);

			}

			this.boundingSphere.center.copy(this.player.position);

			//Out of bounds check:
			if((this.b_OOB || this.player.position.y < 0 || this.player.position.z < -230 || this.player.position.z > 145) && !this.b_idle){
				this.f_respawnTimer = 2.0;
			}

			//Respawning:
			if(this.f_respawnTimer > 0.0){		
				this.f_respawnTimer -= 1/60;
				this.b_idle = true;

				if(this.f_respawnTimer <= 0.0){
					this.f_respawnTimer = 0.0;
					this.b_idle = false;
				}
				else if(this.f_respawnTimer < 1.0){
					//Update player position:
					this.player.position.copy(this.v_respawnPos);
					this.player.rotation.y = this.f_respawnDirec;
					this.b_OOB = false;

					this.f_speed = 0.0;
					this.f_gravity = this.f_BASE_GRAVITY;
				}
			}
		}
		
	}
	
	fn_hitWall(_depth){
		this.player.position.x -= _depth;
	}
	
	fn_setPosition(_x, _y, _z){
		this.player.position.x = _x;
		this.player.position.y = _y;
		this.player.position.z = _z;
		
		this.worldCollider.start.x = _x;
		this.worldCollider.start.y = _y;
		this.worldCollider.start.z = _z;
		//this.playerCollider.end.x = _x;
		//this.playerCollider.end.y = _y;
		//this.playerCollider.end.z = _z;
	}
	
	//Checks for contact with off-road:
	fn_offroad(offroadOctree, _int_frames, _enabled){
		if(!offroadOctree) return;
		if(_int_frames % 2 != 0 ) return;	//Only check every other frame.
		this.result = offroadOctree.capsuleIntersect( this.worldCollider );
		
		if (this.b_offroadEnable && this.result.depth > 0 && _enabled) {
			this.b_inOffroad = true;
		}
	}
	
	//Checks for collisions with course and environment:
	fn_collision(worldOctree){
		if(!worldOctree) return;
		this.result = worldOctree.capsuleIntersect( this.worldCollider );

		if ( this.result ) {
			//console.log("Depth x = " + this.result.normal.x + ", y = " + this.result.normal.y + ", z = " + this.result.normal.z);

			if ( this.result.depth > 1e-10 ) {
				
				this.worldCollider.translate( this.result.normal.multiplyScalar( this.result.depth ) );
				this.player.position.set(this.worldCollider.start.x, this.worldCollider.start.y, this.worldCollider.start.z);
				
				
				this.f_gravity = this.f_BASE_GRAVITY;
				this.b_onGround = true;
			}
			
			//Wall collision:
			if(Math.abs(this.result.normal.x) > 0.3 || Math.abs(this.result.normal.z) > 0.3) {
				this.b_hitWall = true;
			}
		}
	}

	//Use this for checking for non-octree collisions:
		fn_meshCollisionCheck(otherPlayer){
			if(this.boundingSphere.intersectsSphere(otherPlayer.fn_getBoundingSphere())){
				//console.log(`Player #${this.int_PLAYERNUM} collided with player #${this.fn_getPlayerIndex()}`);
				this.fn_DSOC(otherPlayer);
				return true;
			}
			else{
				return false;
			}
			//return false;
		}

	//If another player collides with this player, push them back:
	fn_DSOC(_player){
		//Removing the overlap,
		const f_delta = new THREE.Vector3().subVectors(
			this.boundingSphere.center,
			_player.fn_getBoundingSphere().center
		);
		const overlap = (this.boundingSphere.radius + _player.fn_getBoundingSphere().radius) - f_delta.length();
		f_delta.normalize();
		this.player.position.addScaledVector(f_delta, overlap * 0.5);
		_player.fn_getPlayer().position.addScaledVector(f_delta, -overlap * 0.5);
		
		//Then apply the bounce to the opposing driver,
		_player.fn_setHitWall(true, true);
		
		//And then this driver gets pushed back too in the opposite direction of the pusher:
		var f_push = .1 + (_player.fn_getSpd() - this.f_speed);									//Adjust this to adjust how far people get bounced.
		if(f_push < 0) f_push = 0;
		if(_player.fn_getReverse()) f_push *= -1;
		this.v_pushForward.copy(f_delta).multiplyScalar(f_push);

		return true;
	}
	
	
	fn_update(_int_frames){
		const input = a_INPUTS[this.int_PLAYER_NUM];
		const f_cosY = Math.cos(this.player.rotation.y);
		const f_sinY = Math.sin(this.player.rotation.y);
		const camera = this.cameraRef;

		//Code to run when wall is hit:
			if(this.b_hitWall){
				this.f_pushedBack = -this.f_speed;

				if(this.b_hitPlayer){
					this.f_pushedBack += - 0.6;
				}
				else{
					this.fn_stopDrifting();
				}

				//Reduce less speed from a collision when in a speed boost:
				if(this.f_speedBoostTimer == 0.0){
					this.f_speed = this.f_speed / 2;	
				}
				else{
					this.f_speed -= 0.2;
				}

				if(this.f_speed < 0){
					this.f_speed = 0;
				}
				
				//console.log("Wall collision detected!");
				this.b_hitWall = false;
				this.b_hitPlayer = false;
			}
		
		if(b_showCapsule){
			//Update collision capsule visulizers:
				this.capsuleMesh.position.copy(new THREE.Vector3().addVectors(this.worldCollider.start, this.worldCollider.end).multiplyScalar(0.5));
				this.startVis.position.set(this.worldCollider.start.x, this.worldCollider.start.y, this.worldCollider.start.z);
				this.endVis.position.set(this.worldCollider.end.x, this.worldCollider.end.y, this.worldCollider.end.z);
		}
		
		//Update the sprite/model positions:
		for(const obj_character of this.a_characters){
			obj_character.fn_update(this, this.player.position, this.player.rotation.y, this.f_driftingDirec, input, this.b_idle, _int_frames);
		}
			
			this.obj_kart.fn_setPos(new THREE.Vector3(
				this.player.position.x, 
				this.player.position.y - .64 * this.f_scale, 
				this.player.position.z
			));
			this.obj_kart.fn_update(input, this.player.rotation.y, this.b_idle, this.f_driftingDirec, _int_frames);
				
		//Update camera's position:
		if(!window.b_birdEye || this.b_flying){
			this.f_posY = this.player.position.y + 2;
			this.f_lookY = this.player.position.y + 1.15;
			if(this.b_jumping){
				this.f_posY = this.f_jumpStartY + 2;
				this.f_lookY = this.f_jumpStartY + 1.15;
			}
			
			//Rear view:
			if(input.fn_hold_rear(this.b_idle) && !this.b_flying){
				if(this.f_respawnTimer < 1.0){
					camera.position.set(this.player.position.x - 4.5 * f_sinY, this.f_posY, this.player.position.z - 4.5 * f_cosY);
				}
				camera.lookAt( this.player.position.x, this.f_lookY, this.player.position.z );
			}
			else{
				if(this.f_respawnTimer < 1.0){
					camera.position.set(this.player.position.x + 5.75 * f_sinY, this.f_posY, this.player.position.z + 5.75 * f_cosY);
				}
				camera.lookAt( this.player.position.x, this.f_lookY, this.player.position.z );
			}
		}
		else{
			camera.position.set(0, 420, -30);
			camera.lookAt(0, 0, -30);
		}
		
		if(this.b_onGround && !this.b_prevOnGround){
			this.b_firstLanded = true;
		}
		this.b_prevOnGround = this.b_onGround;
	}
	
	fn_getPlayer(){
		return this.player;
	}

	fn_getPlayerIndex(){
		return this.int_PLAYER_NUM;
	}

	fn_getPos(){
		return this.player.position;
	}

	fn_getRotation(){
		return this.player.rotation.y;
	}

	fn_getSpd(){
		return this.f_speed;
	}

	fn_getReverse(){
		return this.b_reverse;
	}
	
	fn_getBoundingSphere(){
		if(this.boundingSphere){
			return this.boundingSphere;
		}
		
		return false;
	}

	fn_getCapsuleMesh(){
		if(b_showCapsule){
			return this.capsuleMesh;
		}
		else{
			return false;
		}
	}

	fn_setOOB(_b_newVal){
		this.b_OOB = _b_newVal;
	}

	fn_setHitWall(_b_newHitWall, _b_newHitPlayer){
		this.b_hitWall = _b_newHitWall;
		this.b_hitPlayer = _b_newHitPlayer
	}
	
	fn_checkpointUpdate(_checkpoint){
		if(this.b_OOB) return;
		
		//Update respawn variables:
		this.v_respawnPos = _checkpoint.fn_getPos();	
		this.f_respawnDirec = _checkpoint.fn_getRotation().y - 1.5708;

		if(this.int_lapProgress + 30 >= _checkpoint.fn_getID() && this.b_inOrder){	//Doesn't count checkpoints that are too far ahead.
			this.int_lapProgress = _checkpoint.fn_getID();
			this.int_totalProgress = _checkpoint.fn_getID() + this.int_NUM_CHECKS * (this.int_lap - 1);
		}

		if(window.b_debug){
			const p_lapProgress = document.getElementById("p_check");
			p_lapProgress.innerHTML = "Lap Progress: " + this.int_lapProgress;
			const p_totalProgress = document.getElementById("p_name");
			p_totalProgress.innerHTML = "Total Progress: " + this.int_totalProgress;
		}

		if(_checkpoint.fn_getKey() && this.int_lastKey != _checkpoint.fn_getID()){
			if(_checkpoint.fn_getID() == this.int_expectedKey){
				this.int_expectedKey = _checkpoint.fn_getNextKey();
				//console.log("Next key is " + this.int_expectedKey);
				this.b_inOrder = true;
				this.int_keysPassed += 1;
				
			}
			else{
				if(this.int_keysPassed > 0){	//If passed a checkpoint after first going to the goal:
					this.int_keysPassed -= 1;
					this.int_expectedKey = this.int_lastKey;
				}
				else{							//If passed a checkpoint before first going to the goal:
					this.int_expectedKey = 0;
					this.int_lastKey = -1;
					this.int_expectedKey = 0;			
				}
				
				//console.log("Out of order. Next key is " + this.int_expectedKey);
				this.b_inOrder = false;
			}
			//console.log("Last key: " + this.int_lastKey);
			
			//For incremementing laps:
			if(_checkpoint.fn_getGoal() && this.int_keysPassed >= this.int_NUM_KEYS && window.int_gameMode > 0){
				this.int_keysPassed = 1;
				this.int_lap += 1;
				
				if(this.int_lap <= this.int_NUM_LAPS && window.int_gameMode > 0){
					this.p_hudLaps.innerHTML = "LAP " + this.int_lap + " / " + this.int_NUM_LAPS;
				}
				else{
					this.b_finished = true;
					this.b_idle = true;
					this.p_hudFinish.innerHTML = "FINISH";
				}
			}   
			//console.log("Keys passed: " + this.int_keysPassed + "\n------------");
			
			this.int_lastKey = _checkpoint.fn_getID();
		}
	}

	fn_isFinished(){
		return this.b_finished;
	}

	//Resets all variables related to drifting. Call this when a drift ends:
	fn_stopDrifting(){
		this.b_drifting = false;
		
		this.f_maxTurning = this.f_BASE_MAX_TURNING;
		this.f_driftSlide = this.f_driftSlideMin;
		this.f_maxDriftSlideHit = false;
		this.f_driftingDirec = 0;
		this.f_MTcharge = 0.0;
		this.str_MT = "";
	}

	//Roll the item roulette:
	fn_getItem(){
		if(this.a_characters[0].fn_getItemSlots().fn_canGetItem()){
			this.a_characters[0].fn_getItemSlots().fn_roll();
		}
	}

	//Changes to state:
	fn_addSpeedBoost(_str_power, _f_duration){
		if(_str_power.slice(0, -1) == "MT"){
			this.f_speedBoost += .07;
			this.f_speedBoost += Number(_str_power.at(-1)) * 0.01;
			this.f_FOV = this.f_baseFOV;

			if(_str_power == "MT1"){
				this.f_speedBoostTimer = .15;
			}
			else if(_str_power == "MT2"){
				this.f_speedBoostTimer = .7;
			}
			else if(_str_power == "MT3"){
				this.f_speedBoostTimer = 1.3;
			}
			else if(_f_duration){
				this.f_speedBoostTimer = _f_duration;
			}

			//Change speed boost duration based on mini-turbo stat:
			this.f_speedBoostTimer += this.f_STAT_MINITURBO / 15;
		}
		else if(_str_power == "T"){
			this.f_speedBoost += .2;
			this.b_offroadEnable = false;
			this.f_FOV = this.f_baseFOV + 15;
			
			if(!_f_duration){
				this.f_speedBoostTimer = 1.3;
			}
			else{
				this.f_speedBoostTimer = _f_duration;
			}
		}

		//Cap on max speed boost and duration:
		if(this.f_speedBoost > .2){
			this.f_speedBoost = .2;
		}
		if(this.f_speedBoostTimer > 1.3){
			this.f_speedBoostTimer = 1.3;
		}

		this.f_speed += this.f_maxSpeed * .9;
	}
}