import { useState, useEffect, useRef } from 'react';
import { Camera, Mic, CheckCircle2, AlertCircle, Loader2, Play } from 'lucide-react';

/**
 * PRE-FLIGHT CHECK (SALA DE ESPERA TÉCNICA)
 * 
 * DESCRIPCIÓN:
 * Este componente actúa como un guardián antes de entrar a la videollamada.
 * Permite al usuario verificar que su cámara y micrófono funcionan correctamente.
 * 
 * CÓMO FUNCIONA:
 * 1. Intenta acceder a los medios locales usando navigator.mediaDevices.getUserMedia.
 * 2. Muestra un flujo de video local en tiempo real.
 * 3. Valida el estado de los permisos antes de permitir el acceso a la sala SFU.
 * 
 * CÓMO MODIFICARLO:
 * - Para cambiar el mensaje de error: Edita el estado 'error'.
 * - Para ajustar la estética: Usa los tokens var(--mc-...) en las clases CSS.
 */
interface PreFlightProps {
    onReady: () => void;
    userName: string;
}

export const PreFlightCheck = ({ onReady, userName }: PreFlightProps) => {
    const [status, setStatus] = useState({ video: false, audio: false });
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const checkDevices = async () => {
        setIsChecking(true);
        setError(null);
        try {
            const userMedia = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: true
            });
            setStream(userMedia);
            setStatus({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = userMedia;
            }
        } catch (err: any) {
            console.error("Error de permisos:", err);
            if (err.name === 'NotAllowedError') {
                setError("Acceso denegado. Por favor, activa los permisos de cámara y micrófono en la barra de tu navegador o en la configuración de tu sistema.");
            } else {
                setError("No se detectaron dispositivos de video o audio. Verifica que tu cámara esté conectada.");
            }
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        checkDevices();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-[var(--mc-bg-dark)] z-[100] flex items-center justify-center p-4">
            <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-8 items-center">

                {/* Visualizador de Cámara Local */}
                <div className="relative aspect-video bg-black rounded-[var(--mc-radius-xl)] overflow-hidden border border-gray-800 shadow-2xl mc-glass-panel">
                    {stream ? (
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover mirror"
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-4">
                            {isChecking ? <Loader2 className="animate-spin w-8 h-8" /> : <Camera size={48} />}
                            <p className="text-xs uppercase tracking-widest font-bold">Cámara desactivada</p>
                        </div>
                    )}

                    {/* Overlay de Estado */}
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                        <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-2 ${status.video ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {status.video ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                            Video
                        </div>
                        <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-2 ${status.audio ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {status.audio ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                            Audio
                        </div>
                    </div>
                </div>

                {/* Controles y Mensajes */}
                <div className="space-y-8 text-center lg:text-left p-4">
                    <div>
                        <h2 className="text-white text-3xl font-bold mb-2">Hola, {userName}</h2>
                        <p className="text-gray-400 text-sm">Prepara tu entorno antes de entrar a la consulta médica.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-4 text-left">
                            <AlertCircle className="text-red-500 shrink-0" size={20} />
                            <p className="text-red-200 text-xs leading-relaxed">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <p className="text-gray-500 text-xs italic">Al hacer clic en "Entrar a la Consulta", aceptas el uso de la cámara y el micrófono para esta sesión cifrada.</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={checkDevices}
                                className="px-6 py-4 rounded-2xl bg-gray-800 text-white font-bold hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                            >
                                <Mic size={18} />
                                Re-intentar
                            </button>
                            <button
                                disabled={!status.video || !status.audio}
                                onClick={onReady}
                                className={`flex-1 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${status.video && status.audio ? 'mc-button-primary text-white' : 'bg-gray-900 text-gray-600 cursor-not-allowed'}`}
                            >
                                <Play size={18} />
                                Entrar a la Consulta
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
