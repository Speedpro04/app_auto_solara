import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Car, MapPin, Phone, Filter } from 'lucide-react'
import api from '../lib/api'
import { Store, VehicleWithMedia } from '../types'

function StorePage() {
  const { slug } = useParams<{ slug: string }>()
  const [store, setStore] = useState<Store | null>(null)
  const [vehicles, setVehicles] = useState<VehicleWithMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeRes, vehiclesRes] = await Promise.all([
          api.get('/store'),
          api.get('/vehicles', { params: filters }),
        ])
        setStore(storeRes.data)
        setVehicles(vehiclesRes.data)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-24 bg-[#1A1A1F] rounded-xl mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1A1A1F] rounded-xl overflow-hidden">
                <div className="h-48 bg-[#2A2A30]"></div>
                <div className="p-4">
                  <div className="h-4 bg-[#2A2A30] rounded mb-2"></div>
                  <div className="h-6 bg-[#2A2A30] rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-4xl font-['Bebas_Neue'] text-white mb-4">
          Loja Não Encontrada
        </h1>
        <Link to="/" className="text-[#E84118] hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Store Header */}
      <div className="bg-[#1A1A1F] rounded-xl p-8 mb-8 border border-[#2A2A30]">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {store.logo_url ? (
            <img
              src={store.logo_url}
              alt={store.name}
              className="h-20 object-contain"
            />
          ) : (
            <Car className="w-20 h-20 text-[#E84118]" />
          )}
          <div className="flex-1">
            <h1 className="text-5xl font-['Bebas_Neue'] text-white mb-2">
              {store.name}
            </h1>
            {store.city && (
              <div className="flex items-center gap-2 text-[#A0A0B0] mb-4">
                <MapPin className="w-4 h-4" />
                <span>{store.city}</span>
              </div>
            )}
          </div>
          <a
            href={`https://wa.me/${store.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#E84118] text-white px-6 py-3 rounded-lg hover:bg-[#FF5733] transition"
          >
            <Phone className="w-5 h-5" />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1A1A1F] rounded-xl p-6 mb-8 border border-[#2A2A30]">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-[#E84118]" />
          <h2 className="text-xl font-['Bebas_Neue'] text-white">Filtros</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="bg-[#0C0C0E] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
          >
            <option value="">Tipo</option>
            <option value="carro">Carros</option>
            <option value="moto">Motos</option>
          </select>
          <input
            type="text"
            placeholder="Marca"
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="bg-[#0C0C0E] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
          />
          <input
            type="number"
            placeholder="Preço mínimo"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="bg-[#0C0C0E] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
          />
          <input
            type="number"
            placeholder="Preço máximo"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="bg-[#0C0C0E] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
          />
        </div>
      </div>

      {/* Vehicles Grid */}
      {vehicles.length === 0 ? (
        <div className="text-center py-16">
          <Car className="w-24 h-24 text-[#6B6B7B] mx-auto mb-4" />
          <p className="text-[#A0A0B0] text-lg">Nenhum veículo encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  )
}

function VehicleCard({ vehicle }: { vehicle: VehicleWithMedia }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const coverImage = vehicle.media?.find((m) => m.order === 0)?.url

  return (
    <Link
      to={`/veiculo/${vehicle.id}`}
      className="bg-[#1A1A1F] rounded-xl overflow-hidden border border-[#2A2A30] hover:border-[#E84118] transition group"
    >
      <div className="relative h-48 bg-[#2A2A30]">
        {coverImage ? (
          <img
            src={coverImage}
            alt={vehicle.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="w-16 h-16 text-[#6B6B7B]" />
          </div>
        )}
        {vehicle.status === 'sold' && (
          <div className="absolute top-4 right-4 bg-[#E84118] text-white px-3 py-1 rounded-full text-sm font-medium">
            Vendido
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-white mb-2 group-hover:text-[#E84118] transition">
          {vehicle.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-['Bebas_Neue'] text-[#E84118]">
            {formatPrice(vehicle.price)}
          </span>
          <span className="text-sm text-[#6B6B7B]">
            {vehicle.year} · {vehicle.km.toLocaleString('pt-BR')} km
          </span>
        </div>
      </div>
    </Link>
  )
}

export default StorePage
