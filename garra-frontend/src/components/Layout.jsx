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
    <div className="min-h-screen bg-[#F5F5F5]">
      <nav className="bg-white border-b border-[#E5E5E5] sticky top-0 z-50 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold text-[#722F37] tracking-tight">
                GarraDragon
              </Link>
              {user && (
                <div className="flex items-center gap-2">
                  {user.rol === 'tesorero' && (
                    <>
                      <Link
                        to="/dashboard"
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive('/dashboard')
                            ? 'bg-[#722F37] text-white'
                            : 'text-[#4A4A4A] hover:bg-[#F5F5F5] hover:text-[#722F37]'
                        }`}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/aportantes"
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive('/aportantes')
                            ? 'bg-[#722F37] text-white'
                            : 'text-[#4A4A4A] hover:bg-[#F5F5F5] hover:text-[#722F37]'
                        }`}
                      >
                        Aportantes
                      </Link>
                      <Link
                        to="/invitaciones"
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive('/invitaciones')
                            ? 'bg-[#722F37] text-white'
                            : 'text-[#4A4A4A] hover:bg-[#F5F5F5] hover:text-[#722F37]'
                        }`}
                      >
                        Invitaciones
                      </Link>
                    </>
                  )}
                  {user.rol === 'aportante' && (
                    <Link
                      to="/mis-aportaciones"
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive('/mis-aportaciones')
                          ? 'bg-[#722F37] text-white'
                          : 'text-[#4A4A4A] hover:bg-[#F5F5F5] hover:text-[#722F37]'
                      }`}
                    >
                      Mis Aportaciones
                    </Link>
                  )}
                </div>
              )}
            </div>
            {user && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-3 py-1.5 bg-[#F5F5F5] rounded-full">
                  <div className="w-8 h-8 rounded-full bg-[#722F37] flex items-center justify-center text-white text-sm font-medium">
                    {user.nombre?.charAt(0)}{user.apellido?.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-[#1A1A1A]">
                    {user.nombre} {user.apellido}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-[#722F37] hover:bg-[#722F37]/10 rounded-xl transition-all duration-200"
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