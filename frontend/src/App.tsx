import { useState } from 'react';
import Navbar from './components/Navbar';
import Videollamada from './components/Videollamada';
import HistorialClinico from './components/HistorialClinico';

function App() {
    const [vista, setVista] = useState<'videollamada' | 'historial'>('videollamada');
    const [tipoUsuario] = useState<'paciente' | 'medico'>('medico');
    const [nombreUsuario] = useState('Dr. Carlos Martínez');

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar
                vista={vista}
                onCambiarVista={setVista}
                nombreUsuario={nombreUsuario}
                tipoUsuario={tipoUsuario}
            />

            {vista === 'videollamada' ? <Videollamada /> : <HistorialClinico />}
        </div>
    );
}

export default App;
