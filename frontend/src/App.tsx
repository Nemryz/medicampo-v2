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
import { useAuth } from './context/AuthContext';

// Componente guard que verifica el rol antes de renderizar
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

    // Página de inicio según rol
    const homeRoute =
        user.role === 'ADMIN' ? '/admin' :
        user.role === 'DOCTOR' ? '/dashboard-medico' :
        '/dashboard-paciente';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {!location.pathname.startsWith('/room/') && (
                <Navbar
                    nombreUsuario={user.name}
                    tipoUsuario={user.role.toLowerCase() as 'paciente' | 'medico' | 'admin'}
                />
            )}

            <main className="flex-1">
                <Routes>
                    {/* Dashboards protegidos por Rol */}
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

                    {/* Funcionalidades compartidas con sus restricciones */}
                    <Route path="/reserva" element={<RoleRoute roles={['PATIENT']} element={<ReservaCita />} />} />
                    <Route path="/historial" element={<RoleRoute roles={['PATIENT', 'DOCTOR', 'ADMIN']} element={<HistorialClinico />} />} />
                    <Route path="/historial/:appointmentId" element={<HistorialClinico />} />
                    <Route path="/room/:roomId" element={<Videollamada />} />

                    {/* Redirigir a home según rol */}
                    <Route path="*" element={<Navigate to={homeRoute} replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
