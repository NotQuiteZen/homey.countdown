// Fetch Homey
const Homey = require('homey');

// Fetch timers
const {Timers} = require('../timers');

// Create => register => export the FlowCardCondition 'countdown_active_autocomplete'
const conditionCountdownActiveAutocomplete = new Homey.FlowCardCondition('countdown_active_autocomplete')
    .register()
    .registerRunListener(args => {

        // Build timerName
        let timerName = args.name;
        
        // Homey seems to pass args as an object (sometimes?)
        if (typeof timerName === 'object') {
            timerName = timerName.name;
        }

        // Homey seems to pass args as an object (sometimes?)
        if (typeof timerName === 'object') {
            timerName = timerName.name;
        }

        // Check if its counting
        let isCounting = Timers.isCounting(timerName);

        // Null means it doesnt exists
        if (isCounting === null) {
            return Promise.reject(new Error(`Failed to check if timer ${timerName} is active`));
        }

        // Done
        return Promise.resolve(isCounting);

    });

// Bind autocomplete
const conditionCountdownActiveAutocompleteArg = conditionCountdownActiveAutocomplete.getArgument('name');
conditionCountdownActiveAutocompleteArg.registerAutocompleteListener(Timers.autocomplete);

module.exports = conditionCountdownActiveAutocomplete;
