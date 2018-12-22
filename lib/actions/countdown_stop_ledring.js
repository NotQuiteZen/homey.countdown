// Fetch Homey
const Homey = require('homey');

// Fetch timers
const {Timers} = require('../timers');

// Create => register => export the FlowCardAction 'countdown_stop_ledring'
const actionCountdownStopLedring = new Homey.FlowCardAction('countdown_stop_ledring')
    .register()
    .registerRunListener(() => {
        if (Timers.stopLedring()) {
            return Promise.resolve(true);
        }
        return Promise.reject('Failed to stop ledring');
    });

module.exports = actionCountdownStopLedring;
