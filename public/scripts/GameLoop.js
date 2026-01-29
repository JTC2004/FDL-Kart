//Tutorial used: https://youtu.be/ALK0OFQlEto?si=XML3nZSgX_rjWUE1 
//Also used ChatGPT to help modify this loop to make it friendly to refresh rates other than 60hz.

let frameTime;
const FIXED_STEP = 1 / 60;		//Have the game update 60 frames per second.

class GameLoop{
	constructor(){
		this.flag = false;		//Boolean value that changes based on loop is running or not.
		this.callbacks = [];
		this.lastTime = 0;		
		this.accumulator = 0;
	}
	
	addCallback(callback){
		this.callbacks.push(callback);
	}
	removeCallback(callback){
		this.callbacks = this.callbacks.filter(cb => cb != callback);		//"Not the most efficient way, but for the moment is okay."
	}
	
	run(time){
		//If flag becomes false, stop running:
		if(!this.flag){
			return;
		}

		//Find the current FPS:
		//	- When my game is running at 60 FPS, frameTime equals 1/60.
		frameTime = (time - this.lastTime) / 1000;
		this.lastTime = time;

		//Avoid a "spiral of death":
		//	- When the game lags, it catches up by updaing additional times.
		//	  However, if the game lags too much, game can get caught in an infinite loop of catching up.
		//	- So, the following code makes it so if the game lags longer than 0.25 seconds, it skips ahead a bit.
		const clampedTime = Math.min(frameTime, 0.25);
		this.accumulator += clampedTime;

		//Iterate the array in order to execute every callback we have in the array callbacks:
			while (this.accumulator >= FIXED_STEP) {
				this.callbacks.forEach(cb => cb(FIXED_STEP));	//Update only.
				this.accumulator -= FIXED_STEP;
			}

		// Render exactly once per frame
		this.callbacks.forEach(cb => cb(0));
		
		//Native JS function. Is executed when full page is rendered by browser:	
		requestAnimationFrame(this.run.bind(this));		//This makes the function know value of local this.flag.
	}

	start(){
		//If flag is true, cancel start.
		if(this.flag){
			return;
		}
		this.flag = true;
		this.lastTime = performance.now();
		requestAnimationFrame(this.run.bind(this));		//Make physics separated into a separate, asynchronouse handler.
		//this.run();									
	}

	stop(){
		this.flag = false;
	}

	fn_getFPS(){
		//console.log(`FPS = ${1 / frameTime}`);
		return 1 / frameTime;
	}
}

const gameLoop = new GameLoop();

export default gameLoop;