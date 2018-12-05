// Fetch Homey
const Homey = require('homey');

// Fetch timers
const {Timers} = require('../timers');


// Create => register => export the FlowCardCondition 'countdown_active'
module.exports = new Homey.FlowCardCondition('countdown_active')
    .register()
    .registerRunListener(args => {

        // Build timerName
        let timerName = args.name;

        // Check if its counting
        let isCounting = Timers.isCounting(timerName);


        // Null means it doesnt exists
        if (isCounting === null) {
            return Promise.reject(new Error(`Failed to check if timer ${timerName} is active`));
        }

        // Done
        return Promise.resolve(isCounting);

    });
