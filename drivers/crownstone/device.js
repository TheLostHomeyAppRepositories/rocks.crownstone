'use strict';

const Homey = require('homey');
let accessToken;

/**
 * Current we have implemented this through the BLE chip on board of the Homey. This has the advantage that we can
 * directly send a command to the Crownstone itself. Henceforth, it should be faster than a round-trip through the
 * cloud. However, in this way it is only possible to set up a connection to a Crownstone that is in the 
 * neighbourhood of the Homey. The Crownstone app knows how to send messages into the mesh. The Homey does not. It
 * only is able to send a request to a device that is broadcasting BLE advertisements in its neighbourhood.
 *
 * It might make sense to have a toggle that defines this behavior. It can define if we should go through the 
 * Crownstone app (but then the particular phone has to be present) or directly with the Crownstones in its vicinity.
 */
class CrownstoneDevice extends Homey.Device {

    // This method is called when the Device is initialized. It does not necessarily do any scanning itself. 
    onInit() {
        this.log(this.getName() + ' has been inited');
        this.log('Name:', this.getName());
        this.log('Class:', this.getClass());
        console.log(this.getData().id);
        this.cloud = Homey.app.getCloud();
        accessToken = Homey.app.getUserToken(function (token) {
            accessToken = token;
        });
        this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this));
    }

    /**
     * Called when the device has requested a state change (turned on or off).
     */
    async onCapabilityOnoff(value, opts) {
        this.log('Change ' + this.getName() + ' to ' + value);
        if (value) {
            this.log(this.getData().id + ': turn on!');
            await this.cloud.crownstone(this.getData().id).turnOn()
        } else if (!value){
            this.log(this.getData().id + ': turn off!');
            await this.cloud.crownstone(this.getData().id).turnOff()
        }
        //todo: handle errors
    }

    // this method is called when the Device is added
    onAdded() {
        this.log(this.getName() + ' has been added.');
        // todo register a capability listener for dimming if the Crownstone can be dimmed (use this.getData())
    }

    // this method is called when the Device is deleted
    onDeleted() {
        this.log(this.getName() + ' has been deleted.');
    }
}

module.exports = CrownstoneDevice;