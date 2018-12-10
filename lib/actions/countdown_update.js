// Fetch Homey
const Homey = require('homey');

// Fetch timers
const {Timers} = require('../timers');

const triggerSpecificCountdownStarted = require('../triggers/specific_countdown_started');
const triggerCountdownStarted = require('../triggers/countdown_started');

// Create => register => export the FlowCardAction 'countdown_update'
module.exports = new Homey.FlowCardAction('countdown_update')
    .register()
    .registerRunListener((args) => {

        // Build timerName
        let timerName = args.name.toLowerCase();

        // Validate timerName
        if (!Timers.validateName(timerName)) {
            return Promise.reject(new Error('Invalid name, only use a-z and 0-9'));
        }

        // timerSeconds
        let timerSeconds = args['seconds'];

        // Validate timerSeconds
        if (timerSeconds <= 0) {
            return Promise.reject(new Error('Seconds must be greater then 0'));
        }

        // Add a new timer
        Timers.add(timerName);

        // Set the time
        Timers.setTime(timerName, timerSeconds);

        // Start the timer
        Timers.start(timerName);

        //
        let triggerTokens = {name: timerName};

        // SpecificCountdownStarted
        triggerSpecificCountdownStarted.trigger({}, triggerTokens);

        // CountdownStarted
        triggerCountdownStarted.trigger(triggerTokens);

        // Done
        return Promise.resolve(true);
    });
