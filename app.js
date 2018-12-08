'use strict';

let timers = {};
const Homey = require('homey');

// Register triggers
let specificCountdownStarted = new Homey.FlowCardTrigger('specific_countdown_started');
specificCountdownStarted
	.registerRunListener(( args, state ) => {
		return Promise.resolve( (args.name && state.name) && args.name.toLowerCase() === state.name.toLowerCase() ); // If names match, this flow should run
	})
	.register()

let specificCountdownStopped = new Homey.FlowCardTrigger('specific_countdown_stopped');
specificCountdownStopped
	.registerRunListener(( args, state ) => {
			return Promise.resolve( (args.name && state.name) && args.name.toLowerCase() === state.name.toLowerCase() ); // If names match, this flow should run	
	})
	.register()
	


// Register conditions
let countdownActive = new Homey.FlowCardCondition('countdown_active');
countdownActive
	.register()
	.registerRunListener(( args, state ) => {
		if (/^[a-zA-Z0-9 ]+$/.test(args.name)) {
			return Promise.resolve( (args.name.toLowerCase() in timers) );	
		}
		return Promise.reject( new Error('Invalid name, only use a-z and 0-9') );
	})
	
	
	
// Register actions
let countdownUpdate = new Homey.FlowCardAction('countdown_update');
countdownUpdate
	.register()
	.registerRunListener(( args ) => {
		if (/^[a-zA-Z0-9 ]+$/.test(args.name)) {
			if (args.seconds > 0) {
				console.log('Started timer '+args.name);
				timers[args.name.toLowerCase()] = args.seconds;
				
				specificCountdownStarted.trigger({}, {'name': args.name});
				
				let countdownStarted= new Homey.FlowCardTrigger('countdown_started');			
				let tokens = {
					'name': args.name
				}
				countdownStarted
					.register()
					.trigger(tokens)
				
				return Promise.resolve( true );
			}
			return Promise.reject( new Error('Seconds must be greater then 0') );	
		}
		return Promise.reject( new Error('Invalid name, only use a-z and 0-9') );
	});
	
let countdownStop = new Homey.FlowCardAction('countdown_stop');
countdownStop
	.register()
	.registerRunListener(( args ) => {
		if (/^[a-zA-Z0-9 ]+$/.test(args.name)) {
			if (args.name.toLowerCase() in timers) {
				timers[args.name.toLowerCase()] = 0;
			}
			return Promise.resolve( true );
		} 
		return Promise.reject( new Error('Invalid name, only use a-z and 0-9') );
	});

let countdownStopAll = new Homey.FlowCardAction('countdown_stop_all');
countdownStopAll
	.register()
	.registerRunListener(() => {
		console.log('Stopping all timers');
		Object.keys(timers).forEach(function(key) {
			timers[key] = 0;
		});
		
		return Promise.resolve( true );
	});
	
let countdownStopped= new Homey.FlowCardTrigger('countdown_stopped');			
countdownStopped
	.register()
	

class CountdownTimers extends Homey.App {
	
	onInit() {
		this.log('Countdown timers is running...');
		
		this.updateTimers();
	}
	
	updateTimers() {
		if (Object.keys(timers).length > 0) {
			console.log(timers);	
		}
		
		Object.keys(timers).forEach(function(key) {
			var timeLeft = timers[key];
			
			if (timeLeft > 0) {
				timers[key] = timeLeft - 1;
			} else {
				delete timers[key];
				console.log('Timer '+key+' has stopped');
				
				specificCountdownStopped.trigger({}, {'name': key}); // Trigger specific_countdown_stopped
				
				let tokens = {
					'name': key
				}
				countdownStopped
					.trigger(tokens) // Trigger countdown_stopped
			}
		  });
		
		setTimeout(() => this.updateTimers(), 1000);
	}
}

module.exports = CountdownTimers;