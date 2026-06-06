const io = require('socket.io-client');
const socket = io('http://localhost:8000');

const orderId = '6a22503a88a844ea27106556';
const editorId = '6a056206d27e3b7dccac9164';

socket.on('connect', () => {
  console.log('Connected to socket server as Editor');
  socket.emit('join_order', orderId);
  
  console.log('Emitting __CALL_RINGING__...');
  socket.emit('send_message', {
    orderId,
    message: '__CALL_RINGING__',
    senderId: editorId
  });

  setTimeout(() => {
    console.log('Done emitting. Disconnecting.');
    socket.disconnect();
    process.exit(0);
  }, 2000);
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err);
});
