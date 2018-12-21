# Countdown timers for Homey
[![Build Status](https://travis-ci.com/NotQuiteZen/homey.countdown.svg?branch=beta)](https://travis-ci.com/NotQuiteZen/homey.countdown) 
[![Open issues](https://img.shields.io/github/issues-raw/NotQuiteZen/homey.countdown.svg?colorB=blue)](https://github.com/NotQuiteZen/homey.countdown/issues) 
[![Closed issues](https://img.shields.io/github/issues-closed-raw/NotQuiteZen/homey.countdown.svg?colorB=brightgreen)](https://github.com/NotQuiteZen/homey.countdown/issues?q=is%3Aissue+is%3Aclosed) 
![Code size](https://img.shields.io/github/languages/code-size/NotQuiteZen/homey.countdown.svg)
![Repo size](https://img.shields.io/github/repo-size/NotQuiteZen/homey.countdown.svg)


The Countdown timers app for Athom's Homey provides hourglass-like timer cards in your Flows.

# Version log

### 1.2.0

  - Restructured most of the code to make more sense and is more future-proof
  - Fixes some triggers not properly triggering 
  - Adds autocomplete to certain Flow cards
      - **WARNING: Old Flow cards will still work for now, but have been marked as deprecated and will be removed in a future version. Please change your Flows to use the new autocomplete cards.**


# What does it do?
This app adds the following cards to your Homey Flows:
### Triggers

- A specific timer has started
- A specific timer has stopped
- A timer started
- A timer stopped

### Conditions

- A specific timer is active / inactive
    
### Actions

- Start / update a timer
- Stop a timer
- Stop all timers


# Development

Want to help? Awesome!
Just make a fork, clone it and start contributing.
We use Husky for a pre-commit Unit Test hook, so make sure to run `npm install` after your `git clone` so all depencies get installed and set. Need help? Scroll down to the `Contact` part of this readme.

# Roadmap

 - Write MORE tests
 - mock Homey npm module
 - LED ring support to make-visual a timer 
 
# Contact

Have a question or a bug report? Please file an issue on the Github repo. 
You can also hit us up on Athom's Slack community at @jeroenbos22 or @milanzor, see you there!
