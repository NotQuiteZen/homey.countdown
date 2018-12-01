// Fetch Homey
const Homey = require('homey');

// Create => register => export the FlowCardTrigger 'specific_countdown_started'
module.exports = new Homey.FlowCardTrigger('specific_countdown_started')
    .registerRunListener((args, state) => {
        return Promise.resolve((args.name && state.name) && args.name.toLowerCase() === state.name.toLowerCase()); // If names match, this flow should run
    })
    .register();
