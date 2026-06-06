const io = require('socket.io-client');
const socket = io('https://editgoapp.onrender.com');

const orderId = '6a22503a88a844ea27106556';

socket.on('connect', () => {
  console.log('Connected to PROD socket server as Listener');
  socket.emit('join_order', orderId);
});

socket.on('receive_message', (data) => {
  console.log('Received message on PROD:', data);
});

socket.on('incoming_call', (data) => {
  console.log('Received incoming_call on PROD:', data);
});

socket.on('connect_error', (err) => {
  console.error('PROD Connection error:', err);
});
