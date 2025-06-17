const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const message = Buffer.from('simulando UDP');
client.send(message, 3001, '127.0.0.1', (err) => {
  if (err) {
    console.error('Erro ao enviar:', err);
  } else {
    console.log('✅ Pacote enviado!');
  }
  client.close();
});