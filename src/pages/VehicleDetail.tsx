import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Car, MapPin, Phone, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import api from '../lib/api'
import { VehicleWithMedia, Store } from '../types'

function VehicleDetail() {
  const { id } = useParams<{ id: string }>()
  const [vehicle, setVehicle] = useState<VehicleWithMedia | null>(null)
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehicleRes, storeRes] = await Promise.all([
          api.get(`/vehicles/${id}`),
          api.get('/store'),
        ])
        setVehicle(vehicleRes.data)
        setStore(storeRes.data)
      } catch (error) {
        console.error('Erro ao carregar veículo:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const handleWhatsAppClick = () => {
    if (!vehicle || !store) return
    const message = encodeURIComponent(
      `Olá! Vi o veículo ${vehicle.title} no site e gostaria de mais informações: ${window.location.href}`
    )
    window.open(`https://wa.me/${store.phone}?text=${message}`, '_blank')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-96 bg-[#1A1A1F] rounded-xl mb-8"></div>
          <div className="space-y-4">
            <div className="h-8 bg-[#1A1A1F] rounded w-1/2"></div>
            <div className="h-6 bg-[#1A1A1F] rounded w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-4xl font-['Bebas_Neue'] text-white mb-4">
          Veículo Não Encontrado
        </h1>
        <Link to="/" className="text-[#E84118] hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    )
  }

  const images = vehicle.media?.filter((m) => m.type === 'image') || []
  const hasImages = images.length > 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        to={`/${store?.slug || ''}`}
        className="inline-flex items-center gap-2 text-[#A0A0B0] hover:text-white transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="bg-[#1A1A1F] rounded-xl overflow-hidden border border-[#2A2A30] mb-4">
            {hasImages ? (
              <div className="relative h-96">
                <img
                  src={images[currentImageIndex].url}
                  alt={vehicle.title}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition ${
                            index === currentImageIndex
                              ? 'bg-[#E84118]'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center">
                <Car className="w-32 h-32 text-[#6B6B7B]" />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {hasImages && images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-20 rounded-lg overflow-hidden border-2 transition ${
                    index === currentImageIndex
                      ? 'border-[#E84118]'
                      : 'border-transparent hover:border-[#2A2A30]'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${vehicle.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Vehicle Info */}
        <div>
          <div className="bg-[#1A1A1F] rounded-xl p-8 border border-[#2A2A30]">
            <h1 className="text-5xl font-['Bebas_Neue'] text-white mb-4">
              {vehicle.title}
            </h1>

            <div className="text-4xl font-['Bebas_Neue'] text-[#E84118] mb-6">
              {formatPrice(vehicle.price)}
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#0C0C0E] rounded-lg p-4">
                <p className="text-sm text-[#6B6B7B] mb-1">Ano</p>
                <p className="text-xl font-medium text-white">{vehicle.year}</p>
              </div>
              <div className="bg-[#0C0C0E] rounded-lg p-4">
                <p className="text-sm text-[#6B6B7B] mb-1">Quilometragem</p>
                <p className="text-xl font-medium text-white">
                  {vehicle.km.toLocaleString('pt-BR')} km
                </p>
              </div>
              <div className="bg-[#0C0C0E] rounded-lg p-4">
                <p className="text-sm text-[#6B6B7B] mb-1">Marca</p>
                <p className="text-xl font-medium text-white">{vehicle.brand}</p>
              </div>
              <div className="bg-[#0C0C0E] rounded-lg p-4">
                <p className="text-sm text-[#6B6B7B] mb-1">Tipo</p>
                <p className="text-xl font-medium text-white capitalize">
                  {vehicle.type === 'carro' ? 'Carro' : 'Moto'}
                </p>
              </div>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="mb-6">
                <h3 className="text-xl font-['Bebas_Neue'] text-white mb-3">
                  Descrição
                </h3>
                <p className="text-[#A0A0B0] leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </p>
              </div>
            )}

            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsAppClick}
              className="w-full flex items-center justify-center gap-2 bg-[#E84118] text-white px-6 py-4 rounded-lg hover:bg-[#FF5733] transition text-lg font-medium"
            >
              <Phone className="w-6 h-6" />
              Conversar no WhatsApp
            </button>

            {store && (
              <div className="mt-6 pt-6 border-t border-[#2A2A30]">
                <div className="flex items-center gap-3">
                  {store.logo_url ? (
                    <img
                      src={store.logo_url}
                      alt={store.name}
                      className="h-12 object-contain"
                    />
                  ) : (
                    <Car className="w-12 h-12 text-[#E84118]" />
                  )}
                  <div>
                    <p className="text-white font-medium">{store.name}</p>
                    {store.city && (
                      <div className="flex items-center gap-1 text-sm text-[#A0A0B0]">
                        <MapPin className="w-3 h-3" />
                        {store.city}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleDetail
