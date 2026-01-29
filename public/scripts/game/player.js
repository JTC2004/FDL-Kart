import * as THREE from 'three';
import { Capsule } from 'three/addons/math/Capsule.js';
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';
//import InputHandler from "./inputKB.js";

//Declaring constants:
	const b_showCapsule = false;

	const f_baseGravity = new WeakMap();
	const f_gravityRate = new WeakMap();
	const int_CC = new WeakMap();

	const f_stat_speed = new WeakMap();
	const f_stat_acceleration = new WeakMap();
	const f_stat_handling = new WeakMap();
	const f_stat_weight = new WeakMap();
	const f_stat_miniTurbo = new WeakMap();
	const f_stat_traction = new WeakMap();

	const f_baseMaxSpeed = new WeakMap();
	const f_baseMaxTurning = new WeakMap();
	const f_baseAcceletation = new WeakMap();

	const int_numLaps = new WeakMap();
	const int_numChecks = new WeakMap();
	const int_numKeys = new WeakMap();
	const f_maxDriftSlide = new WeakMap();

export default class Player{

	constructor(_scene, [_x, _y, _z], _scale, _numChecks, _numKeys, _int_numLaps){
			this.f_radius = _scale * .7;													//Radius of the player's collisions.
			this.f_scale = _scale;															//The scale of the player.
		//Add the player to the scene:
			this.playerGeometry = new THREE.SphereGeometry( this.f_radius, 8, 8);				
			this.playerMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
			this.player = new THREE.Mesh( this.playerGeometry, this.playerMaterial );		//Player collision with objects. Represents the player's XYZ (possible change XYZ to be separate like objects).
			_scene.add( this.player );
			this.player.position.set(_x, _y, _z);
			this.player.visible = false;

		//Collision capsule:
			this.worldCollider = new Capsule( new THREE.Vector3( _x, _y, _z ), new THREE.Vector3( _x, _y + this.f_radius, _z ), this.f_radius );	//Collider with the map.
			this.worldCollider.visible = true;
		if(b_showCapsule){
			//Visualize collision capsule:
				this.capsuleGeom = new THREE.CapsuleGeometry(this.f_radius, this.f_radius * .35, 8, 16);
				this.capsuleMat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
				this.capsuleMesh = new THREE.Mesh(this.capsuleGeom, this.capsuleMat);			//Mesh to visualize the collision capsule.
				_scene.add(this.capsuleMesh);
			//Visualize where collision capsule top and bottom are:
				this.visGeometry = new THREE.SphereGeometry( .1, 6, 6);	
				this.startVis = new THREE.Mesh( this.visGeometry, new THREE.MeshPhongMaterial( { color: 0x00ff00 } ));
				this.endVis = new THREE.Mesh( this.visGeometry, this.playerMaterial );
				_scene.add(this.startVis);
				_scene.add(this.endVis);
		}
		
		//Code for player sprite:
			this.spriteMap = new THREE.TextureLoader().load( 'assets/sprites/gameplay/Placeholder.png' ); //Load the image
			this.spriteMaterial = new THREE.SpriteMaterial( { 
				map: this.spriteMap, 
				transparent: true,
				alphaTest: 0.75,				//Helps discard transparent pixels.
				color: 0xffffff
			});
			this.sprite = new THREE.Sprite( this.spriteMaterial );							//The sprite itself.
			this.sprite.scale.set(_scale * 1.5, _scale * 1.5, _scale * 1.5);
			this.sprite.position.set(_x, _y, _z);
			_scene.add( this.sprite );
		
		//Player states:
			//Flying:
				this.b_flying = false;															//When true, player is in free-cam mode.
				this.int_cameraSpd = .75;														//Speed the camera moves while flying.
			//Jummping & falling:
				f_gravityRate.set(this, 0.02);
				f_baseGravity.set(this, .14);
				this.f_gravity = f_baseGravity.get(this);										//Rate the player moves down per frame.
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
				this.b_onGround = false;														//Player is on ground when true.
				this.b_prevOnGround = false;
				this.b_firstLanded = false;														//Equals true ONLY the first frame player lands on ground.
			//Drifting:
				this.b_drifting = false;														//True when player is drifting.
				this.b_prevBrakeDrifting = false;
				this.b_standstill = false;														//True when player is standstill drifitng.
				this.b_inOffroad = false;														//True when collider is in offroad.
				this.b_reverse = false;															//True when the player is braking or reversing.
			
		//Movement variables:
			//Stats:
				f_stat_speed.set(this, 3);														//@ 150cc, stat 3 is ~78kmh.
				f_stat_acceleration.set(this, 3);
				f_stat_handling.set(this, 3);
				f_stat_weight.set(this, 3);
				f_stat_miniTurbo.set(this, 3);
				f_stat_traction.set(this, 3);
			//Speed & acceleration:
				int_CC.set(this, 150);	
				f_baseMaxSpeed.set(this, .0043 * int_CC.get(this) + 0.105 + f_stat_speed.get(this) * .01);	//The player's max speed.	
				this.f_maxSpeed = f_baseMaxSpeed.get(this);										//The current max speed.
				this.f_speed = 0.0;																//The current amount the player moves forwards per frame.
				f_baseAcceletation.set(this, f_stat_acceleration.get(this) * 0.0017);
				this.f_acceleration = f_baseAcceletation.get(this);								//The amount of speed the player gains while accelerating.
			//Steering:
				this.f_steeringSpeedOffset = 0.001;
				this.b_steeringBounceBack = false;
				f_baseMaxTurning.set(this, f_stat_handling.get(this) * 0.007);											//Max turning speed.
				this.f_maxTurning = f_baseMaxTurning.get(this);
				this.f_turning = 0.0;															//The amount the player rotates per frame.
				this.f_turningDirec = 0;
			//Drifting:
				this.f_driftingDirec = 0;
				f_maxDriftSlide.set(this, 0.55);												//Modifier for how much player slides when starting a drift (multiplied by f_speed).
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
			
		//For checking laps:
			this.b_done = false;														//True if the player has completed all the laps.
			this.b_inOrder = true;															//True if the player is passing the key checkpoints in order.
			int_numLaps.set(this, _int_numLaps);													//Total # of laps.
			this.int_lap = 1;																//This player's current lap.
			this.int_courseProgress = 0;													//Number of checkpoints passed.
			int_numChecks.set(this, _numChecks);														//Total # of checkpoints.
			
			int_numKeys.set(this, _numKeys);														//Total # of key checkpoints.
			this.int_keysPassed = 0;														//Number of key checkpoints passed.
			this.int_expectedKey = 0;														//Index of the next expected key checkpoint.
			this.int_lastKey = -1;															//Index of the last key checkpoint passed.
			var lapsParagraph = document.getElementById("p_laps");
			if(window.int_gameMode > 0){
				lapsParagraph.innerHTML = "LAP " + this.int_lap + " / " + int_numLaps.get(this);
			}

		//HUD variables:
			this.str_speedometerTextColor = "gold";
			this.str_speedometerBorderColor = "#d57900";
	}
	
