import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from './jwt';

/**
 * SocketConfig
 * 
 * S - Single Responsibility: Solo configura y maneja la lógica de Socket.io.
 * O - Open/Closed: Extensible para añadir nuevos eventos sin modificar la configuración base.
 */
export class SocketConfig {
    private io: Server;

    constructor(httpServer: HttpServer) {
        this.io = new Server(httpServer, {
            cors: { origin: '*', methods: ['GET', 'POST'] },
        });

        this.setupMiddleware();
        this.setupEvents();
    }

    private setupMiddleware(): void {
        this.io.use((socket: Socket, next) => {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error: Token missing'));
            }
            try {
                const decoded = jwt.verify(token, JWT_CONFIG.secret);
                socket.data.user = decoded;
                next();
            } catch (err) {
                next(new Error('Authentication error: Invalid token'));
            }
        });
    }

    private setupEvents(): void {
        this.io.on('connection', (socket: Socket) => {
            console.log('User connected to socket:', socket.id);

            socket.on('join-room', (roomId: string, userId: string) => {
                socket.join(roomId);
                console.log(`User ${userId} joined room: ${roomId}`);
                socket.to(roomId).emit('user-connected', userId);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });
    }

    public getIO(): Server {
        return this.io;
    }
}
