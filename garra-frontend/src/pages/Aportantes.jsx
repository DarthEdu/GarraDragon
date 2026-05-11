import { useEffect, useState } from 'react';
import { getAportantes, createAportante, deleteAportante } from '../services/api';

const Aportantes = () => {
  const [aportantes, setAportantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    celular: '',
    reserva: '',
    entrega: '',
    plan: 'mensual',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAportantes = async () => {
    try {
      const response = await getAportantes();
      setAportantes(response.data);
    } catch (err) {
      console.error('Error fetching aportantes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAportantes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createAportante(formData);
      setSuccess('Aportante creado exitosamente');
      setShowModal(false);
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        celular: '',
        reserva: '',
        entrega: '',
        plan: 'mensual',
      });
      fetchAportantes();
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al crear aportante');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de dar de baja este aportante?')) return;
    try {
      await deleteAportante(id, { entrega: new Date().toISOString() });
      fetchAportantes();
    } catch (err) {
      console.error('Error deleting aportante:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#4A4A4A]">Cargando...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Aportantes</h1>
          <p className="text-[#4A4A4A] text-sm">Gestión de aportantes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-[#722F37] text-white font-medium rounded-xl hover:bg-[#5a252c] transition-all duration-200"
        >
          + Nuevo Aportante
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-[#722F37] rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm border border-green-100">
          {success}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-[#F5F5F5]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#4A4A4A] uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#4A4A4A] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#4A4A4A] uppercase tracking-wider">
                Celular
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#4A4A4A] uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#4A4A4A] uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#4A4A4A] uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {aportantes.map((aportante, index) => (
              <tr key={aportante._id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]/50'}>
                <td className="px-6 py-4">
                  <span className="font-medium text-[#1A1A1A]">
                    {aportante.nombre} {aportante.apellido}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#4A4A4A]">{aportante.email}</td>
                <td className="px-6 py-4 text-[#4A4A4A]">{aportante.celular}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 text-xs font-medium bg-[#F5F5F5] text-[#4A4A4A] rounded-lg capitalize">
                    {aportante.plan}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      aportante.estado
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {aportante.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(aportante._id)}
                    className="text-[#722F37] hover:text-[#5a252c] text-sm font-medium transition-colors"
                  >
                    Dar de baja
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {aportantes.length === 0 && (
          <div className="p-12 text-center text-[#4A4A4A]">
            No hay aportantes registrados
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Nuevo Aportante</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, apellido: e.target.value })
                    }
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
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, celular: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent rounded-xl focus:outline-none focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/20 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Plan
                </label>
                <select
                  value={formData.plan}
                  onChange={(e) =>
                    setFormData({ ...formData, plan: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent rounded-xl focus:outline-none focus:border-[#722F37] focus:ring-2 focus:ring-[#722F37]/20 transition-all duration-200"
                >
                  <option value="mensual">Mensual</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-[#4A4A4A] hover:bg-[#F5F5F5] rounded-xl transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#722F37] text-white font-medium rounded-xl hover:bg-[#5a252c] transition-all duration-200"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Aportantes;