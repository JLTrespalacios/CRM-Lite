import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Users, Calendar, TrendingUp, ArrowRight, UserPlus, Clock, DollarSign, MoreHorizontal, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    pendingAppointments: 0,
    estimatedRevenue: 0,
    recentClients: []
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [clientsResponse, appointmentsResponse] = await Promise.all([
          api.get('/clients'),
          api.get('/appointments')
        ]);

        const clients = clientsResponse.data;
        const appointments = appointmentsResponse.data;
        
        // Calcular estadísticas
        const totalClients = clients.length;
        const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
        const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
        
        // Estimación: $50 por cita confirmada
        const estimatedRevenue = confirmedAppointments.length * 50; 
        
        const recentClients = [...clients].reverse().slice(0, 5); // Últimos 5

        setStats({
          totalClients,
          pendingAppointments,
          estimatedRevenue,
          recentClients
        });

        // Generar datos para el gráfico (últimos 7 días)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = subDays(new Date(), 6 - i);
          return d;
        });

        const newChartData = last7Days.map(date => {
          const dayName = format(date, 'EEE', { locale: es });
          const dayNameCap = dayName.charAt(0).toUpperCase() + dayName.slice(1);
          
          const dailyRevenue = confirmedAppointments
            .filter(a => isSameDay(parseISO(a.date), date))
            .length * 50;

          return { name: dayNameCap, revenue: dailyRevenue };
        });

        setChartData(newChartData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard General</h2>
          <p className="text-sm text-gray-500 mt-1">Resumen de actividad y métricas clave de tu negocio.</p>
        </div>
        <Link to="/appointments" className="btn btn-primary">
          <Calendar className="w-4 h-4 mr-2" />
          Nueva Cita
        </Link>
      </div>
      
      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Clientes */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-indigo-50 rounded-lg">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="badge badge-success">
                <TrendingUp className="w-3 h-3 mr-1" /> +12%
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Clientes Totales</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{stats.totalClients}</p>
            <div className="mt-4 pt-4 border-t border-slate-50">
              <Link to="/clients" className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-700">
                Ver todos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2: Citas Pendientes */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-orange-50 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <span className="badge badge-warning">
                Acción requerida
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Citas Pendientes</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{stats.pendingAppointments}</p>
            <div className="mt-4 pt-4 border-t border-slate-50">
              <Link to="/appointments" className="flex items-center gap-1 text-sm text-orange-600 font-medium hover:text-orange-700">
                Gestionar agenda <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Card 3: Ingresos */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-emerald-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="badge badge-neutral">Este mes</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Ingresos Estimados</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">${stats.estimatedRevenue}</p>
            <div className="mt-4 pt-4 border-t border-slate-50">
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Proyección basada en citas
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Ingresos */}
        <div className="lg:col-span-2 card-static">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Rendimiento Semanal</h3>
                <p className="text-sm text-slate-500">Ingresos estimados por citas confirmadas</p>
              </div>
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Activity className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}} 
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value) => [`$${value}`, 'Ingresos']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4f46e5" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabla de Clientes Recientes (Mini) */}
        <div className="card-static flex flex-col h-full">
          <div className="card-header bg-slate-50/50">
            <h3 className="text-base font-semibold text-slate-900">Últimos Clientes</h3>
            <Link to="/clients" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Ver todos</Link>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {stats.recentClients.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {stats.recentClients.map(client => (
                  <div key={client.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-white flex-shrink-0">
                      {client.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">{client.name}</p>
                      <p className="text-xs text-slate-500 truncate">{client.email}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="badge badge-success">
                        Nuevo
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <p className="text-sm">No hay clientes recientes</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <button className="btn btn-secondary w-full shadow-sm">
              Agregar Cliente Rápido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;