// Fetch Homey
const Homey = require('homey');

// Fetch Timers
const {Timers} = require('../timers');

// Create => register => export the FlowCardTrigger 'specific_countdown_stopped'
module.exports = new Homey.FlowCardTrigger('specific_countdown_stopped')
    .register()
    .registerRunListener((args, state) => {

        // Fetch flowTimerName
        let flowTimerName = 'name' in args ? args.name.toLowerCase().trim() : false;

        // Fetch triggeredTimerName
        let triggeredTimerName = 'name' in state ? state.name.toLowerCase().trim() : false;

        // Compare
        return Promise.resolve(flowTimerName && triggeredTimerName && flowTimerName === triggeredTimerName);
    });


