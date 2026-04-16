import { useState } from 'react';
import { Calendar, MapPin, User, CheckCircle, Clock, Save } from 'lucide-react';
import { pacienteActual, consultasAnteriores } from '../data/mockData';
import { NotaClinica, Consulta } from '../types';

export default function HistorialClinico() {
    const [consultas, setConsultas] = useState<Consulta[]>(consultasAnteriores);
    const [nuevaNota, setNuevaNota] = useState<NotaClinica>({
        diagnostico: '',
        medicamentos: '',
        observaciones: ''
    });
    const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

    const handleGuardarNota = (e: React.FormEvent) => {
        e.preventDefault();

        if (!nuevaNota.diagnostico.trim()) {
            alert('El diagnóstico es obligatorio');
            return;
        }

        const nuevaConsulta: Consulta = {
            id: (consultas.length + 1).toString(),
            fecha: new Date().toISOString().split('T')[0],
            diagnostico: nuevaNota.diagnostico,
            estado: 'completada',
            medicamentos: nuevaNota.medicamentos,
            observaciones: nuevaNota.observaciones
        };

        setConsultas([nuevaConsulta, ...consultas]);
        setNuevaNota({ diagnostico: '', medicamentos: '', observaciones: '' });
        setMostrandoFormulario(false);

        alert('✓ Nota clínica guardada exitosamente');
    };

    const formatearFecha = (fecha: string) => {
        const [year, month, day] = fecha.split('-');
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return `${day} ${meses[parseInt(month) - 1]} ${year}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Historial Clínico del Paciente</h1>

                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white mb-8 shadow-lg">
                        <div className="flex items-start justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <User size={24} />
                                    <h2 className="text-2xl font-bold">{pacienteActual.nombre}</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div>
                                        <p className="text-blue-200 text-sm">RUT</p>
                                        <p className="font-semibold">{pacienteActual.rut}</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-200 text-sm">Edad</p>
                                        <p className="font-semibold">{pacienteActual.edad} años</p>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <MapPin size={16} className="mt-1" />
                                        <div>
                                            <p className="text-blue-200 text-sm">Localidad</p>
                                            <p className="font-semibold">{pacienteActual.localidad}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <button
                            onClick={() => setMostrandoFormulario(!mostrandoFormulario)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                        >
                            <Save size={20} />
                            <span>{mostrandoFormulario ? 'Cancelar' : 'Registrar Nueva Nota Clínica'}</span>
                        </button>
                    </div>

                    {mostrandoFormulario && (
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Nueva Nota Clínica</h3>
                            <form onSubmit={handleGuardarNota} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Diagnóstico *
                                    </label>
                                    <input
                                        type="text"
                                        value={nuevaNota.diagnostico}
                                        onChange={(e) => setNuevaNota({ ...nuevaNota, diagnostico: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Ej: Hipertensión arterial controlada"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Indicaciones de Medicamentos
                                    </label>
                                    <textarea
                                        value={nuevaNota.medicamentos}
                                        onChange={(e) => setNuevaNota({ ...nuevaNota, medicamentos: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        rows={3}
                                        placeholder="Ej: Losartán 50mg - 1 comprimido cada 24 horas"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Observaciones
                                    </label>
                                    <textarea
                                        value={nuevaNota.observaciones}
                                        onChange={(e) => setNuevaNota({ ...nuevaNota, observaciones: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        rows={3}
                                        placeholder="Ej: Control en 30 días. Dieta baja en sodio."
                                    />
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                                    >
                                        <Save size={18} />
                                        <span>Guardar Nota Clínica</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMostrandoFormulario(false)}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Consultas Anteriores</h3>
                        <div className="space-y-4">
                            {consultas.map((consulta) => (
                                <div
                                    key={consulta.id}
                                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="text-blue-600" size={20} />
                                            <span className="font-semibold text-gray-800">
                                                {formatearFecha(consulta.fecha)}
                                            </span>
                                        </div>
                                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${consulta.estado === 'completada'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {consulta.estado === 'completada' ? (
                                                <CheckCircle size={16} />
                                            ) : (
                                                <Clock size={16} />
                                            )}
                                            <span className="text-sm font-medium capitalize">{consulta.estado}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-600 font-semibold mb-1">Diagnóstico:</p>
                                            <p className="text-gray-800">{consulta.diagnostico}</p>
                                        </div>

                                        {consulta.medicamentos && (
                                            <div>
                                                <p className="text-sm text-gray-600 font-semibold mb-1">Medicamentos:</p>
                                                <p className="text-gray-800">{consulta.medicamentos}</p>
                                            </div>
                                        )}

                                        {consulta.observaciones && (
                                            <div>
                                                <p className="text-sm text-gray-600 font-semibold mb-1">Observaciones:</p>
                                                <p className="text-gray-800">{consulta.observaciones}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
