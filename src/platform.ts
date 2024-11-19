import {
  API,
  DynamicPlatformPlugin,
  Logger,
  PlatformAccessory,
  PlatformConfig,
} from "homebridge";
import { PLATFORM_NAME, PLUGIN_NAME } from "./settings";
import { FlipperZeroAccessory } from "./platformAccessory";

export class FlipperZeroPlatform implements DynamicPlatformPlugin {
  private readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API
  ) {
    this.api.on("didFinishLaunching", () => {
      this.discoverDevices();
    });
  }

  // Method to handle restored accessories
  configureAccessory(accessory: PlatformAccessory): void {
    this.log.info("Restoring accessory from cache:", accessory.displayName);
    this.accessories.push(accessory);
  }

  // Method to discover and register new devices
  discoverDevices() {
    const devices = [
      {
        uniqueId: "flipper-zero-device",
        displayName: "Flipper Zero Device",
        onCommand: "python3 /path/to/your/script.py --send on",
        offCommand: "python3 /path/to/your/script.py --send off",
      },
    ];

    for (const device of devices) {
      const uuid = this.api.hap.uuid.generate(device.uniqueId);
      const existingAccessory = this.accessories.find(
        (accessory) => accessory.UUID === uuid
      );

      if (existingAccessory) {
        this.log.info(
          "Existing accessory found:",
          existingAccessory.displayName
        );
        new FlipperZeroAccessory(this, existingAccessory);
      } else {
        this.log.info("Adding new accessory:", device.displayName);
        const accessory = new this.api.platformAccessory(
          device.displayName,
          uuid
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
