const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const messageData = JSON.parse(data);
    const { from, to, message } = messageData;

    if (!clients.has(to)) {
      return;
    }

    const friendSocket = clients.get(to);
    friendSocket.send(JSON.stringify({
      from: from,
      message: message
    }));
  });
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});
