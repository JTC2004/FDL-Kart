export default class InputHandlerGP{
	
	constructor(gamepad){
		console.log("gamepad ID = " + gamepad.id);
		
		this.int_index = gamepad.index;
		this.b_printButton = false;

		this.a_prevButtons = [];		//Array of buttons held down in a previous frame.
		this.a_press = [];				//Each index corresponds with a button, and returns true only if that button is pressed.
		this.a_hold = [];				//Each index corresponds with a button, and returns true only if that button is held.

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
	fn_updateGP(gp){
		//Error handling:
		if(!gp){
			console.log("Error, no controller here.");
			return;
		}
		
		//Tell the difference for whether a button is held or pressed:
		gp.buttons.forEach((btn, i) => {
			const wasPressed = this.a_prevButtons[i] || false;
			const isPressed  = btn.pressed;

			//Debug prints:
			if(this.b_printButton){
				if (isPressed && !wasPressed) {
					console.log(`Button ${i} pressed`);
				}

				if (!isPressed && wasPressed) {
					console.log(`Button ${i} released`);
				}
			}
			this.b_inDeadZone = true;
			this.f_leftX = 0.0;
			this.f_leftY = 0.0;
			this.f_rightX = 0.0;
			this.f_rightY = 0.0;

			//Updating joystick axis variables:
			if(Math.abs(gp.axes[0]) > this.f_deadZone){
				this.f_leftX = gp.axes[0];
				this.b_inDeadZone = false;
			}
			if(Math.abs(gp.axes[1]) > this.f_deadZone){
				this.f_leftY = gp.axes[1];
				this.b_inDeadZone = false;
			}
			if(Math.abs(gp.axes[2]) > this.f_deadZone + 0.01){
				this.f_rightX = gp.axes[2];
			}
			if(Math.abs(gp.axes[3]) > this.f_deadZone + 0.01){
				this.f_rightY = gp.axes[3];
			}

			//console.log("f_leftX = " + this.f_leftX + "\t f_leftY = " + this.f_leftY)

			//Updating arrays used for determing press vs hold:
			this.a_press[i] = isPressed && !wasPressed;
			this.a_hold[i] = isPressed;
			this.a_prevButtons[i] = isPressed;

			//Refresh page if select button pressed:
			if(this.a_press[8]){
				location.reload();
			}
		});
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
		return this.a_press[this.int_gp_fly];
	}
	fn_hold_fly(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.int_gp_fly];
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
		return `GP${this.int_index}`;
	}

	//Make sure array of inputs updates to kep track of it a :
	fn_updateLastKey(){
		this.b_prevDeadZone = this.b_inDeadZone;
		//this.prevButtons = [...this.currButtons];
	}
}