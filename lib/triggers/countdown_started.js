// Fetch Homey
const Homey = require('homey');

// Fetch timerEvents
const {timerEvents} = require('../timers');

// Create => register => export the FlowCardTrigger 'countdown_started'
const triggerCountdownStarted = new Homey.FlowCardTrigger('countdown_started')
    .register();

// Bind this trigger to the event timer.start
timerEvents.on('timer.start', (data) => {
    let triggerTokens = {name: data.name};
    triggerCountdownStarted.trigger(triggerTokens);
});

// Export
module.exports = triggerCountdownStarted;
