const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const PORT = 3001;

server.on('listening', () => {
  const address = server.address();
  console.log(`🚀 UDP Server listening on ${address.address}:${address.port}`);
});

server.on('message', (msg, rinfo) => {
  console.log(`📦 Message from ${rinfo.address}:${rinfo.port}`);
  console.log(msg); // Raw buffer
  console.log(parseTelemetry(msg)); // Decoded data
});

/**
 * Exemplo básico para interpretar os primeiros bytes.
 * A estrutura completa do protocolo precisa ser conhecida para parse completo.
 */
function parseTelemetry(buffer) {
  // Exemplo: pegar apenas os primeiros campos como RPM, velocidade etc.
  const rpm = buffer.readFloatLE(16);       // offset 16
  const speed = buffer.readFloatLE(20);     // offset 20
  const gear = buffer.readInt8(24);         // offset 24

  return { rpm, speed, gear };
}

server.bind(PORT);
