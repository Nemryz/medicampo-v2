import React, { useState, useEffect, useMemo } from 'react';
import { useChat } from '@livekit/components-react';
import { Send, MessageSquare } from 'lucide-react';

/**
 * ChatConsulta Component
 *
 * DESCRIPCIÓN:
 * Gestiona la mensajería de texto en tiempo real durante la videollamada.
 * Sigue el principio de Responsabilidad Única (SOLID) al aislar la lógica del chat del video.
 *
 * CÓMO FUNCIONA:
 * 1. Utiliza el hook 'useChat' de LiveKit que se comunica por el Data Channel de WebRTC.
 * 2. Los mensajes en vivo de LiveKit son EFÍMEROS (solo viven en memoria mientras dura la conexión).
 * 3. (NOTA persistencia chat) Para que los mensajes NO se pierdan al reconectarse tras una
 *    caída de red/recarga, los guardamos también en localStorage indexados por sala (roomId).
 *    Así el historial sobrevive reconexiones y recargas EN ESTE MISMO equipo/navegador.
 *    -> Es persistencia LOCAL del dispositivo (no compartida entre dispositivos distintos).
 *
 * CÓMO MODIFICARLO:
 * - Para cambiar el estilo de los mensajes: Edita las clases de Tailwind en el mapeo de mensajes.
 * - Para añadir emojis o archivos: Deberás extender la función 'send'.
 * - Para DESACTIVAR la persistencia local: elimina los bloques marcados con "(NOTA persistencia chat)"
 *   y vuelve a renderizar directamente 'chatMessages' en lugar de 'mensajes'.
 */

// (NOTA persistencia chat) Estructura mínima que guardamos por mensaje en localStorage.
interface StoredMessage {
    key: string;        // identificador único para deduplicar (id de LiveKit o timestamp+texto)
    timestamp: number;
    message: string;
    fromIdentity: string;
    isLocal: boolean;
}

interface ChatConsultaProps {
    // (NOTA persistencia chat) roomId para aislar el historial de cada sala.
    roomId?: string;
}

export const ChatConsulta: React.FC<ChatConsultaProps> = ({ roomId }) => {
    const { chatMessages, send } = useChat();
    const [message, setMessage] = useState('');

    // (NOTA persistencia chat) Clave de almacenamiento por sala.
    const storageKey = useMemo(() => `medicampo_chat_${roomId || 'default'}`, [roomId]);

    // (NOTA persistencia chat) Historial persistido; se inicializa leyendo localStorage.
    const [mensajes, setMensajes] = useState<StoredMessage[]>(() => {
        try {
            const raw = localStorage.getItem(`medicampo_chat_${roomId || 'default'}`);
            return raw ? (JSON.parse(raw) as StoredMessage[]) : [];
        } catch {
            return [];
        }
    });

    // (NOTA persistencia chat) Cada vez que LiveKit entrega mensajes en vivo, los fusionamos
    // con el historial guardado (sin duplicar) y persistimos el resultado en localStorage.
    useEffect(() => {
        if (!chatMessages || chatMessages.length === 0) return;

        setMensajes((prev) => {
            const fusionados: StoredMessage[] = [...prev];

            for (const msg of chatMessages) {
                const key = (msg.id ?? `${msg.timestamp}-${msg.message}`).toString();
                if (!fusionados.some((m) => m.key === key)) {
                    fusionados.push({
                        key,
                        timestamp: msg.timestamp,
                        message: msg.message,
                        fromIdentity: msg.from?.identity || 'Sistema',
                        isLocal: !!msg.from?.isLocal,
                    });
                }
            }

            fusionados.sort((a, b) => a.timestamp - b.timestamp);

            try {
                localStorage.setItem(storageKey, JSON.stringify(fusionados));
            } catch {
                /* Si el almacenamiento falla (modo privado/cuota), el chat sigue funcionando en memoria. */
            }

            return fusionados;
        });
    }, [chatMessages, storageKey]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            await send(message);
            setMessage('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800 bg-gray-900/80 flex items-center gap-2">
                <MessageSquare className="text-emerald-400 w-4 h-4" />
                <h4 className="text-white font-bold text-sm">Chat de la Consulta</h4>
            </div>

            {/* Lista de Mensajes (NOTA persistencia chat: se renderiza el historial fusionado) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mensajes.map((msg) => (
                    <div key={msg.key} className={`flex flex-col ${msg.isLocal ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] text-gray-500 font-bold uppercase">
                                {msg.fromIdentity}
                            </span>
                        </div>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.isLocal
                                ? 'bg-emerald-600 text-white rounded-tr-none'
                                : 'bg-gray-800 text-gray-200 rounded-tl-none'
                            }`}>
                            {msg.message}
                        </div>
                    </div>
                ))}
                {mensajes.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                            <MessageSquare className="text-gray-600 w-6 h-6" />
                        </div>
                        <p className="text-gray-500 text-xs">No hay mensajes aún. Puedes escribirle al {window.location.pathname.includes('doctor') ? 'paciente' : 'médico'}.</p>
                    </div>
                )}
            </div>

            {/* Input de Mensaje */}
            <form onSubmit={handleSendMessage} className="p-4 bg-gray-900/80 border-t border-gray-800 flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-gray-800 border-none rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <button
                    type="submit"
                    disabled={!message.trim()}
                    className="bg-emerald-600 p-2 rounded-xl text-white hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};
