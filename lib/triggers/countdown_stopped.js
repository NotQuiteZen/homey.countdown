// Fetch Homey
const Homey = require('homey');

// Fetch timerEvents
const {timerEvents} = require('../timers');

// Create => register => export the FlowCardTrigger 'countdown_stopped'
const triggerCountdownStopped = new Homey.FlowCardTrigger('countdown_stopped')
    .register();

timerEvents.on('timer.empty', function (data) {
    let triggerTokens = {name: data.name};
    triggerCountdownStopped.trigger(triggerTokens);
});

module.exports = triggerCountdownStopped;
