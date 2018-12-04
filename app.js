'use strict';

const {Timers} = require('./lib/timers');

// Register actions
const actionCountdownStop = require('./lib/actions/countdown_stop');
const actionCountdownStopAll = require('./lib/actions/countdown_stop_all');
const actionCountdownUpdate = require('./lib/actions/countdown_update');

// Register conditions
const conditionActive = require('./lib/conditions/countdown_active');

// Register triggers
const triggerCountdownStopped = require('./lib/triggers/countdown_stopped');
const triggerSpecificCountdownStopped = require('./lib/triggers/specific_countdown_stopped');
const triggerSpecificCountdownStarted = require('./lib/triggers/specific_countdown_started');

module.exports = Timers;
