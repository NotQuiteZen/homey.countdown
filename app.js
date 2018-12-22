const {Timers} = require('./lib/timers');

// Register actions
const actionCountdownStop = require('./lib/actions/countdown_stop');
const actionCountdownStopAutocomplete = require('./lib/actions/countdown_stop_autocomplete');
const actionCountdownStopAll = require('./lib/actions/countdown_stop_all');
const actionCountdownUpdate = require('./lib/actions/countdown_update');
const actionCountdownUpdateAutocomplete = require('./lib/actions/countdown_update_autocomplete');
const actionCountdownStartLedringAutocomplete = require('./lib/actions/countdown_start_ledring');

// Register conditions
const conditionActive = require('./lib/conditions/countdown_active');
const conditionActiveAutocomplete = require('./lib/conditions/countdown_active_autocomplete');

// Register triggers
const triggerCountdownStarted = require('./lib/triggers/countdown_started');
const triggerCountdownStopped = require('./lib/triggers/countdown_stopped');
const triggerSpecificCountdownStopped = require('./lib/triggers/specific_countdown_stopped');
const triggerSpecificCountdownStoppedAutocomplete = require('./lib/triggers/specific_countdown_stopped_autocomplete');
const triggerSpecificCountdownStarted = require('./lib/triggers/specific_countdown_started');
const triggerSpecificCountdownStartedAutcomplete = require('./lib/triggers/specific_countdown_started_autocomplete');


// Give Timers all the cards, so we can do all kinds of stuff
Timers.setCards([
    actionCountdownStop,
    actionCountdownStopAll,
    actionCountdownUpdate,
    conditionActive,
    conditionActiveAutocomplete,
    triggerCountdownStarted,
    triggerCountdownStopped,
    triggerSpecificCountdownStopped,
    triggerSpecificCountdownStarted,
    actionCountdownUpdateAutocomplete,
    actionCountdownStartLedringAutocomplete,
    actionCountdownStopAutocomplete,
    triggerSpecificCountdownStoppedAutocomplete,
    triggerSpecificCountdownStartedAutcomplete,
]);

module.exports = Timers;
