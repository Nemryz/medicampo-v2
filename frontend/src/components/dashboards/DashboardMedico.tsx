import { useState, useEffect } from 'react';
import { Video, FileText, Clock, CheckCircle2, Stethoscope, ChevronRight, Users, HeartPulse, Check, X, Calendar } from 'lucide-react';
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

  const handleStatusUpdate = async (id: number, status: string, date: string, meetingLink: string | null) => {
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
        // Si la cita es para HOY y se aceptó, preguntar si quiere entrar de una vez
        const isToday = new Date(date).toDateString() === new Date().toDateString();
        if (status === 'CONFIRMED' && isToday && meetingLink) {
          if (window.confirm('Cita aceptada para hoy. ¿Deseas ingresar a la sala de video ahora?')) {
            navigate(meetingLink);
            return;
          }
        }
        fetchAppointments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const todayStr = new Date().toDateString();
  
  // Citas para hoy (Confirmadas)
  const todayApts = appointments.filter(a => 
    new Date(a.date).toDateString() === todayStr && a.status === 'CONFIRMED'
  );

  // Citas Pendientes de Aprobación (Cualquier fecha)
  const pendingApts = appointments.filter(a => a.status === 'PENDING');

  // Citas Futuras Confirmadas (Después de hoy)
  const futureApts = appointments.filter(a => 
    new Date(a.date) > new Date() && 
    new Date(a.date).toDateString() !== todayStr && 
    a.status === 'CONFIRMED'
  );

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
        <p className="text-gray-500 mt-1">Gestiona tus consultas y visibilidad de agenda.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Consultas Hoy', value: todayApts.length, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Por Aprobar', value: pendingApts.length, icon: HeartPulse, color: 'text-yellow-500', bg: 'bg-yellow-50' },
          { label: 'Completadas', value: completed.length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Próximas', value: futureApts.length, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-5 flex flex-col gap-2 border border-white shadow-sm`}>
            <div className={`${color} w-8 h-8`}><Icon className="w-full h-full" /></div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Agenda Principal */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Lado Izquierdo: Acciones Inmediatas */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 text-emerald-600">
              <Clock className="w-5 h-5" /> Consultas de Hoy
            </h2>
            {todayApts.length === 0 ? (
              <p className="text-center py-10 text-gray-400">No hay consultas confirmadas para hoy.</p>
            ) : (
              <div className="space-y-3">
                {todayApts.map(apt => (
                  <div key={apt.id} className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-gray-900">{apt.patient.name}</p>
                      <p className="text-xs text-gray-500">{new Date(apt.date).toLocaleTimeString('es-CL', { timeStyle: 'short' })} hrs</p>
                    </div>
                    <button
                      onClick={() => navigate(apt.meetingLink!)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition"
                    >
                      <Video size={16} /> Iniciar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 text-yellow-600">
              <HeartPulse className="w-5 h-5" /> Solicitudes Pendientes
            </h2>
            {pendingApts.length === 0 ? (
              <p className="text-center py-10 text-gray-400">No tienes solicitudes por aprobar.</p>
            ) : (
              <div className="space-y-3">
                {pendingApts.map(apt => (
                  <div key={apt.id} className="p-4 rounded-2xl border border-yellow-100 bg-yellow-50/20 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900">{apt.patient.name}</p>
                        <p className="text-xs text-gray-500">{new Date(apt.date).toLocaleDateString()} - {new Date(apt.date).toLocaleTimeString('es-CL', { timeStyle: 'short' })}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleStatusUpdate(apt.id, 'CONFIRMED', apt.date, apt.meetingLink)} className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"><Check size={18} /></button>
                        <button onClick={() => handleStatusUpdate(apt.id, 'CANCELLED', apt.date, apt.meetingLink)} className="p-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"><X size={18} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lado Derecho: Próximas Citas */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 text-purple-600">
            <Calendar className="w-5 h-5" /> Próximas Citas Confirmadas
          </h2>
          {futureApts.length === 0 ? (
            <p className="text-center py-10 text-gray-400">No tienes citas agendadas para el futuro.</p>
          ) : (
            <div className="space-y-3">
              {futureApts.map(apt => (
                <div key={apt.id} className="p-4 rounded-2xl border border-purple-50 hover:bg-purple-50/30 transition flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{apt.patient.name}</p>
                    <p className="text-xs text-purple-600 font-medium uppercase tracking-tighter">
                      {new Date(apt.date).toLocaleDateString('es-CL', { dateStyle: 'medium' })}
                    </p>
                  </div>
                  <Clock size={18} className="text-purple-200" />
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FileText className="text-gray-400 w-5 h-5" /> Atenciones Recientes
            </h2>
            <div className="space-y-3">
              {completed.slice(0, 5).map(apt => (
                <div key={apt.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer" onClick={() => navigate(`/historial/${apt.id}`)}>
                   <p className="text-sm font-medium text-gray-800">{apt.patient.name}</p>
                   <ChevronRight size={16} className="text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
