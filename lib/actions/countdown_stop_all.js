// Fetch Homey
const Homey = require('homey');

// Fetch timers
const Timers = require('../timers');

// Create => register => export the FlowCardAction 'countdown_stop_all'
module.exports = new Homey.FlowCardAction('countdown_stop_all')
    .register()
    .registerRunListener(() => {
        if (Timers.stopAll()) {
            return Promise.resolve(true);
        }
        return Promise.reject('Failed to stop all timers');
    });
