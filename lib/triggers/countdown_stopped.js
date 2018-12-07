// Fetch Homey
const Homey = require('homey');

// Create => register => export the FlowCardTrigger 'countdown_stopped'
module.exports = new Homey.FlowCardTrigger('countdown_stopped')
    .register();

