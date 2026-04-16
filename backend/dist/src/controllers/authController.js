"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersafesecretkey_change_in_production';
const register = async (req, res) => {
    try {
        const { rut, name, email, password } = req.body;
        // Verificar si existe
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { rut }]
            }
        });
        if (existingUser) {
            res.status(400).json({ error: 'El usuario con ese correo o RUT ya existe.' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const newUser = await prisma.user.create({
            data: {
                rut,
                name,
                email,
                password: hashedPassword,
                role: 'PATIENT' // Por defecto
            }
        });
        res.status(201).json({ message: 'Usuario registrado exitosamente', user: { id: newUser.id, name: newUser.name, email: newUser.email } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al registrar' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ error: 'Credenciales inválidas.' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: 'Credenciales inválidas.' });
            return;
        }
        const payload = {
            sub: user.id,
            role: user.role,
            name: user.name
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno al iniciar sesión' });
    }
};
exports.login = login;
