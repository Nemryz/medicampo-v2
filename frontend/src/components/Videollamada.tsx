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
    
    const [formData, setFormData] = useState({
        symptoms: '', diagnosis: '', prescription: '', weight: '', height: '', bloodPressure: '', temperature: ''
    });

    const { roomId } = useParams<{ roomId: string }>();

    useEffect(() => {
        if (!roomId) return;
        const token = localStorage.getItem('medicampo_token');

        // PRE-WARMING: Activar cámara DE INMEDIATO
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                myStreamRef.current = stream;
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;
                console.log('Cámara y Micro listos (Pre-warming)');
            })
            .catch(err => console.error('Fallo en pre-warming hardware:', err));

        // Fetch info cita
        fetch(`${API_URL}/api/appointments/room/${roomId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(data => data.id && setAppointment(data))
        .catch(console.error);

        // EXTRAER HOST PARA PEERJS (Apunta a nuestra propia API)
        const peerHost = SOCKET_URL.replace('https://', '').replace('http://', '').split('/')[0];
        const isSecure = SOCKET_URL.startsWith('https');

        peerRef.current = new Peer({
            host: peerHost,
            port: isSecure ? 443 : 5000,
            path: '/peerjs',
            secure: isSecure,
            debug: 3,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    {
                        urls: "turn:openrelay.metered.ca:80",
                        username: "openrelayproject",
                        credential: "openrelayproject",
                    },
                    {
                        urls: "turn:openrelay.metered.ca:443",
                        username: "openrelayproject",
                        credential: "openrelayproject",
                    }
                ]
            }
        });

        socketRef.current = io(SOCKET_URL, { auth: { token } });

        peerRef.current.on('open', id => {
            console.log('Conectado a nuestro propio servidor de señalización. ID:', id);
            socketRef.current?.emit('join-room', roomId, id);
        });

        // ESCUCHAR LLAMADAS ENTRANTES
        peerRef.current.on('call', call => {
            console.log('Recibiendo llamada entrante...');
            const startStream = () => {
                if(myStreamRef.current) {
                    call.answer(myStreamRef.current);
                    call.on('stream', remoteStream => {
                        setIsConnected(true);
                        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
                    });
                } else {
                    setTimeout(startStream, 500); // Reintentar si el stream aún no está listo
                }
            };
            startStream();
        });

        // LLAMAR A OTROS
        socketRef.current.on('user-connected', userId => {
            console.log('Nuevo usuario detectado, llamando a:', userId);
            const tryCall = () => {
                if(myStreamRef.current) {
                    const call = peerRef.current?.call(userId, myStreamRef.current);
                    call?.on('stream', remoteStream => {
                        setIsConnected(true);
                        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
                    });
                } else {
                    setTimeout(tryCall, 500);
                }
            };
            tryCall();
        });

        // Timer
        const interval = setInterval(() => {
            setTiempoLlamada(prev => {
                const [m, s] = prev.split(':').map(Number);
                const total = m * 60 + s + 1;
                return `${Math.floor(total/60).toString().padStart(2,'0')}:${(total%60).toString().padStart(2,'0')}`;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            myStreamRef.current?.getTracks().forEach(t => t.stop());
            socketRef.current?.disconnect();
            peerRef.current?.destroy();
        };
    }, [roomId]);

    const toggleMic = () => {
        const t = myStreamRef.current?.getAudioTracks()[0];
        if (t) { t.enabled = !t.enabled; setMicrofonoActivo(t.enabled); }
    };

    const toggleVideo = () => {
        const t = myStreamRef.current?.getVideoTracks()[0];
        if (t) { t.enabled = !t.enabled; setCamaraActiva(t.enabled); }
    };

    const finalizarLlamada = () => {
        myStreamRef.current?.getTracks().forEach(t => t.stop());
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
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            if (res.ok) { alert('✓ Ficha clínica guardada.'); finalizarLlamada(); }
        } catch (error) { alert('Error de conexión'); } finally { setIsSaving(false); }
    };

    return (
        <div className="min-h-screen bg-black p-4 flex flex-col justify-center">
            <div className="max-w-7xl mx-auto w-full bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-800 shadow-2xl">
                <div className="bg-emerald-600 px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Shield className="text-white w-5 h-5" />
                        <span className="text-white font-bold">Consulta Segura (PeerServer Pro)</span>
                    </div>
                    <div className="bg-black/20 px-4 py-1 rounded-full text-white font-mono">{tiempoLlamada}</div>
                </div>

                <div className="grid lg:grid-cols-4 gap-0">
                    <div className="lg:col-span-3 relative bg-black aspect-video flex items-center justify-center">
                        <video ref={remoteVideoRef} autoPlay playsInline className={`w-full h-full object-cover transition-opacity duration-1000 ${isConnected ? 'opacity-100' : 'opacity-0'}`} />
                        {!isConnected && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                                <h3 className="text-xl font-bold text-white">Sincronizando Conexión...</h3>
                                <p className="text-gray-500 text-sm mt-2 max-w-xs">Optimizando túnel WebRTC a través de PeerServer privado. Espere un momento.</p>
                            </div>
                        )}
                        <div className="absolute bottom-6 right-6 w-32 sm:w-48 aspect-video bg-gray-800 rounded-xl overflow-hidden border-2 border-emerald-500/30">
                            <video ref={localVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover transform scale-x-[-1] ${camaraActiva ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-gray-900/80 backdrop-blur-md p-4 rounded-full border border-gray-700">
                            <button onClick={toggleMic} className={`p-3 rounded-full ${microfonoActivo ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'}`}><Mic size={20} /></button>
                            <button onClick={toggleVideo} className={`p-3 rounded-full ${camaraActiva ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'}`}><VideoIcon size={20} /></button>
                            <button onClick={finalizarLlamada} className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700"><PhoneOff size={20} /></button>
                        </div>
                    </div>

                    <div className="lg:col-span-1 bg-gray-800 p-6 overflow-y-auto max-h-[80vh]">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2 border-b border-gray-700 pb-2"><Stethoscope className="text-emerald-400" /> {user?.role === 'DOCTOR' ? 'Diagnóstico' : 'Detalles'}</h3>
                        {user?.role === 'DOCTOR' ? (
                            <form onSubmit={handleSaveRecord} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-400 font-bold uppercase">Paciente</label>
                                    <p className="text-white font-bold">{appointment?.patient.name}</p>
                                </div>
                                <div><label className="text-[10px] text-gray-400 font-bold uppercase">Diagnóstico</label><textarea required value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} className="w-full bg-gray-900 border-gray-700 rounded-xl p-3 text-sm text-white" rows={4} /></div>
                                <div><label className="text-[10px] text-gray-400 font-bold uppercase">Prescripción</label><textarea value={formData.prescription} onChange={e => setFormData({...formData, prescription: e.target.value})} className="w-full bg-gray-900 border-gray-700 rounded-xl p-3 text-sm text-white" rows={4} /></div>
                                <button type="submit" disabled={isSaving} className="w-full bg-emerald-600 py-4 rounded-2xl text-white font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">{isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />} Guardar Ficha</button>
                            </form>
                        ) : (
                            <div className="text-gray-300 space-y-4">
                                <p className="text-sm">Médico: <span className="text-white font-bold">{appointment?.doctor.name}</span></p>
                                <div className="p-4 bg-emerald-900/20 border border-emerald-800 rounded-2xl text-xs leading-relaxed">Su consulta está siendo procesada de forma segura a través de nuestro servidor de señalización privado.</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
