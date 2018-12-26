// Fetch Homey
const Homey = require('homey');

// Fetch timerEvents
const {Timers, timerEvents} = require('../timers');

// Setup the trigger
const triggerSpecificCountdownStarted = new Homey.FlowCardTrigger('specific_countdown_started_autocomplete')
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


// Bind this trigger to the event timer.start
timerEvents.on('timer.start', (data) => {
    let triggerTokens = {name: data.name};
    triggerSpecificCountdownStarted.trigger({}, triggerTokens);
});

// Bind autocomplete
const triggerSpecificCountdownStartedArg = triggerSpecificCountdownStarted.getArgument('name');
triggerSpecificCountdownStartedArg.registerAutocompleteListener(Timers.autocomplete);

// Export
module.exports = triggerSpecificCountdownStarted;
