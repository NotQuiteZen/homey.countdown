// Fetch Homey
const Homey = require('homey');

// Fetch timerEvents
const {timerEvents} = require('../timers');

// Setup the trigger
const specificCountdownStopped = new Homey.FlowCardTrigger('specific_countdown_stopped')
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
    specificCountdownStopped.trigger({}, triggerTokens);
});

// Export
module.exports = specificCountdownStopped;
