import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Videollamada from './components/Videollamada';
import HistorialClinico from './components/HistorialClinico';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ReservaCita from './components/ReservaCita';
import { useAuth } from './context/AuthContext';

function App() {
    const { isAuthenticated, user } = useAuth();
    const [authView, setAuthView] = useState<'login' | 'register'>('login');
    const location = useLocation();

    // If completely unauthenticated, force login
    if (!isAuthenticated || !user) {
        return authView === 'login' ? (
            <Login onSwitchToRegister={() => setAuthView('register')} />
        ) : (
            <Register onSwitchToLogin={() => setAuthView('login')} />
        );
    }

    // Determine the homepage redirect dynamically based on Role
    const defaultRoute = user.role === 'PATIENT' ? '/reserva' : '/historial';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Show Navbar unless inside a Videocall room */}
            {!location.pathname.startsWith('/room/') && (
                <Navbar
                    nombreUsuario={user.name}
                    tipoUsuario={user.role.toLowerCase() as 'paciente' | 'medico'}
                />
            )}

            <main className="flex-1">
                <Routes>
                    <Route path="/reserva" element={<ReservaCita />} />
                    <Route path="/historial" element={<HistorialClinico />} />
                    <Route path="/room/:roomId" element={<Videollamada />} />
                    
                    {/* Catch all fallback */}
                    <Route path="*" element={<Navigate to={defaultRoute} replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
