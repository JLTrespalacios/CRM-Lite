import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserCircle, Mail, Shield, Camera, Lock } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Mi Perfil</h2>
        <p className="text-gray-500 mt-1">Gestiona tu información personal y configuración de cuenta.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card Principal de Perfil */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-indigo-600 to-indigo-800"></div>
            <div className="px-6 pb-6 text-center relative">
              <div className="w-24 h-24 bg-white p-1 rounded-full mx-auto -mt-12 relative shadow-lg">
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center overflow-hidden relative group cursor-pointer">
                  {user?.name ? (
                    <span className="text-3xl font-bold text-slate-400">{user.name.charAt(0)}</span>
                  ) : (
                    <UserCircle className="w-16 h-16 text-slate-300" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              <h3 className="mt-4 text-xl font-bold text-gray-900">{user?.name || 'Usuario'}</h3>
              <p className="text-indigo-600 font-medium text-sm">{user?.role || 'Administrador'}</p>
              
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{user?.email || 'usuario@ejemplo.com'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span>Cuenta Verificada</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Edición */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-indigo-600" />
              Información Personal
            </h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Cargo / Rol</label>
                  <input
                    type="text"
                    defaultValue={user?.role || 'Administrador'}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50/50"
                    disabled
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50/50"
                    disabled
                  />
                  <p className="text-xs text-gray-500">El correo electrónico no se puede cambiar por seguridad.</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-indigo-600" />
                  Seguridad
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nueva Contraseña</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="button" className="px-6 py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
