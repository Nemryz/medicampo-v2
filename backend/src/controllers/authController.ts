import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersafesecretkey_change_in_production';

export const register = async (req: Request, res: Response): Promise<void> => {
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor al registrar' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ error: 'Credenciales inválidas.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'Credenciales inválidas.' });
      return;
    }

    const payload = {
      sub: user.id,
      role: user.role,
      name: user.name
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno al iniciar sesión' });
  }
};
