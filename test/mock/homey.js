class App {
    static log() {
    }
}

/**
 * Mock: Homey.App,
 * Homey.FlowCardTrigger,
 * Homey.FlowCardCondition,
 * Homey.FlowCardAction,
 * @type {{App: App, FlowCardAction: (function(): {registerRunListener: (function(): exports), register: (function(): exports)}), FlowCardTrigger: (function(): {registerRunListener: (function(): exports), register: (function(): exports)}), FlowCardCondition: (function(): {registerRunListener: (function(): exports), register: (function(): exports)})}}
 */
const Homey = {
    App: App,
    FlowCardTrigger: function () {
        return {
            register: function () {
                return this;
            },
            registerRunListener: function () {
                return this;
            }
        }
    },
    FlowCardAction: function () {
        return {
            register: function () {
                return this;
            },
            registerRunListener: function () {
                return this;
            }
        }
    },
    FlowCardCondition: function () {
        return {
            register: function () {
                return this;
            },
            registerRunListener: function () {
                return this;
            }
        }
    },
};
module.exports = Homey;
