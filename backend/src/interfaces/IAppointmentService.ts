import { Appointment } from '@prisma/client';

/**
 * IAppointmentService
 * 
 * I - Interface Segregation: Define el contrato para el servicio de citas.
 * D - Dependency Inversion: Los controladores dependen de esta abstracción.
 */
export interface IAppointmentService {
    getDoctors(): Promise<any[]>;
    createAppointment(data: CreateAppointmentDto): Promise<Appointment>;
    getMyAppointments(userId: number, role: string): Promise<Appointment[]>;
    getAppointmentByRoomId(roomId: string): Promise<any>;
    updateAppointmentStatus(id: number, userId: number, status: string): Promise<Appointment>;
    deleteAllAppointments(role: string): Promise<void>;
}

export interface CreateAppointmentDto {
    doctorId: number;
    date: string;
    patientId: number;
}
