// Fetch Homey
const Homey = require('homey');

// Fetch Timers
const {Timers} = require('../timers');

// Create => register => export the FlowCardTrigger 'specific_countdown_started'
module.exports = new Homey.FlowCardTrigger('specific_countdown_started')
    .register()
    .registerRunListener((args, state) => {
        
        let timerName = args.name;

        // Fetch flowTimerName
        let flowTimerName = timerName.toLowerCase().trim();

        // Fetch triggeredTimerName
        let triggeredTimerName = 'name' in state ? state.name.toLowerCase().trim() : false;
        
        // Check if its counting
        let isCounting = Timers.isCounting(flowTimerName);

        // Compare
        return Promise.resolve(flowTimerName && triggeredTimerName && isCounting && flowTimerName === triggeredTimerName);
    });
