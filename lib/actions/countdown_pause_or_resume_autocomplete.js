// Fetch Homey
const Homey = require('homey');

// Fetch timers
const {Timers} = require('../timers');

// Create => register => export the FlowCardAction 'countdown_pause_or_resume_autocomplete'
const actionCountdownPauseOrResumeAutocomplete = new Homey.FlowCardAction('countdown_pause_or_resume_autocomplete')
    .register()
    .registerRunListener((args) => {

        // Build timerName
        let timerName = args.name;

        // Homey seems to pass args as an object (sometimes?)
        if (typeof timerName === 'object') {
            timerName = timerName.name;
        }

        if (!Timers.exists(timerName)) {
            return Promise.reject(new Error(`Timer ${timerName} does not exists, cannot pause/resume`));
        }


        // Counting
        if (Timers.isCounting(timerName)) {

            // Pause it
            if (Timers.pause(timerName)) {
                return Promise.resolve(true);
            }
        } else {

            // Not counting, resume it
            if (Timers.resume(timerName)) {
                return Promise.resolve(true);
            }
        }

        return Promise.reject(new Error(`Failed to resume timer ${timerName}`));
    });


const actionCountdownPauseOrResumeAutocompleteArg = actionCountdownPauseOrResumeAutocomplete.getArgument('name');
actionCountdownPauseOrResumeAutocompleteArg.registerAutocompleteListener(Timers.autocomplete);

module.exports = actionCountdownPauseOrResumeAutocomplete;
