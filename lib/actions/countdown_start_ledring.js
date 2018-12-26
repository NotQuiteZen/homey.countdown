// Fetch Homey
const Homey = require('homey');

// Fetch timers
const {Timers} = require('../timers');

// Create => register => export the FlowCardAction 'countdown_start_ledring'
const actionCountdownStartLedringAutocomplete = new Homey.FlowCardAction('countdown_start_ledring')
    .register()
    .registerRunListener((args) => {

        // Build timerName
        let timerName = args.name;
        
        // Homey seems to pass args as an object (sometimes?)
        if (typeof timerName === 'object') {
            timerName = timerName.name;
        }

        // Validate name
        if (!Timers.validateName(timerName)) {
            return Promise.reject(new Error('Invalid name, only use a-z and 0-9'));
        }

        if (Timers.startLedring(timerName)) {
            return Promise.resolve(true);
        }

        return Promise.reject(new Error(`Failed to stop timer ${timerName}`));
    });



const actionCountdownStartLedringAutocompleteArg = actionCountdownStartLedringAutocomplete.getArgument('name');
actionCountdownStartLedringAutocompleteArg.registerAutocompleteListener(Timers.autocomplete);

module.exports = actionCountdownStartLedringAutocomplete;
