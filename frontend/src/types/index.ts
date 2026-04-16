export interface Paciente {
    id: string;
    nombre: string;
    rut: string;
    edad: number;
    localidad: string;
}

export interface Consulta {
    id: string;
    fecha: string;
    diagnostico: string;
    estado: 'completada' | 'pendiente';
    medicamentos?: string;
    observaciones?: string;
}

export interface NotaClinica {
    diagnostico: string;
    medicamentos: string;
    observaciones: string;
}
