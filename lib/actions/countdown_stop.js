// Fetch Homey
const Homey = require('homey');

// Fetch timers
const {Timers} = require('../timers');

// Create => register => export the FlowCardAction 'countdown_stop'
const actionCountdownStop = new Homey.FlowCardAction('countdown_stop')
    .register()
    .registerRunListener((args) => {

        let timerName = 'name' in args ? args.name.toLowerCase() : false;

        // Validate name
        if (!Timers.validateName(timerName)) {
            return Promise.reject(new Error('Invalid name, only use a-z and 0-9'));
        }

        if (Timers.setTime(timerName, 0)) {
            return Promise.resolve(true);
        }

        return Promise.reject(new Error(`Failed to stop timer ${timerName}`));
    });

module.exports = actionCountdownStop;
