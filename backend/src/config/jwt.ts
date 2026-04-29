/**
 * JWT Configuration
 * 
 * S - Single Responsibility: Centraliza la configuración y utilidades JWT.
 */
export const JWT_CONFIG = {
    secret: process.env.JWT_SECRET || 'supersafesecretkey_change_in_production',
    expiresIn: '1d' as const,
};

export interface JwtPayload {
    sub: number;
    role: string;
    name: string;
}
