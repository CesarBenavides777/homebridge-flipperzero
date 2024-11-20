import argparse
from pyflipper.pyflipper import PyFlipper
import serial.tools.list_ports as list_ports


def get_flipper_com_port():
    """Detect the USB port of Flipper Zero dynamically."""
    try:
        for port in list_ports.comports():
            if "Flipper" in port.description or "flip" in port.device.lower():
                return port.device
        return None
    except Exception as e:
        print(f"Error detecting Flipper Zero: {e}")
        return None


def verify_file_exists(flipper, remote_file_path):
    """Verify that a file exists on the Flipper Zero's filesystem."""
    try:
        file_info = flipper.storage.stat(file=remote_file_path)
        print(f"File exists: {remote_file_path}")
        return True
    except FileNotFoundError:
        print(f"File not found on Flipper: {remote_file_path}")
        return False
    except Exception as e:
        print(f"Error checking file existence: {e}")
        return False


def list_directory(flipper, path="/ext"):
    """List the contents of a directory on the Flipper Zero."""
    try:
        files = flipper.storage.list(path=path)
        print(f"Files in {path}: {files}")
        return files
    except Exception as e:
        print(f"Error listing directory {path}: {e}")
        return []


def send_subghz_signal(flipper, remote_file_path):
    """Transmit a Sub-GHz signal from a file on the Flipper Zero."""
    if not verify_file_exists(flipper, remote_file_path):
        print(f"Cannot transmit. File not found: {remote_file_path}")
        return

    try:
        # Read the Sub-GHz file content from Flipper Zero
        content = flipper.storage.read(file=remote_file_path)
        
        # If your Sub-GHz transmission expects decoding, you can manually implement it here.
        # For now, this assumes the content is usable directly by tx method:
        flipper.subghz.tx(content)
        print(f"Transmitted Sub-GHz signal from {remote_file_path}")
    except AttributeError as e:
        print("The 'tx_from_file' method is unavailable. Ensure pyflipper is up-to-date.")
    except Exception as e:
        print(f"Failed to transmit Sub-GHz signal: {e}")



def send_ir_signal(flipper, remote_file_path):
    """Transmit an IR signal from a file on the Flipper Zero."""
    if not verify_file_exists(flipper, remote_file_path):
        print(f"Cannot transmit. File not found: {remote_file_path}")
        return
    try:
        # Read the file content from Flipper Zero
        content = flipper.storage.read(file=remote_file_path)
        lines = content.splitlines()  # Split into lines
        for line in lines:
            if line.startswith('data:'):
                data = list(map(int, line.split()[1:]))
                flipper.ir.tx_raw(frequency=38000, duty_cycle=0.33, samples=data)
                print(f"Transmitted IR signal from {remote_file_path}")
                return
        print(f"No valid data found in {remote_file_path}")
    except Exception as e:
        print(f"Failed to transmit IR signal: {e}")



def main():
    parser = argparse.ArgumentParser(description="Control Flipper Zero via pyFlipper.")
    parser.add_argument('--send', type=str, required=True, help="Command to send (e.g., 'fan-high', 'light-toggle').")
    parser.add_argument('--type', type=str, choices=['subghz', 'ir'], required=True, help="Type of signal ('subghz' or 'ir').")
    parser.add_argument('--file', type=str, required=True, help="Path to the signal file.")
    args = parser.parse_args()

    try:
        # Detect the Flipper Zero device
        device = get_flipper_com_port()
        if not device:
            print("Flipper Zero not detected. Ensure it is connected via USB.")
            return

        # Connect to the Flipper Zero
        print(f"Connecting to Flipper Zero on {device}...")
        flipper = PyFlipper(com=device)
        print(f"Connected to Flipper Zero on {device}.")

        # Verify the file directory contents
        list_directory(flipper, "/ext/subghz")
        list_directory(flipper, "/ext/infrared")

        # Transmit the signal based on type
        if args.type == 'subghz':
            send_subghz_signal(flipper, args.file)
        elif args.type == 'ir':
            send_ir_signal(flipper, args.file)
        else:
            print(f"Unsupported signal type: {args.type}")
    except ImportError as e:
        print("Error: Ensure 'pyserial' and 'pyflipper' are installed properly.")
    except AttributeError as e:
        print(f"Error with serial module: {e}")
    except Exception as e:
        print(f"Failed to connect to Flipper Zero: {e}")


if __name__ == "__main__":
    main()
