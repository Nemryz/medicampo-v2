import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, UserIcon, Stethoscope, ChevronRight, CheckCircle2, AlertCircle, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../lib/api';

interface Doctor {
  id: number;
  name: string;
  specialty?: { name: string } | null;
}

export default function ReservaCita() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [meetingLink, setMeetingLink] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Cargar doctores reales desde la API
  useEffect(() => {
    const token = localStorage.getItem('medicampo_token');
    fetch(`${API_URL}/api/appointments/doctors`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setDoctors(Array.isArray(data) ? data : []);
        setLoadingDoctors(false);
      })
      .catch(() => setLoadingDoctors(false));
  }, []);

  const handleBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;
    setConfirming(true);
    setError('');

    try {
      const token = localStorage.getItem('medicampo_token');
      const dateISO = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();

      const res = await fetch(`${API_URL}/api/appointments/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ doctorId: selectedDoctor, date: dateISO })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear la cita');

      setMeetingLink(data.meetingLink);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setConfirming(false);
    }
  };

  const getAvailableTimes = () => ['09:00', '10:00', '11:30', '14:00', '15:30', '17:00'];

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-12 bg-white rounded-3xl shadow-xl max-w-lg mx-auto border border-emerald-100 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Cita Confirmada!</h2>
        <p className="text-gray-500 text-center mb-6">Tu teleconsulta ha sido agendada con éxito y guardada en tu historial.</p>

        {meetingLink && (
          <button
            onClick={() => navigate(meetingLink)}
            className="mb-4 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/20"
          >
            <Video className="w-5 h-5" /> Entrar a la Sala de Video
          </button>
        )}

        <button
          onClick={() => { setSuccess(false); setSelectedDoctor(null); setSelectedDate(''); setSelectedTime(''); setMeetingLink(null); }}
          className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Agendar otra cita
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Agendar Teleconsulta</h1>
        <p className="text-gray-500">Selecciona al especialista y el horario que mejor te acomode.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Paso 1: Seleccionar Médico */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
            Especialista
          </h2>

          {loadingDoctors ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-2xl" />)}
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Stethoscope className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No hay doctores disponibles.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {doctors.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc.id)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedDoctor === doc.id
                      ? 'border-blue-500 bg-blue-50/50 shadow-md transform scale-[1.02]'
                      : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedDoctor === doc.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <UserIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 gap-1 mt-1">
                        <Stethoscope className="w-4 h-4" />
                        {doc.specialty?.name || 'Medicina General'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Paso 2: Fecha y Hora */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
            Disponibilidad
          </h2>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                Fecha de la consulta
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                disabled={!selectedDoctor}
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all disabled:opacity-50 disabled:bg-gray-100 outline-none"
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="w-5 h-5 text-blue-500" />
                Hora de la consulta
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {getAvailableTimes().map((time) => (
                  <button
                    key={time}
                    disabled={!selectedDate}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                      selectedTime === time
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-blue-50 border border-gray-200 disabled:opacity-40 disabled:hover:bg-gray-50 disabled:scale-100'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500 text-center sm:text-left">
              {!selectedDoctor ? 'Comienza seleccionando un especialista' :
               !selectedDate ? 'Selecciona una fecha en el calendario' :
               !selectedTime ? 'Elige tu bloque horario' :
               <span className="text-emerald-600 font-medium flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Todo listo para confirmar</span>}
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedDoctor || !selectedDate || !selectedTime || confirming}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-[0_8px_20px_rgb(37,99,235,0.2)] transition-all duration-300 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 group"
            >
              {confirming ? 'Guardando...' : 'Confirmar Reserva'}
              {!confirming && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
