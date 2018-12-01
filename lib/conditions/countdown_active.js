// Fetch Homey
const Homey = require('homey');

// Fetch timers
const Timers = require('../timers');


// Create => register => export the FlowCardCondition 'countdown_active'
let countdownActive = new Homey.FlowCardCondition('countdown_active')
    .register()
    .registerRunListener((args, state) => {

        let isCounting = Timers.isCounting(args.name);

        // Null means it doesnt exists
        if (isCounting === null) {
            return Promise.reject(new Error(`Failed to check if timer ${args.name} is active`));
        }

        return Promise.resolve(isCounting);

    });
