import { Service, Characteristic, CharacteristicValue } from "hap-nodejs";
import { exec } from "child_process";
import { FlipperZeroPlatform } from "./platform";
import { PlatformAccessory } from "homebridge";

export class FlipperZeroAccessory {
  private service: Service;

  constructor(
    private readonly platform: FlipperZeroPlatform,
    private readonly accessory: PlatformAccessory
  ) {
    const device = accessory.context.device;

    // Set accessory information
    this.accessory
      .getService(Service.AccessoryInformation)!
      .setCharacteristic(Characteristic.Manufacturer, "Flipper Devices")
      .setCharacteristic(Characteristic.Model, "Flipper Zero")
      .setCharacteristic(Characteristic.SerialNumber, "123-456-789");

    // Create or retrieve the Switch service
    this.service =
      this.accessory.getService(Service.Switch) ||
      this.accessory.addService(Service.Switch);

    // Set the service name
    this.service.setCharacteristic(Characteristic.Name, device.displayName);

    // Register handlers for the On characteristic
    this.service
      .getCharacteristic(Characteristic.On)
      .onSet(this.setOn.bind(this));
  }

  // Handle "On" characteristic changes
  async setOn(value: CharacteristicValue) {
    const device = this.accessory.context.device;
    const command = value ? device.onCommand : device.offCommand;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        this.platform.log.error(`Error executing command: ${stderr}`);
      } else {
        this.platform.log.info(`Command executed successfully: ${stdout}`);
      }
    });
  }
}
