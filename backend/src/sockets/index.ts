import { Server, Socket } from 'socket.io';

export const setupSockets = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_order', (orderId: string) => {
      socket.join(orderId);
      console.log(`User joined order: ${orderId}`);
    });

    socket.on('send_message', (data: { orderId: string, message: string, senderId: string }) => {
      io.to(data.orderId).emit('receive_message', data);
    });

    socket.on('order_status_update', (data: { orderId: string, status: string }) => {
      io.to(data.orderId).emit('status_updated', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
