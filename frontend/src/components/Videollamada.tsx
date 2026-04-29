import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
    PhoneOff, Shield, Clock, Loader2, Save, Stethoscope, MessageSquare, Mic, MicOff, Video, VideoOff, ChevronDown, Wifi, WifiOff
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    LiveKitRoom,
    RoomAudioRenderer,
    GridLayout,
    ParticipantTile,
    useTracks,
    useLocalParticipant,
    useRoomContext,
} from '@livekit/components-react';
import { Track, Room, RoomEvent } from 'livekit-client';
import '@livekit/components-styles';

import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { ChatConsulta } from './ChatConsulta';
import { PreFlightCheck } from './PreFlightCheck';

/**
 * IndicadorCalidadRed
 * DESCRIPCION: Muestra la calidad de la conexion en tiempo real.
 * Utiliza los eventos de LiveKit para detectar perdida de paquetes y latencia.
 */
const IndicadorCalidadRed = () => {
    const room = useRoomContext();
    const [quality, setQuality] = useState<'good' | 'fair' | 'poor' | 'disconnected'>('good');

    useEffect(() => {
        if (!room) return;

        const handleDisconnected = () => setQuality('disconnected');
        const handleReconnecting = () => setQuality('poor');
        const handleReconnected = () => setQuality('good');

        room.on(RoomEvent.Disconnected, handleDisconnected);
        room.on(RoomEvent.Reconnecting, handleReconnecting);
        room.on(RoomEvent.Reconnected, handleReconnected);

        // Monitoreo periodico de calidad
        const interval = setInterval(() => {
            if (room.state === 'disconnected') {
                setQuality('disconnected');
                return;
            }
            // Estimacion basada en participantes y tracks suscritos
            const participants = room.remoteParticipants;
            let poorCount = 0;
            participants.forEach((p) => {
                p.trackPublications.forEach((pub) => {
                    if (pub.track && pub.track.kind === 'video') {
                        // Si el track esta muted, consideramos mala calidad
                        if (pub.track.isMuted) {
                            poorCount++;
                        }
                    }
                });
            });
            if (poorCount > 1) setQuality('poor');
            else if (poorCount > 0) setQuality('fair');
            else setQuality('good');
        }, 5000);

        return () => {
            room.off(RoomEvent.Disconnected, handleDisconnected);
            room.off(RoomEvent.Reconnecting, handleReconnecting);
            room.off(RoomEvent.Reconnected, handleReconnected);
            clearInterval(interval);
        };
    }, [room]);

    const config = {
        good: { icon: Wifi, color: 'text-emerald-500', label: 'Buena' },
        fair: { icon: Wifi, color: 'text-amber-500', label: 'Regular' },
        poor: { icon: WifiOff, color: 'text-red-500', label: 'Mala' },
        disconnected: { icon: WifiOff, color: 'text-gray-500', label: 'Desconectado' },
    };

    const { icon: Icon, color, label } = config[quality];

    return (
        <div className={`flex items-center gap-1.5 ${color}`} title={`Calidad de red: ${label}`}>
            <Icon size={14} className={quality === 'poor' || quality === 'disconnected' ? 'animate-pulse' : ''} />
            <span className="text-[9px] font-bold uppercase tracking-wider hidden sm:inline">{label}</span>
        </div>
    );
};

/**
 * ControlesPersonalizados
 * DESCRIPCION: Gestiona el hardware con feedback visual de colores.
 */