	//Function for player input and movement:
	fn_play(camera, input){
		if(input.fn_press_fly(this.b_done)){
			var infoParagraph = document.getElementById("info");
			if(this.b_flying){
				//infoParagraph.innerHTML = "Use Space to accelerate, WASD to steer, & J to drift/brake.<br /> Press f to toggle free cam.";
				infoParagraph.innerHTML = "";
				this.b_flying = false;
			}
			else{
				this.b_flying = true;
				infoParagraph.innerHTML = "Use Space to ascend, WASD to move, & J to descend.<br /> Press f to toggle free cam.";
				this.f_speed = 0.0;
				camera.rotation.set(0,0,0);
				//camera.position.set( -54, 120, 114 );
				//camera.lookAt(-40, 0, -20);
			}
		}
		
		if(this.b_flying){
			//Horizontal movement:
				if(input.fn_hold_forward(this.b_done)){
					//camera.position.z -= 1;
					camera.position.z -= Math.cos(camera.rotation.y) * this.int_cameraSpd;
					camera.position.x -= Math.sin(camera.rotation.y) * this.int_cameraSpd;
				}
				if(input.fn_hold_back(this.b_done)){
					//camera.position.z += 1;
					camera.position.z += Math.cos(camera.rotation.y) * this.int_cameraSpd;
					camera.position.x += Math.sin(camera.rotation.y) * this.int_cameraSpd;
				}
				if(input.fn_hold_left(this.b_done)){		//Slide camera left.
					//camera.rotation.y += .02;
					camera.position.z += Math.sin(camera.rotation.y) * this.int_cameraSpd;
					camera.position.x -= Math.cos(camera.rotation.y) * this.int_cameraSpd;
				}
				if(input.fn_hold_right(this.b_done)){		//Slide camera right.
					//camera.rotation.y -= .02;
					camera.position.z -= Math.sin(camera.rotation.y) * this.int_cameraSpd;
					camera.position.x += Math.cos(camera.rotation.y) * this.int_cameraSpd;
				}
			//Rotation:	
				if(input.fn_hold_item(this.b_done)){
					camera.rotation.y += f_baseMaxTurning.get(this) + .005;
				}
				if(input.fn_hold_rear(this.b_done)){
					camera.rotation.y -= f_baseMaxTurning.get(this) + .005;
				}
			
			//Vertical movement:
				if(input.fn_hold_accelerate(this.b_done)){
					camera.position.y += .4;
				}
				if(input.fn_hold_drift(this.b_done)){
					camera.position.y -= .4;
				}
		}
		else{			
			this.b_standstill = false;
			
			//Drifting:
				if(input.fn_hold_drift(this.b_done) && input.fn_hold_accelerate(this.b_done)){
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
						//console.log(`f_driftingDirec = ${this.f_driftingDirec},\tf_turningDirec = ${this.f_turningDirec}`);
					}
				}
				//Cases where a drift ends:
				else if(!input.fn_hold_drift(this.b_done)){
					this.b_drifting = false;
				}
				//Min speed for brake-drifting:
				if(!input.fn_hold_accelerate(this.b_done) && this.f_speed < this.f_minBrakeDriftSpd){
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
					if(input.fn_hold_accelerate(this.b_done) && input.fn_press_drift(this.b_done) && this.b_onGround && this.f_speed > 0.05){
						this.f_gravity = this.f_jumpHeight;
						this.b_jumping = true;
						this.f_jumpStartY = this.player.position.y;
						this.b_drifting = false;
					}
				//Charge-jumping:
				if(this.b_chargingJump){
					this.f_jumpCharge += 0.025;
				}
				if(!input.fn_hold_drift(this.b_done) && this.f_jumpCharge > 1.0){
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
				else if(!input.fn_hold_drift(this.b_done)){
					this.b_chargingJump = false;
					this.f_jumpCharge = 0.0; 
				}
				//console.log(`Jumping ${this.b_jumping}, \tJumpOffset ${this.f_jumpOffset}`);
				
			
			//Accelerating:
				if(this.b_onGround || this.f_gravity < 0){
					if(input.fn_hold_accelerate(this.b_done) && !this.b_standstill){
						this.f_speed += this.f_acceleration;
						this.b_reverse = false;
					}
					else if(!input.fn_hold_accelerate(this.b_done) && input.fn_hold_drift(this.b_done)){	//Brake/reverse
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
					
					//console.log("MIDAIR SPEED LOSS");
				}
				//console.log(`f_jumpStartY = ${this.f_jumpStartY}`);
			//Limits on speed:
				//Hit max speed:
				if(this.f_speed > this.f_maxSpeed + this.f_speedBoost)
				{
					this.f_speed = this.f_maxSpeed + this.f_speedBoost;
				}
				//Hit min speed while not in reverse:
				if(this.f_speed < 0 && !input.fn_hold_drift(this.b_done))
				{
					this.f_speed = 0;
				}
				//Standstill:
				if(this.f_speed < 0 && input.fn_hold_drift(this.b_done) && input.fn_hold_accelerate(this.b_done))
				{
					this.f_speed = 0;
				}//Reverse:
				else if(this.f_speed < -0.2 && input.fn_hold_drift(this.b_done)){
					this.f_speed = -0.2;
				}
				//When in offRoad:
				if(this.b_inOffroad){
					this.f_maxSpeed = f_baseMaxSpeed.get(this) / 2;
				}
				else{
					this.f_maxSpeed = f_baseMaxSpeed.get(this);
				}
				//if(this.b_finished && this.f_speed < 0){
				//	this.f_speed = 0;
				//}

				//Update HUD for speed:
					var p_hudSpd = document.getElementById("p_spd");
					var str_spd = (Math.abs(Math.trunc(this.f_speed * 100))).toString();
					
					if(Math.abs(this.f_speed * 100) < 10){
						str_spd = "0" + str_spd;
					}
					
					p_hudSpd.innerHTML = str_spd + " kmh";
					
					//Adjust HUD color based on MT charge:
					p_hudSpd.style.color = this.str_speedometerTextColor;
					p_hudSpd.style.textShadow = `-.18vw -.18vw 0 ${this.str_speedometerBorderColor},
												.18vw -.18vw 0 ${this.str_speedometerBorderColor},
												-.18vw  .18vw 0 ${this.str_speedometerBorderColor},
												.18vw  .18vw 0 ${this.str_speedometerBorderColor}`

			//console.log("f_speed = " + this.f_speed);
			//Steering:	
				if((input.fn_hold_left(this.b_done) || input.fn_hold_right(this.b_done)) && (this.f_speed !== 0 || this.b_standstill)){
					//console.log(`f_turningDirec = ${this.f_turningDirec}`);
					if(input.fn_hold_left(this.b_done)){
						this.f_turningDirec = 1;
					}
					if(input.fn_hold_right(this.b_done)){
						this.f_turningDirec = -1;
					}
					
					this.f_turning += 0.0013 * this.f_turningDirec;
					//console.log(`f_turning = ${this.f_turning}`);
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
					if(!this.b_drifting && this.b_onGround && this.f_speedBoostTimer == 0.0){
						if(this.b_steeringBounceBack && this.f_acceleration + this.f_steeringSpeedOffset < f_baseAcceletation.get(this)){
							this.f_acceleration += this.f_steeringSpeedOffset;
							this.f_steeringSpeedOffset *= 1.00075;						//% of the value that decays.
						}
						else{
							this.f_acceleration -= this.f_steeringSpeedOffset;
							this.f_steeringSpeedOffset *= .003;						//% of the vaue that decays.
						}
						if(this.f_steeringSpeedOffset < 0.00005){
							this.b_steeringBounceBack = true;
							//console.log("SHOULD BE ZERO");
						}
					}
					else{	//Account for when user starts drifting while turning:
						this.f_acceleration = f_baseAcceletation.get(this);
					}
				}
				else{	//When not steering:
					//console.log("f_turningDirec = " + this.f_turningDirec);
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
					this.f_acceleration = f_baseAcceletation.get(this);
				}
			
			//console.log(`b_drifting = ${this.b_drifting},\tb_standstill = ${this.b_standstill}`);
			//console.log(`f_MTcharge = ${this.f_MTcharge},\str_MT = ${this.str_MT}`);
			
			//Steering while drifting:
				if(this.b_drifting){		
					//If drifitng, can turn tighter.
					this.f_maxTurning = f_baseMaxTurning.get(this) * 1.1; 
					
					//Slide-ing:
					this.player.position.z -= Math.sin(this.player.rotation.y) * this.f_driftSlide * this.f_driftingDirec;
					this.player.position.x += Math.cos(this.player.rotation.y) * this.f_driftSlide * this.f_driftingDirec;
					
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
						if(this.f_driftSlide > f_maxDriftSlide.get(this) * this.f_speed){
							this.f_driftSlide = f_maxDriftSlide.get(this) * this.f_speed;
							this.f_maxDriftSlideHit = true;
							//console.log("SIDE MAX HIT");
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
					//console.log(`f_driftSlide = ${this.f_driftSlide}`);
				}
				else if(this.b_standstill){
					this.f_maxTurning = f_baseMaxTurning.get(this) * 1.2; 
					
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
					if(this.str_MT && input.fn_hold_accelerate(this.b_done)){
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
					this.str_speedometerTextColor = "gold";
					this.str_speedometerBorderColor = "#d57900";
				}
			//Speed boosts & mini-turbos:
				if(this.f_speedBoostTimer > 0.0){
					this.f_speedBoostTimer -= 1.0/60.0;
					//Make it so acceleration doesn't depend on stats during a speed boost.
				}
				else if(this.f_speedBoost > 0.0){
					this.f_speedBoost -= 0.01 / f_stat_weight.get(this);	//The larger weight, the longer a speed boost is maintained.
				}
				else{
					this.f_speedBoost = 0.0;
					this.f_speedBoostTimer = 0.0;
				}
			
			//Gravity:
				this.f_gravity += f_gravityRate.get(this);
				//console.log("f_gravity = " + this.f_gravity);
				if(this.f_gravity > 1.05){
					this.f_gravity = 1.05;
				}
				if(this.f_gravity > 0.0){
					this.b_chargeJumping = false;
				}
				this.player.position.y -= this.f_gravity;
				this.worldCollider.start.y -= this.f_gravity;

				//console.log(`Charge jumping = ${this.b_chargeJumping}`);
			
			//Update player's position:
				this.player.position.x -= Math.sin(this.player.rotation.y) * this.f_speed;
				this.player.position.z -= Math.cos(this.player.rotation.y) * this.f_speed;
				this.player.rotation.y += this.f_turning;
			//Update world collider:
				this.worldCollider.start.set(this.player.position.x, this.player.position.y, this.player.position.z);
				this.worldCollider.end.set(this.worldCollider.start.x, this.worldCollider.start.y + this.f_radius * .35, this.worldCollider.start.z);
			
			//this.playerCollider.start.x -= Math.sin(this.player.rotation.y) * this.f_acceleration;
			//this.playerCollider.start.z -= Math.cos(this.player.rotation.y) * this.f_acceleration;
			
			this.b_onGround = false;
			this.b_firstLanded = false;
		}
	}
	
	fn_animate(){
		
	}
	
	fn_onGround(_depth){
		//this.f_gravity = .2;
		//this.player.position.y +=  _depth;
	}
	
	fn_hitWall(_depth){
		this.player.position.x -= _depth;
		
	}
	
	fn_getPosition(){
		return new THREE.Vector3(this.player.position.x, this.player.position.y, this.player.position.z);
		
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
	fn_offroad(offroadOctree){
		this.result = offroadOctree.capsuleIntersect( this.worldCollider );
		if ( this.result.depth > 1e-10 ) {
			this.b_inOffroad = true;
		}
		else{
			this.b_inOffroad = false;
		}

		//console.log(`b_inOffroad = ${this.b_inOffroad}`);
	}
	
	//Checks for collisions with course and environment:
	fn_collision(worldOctree){
		this.result = worldOctree.capsuleIntersect( this.worldCollider );

		if ( this.result ) {
			//console.log("Depth x = " + this.result.normal.x + ", y = " + this.result.normal.y + ", z = " + this.result.normal.z);

			if ( this.result.depth > 1e-10 ) {
				
				this.worldCollider.translate( this.result.normal.multiplyScalar( this.result.depth ) );
				this.player.position.set(this.worldCollider.start.x, this.worldCollider.start.y, this.worldCollider.start.z);
				
				
				this.f_gravity = f_baseGravity.get(this);
				this.b_onGround = true;
			}
			
			//Wall collision:
			if(Math.abs(this.result.normal.x) > 0.1 || Math.abs(this.result.normal.z) > 0.1) {
				this.b_hitWall = true;
			}
		}
	}
	
	
	fn_update(camera, input){
		//Code to run when wall is hit:
			if(this.b_hitWall){			
				//Only reduce speed from a collision when not in a speed boost:
				if(this.f_speedBoostTimer == 0.0){
					this.f_speed -= this.f_speed / 6;
					if(this.f_speed < 0){
						this.f_speed = 0;
					}
				}

				//MAKE PLAYER BOUNCE BACK
				
				console.log("Wall collision detected!");
				this.b_hitWall = false;
				this.fn_stopDrifting();
			}
		
		if(b_showCapsule){
			//Update collision capsule visulizers:
				this.capsuleMesh.position.copy(new THREE.Vector3().addVectors(this.worldCollider.start, this.worldCollider.end).multiplyScalar(0.5));
				this.startVis.position.set(this.worldCollider.start.x, this.worldCollider.start.y, this.worldCollider.start.z);
				this.endVis.position.set(this.worldCollider.end.x, this.worldCollider.end.y, this.worldCollider.end.z);
		}
		
		//Update the sprite's position:
			this.sprite.position.set(this.player.position.x, this.player.position.y + 0.02 * this.f_scale, this.player.position.z);
				
		//Update camera's position:
			if(!this.b_flying){
				this.f_posY = this.player.position.y + 2;
				this.f_lookY = this.player.position.y + 1.15;
				if(this.b_jumping){
					this.f_posY = this.f_jumpStartY + 2;
					this.f_lookY = this.f_jumpStartY + 1.15;
				}
				//console.log(`f_lookY = ${this.f_lookY}`);
				
				//Rear view:
				if(input.fn_hold_rear(this.b_done)){
					camera.position.set(this.player.position.x - 4.5 * Math.sin(this.player.rotation.y), this.f_posY, this.player.position.z - 4.5 * Math.cos(this.player.rotation.y));
					camera.lookAt( this.player.position.x, this.f_lookY, this.player.position.z );
				}
				else{
					camera.position.set(this.player.position.x + 5.75 * Math.sin(this.player.rotation.y), this.f_posY, this.player.position.z + 5.75 * Math.cos(this.player.rotation.y));
					camera.lookAt( this.player.position.x, this.f_lookY, this.player.position.z );
				}
			}
			else{
				//camera.lookAt(-40, 0, -20);
			}
		
		if(this.b_onGround && !this.b_prevOnGround){
			this.b_firstLanded = true;
		}
		this.b_prevOnGround = this.b_onGround;
	}
	
	fn_getPlayer(){
		return this.player;
	}
	
	fn_getHitbox(){
		return new THREE.Box3().setFromObject(this.player);
		//return this.player.geometry;
	}
	
	fn_checkpointUpdate(_checkpoint){
		
		if(this.int_courseProgress + 10 >= _checkpoint.fn_getID() && this.b_inOrder){	//Doesn't count checkpoints that are too far ahead.
			this.int_courseProgress = _checkpoint.fn_getID() /*+ (int_numChecks.get(this) + 1) * (this.int_lap - 1)*/;
		}

		if(window.b_debug){
			var idButton = document.getElementById("p_check");
			idButton.innerHTML = "Progress: " + this.int_courseProgress;
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
					//this.int_keysPassed = 0;
					this.int_lastKey = -1;
					this.int_expectedKey = 0;				}
				
				//console.log("Out of order. Next key is " + this.int_expectedKey);
				this.b_inOrder = false;
			}
			//console.log("Last key: " + this.int_lastKey);
			
			//For incremementing laps:
			if(_checkpoint.fn_getGoal() && this.int_keysPassed >= int_numKeys.get(this) && window.int_gameMode > 0){
				this.int_keysPassed = 1;
				this.int_lap += 1;
				
				if(this.int_lap <= int_numLaps.get(this)){
					var lapsParagraph = document.getElementById("p_laps");
					lapsParagraph.innerHTML = "LAP " + this.int_lap + " / " + int_numLaps.get(this);
				}
				else{
					this.b_done = true;
					var finishParagraph = document.getElementById("p_finish");
					finishParagraph.innerHTML = "FINISH";
				}
			}   
			//console.log("Keys passed: " + this.int_keysPassed + "\n------------");
			
			this.int_lastKey = _checkpoint.fn_getID();
		}
	}

	fn_isFinished(){
		return this.b_done;
	}

	//Resets all variables related to drifting. Call this when a drift ends:
	fn_stopDrifting(){
		this.b_drifting = false;
		
		this.f_maxTurning = f_baseMaxTurning.get(this);
		this.f_driftSlide = this.f_driftSlideMin;
		this.f_maxDriftSlideHit = false;
		this.f_driftingDirec = 0;
		this.f_MTcharge = 0.0;
		this.str_MT = "";
	}

	//Changes to state:
	fn_addSpeedBoost(_str_power, _f_duration){
		if(_str_power.slice(0, -1) == "MT"){
			this.f_speedBoost = .07;
			this.f_speedBoost += Number(_str_power.at(-1)) * 0.01;
			
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
			this.f_speedBoostTimer += f_stat_miniTurbo.get(this) / 15;
		}
		else if(_str_power == "T"){
			this.f_speedBoost = .16;
			
			if(!_f_duration){
				this.f_speedBoostTimer = 1.8;
			}
			else{
				this.f_speedBoostTimer = _f_duration;
			}
		}
		this.f_speed += this.f_maxSpeed * .9;
	}
}