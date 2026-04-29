/**
 * ILiveKitService
 * 
 * I - Interface Segregation: Define el contrato para generacion de tokens LiveKit.
 * D - Dependency Inversion: Los controladores dependen de esta abstraccion.
 */
export interface ILiveKitService {
    getAccessToken(roomName: string, participantName: string, userId?: number): Promise<{ token: string }>;
}
