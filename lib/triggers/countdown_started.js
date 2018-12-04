// Fetch Homey
const Homey = require('homey');

// Create => register => export the FlowCardTrigger 'countdown_started'
module.exports = new Homey.FlowCardTrigger('countdown_started')
    .register();
