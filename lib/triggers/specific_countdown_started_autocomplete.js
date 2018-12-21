// Fetch Homey
const Homey = require('homey');

// Fetch timerEvents
const {Timers, timerEvents} = require('../timers');

// Setup the trigger
const triggerSpecificCountdownStarted = new Homey.FlowCardTrigger('specific_countdown_started_autocomplete')
    .register()
    .registerRunListener((args, state) => {

        let timerName = args.name;

        // Fetch flowTimerName
        let flowTimerName = timerName.toLowerCase().trim();

        // Fetch triggeredTimerName
        let triggeredTimerName = 'name' in state ? state.name.toLowerCase().trim() : false;

        // Compare
        return Promise.resolve(flowTimerName && triggeredTimerName && flowTimerName === triggeredTimerName);
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
