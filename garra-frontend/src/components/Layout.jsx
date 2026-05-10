import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                GarraDragon
              </Link>
              {user && (
                <div className="ml-10 flex items-center space-x-4">
                  {user.rol === 'tesorero' && (
                    <>
                      <Link
                        to="/dashboard"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          isActive('/dashboard')
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/aportantes"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          isActive('/aportantes')
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Aportantes
                      </Link>
                      <Link
                        to="/invitaciones"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          isActive('/invitaciones')
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Invitaciones
                      </Link>
                    </>
                  )}
                  {user.rol === 'aportante' && (
                    <Link
                      to="/mis-aportaciones"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/mis-aportaciones')
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Mis Aportaciones
                    </Link>
                  )}
                </div>
              )}
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user.nombre} {user.apellido}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;