import { useState, useEffect } from 'react';
import { CalendarPlus, Video, Clock, CheckCircle2, XCircle, ChevronRight, HeartPulse, FileText, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../lib/api';

interface Appointment {
  id: number;
  date: string;
  status: string;
  doctor: { name: string; specialty: { name: string } | null };
  meetingLink: string | null;
}

export default function DashboardPaciente() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('medicampo_token');
    fetch(`${API_URL}/api/appointments/my-appointments`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setAppointments(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING');
  const past = appointments.filter(a => a.status === 'COMPLETED' || a.status === 'CANCELLED');

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      CONFIRMED: 'bg-emerald-100 text-emerald-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      COMPLETED: 'bg-blue-100 text-blue-700',
      CANCELLED: 'bg-red-100 text-red-700',
    };
    const label: Record<string, string> = {
      CONFIRMED: 'Confirmada', PENDING: 'Esperando Médico', COMPLETED: 'Completada', CANCELLED: 'Rechazada'
    };
    return <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${map[status] || 'bg-gray-100 text-gray-600'}`}>{label[status] || status}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bienvenido, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{user?.name?.split(' ')[0]}</span></h1>
          <p className="text-gray-500 mt-1">Control de tus atenciones médicas y resultados.</p>
        </div>
        <button
          onClick={() => navigate('/reserva')}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
        >
          <CalendarPlus className="w-5 h-5" />
          Agendar Teleconsulta
        </button>
      </div>

      {/* Próximas citas / Sala de espera */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <Video className="text-blue-500 w-6 h-6" /> Tu Agenda Próxima
            </h2>
            <span className="text-xs font-medium text-gray-400">Total: {upcoming.length}</span>
        </div>
        
        <div className="p-4 sm:p-8">
            {loading ? (
            <div className="text-center py-12 text-gray-400 animate-pulse">Cargando tus citas...</div>
            ) : upcoming.length === 0 ? (
            <div className="text-center py-20 bg-gray-50/50 rounded-[1.5rem] border border-dashed border-gray-200">
                <HeartPulse className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No tienes teleconsultas agendadas actualmente.</p>
            </div>
            ) : (
            <div className="grid gap-4">
                {upcoming.map(apt => (
                <div 
                    key={apt.id} 
                    className={`relative overflow-hidden p-6 rounded-[1.5rem] border transition-all duration-300 ${
                        apt.status === 'PENDING' 
                        ? 'bg-yellow-50/30 border-yellow-100 border-dashed' 
                        : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-lg'
                    }`}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            {/* Fecha Destacada */}
                            <div className="flex flex-col items-center justify-center w-20 h-20 bg-white shadow-sm rounded-2xl border border-gray-100 text-center">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{new Date(apt.date).toLocaleDateString('es-CL', { month: 'short' })}</span>
                                <span className="text-3xl font-black text-gray-900 leading-none">{new Date(apt.date).getDate()}</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(apt.date).toLocaleTimeString('es-CL', { hour:'2-digit', minute:'2-digit' })}</span>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-lg font-extrabold text-gray-900">{apt.doctor.name}</p>
                                    {statusBadge(apt.status)}
                                </div>
                                <p className="text-sm text-gray-500 mb-1">{apt.doctor.specialty?.name || 'Consulta General'}</p>
                                {apt.status === 'PENDING' ? (
                                    <div className="flex items-center gap-1.5 text-xs text-yellow-600 font-semibold bg-yellow-100/50 px-2 py-1 rounded-lg w-fit">
                                        <AlertCircle size={14} /> El médico confirmará pronto
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-lg w-fit">
                                        <CheckCircle2 size={14} /> Todo listo para la cita
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Botón de Acción Especializado */}
                        <div className="flex flex-col items-stretch sm:items-end gap-3 min-w-[150px]">
                            {apt.status === 'CONFIRMED' && apt.meetingLink ? (
                                <button
                                    onClick={() => navigate(apt.meetingLink!)}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition"
                                >
                                    Ingresar a la Sala
                                </button>
                            ) : (
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Disponible el</p>
                                    <p className="text-sm font-bold text-gray-600">{new Date(apt.date).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
      </div>

      {/* Historial */}
      {past.length > 0 && (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FileText className="text-gray-300 w-6 h-6" /> Tu Historial Médico
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {past.map(apt => (
              <div 
                key={apt.id} 
                onClick={() => navigate(`/historial/${apt.id}`)}
                className="p-5 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-blue-100 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(apt.date).toLocaleDateString()}</span>
                    <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="font-bold text-gray-800">{apt.doctor.name}</p>
                <p className="text-xs text-gray-500 mb-4">{apt.doctor.specialty?.name || 'Medicina General'}</p>
                {statusBadge(apt.status)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
