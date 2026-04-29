/**
 * ILiveKitService
 * 
 * I - Interface Segregation: Define el contrato para generación de tokens LiveKit.
 * D - Dependency Inversion: Los controladores dependen de esta abstracción.
 */
export interface ILiveKitService {
    getAccessToken(roomName: string, participantName: string): Promise<{ token: string }>;
}
