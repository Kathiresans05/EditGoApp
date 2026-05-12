import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { setupSockets } from './sockets';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error Logging Middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('--- SERVER ERROR ---');
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Socket.IO setup
setupSockets(io);

// Basic Route
app.get('/', (req, res) => {
  res.send('EditGo API is running...');
});

// Import and use routes
import authRoutes from './routes/auth.routes';
import orderRoutes from './routes/order.routes';

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
