// Fetch Homey
const Homey = require('homey');

// Create => register => export the FlowCardTrigger 'specific_countdown_stopped'
module.exports = new Homey.FlowCardTrigger('specific_countdown_stopped')
    .registerRunListener((args, state) => {
        return Promise.resolve((args.name && state.name) && args.name.toLowerCase() === state.name.toLowerCase()); // If names match, this flow should run
    })
    .register();

