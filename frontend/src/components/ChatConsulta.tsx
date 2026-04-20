import React, { useState } from 'react';
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
 * 2. Los mensajes son efímeros (solo duran mientras la sesión está activa).
 * 3. Se sincroniza automáticamente con todos los participantes de la sala.
 * 
 * CÓMO MODIFICARLO:
 * - Para cambiar el estilo de los mensajes: Edita las clases de Tailwind en el mapeo de 'chatMessages'.
 * - Para añadir emojis o archivos: Deberás extender la función 'send'.
 */
export const ChatConsulta: React.FC = () => {
    const { chatMessages, send } = useChat();
    const [message, setMessage] = useState('');

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

            {/* Lista de Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.from?.isLocal ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] text-gray-500 font-bold uppercase">
                                {msg.from?.identity || 'Sistema'}
                            </span>
                        </div>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.from?.isLocal
                                ? 'bg-emerald-600 text-white rounded-tr-none'
                                : 'bg-gray-800 text-gray-200 rounded-tl-none'
                            }`}>
                            {msg.message}
                        </div>
                    </div>
                ))}
                {chatMessages.length === 0 && (
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
