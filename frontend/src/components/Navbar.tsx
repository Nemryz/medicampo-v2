import { Video, FileText } from 'lucide-react';

interface NavbarProps {
    vista: 'videollamada' | 'historial';
    onCambiarVista: (vista: 'videollamada' | 'historial') => void;
    nombreUsuario: string;
    tipoUsuario: 'paciente' | 'medico';
}

export default function Navbar({ vista, onCambiarVista, nombreUsuario, tipoUsuario }: NavbarProps) {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-700">MediCampo</span>
                    </div>

                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => onCambiarVista('videollamada')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${vista === 'videollamada'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Video size={20} />
                            <span>Consulta</span>
                        </button>

                        {tipoUsuario === 'medico' && (
                            <button
                                onClick={() => onCambiarVista('historial')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${vista === 'historial'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <FileText size={20} />
                                <span>Historial Clínico</span>
                            </button>
                        )}

                        <div className="flex items-center space-x-2 pl-4 border-l border-gray-300">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">
                                    {nombreUsuario.split(' ')[0][0]}
                                </span>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{nombreUsuario}</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
