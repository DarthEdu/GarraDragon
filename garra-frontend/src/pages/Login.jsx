import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginTesorero, loginAportante } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      try {
        response = await loginTesorero(formData);
      } catch (err) {
        response = await loginAportante(formData);
      }

      const { token, rol, nombre, apellido, _id } = response.data;
      login(token, { _id, nombre, apellido, email: formData.email, rol });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">GarraDragon</h1>
          <p className="text-[#4A4A4A]">Gestión de aportaciones</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6 text-center">
            Iniciar Sesión
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-[#722F37] rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent rounded-xl focus:outline-none focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/20 transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent rounded-xl focus:outline-none focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/20 transition-all duration-200"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#722F37] text-white font-medium rounded-xl hover:bg-[#5a252c] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[#4A4A4A]">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-[#722F37] font-medium hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;