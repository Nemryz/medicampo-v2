import { useState, useEffect } from 'react';
import { CalendarPlus, Video, Clock, CheckCircle2, XCircle, ChevronRight, HeartPulse, FileText } from 'lucide-react';
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
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-600'}`}>{label[status] || status}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido, <span className="text-blue-600">{user?.name?.split(' ')[0]}</span></h1>
          <p className="text-gray-500 mt-1">Gestiona tus consultas médicas y estado de salud.</p>
        </div>
        <button
          onClick={() => navigate('/reserva')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-blue-400 transition-all"
        >
          <CalendarPlus className="w-5 h-5" />
          Agendar Nueva Cita
        </button>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Citas Pendientes', value: upcoming.length, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50' },
          { label: 'Completadas', value: past.filter(a => a.status === 'COMPLETED').length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Canceladas', value: past.filter(a => a.status === 'CANCELLED').length, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Total', value: appointments.length, icon: HeartPulse, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-5 flex flex-col gap-2 border border-white shadow-sm`}>
            <div className={`${color} w-8 h-8`}><Icon className="w-full h-full" /></div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Próximas citas */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Video className="text-blue-500 w-5 h-5" /> Próximas Teleconsultas
        </h2>
        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando citas...</div>
        ) : upcoming.length === 0 ? (
          <div className="text-center py-12">
            <HeartPulse className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No tienes citas agendadas.</p>
            <button onClick={() => navigate('/reserva')} className="mt-4 text-blue-600 font-medium hover:underline">
              Agendar ahora →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map(apt => (
              <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow">
                    {apt.doctor?.name?.split(' ')[1]?.[0] || 'M'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{apt.doctor?.name}</p>
                    <p className="text-sm text-gray-500">{apt.doctor?.specialty?.name || 'Medicina General'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(apt.date).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {statusBadge(apt.status)}
                  {apt.meetingLink && apt.status === 'CONFIRMED' ? (
                    <button
                      onClick={() => navigate(apt.meetingLink!)}
                      className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Video className="w-4 h-4" /> Entrar en Sala
                    </button>
                  ) : apt.status === 'PENDING' ? (
                    <span className="text-[10px] bg-gray-50 text-gray-400 px-3 py-2 rounded-xl border border-gray-100 font-medium whitespace-nowrap">
                      Esperando Médico...
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historial */}
      {past.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="text-gray-400 w-5 h-5" /> Historial de Consultas
          </h2>
          <div className="space-y-3">
            {past.map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50/60 transition group gap-3">
                <div>
                  <p className="font-medium text-gray-800">{apt.doctor?.name}</p>
                  <p className="text-sm text-gray-400">{new Date(apt.date).toLocaleDateString('es-CL', { dateStyle: 'long' })}</p>
                </div>
                <div className="flex items-center gap-2">
                  {statusBadge(apt.status)}
                  <button onClick={() => navigate(`/historial/${apt.id}`)} className="p-2 text-gray-400 hover:text-blue-600 transition">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
