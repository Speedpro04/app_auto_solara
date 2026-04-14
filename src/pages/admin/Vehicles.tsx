import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, Plus, Pencil, Trash2, Search } from 'lucide-react'
import api from '../../lib/api'

function AdminVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const { data } = await api.get('/admin/vehicles')
      setVehicles(data)
    } catch (error) {
      console.error('Erro ao carregar veículos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) return

    try {
      await api.delete(`/admin/vehicles/${id}`)
      fetchVehicles()
    } catch (error) {
      console.error('Erro ao excluir veículo:', error)
      alert('Erro ao excluir veículo')
    }
  }

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-['Bebas_Neue'] text-white">Veículos</h1>
        <Link
          to="/admin/veiculos/novo"
          className="flex items-center gap-2 bg-[#E84118] text-white px-4 py-2 rounded-lg hover:bg-[#FF5733] transition"
        >
          <Plus className="w-5 h-5" />
          Novo Veículo
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B7B]" />
          <input
            type="text"
            placeholder="Buscar veículo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1A1A1F] text-white pl-12 pr-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1A1A1F] rounded-xl p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-[#2A2A30] rounded-lg"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-[#2A2A30] rounded w-1/2"></div>
                  <div className="h-4 bg-[#2A2A30] rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="bg-[#1A1A1F] rounded-xl p-12 text-center border border-[#2A2A30]">
          <Car className="w-16 h-16 text-[#6B6B7B] mx-auto mb-4" />
          <p className="text-[#A0A0B0] mb-4">Nenhum veículo encontrado</p>
          <Link
            to="/admin/veiculos/novo"
            className="inline-flex items-center gap-2 bg-[#E84118] text-white px-6 py-3 rounded-lg hover:bg-[#FF5733] transition"
          >
            <Plus className="w-5 h-5" />
            Cadastrar Veículo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-[#1A1A1F] rounded-xl p-6 border border-[#2A2A30]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-24 h-24 bg-[#2A2A30] rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                    {vehicle.media?.[0]?.url ? (
                      <img
                        src={vehicle.media[0].url}
                        alt={vehicle.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Car className="w-12 h-12 text-[#6B6B7B]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-medium text-white mb-1 truncate">
                      {vehicle.title}
                    </h3>
                    <p className="text-sm text-[#6B6B7B]">
                      {vehicle.brand} · {vehicle.year} · {vehicle.km.toLocaleString('pt-BR')} km
                    </p>
                    <p className="text-lg font-['Bebas_Neue'] text-[#E84118] mt-1">
                      {formatPrice(vehicle.price)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                  <Link
                    to={`/admin/veiculos/${vehicle.id}/editar`}
                    className="p-2 text-[#A0A0B0] hover:text-white hover:bg-[#2A2A30] rounded-lg transition"
                  >
                    <Pencil className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="p-2 text-[#A0A0B0] hover:text-red-500 hover:bg-[#2A2A30] rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminVehicles
