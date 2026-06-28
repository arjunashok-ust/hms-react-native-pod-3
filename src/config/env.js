/* Central environment / API configuration for the mobile app.
   - Emulator: 10.0.2.2 is the Android emulator's alias for the host's localhost.
   - Physical device: set USE_PHYSICAL_DEVICE = true and put your PC's LAN IP
     (or a tunnel/deployed URL) in LAN_IP. */
const USE_PHYSICAL_DEVICE = false;

const LAN_IP = "http://10.11.64.135:5000"; // PC's LAN IP (physical device)
const EMULATOR_HOST = "http://10.0.2.2:5000"; // emulator -> host localhost

export const API_BASE_URL = USE_PHYSICAL_DEVICE ? LAN_IP : EMULATOR_HOST;
