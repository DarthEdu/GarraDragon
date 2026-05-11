import { useEffect, useState } from 'react';
import { generarInvitacion, listarInvitaciones } from '../services/api';

const Invitaciones = () => {
  const [invitaciones, setInvitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [nuevoCodigo, setNuevoCodigo] = useState(null);

  const fetchInvitaciones = async () => {
    try {
      const response = await listarInvitaciones();
      setInvitaciones(response.data);
    } catch (err) {
      console.error('Error fetching invitaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitaciones();
  }, []);

  const handleGenerar = async () => {
    setGenerando(true);
    try {
      const response = await generarInvitacion({ rol: 'tesorero' });
      setNuevoCodigo(response.data);
      fetchInvitaciones();
    } catch (err) {
      console.error('Error generating invitacion:', err);
    } finally {
      setGenerando(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
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
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Invitaciones</h1>
          <p className="text-[#4A4A4A] text-sm">Gestión de códigos de invitación</p>
        </div>
        <button
          onClick={handleGenerar}
          disabled={generando}
          className="px-5 py-2.5 bg-[#722F37] text-white font-medium rounded-xl hover:bg-[#5a252c] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {generando ? 'Generando...' : '+ Generar Código'}
        </button>
      </div>

      {nuevoCodigo && (
        <div className="mb-6 p-5 bg-white border-2 border-[#722F37] rounded-2xl">
          <div className="text-sm font-medium text-[#722F37] mb-2">Nuevo código generado:</div>
          <div className="text-3xl font-bold text-[#1A1A1A] tracking-wider">
            {nuevoCodigo.codigo}
          </div>
          <div className="text-sm text-[#4A4A4A] mt-2">
            Expira: {formatDate(nuevoCodigo.expiresAt)}
          </div>
          <button
            onClick={() => setNuevoCodigo(null)}
            className="mt-3 text-sm text-[#722F37] font-medium hover:underline"
          >
            Ocultar
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-[#F5F5F5]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#4A4A4A] uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#4A4A4A] uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#4A4A4A] uppercase tracking-wider">
                Expira
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#4A4A4A] uppercase tracking-wider">
                Creado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {invitaciones.map((inv, index) => (
              <tr key={inv._id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]/50'}>
                <td className="px-6 py-4">
                  <span className="font-mono font-medium text-[#1A1A1A] bg-[#F5F5F5] px-3 py-1 rounded-lg text-sm">
                    {inv.codigo}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      inv.usado
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {inv.usado ? 'Usado' : 'Disponible'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#4A4A4A]">
                  {formatDate(inv.expiresAt)}
                </td>
                <td className="px-6 py-4 text-sm text-[#4A4A4A]">
                  {formatDate(inv.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invitaciones.length === 0 && (
          <div className="p-12 text-center text-[#4A4A4A]">
            No hay códigos de invitación
          </div>
        )}
      </div>
    </div>
  );
};

export default Invitaciones;