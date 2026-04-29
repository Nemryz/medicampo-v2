"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketConfig = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("./jwt");
/**
 * SocketConfig
 *
 * S - Single Responsibility: Solo configura y maneja la lógica de Socket.io.
 * O - Open/Closed: Extensible para añadir nuevos eventos sin modificar la configuración base.
 */
class SocketConfig {
    constructor(httpServer) {
        this.io = new socket_io_1.Server(httpServer, {
            cors: { origin: '*', methods: ['GET', 'POST'] },
        });
        this.setupMiddleware();
        this.setupEvents();
    }
    setupMiddleware() {
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error: Token missing'));
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, jwt_1.JWT_CONFIG.secret);
                socket.data.user = decoded;
                next();
            }
            catch (err) {
                next(new Error('Authentication error: Invalid token'));
            }
        });
    }
    setupEvents() {
        this.io.on('connection', (socket) => {
            console.log('User connected to socket:', socket.id);
            socket.on('join-room', (roomId, userId) => {
                socket.join(roomId);
                console.log(`User ${userId} joined room: ${roomId}`);
                socket.to(roomId).emit('user-connected', userId);
            });
            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });
    }
    getIO() {
        return this.io;
    }
}
exports.SocketConfig = SocketConfig;
