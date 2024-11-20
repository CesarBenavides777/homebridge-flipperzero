import {
  API,
  DynamicPlatformPlugin,
  Logger,
  PlatformAccessory,
  PlatformConfig,
  Service,
  Characteristic,
} from 'homebridge';
import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js';
import { FlipperZeroAccessory } from './platformAccessory.js';


export class FlipperZeroPlatform implements DynamicPlatformPlugin {
  private readonly accessories: PlatformAccessory[] = [];
  public readonly Service: typeof Service;
  public readonly Characteristic: typeof Characteristic;

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.Service = this.api.hap.Service;
    this.Characteristic = this.api.hap.Characteristic;

    this.api.on('didFinishLaunching', () => {
      this.discoverDevices();
    });
  }

  configureAccessory(accessory: PlatformAccessory): void {
    this.log.info('Restoring accessory from cache:', accessory.displayName);
    this.accessories.push(accessory);
  }

  discoverDevices() {
    if (!this.config.devices || this.config.devices.length === 0) {
      this.log.error('No devices found in the configuration.');
      return;
    }

    this.log.debug('Loaded devices from configuration:', this.config.devices);

    for (const device of this.config.devices) {
      const uuid = this.api.hap.uuid.generate(device.uniqueId);
      const existingAccessory = this.accessories.find(
        (accessory) => accessory.UUID === uuid,
      );

      if (existingAccessory) {
        this.log.info(
          'Restoring existing accessory:',
          existingAccessory.displayName,
        );
        new FlipperZeroAccessory(this, existingAccessory);
      } else {
        this.log.info('Registering new accessory:', device.displayName);
        const accessory = new this.api.platformAccessory(
          device.displayName,
          uuid,
        );
        accessory.context.device = device;

        new FlipperZeroAccessory(this, accessory);
        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [
          accessory,
        ]);
      }
    }
  }
}
