// Fetch Homey
const Homey = require('homey');

// Fetch timers
const Timers = require('../timers');

// Create => register => export the FlowCardAction 'countdown_stop'
module.exports = new Homey.FlowCardAction('countdown_stop')
    .register()
    .registerRunListener((args) => {

        // Validate name
        if (!Timers.validateName(args.name)) {
            return Promise.reject(new Error('Invalid name, only use a-z and 0-9'));
        }

        if (Timers.setTime(args.name, 0)) {
            return Promise.resolve(true);
        }

        return Promise.reject(new Error(`Failed to stop timer ${args.name}`));
    });
