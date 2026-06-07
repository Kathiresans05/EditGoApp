import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { setupSockets } from './sockets';

import path from 'path';

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

// Trust Render.com reverse proxy so req.protocol returns 'https'
app.set('trust proxy', 1);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Error Logging Middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('--- SERVER ERROR ---');
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Socket.IO setup
setupSockets(io);
app.set('io', io);

// Basic Route
app.get('/', (req, res) => {
  res.send('EditGo API is running...');
});

// Import and use routes
import authRoutes from './routes/auth.routes';
import orderRoutes from './routes/order.routes';
import adminRoutes from './routes/admin.routes';
import customerRoutes from './routes/customer.routes';
import paymentRoutes from './routes/payment.routes';
import editorRoutes from './routes/editor.routes';
import pricingRoutes from './routes/pricing.routes';
import settingRoutes from './routes/setting.routes';

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/editor', editorRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/settings', settingRoutes);


const PORT = process.env.PORT || 8000;

server.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
