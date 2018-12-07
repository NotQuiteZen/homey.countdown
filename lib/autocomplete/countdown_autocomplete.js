// // Fetch Homey
// const Homey = require('homey');
//
// // Fetch timers
// const {Timers} = require('../timers');
//
//
// const triggerSpecificCountdownStopped = require('../triggers/specific_countdown_stopped');
//
// triggerSpecificCountdownStopped.getArgumentValues((values) => {
//  return Promise.resolve(true);
// });
//
//
// const actionCountdownStop = require('../actions/countdown_stop');
// const actionCountdownStopArg = actionCountdownStop.getArgument('name');
//
// actionCountdownStopArg.registerAutocompleteListener( ( query, args ) => {
//   let timerNames = Timers.names();
//   let autoCompleteResult = [];
//
//   timerNames.map(function(timerName){
//     autoCompleteResult.push({name: timerName});
//   });
//
// console.log(autoCompleteResult);
//   return Promise.resolve(autoCompleteResult);
// });
