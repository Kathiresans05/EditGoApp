import { Server, Socket } from 'socket.io';

export const setupSockets = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Editor joins a room to receive new order notifications in real-time
    socket.on('editor_online', (data: { editorId: string }) => {
      socket.join('editors_online');
      socket.join(`editor_${data.editorId}`);
      console.log(`Editor ${data.editorId} joined online room`);
    });

    // Editor goes offline — leave the room
    socket.on('editor_offline', (data: { editorId: string }) => {
      socket.leave('editors_online');
      socket.leave(`editor_${data.editorId}`);
      console.log(`Editor ${data.editorId} left online room`);
    });

    socket.on('join_order', (data: any) => {
      const orderId = typeof data === 'string' || typeof data === 'number' ? String(data) : String(data.orderId);
      const role = typeof data === 'string' || typeof data === 'number' ? 'User' : data.role;
      socket.join(orderId);
      console.log(`User joined order: ${orderId} as ${role}`);
      socket.to(orderId).emit('user_joined', { role, timestamp: new Date().toISOString() });
    });

    socket.on('send_message', (data: { orderId: string, message: string, senderId: string }) => {
      io.to(String(data.orderId)).emit('receive_message', data);
    });

    socket.on('order_status_update', (data: { orderId: string, status: string }) => {
      io.to(String(data.orderId)).emit('status_updated', data);
    });

    socket.on('call_user', (data: { orderId: string, senderId: string }) => {
      socket.to(String(data.orderId)).emit('incoming_call', data);
    });

    // WebRTC Signaling Events
    socket.on('webrtc_offer', (data: { orderId: string, offer: any, senderId: string }) => {
      socket.to(String(data.orderId)).emit('webrtc_offer', data);
    });

    socket.on('webrtc_answer', (data: { orderId: string, answer: any, senderId: string }) => {
      socket.to(String(data.orderId)).emit('webrtc_answer', data);
    });

    socket.on('webrtc_ice_candidate', (data: { orderId: string, candidate: any, senderId: string }) => {
      socket.to(String(data.orderId)).emit('webrtc_ice_candidate', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
