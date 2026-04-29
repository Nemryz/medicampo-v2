import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Activity, User, Stethoscope, ArrowRight } from 'lucide-react';

/**
 * LiveKitTest Component (Sandbox)
 * 
 * DESCRIPCIÓN:
 * Este componente actúa como un entorno de pruebas aislado (Sandbox).
 * Permite validar la conexión con el servidor de LiveKit sin depender del flujo de citas real.
 * 
 * CÓMO FUNCIONA:
 * 1. Ofrece dos perfiles preconfigurados: Doctor y Paciente.
 * 2. Al seleccionar uno, genera un roomId de prueba ('test-room-123').
 * 3. Redirige a la interfaz de videollamada usando datos simulados.
 * 
 * CÓMO MODIFICARLO:
 * - Para cambiar el nombre de la sala de prueba: Edita la constante 'TEST_ROOM_ID'.
 * - Para añadir más roles: Añade más botones en el renderizado.
 */
const LiveKitTest: React.FC = () => {
    const navigate = useNavigate();
    const TEST_ROOM_ID = 'test-room-livekit';

    const startTest = (role: 'DOCTOR' | 'PATIENT') => {
        // MOCK AUTH: Simulamos un usuario logueado para que apiFetch funcione
        const testUser = {
            id: role === 'DOCTOR' ? 999 : 888,
            name: role === 'DOCTOR' ? 'Dr. Carlos Martínez' : 'Juan Pérez García',
            role: role,
            email: 'test@medicampo.cl'
        };

        // Guardamos en localStorage para que el AuthContext lo detecte tras recargar
        localStorage.setItem('medicampo_user', JSON.stringify(testUser));
        // Nota: En un entorno real usaríamos un token JWT real, 
        // pero para el Sandbox esto permitirá que los componentes carguen el perfil.

        console.log(`[Sandbox] Iniciando como: ${testUser.name}`);

        // Redirigimos a la videollamada
        navigate(`/room/${TEST_ROOM_ID}`);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
            <div className="max-w-4xl w-full">
                {/* Header del Laboratorio */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-4">
                        <Activity className="text-emerald-500 w-4 h-4 animate-pulse" />
                        <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Laboratorio de Conectividad</span>
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4">Prueba de Videollamada SFU</h1>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Utiliza este entorno para verificar que tu cámara, micrófono y el servidor LiveKit
                        en DigitalOcean están funcionando correctamente.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Opción Doctor */}
                    <div className="group bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem] hover:border-emerald-500/50 transition-all duration-500 cursor-pointer"
                        onClick={() => startTest('DOCTOR')}>
                        <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-900/20">
                            <Stethoscope className="text-white w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Entrar como Médico</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            Verifica la interfaz del doctor, el panel de diagnóstico y la gestión de la ficha clínica.
                        </p>
                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                            Iniciar sesión de prueba <ArrowRight size={16} />
                        </div>
                    </div>

                    {/* Opción Paciente */}
                    <div className="group bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem] hover:border-blue-500/50 transition-all duration-500 cursor-pointer"
                        onClick={() => startTest('PATIENT')}>
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-900/20">
                            <User className="text-white w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Entrar como Paciente</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            Prueba la experiencia del paciente, la recepción de video y el chat de soporte.
                        </p>
                        <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                            Iniciar sesión de prueba <ArrowRight size={16} />
                        </div>
                    </div>
                </div>

                {/* Footer de Seguridad */}
                <div className="mt-12 flex items-center justify-center gap-3 text-gray-600 border-t border-gray-900 pt-8">
                    <Shield size={16} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Conexión Segura vía medicampo-rtc.duckdns.org</span>
                </div>
            </div>
        </div>
    );
};

export default LiveKitTest;
