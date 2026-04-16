import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, VideoIcon, VideoOff, PhoneOff, Shield, Clock, Loader2, Save } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import Peer from 'peerjs';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SOCKET_URL, API_URL } from '../lib/api';

interface AppointData {
    id: number;
    patient: { name: string; rut: string };
    doctor: { name: string; specialty: { name: string } | null };
}

export default function Videollamada() {
    const { user } = useAuth();
    const [microfonoActivo, setMicrofonoActivo] = useState(true);
    const [camaraActiva, setCamaraActiva] = useState(true);
    const [tiempoLlamada, setTiempoLlamada] = useState('00:00');
    const [isConnected, setIsConnected] = useState(false);
    
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const myStreamRef = useRef<MediaStream | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const peerRef = useRef<Peer | null>(null);
    const navigate = useNavigate();

    const [appointment, setAppointment] = useState<AppointData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    // Formulario médico
    const [formData, setFormData] = useState({
        symptoms: '',
        diagnosis: '',
        prescription: '',
        weight: '',
        height: '',
        bloodPressure: '',
        temperature: ''
    });

    const { roomId } = useParams<{ roomId: string }>();

    useEffect(() => {
        if (!roomId) return;
        
        const token = localStorage.getItem('medicampo_token');
        
        // Fetch appointment info
        fetch(`${API_URL}/api/appointments/room/${roomId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(data => {
            if (data.id) setAppointment(data);
        })
        .catch(console.error);

        socketRef.current = io(SOCKET_URL, {
            auth: { token }
        });
        
        peerRef.current = new Peer({
            debug: 3, // Mayor log para diagnosticar fallos si ocurren
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' },
                    { urls: 'stun:stun3.l.google.com:19302' },
                    { urls: 'stun:stun4.l.google.com:19302' },
                ]
            }
        });

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            myStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            peerRef.current?.on('call', call => {
                call.answer(stream);
                call.on('stream', userVideoStream => {
                    setIsConnected(true);
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = userVideoStream;
                    }
                });
            });

            socketRef.current?.on('user-connected', userId => {
                console.log('Detectado nuevo usuario en sala:', userId);
                // Pequeño delay para asegurar que el receptor esté listo
                setTimeout(() => {
                    const call = peerRef.current?.call(userId, stream);
                    if (call) {
                        setIsConnected(true);
                        call.on('stream', userVideoStream => {
                            if (remoteVideoRef.current) {
                                remoteVideoRef.current.srcObject = userVideoStream;
                            }
                        });
                        call.on('error', console.error);
                    }
                }, 1000);
            });
        }).catch(err => {
            console.error('Error accediendo a dispositivos', err);
        });

        peerRef.current.on('open', id => {
            console.log('Mi PeerID es:', id);
            socketRef.current?.emit('join-room', roomId, id);
        });

        peerRef.current.on('error', err => {
            console.error('Error en PeerJS:', err);
            if (err.type === 'peer-unavailable') {
                console.log('El par no está disponible aún, esperando...');
            }
        });

        // Timer
        const interval = setInterval(() => {
           setTiempoLlamada(prev => {
               const [mins, secs] = prev.split(':').map(Number);
               let newSecs = secs + 1;
               let newMins = mins;
               if(newSecs === 60) { newMins++; newSecs = 0; }
               return `${newMins.toString().padStart(2, '0')}:${newSecs.toString().padStart(2, '0')}`;
           });
        }, 1000);

        return () => {
            clearInterval(interval);
            myStreamRef.current?.getTracks().forEach(track => track.stop());
            socketRef.current?.disconnect();
            peerRef.current?.destroy();
        };
    }, []);

    const toggleMic = () => {
        const audioTrack = myStreamRef.current?.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setMicrofonoActivo(audioTrack.enabled);
        }
    };

    const toggleVideo = () => {
        const videoTrack = myStreamRef.current?.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setCamaraActiva(videoTrack.enabled);
        }
    };

    const finalizarLlamada = () => {
        myStreamRef.current?.getTracks().forEach(track => track.stop());
        socketRef.current?.disconnect();
        navigate(-1);
    };

    const handleSaveRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!appointment) return;
        
        setIsSaving(true);
        try {
            const token = localStorage.getItem('medicampo_token');
            const res = await fetch(`${API_URL}/api/clinical/${appointment.id}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            
            if (res.ok) {
                alert('✓ Ficha clínica guardada exitosamente. Finalizando consulta...');
                finalizarLlamada();
            } else {
                alert('Error al guardar la ficha');
            }
        } catch (error) {
            alert('Error de conexión');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 lg:px-8 flex flex-col justify-center animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto w-full">
                <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10">
                    
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-4 flex items-center justify-between shadow-md z-10 relative">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Shield size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-lg leading-tight">Teleconsulta Encriptada</h2>
                                <p className="text-emerald-100 text-xs">P2P PeerJS WebRTC Connection</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 bg-black/20 px-4 py-2 rounded-full font-mono font-medium">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            <span>{tiempoLlamada}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-1 p-1 bg-gray-900">
                        {/* Remote Video Area */}
                        <div className="lg:col-span-3 relative bg-black aspect-video rounded-2xl overflow-hidden group">
                           
                           {/* Video Remoto */}
                           <video 
                             ref={remoteVideoRef} 
                             autoPlay 
                             playsInline 
                             className={`w-full h-full object-cover transition-opacity duration-700 ${isConnected ? 'opacity-100' : 'opacity-0'}`} 
                           />

                           {/* Loader if not connected */}
                           {!isConnected && (
                               <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                   <div className="relative">
                                     <div className="w-24 h-24 border-4 border-gray-700 rounded-full animate-spin"></div>
                                     <div className="w-24 h-24 border-4 border-emerald-500 rounded-full animate-spin absolute inset-0 border-t-transparent border-l-transparent"></div>
                                     <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-emerald-400 animate-pulse" />
                                   </div>
                                   <h3 className="mt-6 text-xl font-medium text-gray-300">
                                       {user?.role === 'PATIENT' ? 'Sala de Espera' : 'Esperando Conexión...'}
                                   </h3>
                                   <p className="text-gray-500 mt-2 text-sm text-center max-w-sm">
                                       {user?.role === 'PATIENT' 
                                          ? 'Aguarde en línea. El profesional médico aceptará la llamada pronto.' 
                                          : 'La sala ha sido creada exitosamente. Esperando ingreso del paciente.'}
                                   </p>
                               </div>
                           )}

                           {/* PiP Local Video */}
                           <div className="absolute bottom-6 right-6 w-32 sm:w-48 aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-700/50 hover:border-emerald-500/50 transition-colors z-20">
                               <video 
                                 ref={localVideoRef} 
                                 autoPlay 
                                 playsInline 
                                 muted 
                                 className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300 ${camaraActiva ? 'opacity-100' : 'opacity-0'}`} 
                               />
                               {!camaraActiva && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-400">
                                      <VideoOff size={32} />
                                  </div>
                               )}
                               <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white font-medium flex items-center gap-1">
                                    Yo {user?.role === 'DOCTOR' ? '(Médico)' : ''}
                               </div>
                           </div>
                           
                           {/* Controles Flotantes */}
                           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center items-center space-x-4 bg-gray-900/60 backdrop-blur-xl px-8 py-4 rounded-full border border-gray-700/50 shadow-2xl opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform translate-y-4 sm:group-hover:translate-y-0 z-30">
                                <button
                                    onClick={toggleMic}
                                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${
                                        microfonoActivo
                                            ? 'bg-gray-700/80 text-white hover:bg-gray-600'
                                            : 'bg-red-500 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-500/50'
                                    }`}
                                >
                                    {microfonoActivo ? <Mic size={24} /> : <MicOff size={24} />}
                                </button>

                                <button
                                    onClick={toggleVideo}
                                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${
                                        camaraActiva
                                            ? 'bg-gray-700/80 text-white hover:bg-gray-600'
                                            : 'bg-red-500 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-500/50'
                                    }`}
                                >
                                    {camaraActiva ? <VideoIcon size={24} /> : <VideoOff size={24} />}
                                </button>

                                <button
                                    onClick={finalizarLlamada}
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-500 shadow-lg shadow-red-600/30 transition-all hover:scale-105 ml-4"
                                >
                                    <PhoneOff size={28} />
                                </button>
                            </div>
                        </div>

                        {/* Detalles Panel Right */}
                        <div className="lg:col-span-1 bg-gray-800 rounded-2xl p-5 border border-gray-700/50 ml-1 overflow-y-auto max-h-[calc(100vh-120px)]">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Shield className="text-emerald-400" />
                                {user?.role === 'DOCTOR' ? 'Panel de Diagnóstico' : 'Detalles Médicos'}
                            </h3>

                            {user?.role === 'DOCTOR' ? (
                                <form onSubmit={handleSaveRecord} className="space-y-4">
                                    <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-700">
                                        <p className="text-xs text-gray-400 uppercase mb-1">Paciente</p>
                                        <p className="text-sm font-semibold text-white">{appointment?.patient.name || 'Cargando...'}</p>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400 uppercase">Síntomas Reportados</label>
                                        <textarea 
                                            value={formData.symptoms}
                                            onChange={e => setFormData({...formData, symptoms: e.target.value})}
                                            className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-emerald-500" 
                                            rows={2}
                                            placeholder="..."
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400 uppercase">Diagnóstico Médico</label>
                                        <textarea 
                                            value={formData.diagnosis}
                                            onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                                            className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-emerald-500" 
                                            rows={2}
                                            placeholder="..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400 uppercase">Receta / Prescripción</label>
                                        <textarea 
                                            value={formData.prescription}
                                            onChange={e => setFormData({...formData, prescription: e.target.value})}
                                            className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-emerald-500" 
                                            rows={3}
                                            placeholder="Medicamentos e indicaciones..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase">Peso (kg)</label>
                                            <input 
                                                type="text" 
                                                value={formData.weight}
                                                onChange={e => setFormData({...formData, weight: e.target.value})}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-1.5 text-xs text-white" 
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase">Presión Art.</label>
                                            <input 
                                                type="text" 
                                                value={formData.bloodPressure}
                                                onChange={e => setFormData({...formData, bloodPressure: e.target.value})}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-1.5 text-xs text-white" 
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-4"
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Guardar y Finalizar
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                                        <p className="text-xs text-gray-400 uppercase mb-1">Médico Atendiendo</p>
                                        <p className="text-sm font-semibold text-gray-200">{appointment?.doctor.name || 'Cargando...'}</p>
                                        <p className="text-xs text-emerald-500 mt-1">{appointment?.doctor.specialty?.name || 'Medicina General'}</p>
                                    </div>

                                    <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 mt-6">
                                        <p className="text-xs text-emerald-100 leading-relaxed uppercase font-bold mb-2">Información de Seguridad</p>
                                        <p className="text-xs text-emerald-100 leading-relaxed">
                                            Tu privacidad es prioridad. Los diagnósticos se almacenan bajo cifrado una vez que el médico finaliza la tanda del historial clínico.
                                        </p>
                                    </div>

                                    <div className="pt-4">
                                        <button 
                                            onClick={finalizarLlamada}
                                            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm transition-all"
                                        >
                                            Salir de la Sala
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
