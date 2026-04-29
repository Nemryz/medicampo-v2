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
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const appointmentRoutes_1 = __importDefault(require("./routes/appointmentRoutes"));
const clinicalRoutes_1 = __importDefault(require("./routes/clinicalRoutes"));
const livekitRoutes_1 = __importDefault(require("./routes/livekitRoutes"));
const socket_1 = require("./config/socket");
const database_1 = __importDefault(require("./config/database"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const httpServer = (0, http_1.createServer)(app);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/appointments', appointmentRoutes_1.default);
app.use('/api/clinical', clinicalRoutes_1.default);
app.use('/api/livekit', livekitRoutes_1.default);
// Health check
app.get('/', (req, res) => {
    res.send('mediCampo API is running with Sockets');
});
// Socket.io configuration (separated by Single Responsibility)
new socket_1.SocketConfig(httpServer);
// Graceful shutdown
process.on('SIGINT', async () => {
    await database_1.default.disconnect();
    process.exit(0);
});
httpServer.listen(PORT, () => {
    console.log(`Server & Secure WebRTC Socket is running on port ${PORT}`);
});
