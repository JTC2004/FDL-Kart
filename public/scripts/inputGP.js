export default class InputHandlerGP{
	
	constructor(gamepad){
		//("gamepad ID = " + gamepad.id);


		this.gamepad = gamepad;					//Should be an object pointer.
		//this.int_index = gamepad.index;
		this.b_printButton = false;

		this.a_prevButtons = [];		//Array of buttons held down in a previous frame.
		this.a_press = [];				//Each index corresponds with a button, and returns true only if that button is pressed.
		this.a_hold = [];				//Each index corresponds with a button, and returns true only if that button is held.
		this.a_release = [];

		this.f_deadZone = 0.15;
		this.b_inDeadZone = null;		//Used to determine taps vs holds of the joystick.
		this.b_prevDeadZone = null;

		this.f_leftX = 0.0;
		this.f_leftY = 0.0;
		this.f_rightX = 0.0;
		this.f_rightY = 0.0;
		
		this.int_gp_forward = 12;
		this.int_gp_back = 13;
		this.int_gp_left = 14;
		this.int_gp_right = 15;
		this.int_gp_accelerate = 0;
		this.int_gp_drift = 7;
		this.int_gimg_itemSlot = 6;
		this.int_gp_swap = 4;
		this.int_gp_rear = 2;
		this.int_gp_pause = 9;
		this.int_gp_LB = 4;
		this.int_gp_RB = 5;
		this.int_gp_fly = 11;
	}

	//Update the gamepad:
	fn_update(){
		//Need to update this gamepad object every frame so the game works in Chromium and doesn't eat inputs:
		this.rawGamepad = navigator.getGamepads()[this.gamepad.index];
		
		//Error handling:
		if(!this.rawGamepad){
			//console.log("Error, no controller here.");
			return;
		}
		this.gamepad = this.rawGamepad;	//Make sure inputs don't get eaten in Firefox either.
										//Unlike Chromium, getGamepads() returns a live object in Firefox.

		//Joystick code doesn't need to be in the buttons loop:
			this.b_inDeadZone = true;
			this.f_leftX = 0.0;
			this.f_leftY = 0.0;
			this.f_rightX = 0.0;
			this.f_rightY = 0.0;

			//Updating joystick axis variables:
			if(Math.abs(this.gamepad.axes[0]) > this.f_deadZone){
				this.f_leftX = this.gamepad.axes[0];
				this.b_inDeadZone = false;
			}
			if(Math.abs(this.gamepad.axes[1]) > this.f_deadZone){
				this.f_leftY = this.gamepad.axes[1];
				this.b_inDeadZone = false;
			}
			if(Math.abs(this.gamepad.axes[2]) > this.f_deadZone + 0.01){
				this.f_rightX = this.gamepad.axes[2];
			}
			if(Math.abs(this.gamepad.axes[3]) > this.f_deadZone + 0.01){
				this.f_rightY = this.gamepad.axes[3];
			}

			//console.log("f_leftX = " + this.f_leftX + "\t f_leftY = " + this.f_leftY);
		
		//Tell the difference for whether a button is held or pressed:
			this.gamepad.buttons.forEach((btn, i) => {
				const wasPressed = this.a_prevButtons[i] || false;
				const isPressed  = btn.pressed;

				//Debug prints:
				if(this.b_printButton){
					if (isPressed && !wasPressed) {
						//console.log(`Button ${i} pressed`);
					}

					if (!isPressed && wasPressed) {
						//console.log(`Button ${i} released`);
					}
				}

				//Updating arrays used for determing press vs hold:
				this.a_press[i] = isPressed && !wasPressed;
				this.a_hold[i] = isPressed;
				this.a_release[i] = !isPressed && wasPressed;

				this.a_prevButtons[i] = isPressed;

				//Refresh page if select button pressed:
				if(this.a_press[8] && window.b_debug){
					location.reload();
				}
			});

		//console.log(`Gamepad ${this.gamepad.index} update.`);
	}

	
	//Functions for pause input:
	fn_press_pause(){
		return this.a_press[this.int_gp_pause];
	}
	fn_hold_pause(){
		return this.a_hold[this.int_gp_pause];
	}
	
	//Function for forward input:
	fn_press_forward(_modifier){	
		if(_modifier) return false;
		return (this.f_leftY < 0.0 && this.b_prevDeadZone != this.b_inDeadZone) || this.a_press[this.int_gp_forward];
	}
	fn_hold_forward(_modifier){	
		if(_modifier) return false;
		return this.f_leftY < 0.0 || this.a_hold[this.int_gp_forward];
	}
	//Function for back input:
	fn_press_back(_modifier){	
		if(_modifier) return false;	
		return (this.f_leftY > 0.0 && this.b_prevDeadZone != this.b_inDeadZone) || this.a_press[this.int_gp_back];
	}
	fn_hold_back(_modifier){	
		if(_modifier) return false;
		return this.f_leftY > 0.0 || this.a_hold[this.int_gp_back];
	}
	//Function for left input:
	fn_press_left(_modifier){	
		if(_modifier) return false;	
		return (this.f_leftX < 0.0 && this.b_prevDeadZone != this.b_inDeadZone) || this.a_press[this.int_gp_left];
	}
	fn_hold_left(_modifier){	
		if(_modifier) return false;
		return this.f_leftX < 0.0 || this.a_hold[this.int_gp_left];
	}
	//Function for right input:
	fn_press_right(_modifier){	
		if(_modifier) return false;	
		return (this.f_leftX > 0.0 && this.b_prevDeadZone != this.b_inDeadZone) || this.a_press[this.int_gp_right];
	}
	fn_hold_right(_modifier){	
		if(_modifier) return false;
		return this.f_leftX > 0.0 || this.a_hold[this.int_gp_right];
	}
	
	//Function for accelerate input:
	fn_press_accelerate(_modifier){	
		if(_modifier) return false;
		return this.a_press[this.int_gp_accelerate] || this.a_press[3];
	}
	fn_hold_accelerate(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.int_gp_accelerate] || this.a_hold[3];
	}
	
	//Function for drift input:
	fn_press_drift(_modifier){	
		if(_modifier) return false;
		return this.a_press[this.int_gp_drift] || this.a_press[1];
	}
	fn_hold_drift(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.int_gp_drift] || this.a_hold[1];
	}
	fn_release_drift(_modifier){
		if(_modifier) return false;
		return this.a_release[this.int_gp_drift] || this.a_release[1];
	}
	//Function for only B input:
	fn_press_B(_modifier){	
		if(_modifier) return false;
		return this.a_press[1];
	}
	fn_hold_B(_modifier){	
		if(_modifier) return false;
		return this.a_hold[1];
	}
	fn_release_B(_modifier){
		if(_modifier) return false;
		return this.a_release[1];
	}
	
	//Function for item input:
	fn_press_item(_modifier){	
		if(_modifier) return false;
		return this.a_press[this.int_gimg_itemSlot];
	}
	fn_hold_item(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.int_gimg_itemSlot];
	}

	//Function for swapping input:
	fn_press_swap(_modifier){	
		if(_modifier) return false;
		return this.a_press[this.int_gp_swap] || this.a_press[5];
	}
	fn_hold_swap(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.int_gp_swap] || this.a_hold[5];
	}

	//Function for rear input:
	fn_press_rear(_modifier){	
		if(_modifier) return false;
		return this.a_press[this.int_gp_rear];
	}
	fn_hold_rear(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.int_gp_rear];
	}

	//Function for 'LB' input:
	fn_press_LB(_modifier){	
		if(_modifier) return false;
		return this.a_press[this.int_gp_LB];
	}
	fn_hold_LB(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.int_gp_LB];
	}

	//Function for 'RB' input:
	fn_press_RB(_modifier){	
		if(_modifier) return false;
		return this.a_press[this.int_gp_RB];
	}
	fn_hold_RB(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.int_gp_RB];
	}

	//Function for flying input:
	fn_press_fly(_modifier){	
		if(_modifier) return false;
		return this.a_press[this.int_gp_fly] || this.a_press[10];
	}
	fn_hold_fly(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.int_gp_fly] || this.a_press[10];
	}

	//If any button pressed:
	fn_press(){
		if (!this.gamepad) return false;
		
		for (const button of this.gamepad.buttons) {
			if (button.pressed) {
				return true;
			}
		}
		if(this.fn_hold_left() || this.fn_hold_right() || this.fn_hold_forward() || this.fn_hold_back()){
			return true;
		}
		return false;
	}

	//Functions for c-stick tilt:
	fn_get_rightX(){
		return this.f_rightX;
	}
	fn_get_rightY(){
		return this.f_rightY;
	}

	//Return if this is a keyboard or gamepad:
	fn_getType(){
		return 'GP' + this.gamepad.index;
	}

	//Return the gamepad object:
	fn_getGP(){
		//console.log(`fn_getGP for controller ${this.gamepad.index} returns ${this.gamepad}`);
		
		return this.gamepad;
	}

	fn_getIndex(){
		return this.gamepad.index;
	}

	//Make sure array of inputs updates to kep track of it a :
	fn_updateLastKey(){
		this.b_prevDeadZone = this.b_inDeadZone;
		//this.prevButtons = [...this.currButtons];
	}
}