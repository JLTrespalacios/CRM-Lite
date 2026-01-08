import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Plus, 
  Search,
  Filter,
  MoreVertical,
  X,
  Loader2,
  CalendarDays
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, isFuture, parseISO, compareAsc } from 'date-fns';
import { es } from 'date-fns/locale';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    clientId: '',
    date: '',
    time: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchClients();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      // Sort by date ascending
      const sorted = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setAppointments(sorted);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!newAppointment.clientId || !newAppointment.date || !newAppointment.time) {
        setError('Por favor complete todos los campos');
        setIsLoading(false);
        return;
      }

      const dateTime = new Date(`${newAppointment.date}T${newAppointment.time}`);
      
      await api.post('/appointments', {
        clientId: newAppointment.clientId,
        date: dateTime.toISOString()
      });

      setNewAppointment({ clientId: '', date: '', time: '' });
      setSuccess('Cita agendada exitosamente.');
      fetchAppointments();
      setIsFormOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error creating appointment:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Error al agendar la cita.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status: newStatus });
      fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar estado');
    }
  };

  const filteredAppointments = appointments.filter(app => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'cancelled': return 'Cancelada';
      default: return 'Pendiente';
    }
  };

  // Group appointments
  const groupedAppointments = filteredAppointments.reduce((acc, app) => {
    const date = parseISO(app.date);
    let group = 'future';
    
    if (isToday(date)) group = 'today';
    else if (isTomorrow(date)) group = 'tomorrow';
    else if (isPast(date) && !isToday(date)) group = 'past';
    
    if (!acc[group]) acc[group] = [];
    acc[group].push(app);
    return acc;
  }, {});

  const renderAppointmentGroup = (title, apps) => {
    if (!apps || apps.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          {title}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {apps.map((app) => (
            <div 
              key={app.id} 
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl flex-shrink-0 ${isToday(parseISO(app.date)) ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-500'}`}>
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{app.client?.name || 'Cliente Desconocido'}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {format(parseISO(app.date), "EEEE d 'de' MMMM", { locale: es })} - {format(parseISO(app.date), 'HH:mm')}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                      {getStatusText(app.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
                {app.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleStatusChange(app.id, 'confirmed')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 text-sm font-medium transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Confirmar
                    </button>
                    <button 
                      onClick={() => handleStatusChange(app.id, 'cancelled')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Cancelar
                    </button>
                  </>
                )}
                {app.status === 'confirmed' && (
                  <button 
                    onClick={() => handleStatusChange(app.id, 'cancelled')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancelar Cita
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Citas</h2>
          <p className="text-sm text-gray-500 mt-1">Programa y gestiona tus citas.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm ${
            isFormOpen 
              ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'
          }`}
        >
          {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isFormOpen ? 'Cancelar' : 'Nueva Cita'}
        </button>
      </div>

      {/* Mensajes de Feedback */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-700 text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Formulario Nueva Cita */}
      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Agendar Nueva Cita
          </h3>
          <form onSubmit={handleAddAppointment} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cliente</label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                value={newAppointment.clientId}
                onChange={(e) => setNewAppointment({...newAppointment, clientId: e.target.value})}
                required
              >
                <option value="">Seleccionar cliente...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Fecha</label>
              <input
                type="date"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Hora</label>
              <input
                type="time"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                required
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar Cita'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros */}
      <div className="flex items-center gap-2 pb-2 overflow-x-auto">
        {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
              filterStatus === status
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {status === 'all' ? 'Todas' : getStatusText(status)}
          </button>
        ))}
      </div>

      {/* Lista de Citas Agrupadas */}
      <div>
        {filteredAppointments.length > 0 ? (
          <>
            {renderAppointmentGroup('Hoy', groupedAppointments.today)}
            {renderAppointmentGroup('Mañana', groupedAppointments.tomorrow)}
            {renderAppointmentGroup('Próximas', groupedAppointments.future)}
            {renderAppointmentGroup('Pasadas', groupedAppointments.past)}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-900 font-medium">No hay citas encontradas</h3>
            <p className="text-gray-500 text-sm mt-1">
              {filterStatus === 'all' 
                ? 'Comienza agendando tu primera cita.' 
                : 'No hay citas con este estado.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;