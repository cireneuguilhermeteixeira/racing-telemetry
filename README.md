# Racing Telemetry

This project is split into two main parts: **Server** and **Client**.

---

## Server (`telemetry-server/`)

The server is responsible for receiving telemetry data from the game **Dirt Rally 2.0**. It leverages the SIM Dashboard resource called **"Forward UDP Telemetry"** to capture real-time UDP packets sent by the game.

### How it works
- **UDP Telemetry Reception:** The server listens for incoming UDP packets containing telemetry data from Dirt Rally 2.0.
- **Parsing UDP Data:** The telemetry data is sent as a sequence of 4-byte floats. The server parses the incoming buffer by reading every 4 bytes and converting them into floating-point numbers. This approach is necessary because the telemetry protocol transmits all values as 32-bit floats, and parsing them in 4-byte chunks ensures accurate data extraction.
- **WebSocket Broadcasting:** After parsing, the server broadcasts the telemetry data via WebSocket to `0.0.0.0`, making it accessible to all devices on your internal network. This allows any device connected to your network to receive real-time telemetry updates.

---

## Client (`telemetry-app/`)

The client is a React Native application that visualizes the telemetry data in real time.

### Key Libraries
- **react-native-reanimated:** Used for smooth, performant animations within the app.
- **react-native-svg:** Enables rendering of scalable vector graphics, which is essential for drawing custom gauges, dials, and other dashboard elements.

### Features
- **Dashboard Panels:** The app includes multiple dashboard panels, such as a basic RPM dashboard and a Civic G10-inspired dashboard. These panels display real-time information like gear, RPM, and speed, closely mimicking the look and feel of real car dashboards.
- **Live Telemetry:** The app connects to the server via WebSocket to receive live updates, ensuring the dashboard reflects the current state of the car in-game.

### Project Structure
- `src/pages/`: Contains main screens and panels for the app.
- `src/pannels/`: Houses different dashboard implementations (e.g., `basic_rpm_dashboard`, `civic_g10_dashboard`), each with their own components for displaying telemetry data.
- `src/services/`: Includes the WebSocket client for connecting to the server.
- `src/contexts/`: Provides React context for managing WebSocket state and sharing telemetry data across components.
- `src/utils.ts`: Utility functions used throughout the app.

---

## Summary
This project enables real-time visualization of Dirt Rally 2.0 telemetry data on any device in your network. The server efficiently parses and broadcasts telemetry, while the client delivers a visually rich, animated dashboard experience using modern React Native technologies.

---
![image](https://github.com/user-attachments/assets/021a9a49-1c77-4970-b0d8-85a680c880db)

## Demo

[![Watch the demo](https://img.youtube.com/vi/xNK9pjLGo4M/0.jpg)](https://youtu.be/xNK9pjLGo4M)

Watch a demonstration of the Racing Telemetry project in action on [YouTube](https://youtu.be/xNK9pjLGo4M).
