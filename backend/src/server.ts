import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { createServer } from 'http';
import authRoutes from './routes/authRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import clinicalRoutes from './routes/clinicalRoutes';
import livekitRoutes from './routes/livekitRoutes';
import { SocketConfig } from './config/socket';
import Database from './config/database';

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clinical', clinicalRoutes);
app.use('/api/livekit', livekitRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('mediCampo API is running with Sockets');
});

// Socket.io configuration (separated by Single Responsibility)
new SocketConfig(httpServer);

// Graceful shutdown
process.on('SIGINT', async () => {
  await Database.disconnect();
  process.exit(0);
});

httpServer.listen(PORT, () => {
  console.log(`Server & Secure WebRTC Socket is running on port ${PORT}`);
});
