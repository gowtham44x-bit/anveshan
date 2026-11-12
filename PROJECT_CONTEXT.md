# PROJECT CONTEXT: All India Lake / Lake Monitoring System

## 1. Project Mission & Scope
The goal is to build an AI-based, off-grid lake monitoring system and a map-first civic geospatial console. It tracks water quality across India, identifies pollution causes using AI and local news, and provides actionable restoration steps based on Indian CPCB/BIS standards.

## 2. Physical Hardware Architecture (IoT Node)
The physical monitoring buoys consist of the following off-grid components:
* **Brain & Connectivity:** ESP32 Development Board, NEO-6M GPS module.
* **Water Quality Sensors:** Dissolved Oxygen (DO), Turbidity, Waterproof Temperature (DS18B20), pH (PH-4502C), and TDS Meter.
* **Off-Grid Power:** Mini solar panel, TP4056 charging module, and 18650 Lithium-ion batteries.

## 3. Frontend Dashboard Architecture
* **Stack:** Vite + React + TypeScript frontend backed by an Express server.
* **Interface:** A full-height India map (via a Google Maps JS proxy) with map/layer/time filters, a selected-lake detail panel, a history chart, and a lake-news panel (embedded via Google Programmable Search).
* **Hardware Health View:** A 10-part inventory tracking the physical health and connection status of every hardware component listed above:
  1. ESP32 Dev Board
  2. NEO-6M GPS Module
  3. Dissolved Oxygen (DO) Sensor
  4. Turbidity Sensor
  5. DS18B20 Temperature Sensor
  6. PH-4502C pH Sensor
  7. TDS Meter
  8. Mini Solar Panel
  9. TP4056 Charging Module
  10. 18650 Li-ion Battery Pack
* **Design Language:** Map-first civic cartography. Brand color: "Deep Estuary Green" (`#0E7468`). Voice: direct and evidence-first.

## 4. n8n Diagnostic Engine Integration
* **Production Webhook:** `https://supermanxo777.app.n8n.cloud/webhook/india-lake-monitor-ai`
* **Workflow Name:** `India Lake AI Diagnosis (Groq)` (ID: `CL6bCFtadsf0kmLX`)
* **Role:** Evaluates telemetry against CPCB rules, queries Tavily for local environmental news context, and uses Groq LLM (`openai/gpt-oss-120b`) to return causes, recovery actions, and regulatory bodies to notify.

## 5. Current Phase & Prototype Constraints
* Physical hardware is not yet deployed.
* The digital prototype operates on synthetic data. Every sensor reading, map sample, historical point, and component health value is explicitly badged as `SIMULATED` or `DEMO STREAM`.
