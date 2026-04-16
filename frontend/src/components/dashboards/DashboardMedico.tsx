import { useState, useEffect } from 'react';
import { Video, FileText, Clock, CheckCircle2, Stethoscope, ChevronRight, Users, HeartPulse, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../lib/api';

interface Appointment {
  id: number;
  date: string;
  status: string;
  patient: { name: string; rut: string };
  meetingLink: string | null;
  clinicalRecord?: { diagnosis: string } | null;
}

export default function DashboardMedico() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = () => {
    const token = localStorage.getItem('medicampo_token');
    fetch(`${API_URL}/api/appointments/my-appointments`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setAppointments(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('medicampo_token');
      const res = await fetch(`${API_URL}/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchAppointments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const today = new Date().toDateString();
  const todayApts = appointments.filter(a => new Date(a.date).toDateString() === today);
  const pending = appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING');
  const completed = appointments.filter(a => a.status === 'COMPLETED');

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      CONFIRMED: 'bg-emerald-100 text-emerald-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      COMPLETED: 'bg-blue-100 text-blue-700',
      CANCELLED: 'bg-red-100 text-red-700',
    };
    const label: Record<string, string> = {
      CONFIRMED: 'Confirmada', PENDING: 'Pendiente', COMPLETED: 'Completada', CANCELLED: 'Cancelada'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-600'}`}>{label[status] || status}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel Médico — <span className="text-emerald-600">{user?.name}</span></h1>
        <p className="text-gray-500 mt-1">Vista general de tu agenda clínica y pacientes del día.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Consultas Hoy', value: todayApts.length, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Pendientes', value: pending.length, icon: HeartPulse, color: 'text-yellow-500', bg: 'bg-yellow-50' },
          { label: 'Completadas', value: completed.length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Total Pacientes', value: new Set(appointments.map(a => a.patient?.name)).size, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-5 flex flex-col gap-2 border border-white shadow-sm`}>
            <div className={`${color} w-8 h-8`}><Icon className="w-full h-full" /></div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Agenda de hoy */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Stethoscope className="text-emerald-500 w-5 h-5" /> Agenda de Hoy
        </h2>
        {loading ? <div className="text-center py-10 text-gray-400">Cargando...</div> :
          (todayApts.length === 0 && pending.length === 0) ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">No tienes consultas programadas para hoy.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Sección de Pendientes de Aprobación */}
              {pending.filter(a => a.status === 'PENDING').map(apt => (
                <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border-2 border-yellow-200 bg-yellow-50/50 transition-all gap-3 animate-pulse-slow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center text-white font-bold text-lg shadow">
                      {apt.patient?.name?.[0] || 'P'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{apt.patient?.name}</p>
                      <p className="text-xs text-yellow-700 font-medium">Solicitud Pendiente</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(apt.date).toLocaleDateString()} — {new Date(apt.date).toLocaleTimeString('es-CL', { timeStyle: 'short' })} hrs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusUpdate(apt.id, 'CONFIRMED')}
                      className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white text-sm rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <Check className="w-4 h-4" /> Aceptar
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(apt.id, 'CANCELLED')}
                      className="flex items-center gap-1 px-4 py-2 bg-white border border-red-200 text-red-600 text-sm rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <X className="w-4 h-4" /> Rechazar
                    </button>
                  </div>
                </div>
              ))}

              {/* Consultas Confirmadas de Hoy */}
              {todayApts.filter(a => a.status === 'CONFIRMED').map(apt => (
                <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow">
                      {apt.patient?.name?.[0] || 'P'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{apt.patient?.name}</p>
                      <p className="text-xs text-gray-400">RUT: {apt.patient?.rut}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(apt.date).toLocaleTimeString('es-CL', { timeStyle: 'short' })} hrs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {statusBadge(apt.status)}
                    {apt.meetingLink && (
                      <button
                        onClick={() => navigate(apt.meetingLink!)}
                        className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white text-sm rounded-xl hover:bg-emerald-700 transition-colors"
                      >
                        <Video className="w-4 h-4" /> Iniciar Consulta
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Historial de pacientes atendidos */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FileText className="text-gray-400 w-5 h-5" /> Historiales Completados
        </h2>
        {completed.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Aún no tienes consultas completadas.</p>
        ) : (
          <div className="space-y-3">
            {completed.map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50/60 transition gap-3">
                <div>
                  <p className="font-medium text-gray-800">{apt.patient?.name}</p>
                  <p className="text-xs text-gray-400">{new Date(apt.date).toLocaleDateString('es-CL')} {apt.clinicalRecord ? `— ${apt.clinicalRecord.diagnosis.slice(0, 40)}...` : '— Sin ficha clínica'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {statusBadge(apt.status)}
                  <button onClick={() => navigate(`/historial/${apt.id}`)} className="p-2 text-gray-400 hover:text-emerald-600 transition">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
