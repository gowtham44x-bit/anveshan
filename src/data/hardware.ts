import { HardwareComponent } from '../types/lake';

export const HARDWARE_COMPONENTS: HardwareComponent[] = [
  {
    id: 1,
    name: "1. ESP32 Dev Board",
    status: "ONLINE",
    badgeColor: "emerald",
    description: "Central processing microcontroller & LoRa/WiFi transceiver for telemetry telemetry.",
    metrics: {
      "CPU Load": "14.2%",
      "Free Heap": "198 KB",
      "RSSI": "-68 dBm",
      "Uptime": "18d 6h"
    }
  },
  {
    id: 2,
    name: "2. NEO-6M GPS Module",
    status: "LOCKED",
    badgeColor: "emerald",
    description: "Geospatial positioning & clock synchronization for telemetry timestamps.",
    metrics: {
      "Satellites": "9 Sats",
      "HDOP": "0.92",
      "Fix Time": "34s TTFF",
      "Drift": "±1.4m"
    }
  },
  {
    id: 3,
    name: "3. Galvanic DO Sensor",
    status: "HEALTHY",
    badgeColor: "emerald",
    description: "Electrochemical membrane probe measuring oxygen dissolved in water.",
    metrics: {
      "Output mV": "24.8 mV",
      "Membrane": "Clean",
      "Calib Drift": "0.04%",
      "Electrolyte": "88%"
    }
  },
  {
    id: 4,
    name: "4. Optical Turbidity Sensor",
    status: "DIRT ALERT",
    badgeColor: "amber",
    description: "Infrared optical scattering probe for suspended particulates & silt.",
    metrics: {
      "Transmittance": "62%",
      "LED Current": "20.4 mA",
      "Bio-fouling": "Moderate",
      "Wiper Cycle": "Every 4h"
    }
  },
  {
    id: 5,
    name: "5. DS18B20 Temp Sensor",
    status: "HEALTHY",
    badgeColor: "emerald",
    description: "Waterproof stainless steel 1-Wire thermal probe.",
    metrics: {
      "Reading": "29.5 °C",
      "CRC Checks": "100% OK",
      "Resolution": "12-bit",
      "Seal Status": "IP68 OK"
    }
  },
  {
    id: 6,
    name: "6. PH-4502C pH Module",
    status: "CALIBRATED",
    badgeColor: "emerald",
    description: "Glass electrode with signal conditioning amplifier board.",
    metrics: {
      "Offset": "2.48 V",
      "Slope": "-59.2 mV/pH",
      "Impedance": "Normal",
      "Reference": "KCl Stable"
    }
  },
  {
    id: 7,
    name: "7. Analog TDS Meter",
    status: "ACTIVE",
    badgeColor: "emerald",
    description: "AC excitation conductivity sensor preventing electrode polarization.",
    metrics: {
      "Frequency": "1.0 kHz AC",
      "Cell Constant": "K=1.0",
      "Polarization": "Zero",
      "Probe Wear": "94%"
    }
  },
  {
    id: 8,
    name: "8. Mini Solar Panel",
    status: "HARVESTING",
    badgeColor: "emerald",
    description: "Monocrystalline 6V 3.5W panel for autonomous day charging.",
    metrics: {
      "Output Voc": "5.82 V",
      "Current": "480 mA",
      "Irradiance": "840 W/m²",
      "Daily Yield": "14.8 Wh"
    }
  },
  {
    id: 9,
    name: "9. TP4056 Charge Controller",
    status: "CC CHARGING",
    badgeColor: "emerald",
    description: "Constant-current / constant-voltage lithium charge management IC.",
    metrics: {
      "Regulated V": "4.18 V",
      "Charge Rate": "1000 mA",
      "Thermals": "36.5 °C OK",
      "Protection": "DW01 Active"
    }
  },
  {
    id: 10,
    name: "10. 18650 Li-ion Cells (2P)",
    status: "88% S.O.C.",
    badgeColor: "emerald",
    description: "5200mAh dual 18650 battery bank powering off-grid night ops.",
    metrics: {
      "Voltage": "4.04 V",
      "Capacity": "4580 mAh",
      "Cycles": "42 / 500",
      "Autonomy": "72h Reserve"
    }
  }
];
