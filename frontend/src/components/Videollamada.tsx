import React, { useState, useEffect } from 'react';
import {
    PhoneOff, Shield, Clock, Loader2, Save, Stethoscope, MessageSquare
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    LiveKitRoom,
    RoomAudioRenderer,
    ControlBar,
    useToken,
    GridLayout,
    ParticipantTile,
    useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';

import { useAuth } from '../context/AuthContext';
import { API_URL, apiFetch } from '../lib/api';
import { ChatConsulta } from './ChatConsulta';

/**
 * EscenarioVideo (Sub-componente Modular)
 * 
 * POR QUÉ ESTÁ AQUÍ:
 * LiveKit requiere que hooks como 'useTracks' se usen DENTRO del contexto de <LiveKitRoom>.
 * Mover esta lógica aquí soluciona el error "No room provided" y permite que el video cargue.
 */
const EscenarioVideo = () => {
    // Obtenemos los tracks de video para la grilla manual de forma simplificada
    const tracks = useTracks(
        [Track.Source.Camera, Track.Source.ScreenShare],
        { onlySubscribed: false },
    );

    return (
        <div className="flex-1 flex items-center justify-center bg-black overflow-hidden relative">
            {tracks.length > 0 ? (
                <GridLayout tracks={tracks} className="w-full h-full">
                    <ParticipantTile />
                </GridLayout>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                    <p className="text-gray-500 text-sm animate-pulse">Sincronizando medios...</p>
                </div>
            )}
        </div>
    );
};

export default function Videollamada() {
    const { user } = useAuth();
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();

    const [tiempoLlamada, setTiempoLlamada] = useState('00:00');
    const [appointment, setAppointment] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showChat, setShowChat] = useState(false);

    const [formData, setFormData] = useState({
        symptoms: '', diagnosis: '', prescription: '', weight: '', height: '', bloodPressure: '', temperature: ''
    });

    // Validamos roomId para evitar errores de LiveKit si el parámetro no llega.
    const token = useToken(`${API_URL}/api/livekit/token`, roomId || 'default-room', {
        userInfo: {
            identity: user?.name || 'Usuario',
            name: user?.name || 'Usuario',
        },
    });

    useEffect(() => {
        if (!roomId) return;

        // MODO SANDBOX: Si la sala es de prueba, usamos datos simulados
        if (roomId === 'test-room-livekit') {
            setAppointment({
                id: 0,
                patient: { name: 'Paciente de Prueba', rut: '12.345.678-9' },
                doctor: { name: 'Dr. de Prueba', specialty: { name: 'Medicina Experimental' } }
            });
            return;
        }

        // MODO REAL: Obtenemos la cita de la API
        apiFetch(`/api/appointments/room/${roomId}`)
            .then(r => r.json())
            .then(data => {
                if (data.id) {
                    setAppointment(data);
                } else {
                    setAppointment({
                        id: 0,
                        patient: { name: 'Usuario Externo', rut: 'N/A' },
                        doctor: { name: 'Médico MediCampo', specialty: { name: 'Consulta General' } }
                    });
                }
            })
            .catch(err => {
                console.error('Error cargando cita:', err);
                setAppointment({
                    id: 0,
                    patient: { name: 'Error de Red', rut: '---' },
                    doctor: { name: 'Reintentando...', specialty: { name: '---' } }
                });
            });

        const interval = setInterval(() => {
            setTiempoLlamada(prev => {
                const [m, s] = prev.split(':').map(Number);
                const total = m * 60 + s + 1;
                return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [roomId]);

    const finalizarLlamada = () => {
        navigate(-1);
    };

    const handleSaveRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!appointment) return;
        setIsSaving(true);
        try {
            const res = await apiFetch(`/api/clinical/${appointment.id}`, {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert('✓ Ficha clínica guardada correctamente.');
                finalizarLlamada();
            }
        } catch (error) {
            alert('Error de conexión al guardar ficha');
        } finally {
            setIsSaving(false);
        }
    };

    if (token === "") {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <h3 className="text-xl font-bold text-white">Iniciando Conexión Segura...</h3>
                <p className="text-gray-500 text-sm mt-2">Conectando con el servidor LiveKit SFU de MediCampo</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black p-4 flex flex-col justify-center font-sans">
            <div className="max-w-7xl mx-auto w-full bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-800 shadow-2xl flex flex-col h-[90vh]">

                {/* Header Superior */}
                <div className="bg-emerald-600 px-8 py-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl"><Shield className="text-white w-5 h-5" /></div>
                        <div>
                            <span className="text-white font-bold block leading-none">Consulta LiveKit SFU</span>
                            <span className="text-emerald-100 text-[10px] uppercase tracking-wider font-semibold">Encriptación de extremo a extremo</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setShowChat(!showChat)} className={`p-2 rounded-xl transition-colors ${showChat ? 'bg-white text-emerald-600' : 'bg-white/10 text-white hover:bg-white/20'}`}><MessageSquare size={20} /></button>
                        <div className="bg-black/20 px-5 py-2 rounded-2xl text-white font-mono flex items-center gap-3 border border-white/10"><Clock size={16} className="text-emerald-300" /><span className="font-bold">{tiempoLlamada}</span></div>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden lg:flex-row flex-col">
                    <div className="flex-1 relative bg-black flex overflow-hidden">
                        <div className={`flex-1 transition-all duration-500 relative ${showChat ? 'lg:mr-[320px]' : ''}`}>
                            <LiveKitRoom
                                video={true}
                                audio={true}
                                token={token}
                                serverUrl={import.meta.env.VITE_LIVEKIT_URL?.startsWith('http')
                                    ? import.meta.env.VITE_LIVEKIT_URL.replace('http', 'ws')
                                    : import.meta.env.VITE_LIVEKIT_URL}
                                onDisconnected={() => navigate(-1)}
                                onError={(error) => {
                                    console.error('Error de LiveKit:', error);
                                    alert('Falla de conexión o dispositivos: No se pudo iniciar el video. Verifique los permisos de su cámara o el firewall.');
                                }}
                                className="h-full flex flex-col relative"
                            >
                                <EscenarioVideo />
                                <RoomAudioRenderer />

                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
                                    <div className="bg-gray-900/90 backdrop-blur-xl p-4 rounded-3xl border border-gray-700 shadow-2xl flex gap-6 items-center justify-center">
                                        {/* Forzamos los controles básicos */}
                                        <ControlBar variation="minimal" controls={{ leave: false, microphone: true, camera: true, screenShare: false }} />
                                        <div className="w-[1px] h-8 bg-gray-700" />
                                        <button onClick={finalizarLlamada} className="p-3 bg-red-600 text-white rounded-2xl hover:bg-red-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-900/20" title="Finalizar consulta"><PhoneOff size={22} /></button>
                                    </div>
                                </div>
                            </LiveKitRoom>
                        </div>

                        <div className={`absolute right-0 top-0 bottom-0 w-full lg:w-[320px] bg-gray-900 border-l border-gray-800 transition-transform duration-500 z-40 ${showChat ? 'translate-x-0' : 'translate-x-full'}`}>
                            {token && <ChatConsulta />}
                        </div>
                    </div>

                    <div className="lg:w-[350px] w-full bg-gray-950 p-8 overflow-y-auto border-l border-gray-800">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-800">
                            <Stethoscope className="text-emerald-500 w-6 h-6" />
                            <h3 className="text-white font-bold text-lg">{user?.role === 'DOCTOR' ? 'Ficha Clínica' : 'Detalles de Cita'}</h3>
                        </div>

                        {user?.role === 'DOCTOR' ? (
                            <form onSubmit={handleSaveRecord} className="space-y-6">
                                <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Paciente</label>
                                    <p className="text-white font-bold text-base">{appointment?.patient.name}</p>
                                    <p className="text-gray-500 text-xs mt-1">RUT: {appointment?.patient.rut}</p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 block">Diagnóstico del Médico</label>
                                        <textarea required value={formData.diagnosis} onChange={e => setFormData({ ...formData, diagnosis: e.target.value })} className="w-full bg-gray-900 border-gray-800 rounded-2xl p-4 text-sm text-white focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-700" rows={5} placeholder="Describa el diagnóstico clínico..." />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 font-bold uppercase mb-2 block">Prescripción Médica</label>
                                        <textarea value={formData.prescription} onChange={e => setFormData({ ...formData, prescription: e.target.value })} className="w-full bg-gray-900 border-gray-800 rounded-2xl p-4 text-sm text-white focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-700" rows={5} placeholder="Medicamentos, dosis y duración..." />
                                    </div>
                                </div>
                                <button type="submit" disabled={isSaving} className="w-full bg-emerald-600 py-4 rounded-2xl text-white font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
                                    {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                    Finalizar y Guardar
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-emerald-900/10 border border-emerald-800/30 p-6 rounded-[2rem]">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {appointment?.doctor?.name?.charAt(0) || 'M'}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{appointment?.doctor?.name || 'Médico'}</p>
                                            <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-tighter">Médico de Cabecera</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-xs leading-relaxed">Su consulta está siendo procesada a través de un nodo SFU dedicado para garantizar la máxima privacidad y calidad de video.</p>
                                </div>
                                <div className="bg-gray-900/30 p-4 rounded-2xl border border-gray-800">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Especialidad</p>
                                    <p className="text-gray-300 text-sm">{appointment?.doctor?.specialty?.name || 'Medicina General'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
