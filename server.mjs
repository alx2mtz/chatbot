// server.js
import express from 'express';
import http from 'http';
import { createServer } from 'http';
import { WebSocketServer } from 'ws'; // Cambio aquí
import fs from 'fs';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ noServer: true }); // Cambio aquí

app.get('/host', (req, res) => {
  fs.readFile('publico/host.html', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error loading host.html');
    } else {
      res.send(data);
    }
  });
});

app.get('/client', (req, res) => {
  fs.readFile('publico/chat.html', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error loading client.html');
    } else {
      res.send(data);
    }
  });
});

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('message', (message) => {
    console.log('Mensaje recibido:', message);
  
    // Convertir el mensaje a cadena de texto
    const textMessage = message.toString();
  
    // Broadcast el mensaje a todos los clientes conectados.
    clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        if (typeof textMessage === 'string') {
          client.send(textMessage);
        } else {
          console.error('Error: Mensaje no es una cadena de texto:', textMessage);
        }
      }
    });
  });
  
  ws.on('close', () => {
    clients.delete(ws);
  });
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});