import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, Eye, Phone, TrendingUp, Plus } from 'lucide-react'
import api from '../../lib/api'

interface DashboardStats {
  total_vehicles: number
  total_views: number
  total_contacts: number
  available_vehicles: number
}

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentVehicles, setRecentVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, vehiclesRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/vehicles?limit=5'),
        ])
        setStats(statsRes.data)
        setRecentVehicles(vehiclesRes.data)
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#1A1A1F] rounded-xl p-6 h-32"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-['Bebas_Neue'] text-white">Dashboard</h1>
        <Link
          to="/admin/veiculos/novo"
          className="flex items-center gap-2 bg-[#E84118] text-white px-4 py-2 rounded-lg hover:bg-[#FF5733] transition"
        >
          <Plus className="w-5 h-5" />
          Novo Veículo
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Car}
          label="Total de Veículos"
          value={stats?.total_vehicles || 0}
          color="#E84118"
        />
        <StatCard
          icon={Eye}
          label="Visualizações"
          value={stats?.total_views || 0}
          color="#3B82F6"
        />
        <StatCard
          icon={Phone}
          label="Contatos WhatsApp"
          value={stats?.total_contacts || 0}
          color="#22C55E"
        />
        <StatCard
          icon={TrendingUp}
          label="Disponíveis"
          value={stats?.available_vehicles || 0}
          color="#F59E0B"
        />
      </div>

      {/* Recent Vehicles */}
      <div className="bg-[#1A1A1F] rounded-xl border border-[#2A2A30]">
        <div className="p-6 border-b border-[#2A2A30]">
          <h2 className="text-2xl font-['Bebas_Neue'] text-white">
            Veículos Recentes
          </h2>
        </div>
        <div className="p-6">
          {recentVehicles.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-[#6B6B7B] mx-auto mb-4" />
              <p className="text-[#A0A0B0] mb-4">
                Nenhum veículo cadastrado ainda
              </p>
              <Link
                to="/admin/veiculos/novo"
                className="inline-flex items-center gap-2 bg-[#E84118] text-white px-6 py-3 rounded-lg hover:bg-[#FF5733] transition"
              >
                <Plus className="w-5 h-5" />
                Cadastrar Primeiro Veículo
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center justify-between p-4 bg-[#0C0C0E] rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#2A2A30] rounded-lg flex items-center justify-center">
                      <Car className="w-8 h-8 text-[#6B6B7B]" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{vehicle.title}</h3>
                      <p className="text-sm text-[#6B6B7B]">
                        {vehicle.year} · {vehicle.km.toLocaleString('pt-BR')} km
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#E84118] font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(vehicle.price)}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        vehicle.status === 'available'
                          ? 'bg-green-500/10 text-green-500'
                          : vehicle.status === 'sold'
                          ? 'bg-[#E84118]/10 text-[#E84118]'
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}
                    >
                      {vehicle.status === 'available'
                        ? 'Disponível'
                        : vehicle.status === 'sold'
                        ? 'Vendido'
                        : 'Pausado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-[#1A1A1F] rounded-xl p-6 border border-[#2A2A30]">
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8" style={{ color }} />
      </div>
      <p className="text-sm text-[#6B6B7B] mb-2">{label}</p>
      <p className="text-3xl font-['Bebas_Neue'] text-white">{value}</p>
    </div>
  )
}

export default AdminDashboard
