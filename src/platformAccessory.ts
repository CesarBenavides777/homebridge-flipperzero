import { Service, Characteristic, CharacteristicValue } from 'hap-nodejs';
import { exec } from 'child_process';
import { FlipperZeroPlatform } from './platform.js';
import { PlatformAccessory } from 'homebridge';

export class FlipperZeroAccessory {
  private service: Service;

  constructor(
    private readonly platform: FlipperZeroPlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    const device = accessory.context.device;

    this.accessory
      .getService(Service.AccessoryInformation)!
      .setCharacteristic(Characteristic.Manufacturer, 'Flipper Devices')
      .setCharacteristic(Characteristic.Model, 'Flipper Zero')
      .setCharacteristic(Characteristic.SerialNumber, device.uniqueId);

    this.service =
      this.accessory.getService(Service.Switch) ||
      this.accessory.addService(Service.Switch);

    this.service.setCharacteristic(Characteristic.Name, device.displayName);

    this.service
      .getCharacteristic(Characteristic.On)
      .onSet(this.setCommand.bind(this, 'onCommandFile'))
      .onGet(this.getStatus.bind(this));
  }

  async setCommand(commandFile: string, value: CharacteristicValue) {
    const device = this.accessory.context.device;
    // log the value
    this.platform.log.info(
      `Setting ${device.displayName} to ${value ? 'On' : 'Off'}`,
    );

    // Ensure that arguments with spaces are wrapped in quotes
    // eslint-disable-next-line max-len
    const commandToRun = `python3 /Users/CESARMAC/desktop/env/homebridge-flipperzero/src/commands/script.py --send "${device.displayName}" --type ${device.signalType} --file ${device[commandFile]}`;

    exec(commandToRun, (error, stdout, stderr) => {
      if (error) {
        this.platform.log.error(`Error executing command: ${stderr}`);
      } else {
        this.platform.log.info(`Command executed successfully: ${stdout}`);
      }
    });
  }

  async getStatus(): Promise<CharacteristicValue> {
    // Return a default status. Modify based on your requirements.
    return false;
  }
}
