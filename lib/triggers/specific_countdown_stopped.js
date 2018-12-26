// Fetch Homey
const Homey = require('homey');

// Fetch timerEvents
const {Timers, timerEvents} = require('../timers');

// Setup the trigger
const specificCountdownStopped = new Homey.FlowCardTrigger('specific_countdown_stopped')
    .register()
    .registerRunListener((args, state) => {

        let timerName = Timers.normalizeName(args.name);

        // Fetch triggeredTimerName
        let triggeredTimerName = 'name' in state ? Timers.normalizeName(state.name) : false;

        // Compare
        return Promise.resolve(timerName && triggeredTimerName && timerName === triggeredTimerName);
    });

// Bind this trigger to the event timer.empty
timerEvents.on('timer.empty', (data) => {
    let triggerTokens = {name: data.name};
    specificCountdownStopped.trigger({}, triggerTokens);
});

// Export
module.exports = specificCountdownStopped;
