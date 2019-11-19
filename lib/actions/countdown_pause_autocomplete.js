// Fetch Homey
const Homey = require('homey');

// Fetch timers
const {Timers} = require('../timers');

// Create => register => export the FlowCardAction 'countdown_pause_autocomplete'
const actionCountdownPauseAutocomplete = new Homey.FlowCardAction('countdown_pause_autocomplete')
    .register()
    .registerRunListener((args) => {

        // Build timerName
        let timerName = args.name;

        // Homey seems to pass args as an object (sometimes?)
        if (typeof timerName === 'object') {
            timerName = timerName.name;
        }

        if (Timers.pause(timerName)) {
            return Promise.resolve(true);
        }

        return Promise.reject(new Error(`Failed to pause timer ${timerName}`));
    });


const actionCountdownPauseAutocompleteArg = actionCountdownPauseAutocomplete.getArgument('name');
actionCountdownPauseAutocompleteArg.registerAutocompleteListener(Timers.autocomplete);

module.exports = actionCountdownPauseAutocomplete;
