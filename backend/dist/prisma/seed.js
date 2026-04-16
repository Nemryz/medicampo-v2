"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Iniciando seed de cuentas demo...');
    const salt = await bcryptjs_1.default.genSalt(10);
    // 1. Crear Especialidades
    const especialidadGP = await prisma.specialty.upsert({
        where: { name: 'Medicina General' },
        update: {},
        create: { name: 'Medicina General' }
    });
    const especialidadCardiologia = await prisma.specialty.upsert({
        where: { name: 'Cardiología' },
        update: {},
        create: { name: 'Cardiología' }
    });
    // 2. Cuenta Admin
    await prisma.user.upsert({
        where: { email: 'admin@medicampo.cl' },
        update: {},
        create: {
            name: 'Administrador Sistema',
            rut: '11111111-1',
            email: 'admin@medicampo.cl',
            password: await bcryptjs_1.default.hash('medicampo123', salt),
            role: 'ADMIN',
        }
    });
    // 3. Cuenta Médico
    await prisma.user.upsert({
        where: { email: 'doctor@medicampo.cl' },
        update: {},
        create: {
            name: 'Dr. Carlos Martínez',
            rut: '22222222-2',
            email: 'doctor@medicampo.cl',
            password: await bcryptjs_1.default.hash('medicampo123', salt),
            role: 'DOCTOR',
            specialtyId: especialidadGP.id,
        }
    });
    // 4. Segunda cuenta Médico para tener más opciones
    await prisma.user.upsert({
        where: { email: 'dra.silva@medicampo.cl' },
        update: {},
        create: {
            name: 'Dra. Ana Silva',
            rut: '33333333-3',
            email: 'dra.silva@medicampo.cl',
            password: await bcryptjs_1.default.hash('medicampo123', salt),
            role: 'DOCTOR',
            specialtyId: especialidadCardiologia.id,
        }
    });
    // 5. Cuenta Paciente
    await prisma.user.upsert({
        where: { email: 'paciente@medicampo.cl' },
        update: {},
        create: {
            name: 'Juan Pérez García',
            rut: '44444444-4',
            email: 'paciente@medicampo.cl',
            password: await bcryptjs_1.default.hash('medicampo123', salt),
            role: 'PATIENT',
        }
    });
    console.log('✅ Cuentas demo creadas exitosamente:');
    console.log('');
    console.log('  🛡️  Admin     → admin@medicampo.cl       / medicampo123');
    console.log('  🩺  Médico    → doctor@medicampo.cl      / medicampo123');
    console.log('  🩺  Médico 2  → dra.silva@medicampo.cl   / medicampo123');
    console.log('  👤  Paciente  → paciente@medicampo.cl    / medicampo123');
    console.log('');
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
