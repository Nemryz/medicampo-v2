import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/authRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import clinicalRoutes from './routes/clinicalRoutes';
import livekitRoutes from './routes/livekitRoutes';

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

const JWT_SECRET = process.env.JWT_SECRET || 'supersafesecretkey_change_in_production';

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clinical', clinicalRoutes);
app.use('/api/livekit', livekitRoutes);

app.get('/', (req, res) => {
  res.send('mediCampo API is running with Sockets');
});

// Inicializando Socket.io y lógica de salas WebRTC
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware de Socket para verificar JWT
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: Token missing'));
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.data.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('User connected to socket:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room: ${roomId}`);
    socket.to(roomId).emit('user-connected', userId);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server & Secure WebRTC Socket is running on port ${PORT}`);
});
