const io = require('socket.io-client');
const socket = io('http://localhost:8000');

const orderId = '6a22503a88a844ea27106556';

socket.on('connect', () => {
  console.log('Connected to socket server as Listener');
  socket.emit('join_order', orderId);
});

socket.on('receive_message', (data) => {
  console.log('Received message:', data);
});

socket.on('incoming_call', (data) => {
  console.log('Received incoming_call:', data);
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err);
});
