import { Paciente, Consulta } from '../types';

export const pacienteActual: Paciente = {
    id: '1',
    nombre: 'María González Pérez',
    rut: '15.234.567-8',
    edad: 42,
    localidad: 'Pucón, Región de La Araucanía'
};

export const consultasAnteriores: Consulta[] = [
    {
        id: '1',
        fecha: '2024-03-15',
        diagnostico: 'Hipertensión arterial leve',
        estado: 'completada',
        medicamentos: 'Enalapril 10mg - 1 comprimido cada 12 horas',
        observaciones: 'Control en 30 días. Dieta baja en sal.'
    },
    {
        id: '2',
        fecha: '2024-02-28',
        diagnostico: 'Infección respiratoria aguda',
        estado: 'completada',
        medicamentos: 'Amoxicilina 500mg - 1 cápsula cada 8 horas por 7 días',
        observaciones: 'Evolución favorable. Completar tratamiento.'
    },
    {
        id: '3',
        fecha: '2024-01-20',
        diagnostico: 'Control preventivo',
        estado: 'completada',
        observaciones: 'Paciente sin síntomas. Continuar controles anuales.'
    }
];

export const medicoActual = {
    nombre: 'Dr. Carlos Martínez',
    especialidad: 'Medicina General',
    registro: 'RM-12345'
};
