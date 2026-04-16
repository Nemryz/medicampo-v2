import { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Shield, Clock } from 'lucide-react';
import { medicoActual } from '../data/mockData';

export default function Videollamada() {
    const [microfonoActivo, setMicrofonoActivo] = useState(true);
    const [camaraActiva, setCamaraActiva] = useState(true);
    const [tiempoLlamada, setTiempoLlamada] = useState('12:34');

    const finalizarLlamada = () => {
        alert('Llamada finalizada. Gracias por usar MediCampo.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-green-600 text-white px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Shield size={20} />
                            <span className="font-medium">Conexión segura y privada</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock size={18} />
                            <span className="text-sm">{tiempoLlamada}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
                        <div className="lg:col-span-3">
                            <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                                    <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-5xl font-bold">
                                            {medicoActual.nombre.split(' ')[1][0]}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-bold mb-2">{medicoActual.nombre}</h2>
                                    <p className="text-xl text-blue-300">{medicoActual.especialidad}</p>
                                    <p className="text-sm text-gray-400 mt-2">Reg. Médico: {medicoActual.registro}</p>
                                </div>

                                <div className="absolute top-4 right-4 bg-gray-800 rounded-lg overflow-hidden w-48 aspect-video shadow-lg border-2 border-white">
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 to-blue-900">
                                        {camaraActiva ? (
                                            <>
                                                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                                                    <span className="text-2xl font-bold text-white">Yo</span>
                                                </div>
                                                <p className="text-xs text-white">Mi cámara</p>
                                            </>
                                        ) : (
                                            <>
                                                <VideoOff size={32} className="text-white mb-2" />
                                                <p className="text-xs text-white">Cámara desactivada</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
                                <div className="flex justify-center items-center space-x-4">
                                    <button
                                        onClick={() => setMicrofonoActivo(!microfonoActivo)}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${microfonoActivo
                                                ? 'bg-white text-blue-600 hover:bg-gray-100'
                                                : 'bg-red-500 text-white hover:bg-red-600'
                                            }`}
                                        title={microfonoActivo ? 'Silenciar micrófono' : 'Activar micrófono'}
                                    >
                                        {microfonoActivo ? <Mic size={24} /> : <MicOff size={24} />}
                                    </button>

                                    <button
                                        onClick={() => setCamaraActiva(!camaraActiva)}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${camaraActiva
                                                ? 'bg-white text-blue-600 hover:bg-gray-100'
                                                : 'bg-red-500 text-white hover:bg-red-600'
                                            }`}
                                        title={camaraActiva ? 'Desactivar cámara' : 'Activar cámara'}
                                    >
                                        {camaraActiva ? <Video size={24} /> : <VideoOff size={24} />}
                                    </button>

                                    <button
                                        onClick={finalizarLlamada}
                                        className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all transform hover:scale-110"
                                        title="Finalizar llamada"
                                    >
                                        <PhoneOff size={24} />
                                    </button>
                                </div>

                                <div className="mt-4 text-center">
                                    <p className="text-white text-sm">
                                        {microfonoActivo ? '🎤 Micrófono activo' : '🔇 Micrófono silenciado'} •
                                        {camaraActiva ? ' 📹 Cámara activa' : ' 📷 Cámara desactivada'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-blue-50 rounded-xl p-6 space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Información de la Consulta</h3>

                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Fecha y hora</p>
                                    <p className="text-sm font-semibold text-gray-800">29 de Marzo, 2024</p>
                                    <p className="text-sm text-gray-600">14:30 hrs</p>
                                </div>

                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Tipo de consulta</p>
                                    <p className="text-sm font-semibold text-gray-800">Control de rutina</p>
                                </div>

                                <div className="bg-green-100 border border-green-300 rounded-lg p-4 mt-6">
                                    <div className="flex items-start space-x-2">
                                        <Shield className="text-green-700 mt-0.5" size={20} />
                                        <div>
                                            <p className="text-sm font-semibold text-green-800">Sesión Segura</p>
                                            <p className="text-xs text-green-700 mt-1">
                                                Esta videollamada está protegida con encriptación de extremo a extremo.
                                                Su privacidad médica está garantizada.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mt-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Recordatorio:</strong> Puede compartir síntomas, mostrar documentos
                                        o hacer preguntas al médico durante la consulta.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
