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
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invitaciones</h1>
        <button
          onClick={handleGenerar}
          disabled={generando}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {generando ? 'Generando...' : 'Generar Código'}
        </button>
      </div>

      {nuevoCodigo && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-600 mb-1">Nuevo código generado:</div>
          <div className="text-2xl font-bold text-green-700">
            {nuevoCodigo.codigo}
          </div>
          <div className="text-sm text-green-600 mt-1">
            Expira: {formatDate(nuevoCodigo.expiresAt)}
          </div>
          <button
            onClick={() => setNuevoCodigo(null)}
            className="mt-2 text-sm text-green-700 hover:underline"
          >
            Ocultar
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Expira
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Creado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invitaciones.map((inv) => (
              <tr key={inv._id}>
                <td className="px-6 py-4 whitespace-nowrap font-mono">
                  {inv.codigo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      inv.usado
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {inv.usado ? 'Usado' : 'Disponible'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(inv.expiresAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(inv.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invitaciones.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No hay códigos de invitación
          </div>
        )}
      </div>
    </div>
  );
};

export default Invitaciones;