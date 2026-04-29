import { ClinicalRecord, Appointment } from '@prisma/client';

/**
 * IClinicalService
 * 
 * I - Interface Segregation: Define el contrato para el servicio clínico.
 * D - Dependency Inversion: Los controladores dependen de esta abstracción.
 */
export interface IClinicalService {
    saveClinicalRecord(appointmentId: number, doctorId: number, data: ClinicalRecordDto): Promise<ClinicalRecord>;
    getPatientHistory(patientId: number, requesterId: number, requesterRole: string): Promise<Appointment[]>;
    getAppointmentRecord(appointmentId: number): Promise<ClinicalRecord | null>;
    getAdminStats(): Promise<AdminStatsDto>;
}

export interface ClinicalRecordDto {
    symptoms: string;
    diagnosis: string;
    prescription?: string;
    observations?: string;
    allergies?: string;
    weight?: number;
    height?: number;
    bloodPressure?: string;
    temperature?: number;
    heartRate?: number;
    oxygenSat?: number;
}

export interface AdminStatsDto {
    totalPatients: number;
    totalDoctors: number;
    totalAppointments: number;
    completedAppointments: number;
    recentAppointments: Appointment[];
}
