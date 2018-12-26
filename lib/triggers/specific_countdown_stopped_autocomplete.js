// Fetch Homey
const Homey = require('homey');

// Fetch timerEvents
const {Timers, timerEvents} = require('../timers');

// Setup the trigger
const triggerspecificCountdownStopped = new Homey.FlowCardTrigger('specific_countdown_stopped_autocomplete')
    .register()
    .registerRunListener((args, state) => {
        
        // Build timerName
        let timerName = args.name;
        
        // Homey seems to pass args as an object (sometimes?)
        if (typeof timerName === 'object') {
            timerName = timerName.name;
        }

        // Fetch triggeredTimerName
        let triggeredTimerName = 'name' in state ? Timers.normalizeName(state.name) : false;

        // Compare
        return Promise.resolve(timerName && triggeredTimerName && timerName === triggeredTimerName);
    });

// Bind this trigger to the event timer.empty
timerEvents.on('timer.empty', (data) => {
    let triggerTokens = {name: data.name};
    triggerspecificCountdownStopped.trigger({}, triggerTokens);
});

// Bind autocomplete
const triggerspecificCountdownStoppedArg = triggerspecificCountdownStopped.getArgument('name');
triggerspecificCountdownStoppedArg.registerAutocompleteListener(Timers.autocomplete);

// Export
module.exports = triggerspecificCountdownStopped;
