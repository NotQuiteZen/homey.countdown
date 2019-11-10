// Fetch Homey
const Homey = require('homey');

// Fetch timers
const {Timers} = require('../timers');

// Create => register => export the FlowCardAction 'countdown_resume_autocomplete'
const actionCountdownResumeAutocomplete = new Homey.FlowCardAction('countdown_resume_autocomplete')
    .register()
    .registerRunListener((args) => {

        // Build timerName
        let timerName = args.name;

        // Homey seems to pass args as an object (sometimes?)
        if (typeof timerName === 'object') {
            timerName = timerName.name;
        }

        if (Timers.resume(timerName)) {
            return Promise.resolve(true);
        }

        return Promise.reject(new Error(`Failed to resume timer ${timerName}`));
    });


const actionCountdownResumeAutocompleteArg = actionCountdownResumeAutocomplete.getArgument('name');
actionCountdownResumeAutocompleteArg.registerAutocompleteListener(Timers.autocomplete);

module.exports = actionCountdownResumeAutocomplete;
