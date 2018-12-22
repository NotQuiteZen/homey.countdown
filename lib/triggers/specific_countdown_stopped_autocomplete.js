// Fetch Homey
const Homey = require('homey');

// Fetch timerEvents
const {Timers, timerEvents} = require('../timers');

// Setup the trigger
const triggerspecificCountdownStopped = new Homey.FlowCardTrigger('specific_countdown_stopped_autocomplete')
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
