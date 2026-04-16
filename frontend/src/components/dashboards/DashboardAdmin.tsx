import { useState, useEffect } from 'react';
import { Users, Activity, CheckCircle2, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { API_URL } from '../../lib/api';

interface Stats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  completedAppointments: number;
  recentAppointments: { id: number; date: string; status: string; patient: { name: string }; doctor: { name: string } }[];
}

export default function DashboardAdmin() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('medicampo_token');
    fetch(`${API_URL}/api/clinical/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => { setError('Error al cargar estadísticas'); setLoading(false); });
  }, []);

  const completionRate = stats && stats.totalAppointments > 0
    ? Math.round((stats.completedAppointments / stats.totalAppointments) * 100)
    : 0;

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
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100'}`}>{label[status] || status}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-100 rounded-2xl">
          <ShieldCheck className="w-7 h-7 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-500 mt-0.5">Monitoreo global de la plataforma mediCampo.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600">
          <AlertTriangle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Pacientes', value: stats?.totalPatients ?? '—', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Médicos', value: stats?.totalDoctors ?? '—', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Total Citas', value: stats?.totalAppointments ?? '—', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
          { label: 'Tasa de Cumplimiento', value: loading ? '—' : `${completionRate}%`, icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`${bg} ${border} border rounded-3xl p-6 flex flex-col gap-3`}>
            <div className={`${color} w-9 h-9`}><Icon className="w-full h-full" /></div>
            <p className="text-3xl font-bold text-gray-900">{loading ? <span className="inline-block w-8 h-6 bg-gray-200 animate-pulse rounded" /> : value}</p>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      {!loading && stats && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Tasa de Consultas Completadas</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{stats.completedAppointments} completadas</span>
              <span>{stats.totalAppointments} totales</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full transition-all duration-700"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-right text-sm font-semibold text-indigo-600">{completionRate}%</p>
          </div>
        </div>
      )}

      {/* Log de actividad reciente */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Actividad Reciente del Sistema</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {(stats?.recentAppointments ?? []).map(apt => (
              <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition gap-2">
                <div>
                  <p className="font-medium text-gray-800">
                    <span className="text-indigo-600">{apt.patient?.name}</span>
                    <span className="text-gray-400"> con </span>
                    <span className="text-emerald-600">{apt.doctor?.name}</span>
                  </p>
                  <p className="text-xs text-gray-400">{new Date(apt.date).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                {statusBadge(apt.status)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
