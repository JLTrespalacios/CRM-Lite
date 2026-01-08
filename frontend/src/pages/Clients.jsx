import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Mail, 
  Phone, 
  User,
  AlertCircle,
  CheckCircle2,
  X,
  MoreVertical,
  ArrowUpDown,
  Calendar
} from 'lucide-react';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // name, recent

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await api.post('/clients', newClient);
      setNewClient({ name: '', email: '', phone: '' });
      setSuccess('Cliente agregado exitosamente.');
      fetchClients();
      setIsFormOpen(false); // Close form on success
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error adding client:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Error al agregar cliente. Intente nuevamente.');
      }
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
      try {
        await api.delete(`/clients/${id}`);
        setSuccess('Cliente eliminado correctamente.');
        fetchClients();
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Error deleting client:', error);
        setError(error.response?.data?.error || 'No se pudo eliminar el cliente.');
      }
    }
  };

  const filteredClients = clients
    .filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'recent') {
        return b.id - a.id; // Assuming higher ID is more recent
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Clientes</h2>
          <p className="text-sm text-gray-500 mt-1">Gestiona tu base de datos de clientes.</p>
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
          {isFormOpen ? 'Cancelar' : 'Nuevo Cliente'}
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

      {/* Formulario de Agregar Cliente */}
      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Información del Cliente
          </h3>
          <form onSubmit={handleAddClient} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="juan@ejemplo.com"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Teléfono</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  value={newClient.phone || ''}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                />
              </div>
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
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors"
              >
                Guardar Cliente
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Clientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Barra de Búsqueda y Filtros */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm appearance-none cursor-pointer"
                >
                  <option value="name">Ordenar por Nombre</option>
                  <option value="recent">Más Recientes</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ArrowUpDown className="h-4 w-4 text-gray-500" />
                </div>
             </div>
             <div className="text-sm text-gray-500 whitespace-nowrap hidden sm:block">
              <span className="font-semibold text-gray-900">{filteredClients.length}</span> clientes
            </div>
          </div>
        </div>

        {filteredClients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Última Actividad</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white">
                          {client.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{client.email}</span>
                        <span className="text-xs text-gray-500">{client.phone || 'Sin teléfono'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          Hace 2 días
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Activo
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                        title="Eliminar cliente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 bg-gray-50/30">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-medium">No se encontraron clientes</p>
            <p className="text-sm text-gray-400 mt-1">Intenta con otra búsqueda o agrega un nuevo cliente.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;