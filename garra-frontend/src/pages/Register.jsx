import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerTesorero, validarInvitacion } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    celular: '',
    codigoInvitacion: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await validarInvitacion(formData.codigoInvitacion);
    } catch (err) {
      setError('Código de invitación inválido o expirado');
      setLoading(false);
      return;
    }

    try {
      await registerTesorero(formData);
      alert('Revisa tu correo para confirmar tu cuenta');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al registrar');
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
            Regístrate
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-[#722F37] rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent rounded-xl focus:outline-none focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/20 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent rounded-xl focus:outline-none focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/20 transition-all duration-200"
                  required
                />
              </div>
            </div>
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
                Celular
              </label>
              <input
                type="text"
                value={formData.celular}
                onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
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
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Código de Invitación
              </label>
              <input
                type="text"
                value={formData.codigoInvitacion}
                onChange={(e) => setFormData({ ...formData, codigoInvitacion: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent rounded-xl focus:outline-none focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/20 transition-all duration-200"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#722F37] text-white font-medium rounded-xl hover:bg-[#5a252c] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[#4A4A4A]">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-[#722F37] font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;