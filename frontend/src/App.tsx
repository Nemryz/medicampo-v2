import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Videollamada from './components/Videollamada';
import HistorialClinico from './components/HistorialClinico';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ReservaCita from './components/ReservaCita';
import DashboardPaciente from './components/dashboards/DashboardPaciente';
import DashboardMedico from './components/dashboards/DashboardMedico';
import DashboardAdmin from './components/dashboards/DashboardAdmin';
import LiveKitTest from './components/LiveKitTest'; // Importación correcta aquí
import { useAuth } from './context/AuthContext';

/**
 * App.tsx (Sistema de Rutas MediCampo)
 * 
 * DESCRIPCIÓN:
 * Gestiona el enrutamiento principal de la aplicación.
 * Ahora incluye la ruta /livekit-test para el entorno Sandbox.
 * 
 * CÓMO FUNCIONA:
 * - Filtra las rutas por rol del usuario.
 * - Muestra la Navbar solo en páginas que no sean de videollamada para maximizar el espacio.
 */
function RoleRoute({ roles, element }: { roles: string[]; element: JSX.Element }) {
    const { user } = useAuth();
    if (!user || !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }
    return element;
}

function App() {
    const { isAuthenticated, user } = useAuth();
    const [authView, setAuthView] = useState<'login' | 'register'>('login');
    const location = useLocation();

    if (!isAuthenticated || !user) {
        return authView === 'login' ? (
            <Login onSwitchToRegister={() => setAuthView('register')} />
        ) : (
            <Register onSwitchToLogin={() => setAuthView('login')} />
        );
    }

    const homeRoute =
        user.role === 'ADMIN' ? '/admin' :
        user.role === 'DOCTOR' ? '/dashboard-medico' :
        '/dashboard-paciente';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Ocultamos Navbar en videollamadas y pruebas de LiveKit para un look más inmersivo */}
            {!location.pathname.startsWith('/room/') && !location.pathname.startsWith('/livekit-test') && (
                <Navbar
                    nombreUsuario={user.name}
                    tipoUsuario={user.role.toLowerCase() as 'paciente' | 'medico' | 'admin'}
                />
            )}

            <main className="flex-1">
                <Routes>
                    <Route
                        path="/dashboard-paciente"
                        element={<RoleRoute roles={['PATIENT']} element={<DashboardPaciente />} />}
                    />
                    <Route
                        path="/dashboard-medico"
                        element={<RoleRoute roles={['DOCTOR']} element={<DashboardMedico />} />}
                    />
                    <Route
                        path="/admin"
                        element={<RoleRoute roles={['ADMIN']} element={<DashboardAdmin />} />}
                    />

                    <Route path="/reserva" element={<RoleRoute roles={['PATIENT']} element={<ReservaCita />} />} />
                    <Route path="/historial" element={<RoleRoute roles={['PATIENT', 'DOCTOR', 'ADMIN']} element={<HistorialClinico />} />} />
                    <Route path="/historial/:appointmentId" element={<HistorialClinico />} />
                    
                    {/* Nuevas rutas de Videollamada y Sandbox */}
                    <Route path="/livekit-test" element={<LiveKitTest />} />
                    <Route path="/room/:roomId" element={<Videollamada />} />

                    <Route path="*" element={<Navigate to={homeRoute} replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
