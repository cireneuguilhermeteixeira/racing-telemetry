const dgram = require('dgram');
const udpServer = dgram.createSocket('udp4');
const WebSocket = require('ws');
const http = require('http');

const PORT_UDP = 3001;
const PORT_WS = 8080;

const server = http.createServer();

const wss = new WebSocket.Server({ server });
const clients = new Set();



// Initializing UDP server
udpServer.on('listening', () => {
  const address = udpServer.address();
  console.log(`🚀 UDP Server listening on ${address.address}:${address.port}`);
});

udpServer.on('message', (msg, rinfo) => {
  console.log(` Message from ${rinfo.address}:${rinfo.port}`);

  const data = parseTelemetry(msg);
  console.log(data);

  const json = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  }
});

function parseTelemetry(buffer) {
  const rpm = buffer.readFloatLE(16);
  const speed = buffer.readFloatLE(20);
  const gear = buffer.readInt8(24);

  return { rpm, speed, gear };
}

udpServer.bind(PORT_UDP);

wss.on('connection', (ws) => {
  console.log('New  WebSocket client connected');
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconected');
  });
});

// Initializing WebSocket server
server.listen(PORT_WS, () => {
  console.log(`WebSocket Server listening on ws://localhost:${PORT_WS}`);
});