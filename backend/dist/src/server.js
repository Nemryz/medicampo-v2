"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const appointmentRoutes_1 = __importDefault(require("./routes/appointmentRoutes"));
const clinicalRoutes_1 = __importDefault(require("./routes/clinicalRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const httpServer = (0, http_1.createServer)(app);
const JWT_SECRET = process.env.JWT_SECRET || 'supersafesecretkey_change_in_production';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/appointments', appointmentRoutes_1.default);
app.use('/api/clinical', clinicalRoutes_1.default);
app.get('/', (req, res) => {
    res.send('mediCampo API is running with Sockets');
});
// Inicializando Socket.io y lógica de salas WebRTC
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: '*' }
});
// Middleware de Socket para verificar JWT
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error: Token missing'));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        socket.data.user = decoded;
        next();
    }
    catch (err) {
        next(new Error('Authentication error: Invalid token'));
    }
});
io.on('connection', (socket) => {
    const user = socket.data.user;
    console.log(`Usuario autenticado en socket [${user.role}]: ${user.name}`);
    socket.on('join-room', (roomId, peerId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', peerId);
        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', peerId);
        });
    });
});
httpServer.listen(PORT, () => {
    console.log(`Server & Secure WebRTC Socket is running on port ${PORT}`);
});
