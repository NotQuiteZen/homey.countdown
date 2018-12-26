// Fetch Homey
const Homey = require('homey');

// Fetch timers
const {Timers} = require('../timers');

// Create => register => export the FlowCardAction 'countdown_update_autocomplete'
const actionCountdownUpdateAutocomplete = new Homey.FlowCardAction('countdown_update_autocomplete')
    .register()
    .registerRunListener((args) => {
        
        // Build timerName
        let timerName = args.name;
        
        // Homey seems to pass args as an object (sometimes?)
        if (typeof timerName === 'object') {
            timerName = timerName.name;
        }

        // timerSeconds
        let timerSeconds = args.seconds;

        // Validate timerSeconds
        if (timerSeconds <= 0) {
            return Promise.reject(new Error('Seconds must be greater then 0'));
        }

        // Add a new timer
        Timers.add(timerName);

        // Set the time
        Timers.setTime(timerName, timerSeconds);

        // Start the timer
        Timers.start(timerName);

        // Done
        return Promise.resolve(true);
    });


const actionCountdownUpdateAutocompleteArg = actionCountdownUpdateAutocomplete.getArgument('name');
actionCountdownUpdateAutocompleteArg.registerAutocompleteListener(Timers.autocomplete);

module.exports = actionCountdownUpdateAutocomplete;
