import { Video, FileText, CalendarPlus, LogOut, Beaker } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
    nombreUsuario: string;
    tipoUsuario: 'paciente' | 'medico' | 'admin';
}

export default function Navbar({ nombreUsuario, tipoUsuario }: NavbarProps) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check active path for styling
    const isActive = (path: string) => location.pathname === path;
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
                        {/* Botón de Sandbox LiveKit (Entorno de Pruebas) */}
                        <button
                            onClick={() => navigate('/livekit-test')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all border-2 border-emerald-500/20 hover:border-emerald-500/50 ${
                                isActive('/livekit-test')
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-500'
                                    : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                        >
                            <Beaker size={20} />
                            <span className="font-bold">Sandbox LiveKit</span>
                        </button>
                        {/* Botón de Home/Dashboard según rol */}
                        <button
                            onClick={() => navigate(
                                tipoUsuario === 'admin' ? '/admin' :
                                tipoUsuario === 'medico' ? '/dashboard-medico' :
                                '/dashboard-paciente'
                            )}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                                isActive('/admin') || isActive('/dashboard-medico') || isActive('/dashboard-paciente')
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <Video size={20} />
                            <span>Inicio</span>
                        </button>

                        {tipoUsuario === 'paciente' && (
                            <button
                                onClick={() => navigate('/reserva')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive('/reserva')
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <CalendarPlus size={20} />
                                <span>Agendar Cita</span>
                            </button>
                        )}
                        
                        {tipoUsuario === 'medico' && (
                            <button
                                onClick={() => navigate('/historial')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive('/historial')
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <FileText size={20} />
                                <span>Historial Clínico</span>
                            </button>
                        )}

                        <div className="flex items-center space-x-2 pl-4 border-l border-gray-300">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-white text-sm font-semibold">
                                    {nombreUsuario ? nombreUsuario.split(' ')[0][0] : 'U'}
                                </span>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{nombreUsuario}</span>
                            
                            <button onClick={logout} className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