const ControlesPersonalizados = ({ finalizarLlamada }: { finalizarLlamada: () => void }) => {
    const { isMicrophoneEnabled, isCameraEnabled, localParticipant } = useLocalParticipant();
    const [isToggling, setIsToggling] = useState(false);

    if (!localParticipant) {
        return (
            <div className="mc-glass-panel p-4 rounded-3xl flex gap-4 items-center">
                <Loader2 className="animate-spin text-[var(--mc-emerald-primary)]" size={20} />
                <span className="text-white text-[10px] font-bold uppercase tracking-widest">Iniciando...</span>
            </div>
        );
    }

    const toggleMic = async () => {
        try { await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled); }
        catch (e) { console.error("Error micro:", e); }
    };

    const toggleCamera = async () => {
        setIsToggling(true);
        try { await localParticipant.setCameraEnabled(!isCameraEnabled); }
        catch (e) { console.error("Error camara:", e); }
        finally { setIsToggling(false); }
    };

    return (
        <div className="mc-glass-panel p-4 rounded-3xl shadow-2xl flex gap-4 items-center justify-center pointer-events-auto border-[var(--mc-glass-border)]">
            <button onClick={toggleMic} className={`p-3 rounded-2xl transition-all duration-300 flex items-center gap-2 ${isMicrophoneEnabled ? 'bg-gray-800 text-white' : 'bg-[var(--mc-danger)] text-white'}`}>
                {isMicrophoneEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                <span className="text-[10px] font-bold uppercase">{isMicrophoneEnabled ? 'On' : 'Off'}</span>
            </button>

            <button onClick={toggleCamera} disabled={isToggling} className={`p-3 rounded-2xl transition-all duration-300 flex items-center gap-2 ${isCameraEnabled ? 'bg-gray-800 text-white' : 'bg-[var(--mc-danger)] text-white'}`}>
                {isToggling ? <Loader2 size={20} className="animate-spin" /> : (isCameraEnabled ? <Video size={20} /> : <VideoOff size={20} />)}
                <span className="text-[10px] font-bold uppercase">{isCameraEnabled ? 'On' : 'Off'}</span>
            </button>

            <div className="w-[1px] h-8 bg-gray-700 mx-2" />

            <button onClick={finalizarLlamada} className="p-3 bg-[var(--mc-danger)] text-white rounded-2xl hover:opacity-80 transition-all">
                <PhoneOff size={22} />
            </button>
        </div>
    );
};

/**
 * EscenarioVideo
 * DESCRIPCION: Renderiza los participantes de la videollamada en una cuadricula.
 * Soporta modo solo audio cuando la camara no esta disponible.
 */
const EscenarioVideo = () => {
    let tracks;
    try {
        tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare], { onlySubscribed: false });
    } catch (error) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-emerald-500" /></div>;
    }

    return (
        <div className="flex-1 flex items-center justify-center bg-black overflow-hidden relative">
            {tracks && tracks.length > 0 ? (
                <GridLayout tracks={tracks} className="w-full h-full"><ParticipantTile /></GridLayout>
            ) : (
                <div className="flex flex-col items-center gap-4 text-gray-500">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <p className="text-xs uppercase tracking-widest">Sincronizando medios...</p>
                </div>
            )}
        </div>
    );
};

