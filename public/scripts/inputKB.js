//Followed this tutorial: https://youtu.be/YczRHardTJI?si=RBdsB2vITmRuvtNY
export default class InputHandlerKB{
	
	constructor(){
		console.log("Keyboard initialized");
		
		this.b_printKey = false;

		//Used to determine taps vs holds of the keys:
		this.a_prevKeys = [];			//Array of keys held down in a previous frame.
		this.a_press = [];				//Each index corresponds with a key, and returns true only if that key is pressed.
		this.a_hold = [];				//Each index corresponds with a key, and returns true only if that key is held.
		this.a_release = [];
		this.b_connected = true;
		this.b_anyKeyPressed = false;
		
		this.char_kb_forward = "w";
		this.char_kb_back = "s";
		this.char_kb_left = "a";
		this.char_kb_right = "d";
		this.char_kb_accelerate = " ";
		this.char_kb_drift = "j";
		this.char_kb_item = "k";
		this.char_kb_swap = "i";
		this.char_kb_rear = "l";
		this.char_kb_pause = "p";
		this.char_kb_LB = "q";
		this.char_kb_RB = "e";
		this.char_kb_fly = "f";
		
		//When keyboard key pressed down:
		window.addEventListener('keydown', (e) => {
			const wasPressed = this.a_prevKeys[e.key] || false;	//Determine if current key was already pressed last frame.

			//Debug print:
			if (this.b_printKey && !wasPressed) {
				console.log(`Key ${e.key} pressed`);
			}

			//Updating arrays used for determing press vs hold:
			this.a_press[e.key] = !wasPressed;		//If current key was already held last frame, it's not a press.
			this.a_hold[e.key] = true;				//Add current key to list of keys held down.
			this.a_prevKeys[e.key] = true;			//Add current key to list of keys held last frame.
			this.a_release[e.key] = false;			

			this.b_anyKeyPressed = true;
		});

		//When keyboard key released:
		window.addEventListener('keyup', (e) => {
			this.a_press[e.key] = false;
			this.a_hold[e.key] = false;				//Remove current key from list of keys held down.
			this.a_release[e.key] = true;

			this.a_prevKeys[e.key] = false;			//Remove current key from list of keys held last frame.

			//Debug print:
			if (this.b_printKey) {
				console.log(`Key ${e.key} released`);
			}

			this.b_anyKeyPressed = false;
		});
	}

	
	//Functions for pause input:
	fn_press_pause(){
		return this.a_press[this.char_kb_pause] || this.a_press['Escape'];
	}
	fn_hold_pause(){
		return this.a_hold[this.char_kb_pause] || this.a_press['Escape'];
	}
	
	//Function for forward input:
	fn_press_forward(_modifier){	
		if(_modifier) return false;
		return this.a_press[this.char_kb_forward];
	}
	fn_hold_forward(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.char_kb_forward];
	}
	//Function for back input:
	fn_press_back(_modifier){	
		if(_modifier) return false;	
		return this.a_press[this.char_kb_back];
	}
	fn_hold_back(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.char_kb_back];
	}
	//Function for left input:
	fn_press_left(_modifier){	
		if(_modifier) return false;	
		return this.a_press[this.char_kb_left];
	}
	fn_hold_left(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.char_kb_left];
	}
	//Function for right input:
	fn_press_right(_modifier){	
		if(_modifier) return false;	
		return this.a_press[this.char_kb_right];
	}
	fn_hold_right(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.char_kb_right];
	}
	
	//Function for accelerate input:
	fn_press_accelerate(_modifier){	
		if(_modifier) return false;
		return this.a_press[this.char_kb_accelerate];
	}
	fn_hold_accelerate(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.char_kb_accelerate];
	}
	
	//Function for drift input:
	fn_press_drift(_modifier){	
		if(_modifier) return false;
		return this.a_press[this.char_kb_drift];
	}
	fn_hold_drift(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.char_kb_drift];
	}
	fn_release_drift(_modifier){
		if(_modifier) return false;
		const b_result = this.a_release[this.char_kb_drift];

		this.a_release[this.char_kb_drift] = false;
		return b_result;
	}
	
	//Function for item input:
	fn_press_item(_modifier){	
		if(_modifier) return false;
		return this.a_press[this.char_kb_item];
	}
	fn_hold_item(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.char_kb_item];
	}

	//Function for swapping input:
	fn_press_swap(_modifier){	
		if(_modifier) return false;
		return this.a_press[this.char_kb_swap];
	}
	fn_hold_swap(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.char_kb_swap];
	}

	//Function for rear input:
	fn_press_rear(_modifier){	
		if(_modifier) return false;
		return this.a_press[this.char_kb_rear];
	}
	fn_hold_rear(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.char_kb_rear];
	}

	//Function for 'LB' input:
	fn_press_LB(_modifier){	
		if(_modifier) return false;
		return this.a_press[this.char_kb_LB];
	}
	fn_hold_LB(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.char_kb_LB];
	}

	//Function for 'RB' input:
	fn_press_RB(_modifier){	
		if(_modifier) return false;
		return this.a_press[this.char_kb_RB];
	}
	fn_hold_RB(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.char_kb_RB];
	}

	//Function for flying input:
	fn_press_fly(_modifier){	
		if(_modifier) return false;
		return this.a_press[this.char_kb_fly];
	}
	fn_hold_fly(_modifier){	
		if(_modifier) return false;
		return this.a_hold[this.char_kb_fly];
	}

	//If any key pressed:
	fn_press(){
		return this.b_anyKeyPressed;
	}

	//Functions for c-stick tilt:
	fn_get_rightX(){
		return 0;
	}
	fn_get_rightY(){
		return 0;
	}

	//Return if this is a keyboard or gamepad:
	fn_getType(){
		return "KB";
	}
	
	//This needs to be here, but not need anything in it:
	fn_update(){
		return;
	}

	//Set true if kb is in a_inputs. False if not.
	fn_setConnected(_newVal){
		this.b_connected = _newVal;
	}
	fn_getConnected(){
		return this.b_connected;
	}

	//a_press needs to be cleared for 'tap' inputs to work:
	fn_updateLastKey(){
		this.a_press = [];
	}
}