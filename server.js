const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server });

const clients = new Map();
const conversations = {};

ws.on('message', (data) => {
  const messageData = JSON.parse(data);
  const friendSocket = getFriendSocket(messageData.from, messageData.to);
  if (friendSocket && friendSocket.readyState === WebSocket.OPEN) {
    const url = new URL(friendSocket.upgradeReq.url, 'https://foolman21.github.io/');
    const friendUsername = url.searchParams.get('username');
    if (friendUsername === messageData.to) {
      friendSocket.send(JSON.stringify({
        from: messageData.from,
        message: messageData.message
      }));
    }
  }
});

  // Create a new conversation if it doesn't exist
  if (!conversations[conversationKey]) {
    conversations[conversationKey] = [];
  }

  // Add the client to the conversation
  conversations[conversationKey].push(ws);

  // Set up the event listener for incoming messages
  ws.on('message', (data) => {
    const messageData = JSON.parse(data);
    const friendSocket = getFriendSocket(messageData.from, messageData.to);
    if (friendSocket) {
      friendSocket.send(JSON.stringify({
        from: messageData.from,
        message: messageData.message
      }));
    }
  });

  // Set up the event listener for closing the connection
  ws.on('close', () => {
    // Remove the client from the conversation
    const index = conversations[conversationKey].indexOf(ws);
    if (index !== -1) {
      conversations[conversationKey].splice(index, 1);
    }

    // If there are no more clients in the conversation, delete it
    if (conversations[conversationKey].length === 0) {
      delete conversations[conversationKey];
    }
  });
});

app.use(express.static('public'));

const listener = server.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

function getConversationKey(user1, user2) {
  return [user1, user2].sort().join('_');
}
function getFriendSocket(from, to) {
  const conversationKey = getConversationKey(from, to);
  const conversation = conversations[conversationKey];
  if (!conversation) {
    return null;
  }
  for (const socket of conversation) {
    if (socket.readyState === WebSocket.OPEN) {
      const url = new URL(socket.upgradeReq.url, 'https://foolman21.github.io/');
      const username = url.searchParams.get('username');
      if (username === to) {
        return socket;
      }
    }
  }
  return null;
}

function getFriendSocket(from, to) {
  const conversationKey = getConversationKey(from, to);
  const conversation = conversations[conversationKey];
  if (!conversation) {
    return null;
  }
  for (const socket of conversation) {
    if (socket.readyState === WebSocket.OPEN) {
      return socket;
    }
  }
  return null;
}
