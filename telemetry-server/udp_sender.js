const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const GEAR_VALUES = [-1, 0, 1, 2, 3, 4, 5, 6];
let rpm = 1000;
let speed = 90;
let gearIndex = 2; // Start at gear 1 (index 2)

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
  const buffer = Buffer.alloc(25);
  buffer.writeFloatLE(rpm, 16);
  buffer.writeFloatLE(speed, 20);
  buffer.writeInt8(GEAR_VALUES[gearIndex], 24);

  client.send(buffer, 3001, '127.0.0.1', (err) => {
    if (err) {
      console.error('Error when try to sent:', err);
    } else {
      console.log(`Sent: rpm=${rpm}, speed=${speed}, gear=${GEAR_VALUES[gearIndex]}`);
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