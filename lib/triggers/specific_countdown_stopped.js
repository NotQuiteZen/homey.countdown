// Fetch Homey
const Homey = require('homey');

// Create => register => export the FlowCardTrigger 'specific_countdown_stopped'
module.exports = new Homey.FlowCardTrigger('specific_countdown_stopped')
    .registerRunListener((args, state) => {

        // Fetch timerName
        let timerName = 'name' in args && args.name ? args.name.toLowerCase().trim() : false;

        // Fetch stateName
        let stateName = 'name' in state && state.name ? state.name.toLowerCase().trim() : false;

        // Compare
        return Promise.resolve(timerName && timerName === stateName);
    })
    .register();

