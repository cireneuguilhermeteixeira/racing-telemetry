const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const GEAR_VALUES = [-1, 0, 1, 2, 3, 4, 5, 6];
let rpm = 1000;
let speed = 90;
let gearIndex = 2; // Start at gear 1 (index 2)
let maxGear = 6;

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function getNextValue(current, min, max, step = 1) {
  // Randomly increment or decrement by up to step
  const delta = Math.floor(Math.random() * (2 * step + 1)) - step;
  return clamp(current + delta, min, max);
}

function getNextGear(currentIndex) {
  // Randomly shift up, down, or stay
  const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
  let nextIndex = clamp(currentIndex + delta, 0, GEAR_VALUES.length - 1);
  return nextIndex;
}

function sendTelemetry() {
  // Create a buffer for 100 floats (400 bytes)
  const buffer = Buffer.alloc(400);

  // Fill with random floats
  for (let i = 0; i < 100; i++) {
    buffer.writeFloatLE(Math.random() * 100, i * 4);
  }

  // Set specific indices to meaningful values
  buffer.writeFloatLE(rpm / 10, 37 * 4);      // index 37: rpm (scaled down)
  buffer.writeFloatLE(speed / 3.6, 25 * 4);   // index 25: speed (scaled down)
  buffer.writeFloatLE(GEAR_VALUES[gearIndex], 33 * 4); // index 33: gear
  buffer.writeFloatLE(maxGear, 65 * 4);       // index 65: maxGear

  client.send(buffer, 3001, '127.0.0.1', (err) => {
    if (err) {
      console.error('Error when try to sent:', err);
    } else {
      console.log(`Sent: rpm=${rpm}, speed=${speed}, gear=${GEAR_VALUES[gearIndex]}, maxGear=${maxGear}`);
    }
  });
}

function loop() {
  rpm = getNextValue(rpm, 800, 8000, 300);
  speed = getNextValue(speed, 0, 250, 5);
  gearIndex = getNextGear(gearIndex);
  sendTelemetry();
  setTimeout(loop, 800);
}

loop();

process.on('SIGINT', () => {
  client.close();
  console.log('\nUDP client closed.');
  process.exit();
});