# Homebridge Flipper Zero Plugin

<p align="center">
  <img src="https://github.com/homebridge/branding/raw/latest/logos/homebridge-wordmark-logo-vertical.png" width="150">
</p>
<p align="center">
    <img src="https://flipperzero.one/img/tild3535-6332-4530-b162-616165303162__orang_transparent.png" width="200 >
</p>

<p align="center">

# Homebridge Flipper Zero Plugin

</p>

> **Homebridge v2.0 Information**  
> This plugin supports both Homebridge v1 and v2.  
> - `package.json -> engines.homebridge` value: `"^1.8.0 || ^2.0.0-beta.0"`  
> - `package.json -> devDependencies.homebridge` value: `"^2.0.0-beta.0"`

## Overview

This plugin integrates Flipper Zero with Homebridge, exposing it as a HomeKit accessory. Use it to control Sub-GHz and IR signals from Flipper Zero via Apple Home.

## Features

- Control Flipper Zero as a HomeKit accessory.
- Support for Sub-GHz and Infrared signal transmission.
- Dynamic discovery of Flipper Zero devices connected via USB.

## Prerequisites

- **Node.js**: Version 18 or later.
- **Homebridge**: Version 1.8.0 or later.
- **Flipper Zero** with signal files stored on the device.
- **Python**: Version 3.8 or later, for executing signal commands.
- **pyFlipper**: Python library for interacting with Flipper Zero. Install it with:
  ```bash
  pip install pyflipper pyserial
  ```
## Installation
1. Clone:
   ```bash
   git clone https://github.com/CesarBenavides777/homebridge-flipperzero.git
    cd homebridge-flipperzero
   ```
2. Add this to homebridge Config:
```json
    {
  "platforms": [
    {
      "platform": "FlipperZeroPlatform",
      "name": "Flipper Zero",
      "devices": [
        {
          "uniqueId": "flipper-001",
          "displayName": "Living Room Flipper",
          "signalType": "subghz",
          "onCommandFile": "/path/to/on.command",
          "offCommandFile": "/path/to/off.command"
        }
      ]
    }
  ]
}
```
