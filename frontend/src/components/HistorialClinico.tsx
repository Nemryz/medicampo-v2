import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  User, 
  Stethoscope, 
  Activity, 
  ArrowLeft, 
  Printer, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../lib/api';

interface ClinicalRecord {
  id: number;
  date: string;
  doctor: { name: string; specialty: { name: string } | null };
  patient: { name: string; rut: string };
  clinicalRecord: {
    symptoms: string;
    diagnosis: string;
    prescription: string;
    observations: string;
    weight: string;
    bloodPressure: string;
    temperature: string;
  } | null;
}

export default function HistorialClinico() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [record, setRecord] = useState<ClinicalRecord | null>(null);
  const [history, setHistory] = useState<ClinicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('medicampo_token');
    
    if (appointmentId) {
      // Fetch specific record
      setLoading(true);
      fetch(`${API_URL}/api/clinical/appointment/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(r => r.json())
      .then(data => {
        // The API returns clinicalRecord with appointment inside, we need to adapt it
        if (data.appointment) {
          setRecord({
            ...data.appointment,
            clinicalRecord: data
          });
        } else {
            // Alternatively if it's the appointment data with record inside
            setRecord(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    } else {
      // Fetch user history
      const targetId = user?.id; // If patient, use self
      if (!targetId) return;

      setLoading(true);
      fetch(`${API_URL}/api/clinical/patient/${targetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(r => r.json())
      .then(data => {
        setHistory(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    }
  }, [appointmentId, user]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // --- MODO DETALLE (REPORTE MÉDICO) ---
  if (appointmentId && record) {
    const r = record.clinicalRecord;
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Back button and Print */}
          <div className="flex justify-between items-center no-print">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition"
            >
              <ArrowLeft size={20} /> Volver
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition"
            >
              <Printer size={20} /> Imprimir Receta / Ficha
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 print:shadow-none print:border-none">
            {/* Header Reporte */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">MediCampo</h1>
                <p className="text-blue-100 flex items-center gap-2 mt-1"><ShieldCheck size={16} /> Certificado de Atención Clínica</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100 uppercase font-bold">Folio: #{record.id}</p>
                <p className="text-xs text-blue-200">{new Date(record.date).toLocaleDateString('es-CL', { dateStyle: 'long' })}</p>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Seccion Paciente y Medico */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b pb-2">Información del Paciente</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><User /></div>
                    <div>
                      <p className="text-lg font-bold text-gray-800">{record.patient.name}</p>
                      <p className="text-sm text-gray-500">{record.patient.rut}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest border-b pb-2">Médico Tratante</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><Stethoscope /></div>
                    <div>
                      <p className="text-lg font-bold text-gray-800">{record.doctor.name}</p>
                      <p className="text-sm text-gray-500">{record.doctor.specialty?.name || 'Medicina General'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signos Vitales */}
              <div className="bg-gray-50 rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border border-gray-100">
                {[
                  { label: 'Peso', value: r?.weight || '—', unit: 'kg', icon: Activity },
                  { label: 'Presión Arterial', value: r?.bloodPressure || '—', unit: 'mmHg', icon: Heart },
                  { label: 'Temperatura', value: r?.temperature || '—', unit: '°C', icon: Activity },
                  { label: 'Ritmo Card.', value: '—', unit: 'LPM', icon: Clock },
                ].map(({ label, value, unit, icon: Icon }) => (
                  <div key={label} className="text-center md:text-left">
                    <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1 justify-center md:justify-start">
                      <Icon size={12} className="text-blue-400" /> {label}
                    </p>
                    <p className="text-lg font-bold text-gray-700">{value} <span className="text-xs text-gray-400 font-normal">{unit}</span></p>
                  </div>
                ))}
              </div>

              {/* Diagnostico y Síntomas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2"><FileText className="text-blue-500" size={18} /> Síntomas Reportados</h4>
                  <div className="p-4 bg-white border border-gray-200 rounded-xl min-h-[80px] text-sm text-gray-600 leading-relaxed shadow-sm">
                    {r?.symptoms || 'No se registraron síntomas específicos.'}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2"><Activity className="text-blue-500" size={18} /> Diagnóstico Médico</h4>
                  <div className="p-4 bg-white border border-gray-200 rounded-xl min-h-[80px] text-sm text-gray-800 font-medium leading-relaxed shadow-sm">
                    {r?.diagnosis || 'Sin diagnóstico registrado.'}
                  </div>
                </div>
              </div>

              {/* Receta Médica */}
              <div className="pt-6">
                <div className="bg-blue-50/30 border-2 border-dashed border-blue-200 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute top-[-20px] left-[-20px] w-20 h-20 bg-blue-100/50 rounded-full"></div>
                  <h4 className="text-xl font-extrabold text-blue-700 mb-6 flex items-center gap-2 uppercase tracking-wide">
                    📦 Receta Médica / Prescripción
                  </h4>
                  <div className="text-gray-700 whitespace-pre-wrap leading-loose font-medium font-mono text-sm">
                    {r?.prescription || 'No se emitieron medicamentos en esta consulta.'}
                  </div>
                  <div className="mt-12 flex justify-between items-end border-t border-blue-100 pt-8 opacity-60">
                    <p className="text-xs text-gray-400">Este documento es una copia digital válida del historial clínico de mediCampo.</p>
                    <div className="text-center">
                      <div className="w-32 border-b border-gray-300 mx-auto mb-2"></div>
                      <p className="text-[10px] text-gray-500 font-bold">Firma Digital del Profesional</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MODO LISTA (HISTORIAL GENERAL) ---
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Tu Historial Médico</h1>
          <p className="text-gray-500 mt-1">Accede a todas tus recetas y diagnósticos anteriores.</p>
        </div>
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
          <FileText size={32} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Cargando tu historial...</div>
      ) : history.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
          <Clock size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-medium text-lg">Aún no tienes atenciones registradas.</p>
          <button onClick={() => navigate('/reserva')} className="mt-4 text-blue-600 hover:underline font-semibold">Reserva tu primera cita aquí →</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((h) => (
            <div 
              key={h.id} 
              onClick={() => navigate(`/historial/${h.id}`)}
              className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    {new Date(h.date).toLocaleDateString('es-CL', { month: 'short' })}
                  </span>
                  <span className="text-xl font-black leading-none">
                    {new Date(h.date).getDate()}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{h.doctor.name}</p>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    {h.doctor.specialty?.name || 'Consulta General'} • 
                    <span className="text-emerald-500 font-medium">Completada</span>
                  </p>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