export default function Videollamada() {
    const { user } = useAuth();
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const roomRef = useRef<Room | null>(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 3;

    const [tiempoLlamada] = useState('00:00');
    const [appointment, setAppointment] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showFicha, setShowFicha] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [isReconnecting, setIsReconnecting] = useState(false);

    const [formData, setFormData] = useState({ diagnosis: '', prescription: '' });
    const [livekitToken, setLivekitToken] = useState<string>("");
    const [lastFetchedRoom, setLastFetchedRoom] = useState<string>("");

    const serverUrl = useMemo(() => {
        const url = import.meta.env.VITE_LIVEKIT_URL;
        return url?.startsWith('http') ? url.replace('http', 'ws') : url || "";
    }, []);

    const fetchToken = useCallback(async () => {
        if (!roomId || !user) return;
        setConnectionError(null);
        try {
            const resp = await apiFetch(`/api/livekit/token?room=${roomId}&identity=${encodeURIComponent(user.name)}`);
            if (!resp.ok) {
                const errorData = await resp.json();
                throw new Error(errorData.error || 'Error al obtener token de acceso');
            }
            const data = await resp.json();
            setLivekitToken(data.token);
            setLastFetchedRoom(roomId);
            reconnectAttempts.current = 0;
        } catch (err: any) {
            console.error('Error token:', err);
            setConnectionError(err.message || 'Error al conectar con la sala');
            // Reintentar reconexion hasta 3 veces
            if (reconnectAttempts.current < maxReconnectAttempts) {
                reconnectAttempts.current++;
                setIsReconnecting(true);
                setTimeout(() => fetchToken(), 2000 * reconnectAttempts.current);
            } else {
                setIsReconnecting(false);
            }
        }
    }, [roomId, user]);

    useEffect(() => {
        if (!roomId || !user || roomId === lastFetchedRoom) return;
        fetchToken();
    }, [roomId, user, lastFetchedRoom, fetchToken]);

    useEffect(() => {
        if (!roomId || roomId === 'test-room-livekit') {
            setAppointment({ patient: { name: 'Paciente de Prueba', rut: '12.345.678-9' }, doctor: { name: 'Dr. Carlos Martinez', specialty: { name: 'Medicina General' } } });
            return;
        }
        apiFetch(`/api/appointments/room/${roomId}`).then(r => r.json()).then(setAppointment);
    }, [roomId]);

    // Cleanup al desmontar el componente
    useEffect(() => {
        return () => {
            // Limpiar conexion de LiveKit al salir de la sala
            if (roomRef.current) {
                try {
                    roomRef.current.disconnect();
                    console.log('[Cleanup] Conexion LiveKit cerrada correctamente');
                } catch (e) {
                    console.warn('[Cleanup] Error al cerrar conexion LiveKit:', e);
                }
                roomRef.current = null;
            }
            // Detener tracks de media activos
            navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                .then(stream => {
                    stream.getTracks().forEach(track => {
                        track.stop();
                        console.log('[Cleanup] Track detenido:', track.kind);
                    });
                })
                .catch(() => {
                    // Si no hay permisos, no hay tracks que detener
                });
        };
    }, []);

    const handleRoomConnected = useCallback(() => {
        setIsReconnecting(false);
        setConnectionError(null);
        console.log('[Room] Conectado a la sala');
    }, []);

    const handleRoomDisconnected = useCallback(() => {
        console.log('[Room] Desconectado de la sala');
        roomRef.current = null;
    }, []);

    const handleSaveRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await apiFetch(`/api/clinical/${appointment.id}`, { method: 'POST', body: JSON.stringify(formData) });
            if (res.ok) navigate(-1);
        } finally { setIsSaving(false); }
    };

    // FASE 3: Si no ha pasado el chequeo de hardware, mostramos la sala de espera tecnica
    if (!isReady) {
        return <PreFlightCheck userName={user?.name || "Invitado"} onReady={() => setIsReady(true)} />;
    }

    if (connectionError && !isReconnecting) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 p-8">
                <WifiOff className="w-16 h-16 text-red-500" />
                <h3 className="text-white font-bold text-xl">Error de Conexion</h3>
                <p className="text-gray-400 text-sm text-center max-w-md">{connectionError}</p>
                <button
                    onClick={() => { reconnectAttempts.current = 0; fetchToken(); }}
                    className="mc-button-primary px-8 py-4 rounded-2xl text-white font-bold"
                >
                    Reintentar Conexion
                </button>
            </div>
        );
    }

    if (isReconnecting) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                <h3 className="text-white font-bold">Reconectando...</h3>
                <p className="text-gray-500 text-sm">Intento {reconnectAttempts.current} de {maxReconnectAttempts}</p>
            </div>
        );
    }

    if (livekitToken === "") return <div className="min-h-screen bg-black flex flex-col items-center justify-center"><Loader2 className="w-12 h-12 text-emerald-500 animate-spin" /><h3 className="text-white mt-4 font-bold">Iniciando Conexion...</h3></div>;

    return (
        <div className="min-h-screen bg-[var(--mc-bg-dark)] p-0 lg:p-4 flex flex-col justify-center font-sans overflow-hidden">
            <div className="max-w-7xl mx-auto w-full bg-[var(--mc-bg-surface)] lg:rounded-[var(--mc-radius-2xl)] overflow-hidden border border-gray-800 shadow-2xl flex flex-col h-screen lg:h-[90vh]">
                <div className="bg-[var(--mc-emerald-dark)] px-6 py-4 flex justify-between items-center shrink-0 z-50">
                    <div className="flex items-center gap-3">
                        <Shield className="text-white w-5 h-5" />
                        <div className="hidden sm:block">
                            <span className="text-white font-bold block text-sm">Consulta SFU Premium</span>
                            <span className="text-emerald-100 text-[10px] uppercase tracking-wider font-semibold">Cifrado Militar</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <IndicadorCalidadRed />
                        <button onClick={() => setShowChat(!showChat)} className={`p-2 rounded-xl transition-all ${showChat ? 'bg-white text-emerald-600' : 'bg-white/10 text-white'}`}><MessageSquare size={18} /></button>
                        <button onClick={() => setShowFicha(!showFicha)} className="lg:hidden p-2 rounded-xl bg-white/10 text-white"><Stethoscope size={18} /></button>
                        <div className="bg-black/20 px-3 py-1.5 rounded-xl text-white font-mono text-xs border border-white/10 font-bold">{tiempoLlamada}</div>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden lg:flex-row flex-col relative">
                    <div className="flex-1 relative bg-black flex overflow-hidden min-h-[40vh] lg:min-h-0">
                        <div className={`flex-1 transition-all duration-500 relative ${showChat ? 'lg:mr-[320px]' : ''}`}>
                            <LiveKitRoom
                                video={false}
                                audio={true}
                                token={livekitToken}
                                serverUrl={serverUrl}
                                onConnected={handleRoomConnected}
                                onDisconnected={handleRoomDisconnected}
                                onError={(error) => {
                                    console.error('[Room] Error:', error);
                                    setConnectionError('Se perdio la conexion con la sala. Reintentando...');
                                    setIsReconnecting(true);
                                    setTimeout(() => fetchToken(), 3000);
                                }}
                                className="h-full flex flex-col relative"
                                options={{
                                    adaptiveStream: true,
                                    dynacast: true,
                                    publishDefaults: {
                                        videoCodec: 'vp9' as const,
                                        dtx: true,
                                        red: true,
                                    },
                                }}
                            >
                                <EscenarioVideo />
                                <RoomAudioRenderer />
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
                                    <ControlesPersonalizados finalizarLlamada={() => navigate(-1)} />
                                </div>
                                <div className={`absolute right-0 top-0 bottom-0 w-full lg:w-[320px] bg-[var(--mc-bg-surface)] border-l border-gray-800 transition-transform duration-500 z-40 ${showChat ? 'translate-x-0' : 'translate-x-full'}`}>
                                    {livekitToken && <ChatConsulta />}
                                </div>
                            </LiveKitRoom>
                        </div>
                    </div>

                    <div className={`
                        lg:w-[380px] w-full bg-[var(--mc-bg-panel)] p-6 lg:p-8 overflow-y-auto border-l border-gray-800
                        fixed lg:relative bottom-0 left-0 right-0 z-[60] lg:z-0
                        transition-transform duration-500 ease-out
                        rounded-t-[2rem] lg:rounded-none shadow-[0_-20px_50px_rgba(0,0,0,0.5)] lg:shadow-none
                        max-h-[85vh] lg:max-h-none
                        ${showFicha ? 'translate-y-0 lg:translate-y-0' : 'translate-y-full lg:translate-y-0'}
                    `}>
                        <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto mb-6 lg:hidden" onClick={() => setShowFicha(false)} />
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <Stethoscope className="text-[var(--mc-emerald-primary)] w-5 h-5" />
                                <h3 className="text-white font-bold">{user?.role === 'DOCTOR' ? 'Ficha Clinica' : 'Resumen Medico'}</h3>
                            </div>
                            <button onClick={() => setShowFicha(false)} className="lg:hidden text-gray-500"><ChevronDown size={20} /></button>
                        </div>

                        {user?.role === 'DOCTOR' ? (
                            <form onSubmit={handleSaveRecord} className="space-y-6">
                                <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Paciente</label>
                                    <p className="text-white font-bold">{appointment?.patient?.name || 'Cargando...'}</p>
                                    <p className="text-gray-500 text-[10px] mt-1">RUT: {appointment?.patient?.rut || '---'}</p>
                                </div>
                                <div className="space-y-4">
                                    <textarea required value={formData.diagnosis} onChange={e => setFormData({ ...formData, diagnosis: e.target.value })} className="w-full bg-gray-900 border-gray-800 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-[var(--mc-emerald-primary)] outline-none" rows={4} placeholder="Escriba el diagnostico..." />
                                    <textarea value={formData.prescription} onChange={e => setFormData({ ...formData, prescription: e.target.value })} className="w-full bg-gray-900 border-gray-800 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-[var(--mc-emerald-primary)] outline-none" rows={4} placeholder="Prescripcion..." />
                                </div>
                                <button type="submit" disabled={isSaving} className="mc-button-primary w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-3">
                                    {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                    Finalizar Consulta
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-6 text-center py-4">
                                <div className="w-20 h-20 bg-[var(--mc-emerald-dark)] rounded-full flex items-center justify-center text-white font-bold mx-auto text-2xl shadow-xl shadow-emerald-900/20">
                                    {appointment?.doctor?.name?.charAt(0) || 'M'}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-xl">{appointment?.doctor?.name || 'Su Medico'}</p>
                                    <p className="text-[var(--mc-emerald-primary)] text-xs font-bold uppercase tracking-widest mt-1">{appointment?.doctor?.specialty?.name || 'Especialista'}</p>
                                </div>
                                <div className="bg-emerald-900/10 border border-emerald-800/30 p-4 rounded-2xl text-left">
                                    <p className="text-gray-400 text-xs leading-relaxed">Consulta cifrada de extremo a extremo.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
