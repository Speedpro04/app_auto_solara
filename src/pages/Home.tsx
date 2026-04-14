import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, MapPin, Search } from 'lucide-react'
import api from '../lib/api'
import { VehicleWithMedia, Store } from '../types'

function Home() {
  const [recentVehicles, setRecentVehicles] = useState<VehicleWithMedia[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, storesRes] = await Promise.all([
          api.get('/vehicles?limit=12'),
          api.get('/stores'),
        ])
        setRecentVehicles(vehiclesRes.data)
        setStores(storesRes.data)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-6xl md:text-7xl font-['Bebas_Neue'] text-white mb-4">
          Encontre Seu <span className="text-[#E84118]">Veículo</span>
        </h1>
        <p className="text-[#A0A0B0] text-lg md:text-xl max-w-2xl mx-auto">
          Carros e motos das melhores lojas da região em um só lugar
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-[#1A1A1F] rounded-xl p-6 mb-12 border border-[#2A2A30]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B7B]" />
            <input
              type="text"
              placeholder="Buscar veículo, marca, modelo..."
              className="w-full bg-[#0C0C0E] text-white pl-12 pr-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
            />
          </div>
          <select className="bg-[#0C0C0E] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition">
            <option value="">Tipo</option>
            <option value="carro">Carros</option>
            <option value="moto">Motos</option>
          </select>
          <button className="bg-[#E84118] text-white px-8 py-3 rounded-lg hover:bg-[#FF5733] transition font-medium">
            Buscar
          </button>
        </div>
      </div>

      {/* Stores Section */}
      <section className="mb-16">
        <h2 className="text-4xl font-['Bebas_Neue'] text-white mb-6">
          Lojas Participantes
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1A1A1F] rounded-xl p-6 animate-pulse">
                <div className="h-12 bg-[#2A2A30] rounded mb-4"></div>
                <div className="h-4 bg-[#2A2A30] rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <Link
                key={store.id}
                to={`/${store.slug}`}
                className="bg-[#1A1A1F] rounded-xl p-6 border border-[#2A2A30] hover:border-[#E84118] transition group"
              >
                {store.logo_url ? (
                  <img
                    src={store.logo_url}
                    alt={store.name}
                    className="h-12 mb-4 object-contain"
                  />
                ) : (
                  <Car className="w-12 h-12 text-[#E84118] mb-4" />
                )}
                <h3 className="text-xl font-['Bebas_Neue'] text-white group-hover:text-[#E84118] transition">
                  {store.name}
                </h3>
                {store.city && (
                  <div className="flex items-center gap-2 mt-2 text-[#A0A0B0]">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{store.city}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent Vehicles */}
      <section>
        <h2 className="text-4xl font-['Bebas_Neue'] text-white mb-6">
          Veículos Recentes
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#1A1A1F] rounded-xl overflow-hidden animate-pulse">
                <div className="h-48 bg-[#2A2A30]"></div>
                <div className="p-4">
                  <div className="h-4 bg-[#2A2A30] rounded mb-2"></div>
                  <div className="h-6 bg-[#2A2A30] rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>
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

export default Home
