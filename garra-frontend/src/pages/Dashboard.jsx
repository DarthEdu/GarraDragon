import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAportantes } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, activos: 0, totalAportado: 0 });
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
            totalAportado: aportantes.reduce((acc, a) => acc + (a.aportaciones?.reduce((sum, ap) => sum + (ap.monto || 0), 0) || 0), 0),
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
        <div className="text-[#4A4A4A]">Cargando...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A1A1A]">
          Bienvenido, {user.nombre} {user.apellido}
        </h1>
        <p className="text-[#4A4A4A] mt-1"> Panel de control </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E5]">
          <div className="text-sm font-medium text-[#4A4A4A] mb-2">Tu Rol</div>
          <div className="text-3xl font-bold text-[#722F37] capitalize">
            {user.rol}
          </div>
        </div>
        {user.rol === 'tesorero' && (
          <>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E5]">
              <div className="text-sm font-medium text-[#4A4A4A] mb-2">Total Aportantes</div>
              <div className="text-3xl font-bold text-[#722F37]">
                {stats.total}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E5E5]">
              <div className="text-sm font-medium text-[#4A4A4A] mb-2">Aportantes Activos</div>
              <div className="text-3xl font-bold text-[#722F37]">
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