import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAportantes } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, activos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (user.rol === 'tesorero') {
        try {
          const response = await getAportantes();
          const aportantes = response.data;
          setStats({
            total: aportantes.length,
            activos: aportantes.filter((a) => a.estado).length,
          });
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      }
      setLoading(false);
    };
    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Bienvenido, {user.nombre} {user.apellido}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Rol</div>
          <div className="text-2xl font-semibold text-gray-800 capitalize">
            {user.rol}
          </div>
        </div>
        {user.rol === 'tesorero' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Total Aportantes</div>
              <div className="text-2xl font-semibold text-blue-600">
                {stats.total}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Aportantes Activos</div>
              <div className="text-2xl font-semibold text-green-600">
                {stats.activos}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;