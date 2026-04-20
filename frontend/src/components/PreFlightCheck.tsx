import { useState, useEffect, useRef } from 'react';
import { Camera, Mic, CheckCircle2, AlertCircle, Loader2, Play, Lock } from 'lucide-react';

/**
 * PRE-FLIGHT CHECK v2 (Resiliente)
 * 
 * DESCRIPCIÓN:
 * Pantalla de validación de hardware con soporte para modo "Solo Audio".
 * Guía al usuario para desbloquear permisos si el sistema los ha denegado.
 */
interface PreFlightProps {
    onReady: () => void;
    userName: string;
}

export const PreFlightCheck = ({ onReady, userName }: PreFlightProps) => {
    const [status, setStatus] = useState({ video: false, audio: false });
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const requestPermissions = async () => {
        setIsChecking(true);
        setError(null);
        setIsBlocked(false);
        
        try {
            // Intentamos pedir ambos
            const userMedia = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            
            setStream(userMedia);
            setStatus({ video: true, audio: true });
            if (videoRef.current) videoRef.current.srcObject = userMedia;

        } catch (err: any) {
            console.warn("Falla en captura completa, intentando solo audio...", err);
            
            // Si falla la cámara, intentamos AL MENOS el audio
            try {
                const audioOnly = await navigator.mediaDevices.getUserMedia({ audio: true });
                setStream(audioOnly);
                setStatus({ video: false, audio: true });
            } catch (audioErr) {
                setIsBlocked(true);
                setError("El navegador ha bloqueado el acceso. Haz clic en el CANDADO de la barra de direcciones y selecciona 'Permitir' para Cámara y Micrófono.");
            }
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        requestPermissions();
        return () => {
            // Nota: No detenemos los tracks para que LiveKit los herede si es posible
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-[var(--mc-bg-dark)] z-[100] flex items-center justify-center p-4">
            <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-8 items-center">
                
                {/* Visualizador Local */}
                <div className="relative aspect-video bg-black rounded-[var(--mc-radius-xl)] overflow-hidden border border-gray-800 shadow-2xl mc-glass-panel">
                    {status.video && stream ? (
                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover mirror" />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-4 bg-gray-900/50">
                            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
                                {status.audio ? <Mic className="text-emerald-500 animate-pulse" size={32} /> : <Camera size={32} />}
                            </div>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold">
                                {status.audio ? 'Modo de Solo Audio Activo' : 'Esperando Dispositivos...'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Info y Acciones */}
                <div className="space-y-8 p-4">
                    <div>
                        <h2 className="text-white text-3xl font-bold mb-2">Hola, {userName}</h2>
                        <p className="text-gray-400 text-sm">Configura tu equipo para la consulta.</p>
                    </div>

                    {isBlocked ? (
                        <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl space-y-4">
                            <div className="flex items-center gap-3 text-amber-500">
                                <Lock size={20} />
                                <span className="font-bold text-sm uppercase tracking-wider">Acceso Bloqueado</span>
                            </div>
                            <p className="text-amber-200/80 text-xs leading-relaxed">
                                Para continuar, debes habilitar los permisos manualmente:
                                <br/><br/>
                                1. Haz clic en el **icono del candado** 🔒 en la barra superior.
                                <br/>
                                2. Activa los interruptores de **Cámara** y **Micrófono**.
                                <br/>
                                3. Refresca la página.
                            </p>
                        </div>
                    ) : error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4">
                            <AlertCircle className="text-red-500" size={20} />
                            <p className="text-red-200 text-xs">{error}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className={`flex-1 p-4 rounded-2xl border ${status.audio ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-gray-800 bg-gray-900/50'} flex items-center gap-3`}>
                                <Mic size={18} className={status.audio ? 'text-emerald-500' : 'text-gray-600'} />
                                <span className={`text-xs font-bold ${status.audio ? 'text-white' : 'text-gray-600'}`}>Micrófono {status.audio ? 'Listo' : '---'}</span>
                            </div>
                            <div className={`flex-1 p-4 rounded-2xl border ${status.video ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-gray-800 bg-gray-900/50'} flex items-center gap-3`}>
                                <Camera size={18} className={status.video ? 'text-emerald-500' : 'text-gray-600'} />
                                <span className={`text-xs font-bold ${status.video ? 'text-white' : 'text-gray-600'}`}>Cámara {status.video ? 'Lista' : 'Off'}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={requestPermissions} className="px-6 py-4 rounded-2xl bg-gray-800 text-white font-bold hover:bg-gray-700 transition-all flex items-center justify-center gap-3">
                                {isChecking ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
                                Probar de Nuevo
                            </button>
                            <button 
                                disabled={!status.audio}
                                onClick={onReady}
                                className={`flex-1 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${status.audio ? 'mc-button-primary text-white shadow-lg shadow-emerald-900/20' : 'bg-gray-900 text-gray-600 cursor-not-allowed'}`}
                            >
                                <CheckCircle2 size={18} />
                                {status.video ? 'Entrar a Videollamada' : 'Entrar solo con Audio'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
