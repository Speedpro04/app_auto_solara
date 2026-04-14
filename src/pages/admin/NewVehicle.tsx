import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, X, Car } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

function AdminNewVehicle() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    type: 'carro',
    brand: '',
    year: new Date().getFullYear(),
    km: 0,
    price: 0,
    description: '',
    status: 'available',
  })
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [error, setError] = useState('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' || name === 'km' || name === 'price' ? Number(value) : value,
    }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setImages((prev) => [...prev, ...files])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Criar veículo
      const { data: vehicle } = await api.post('/admin/vehicles', {
        ...formData,
        store_id: user?.store_id,
      })

      // 2. Upload de imagens
      if (images.length > 0) {
        setUploadingImages(true)
        const uploadPromises = images.map(async (image, index) => {
          const fileExt = image.name.split('.').pop()
          const fileName = `${vehicle.id}/${Date.now()}-${index}.${fileExt}`
          
          const { error: uploadError } = await supabase.storage
            .from('vehicles')
            .upload(`${user?.store_id}/${fileName}`, image)

          if (uploadError) throw uploadError

          const { data: urlData } = supabase.storage
            .from('vehicles')
            .getPublicUrl(`${user?.store_id}/${fileName}`)

          await api.post(`/admin/vehicles/${vehicle.id}/media`, {
            url: urlData.publicUrl,
            type: 'image',
            order: index,
            size_bytes: image.size,
          })
        })

        await Promise.all(uploadPromises)
      }

      navigate('/admin/veiculos')
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar veículo')
    } finally {
      setLoading(false)
      setUploadingImages(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/admin/veiculos"
          className="text-[#A0A0B0] hover:text-white transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-4xl font-['Bebas_Neue'] text-white">Novo Veículo</h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título */}
          <div className="md:col-span-2">
            <label className="block text-sm text-[#A0A0B0] mb-2">
              Título do Anúncio *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ex: Civic EXL 2022"
              className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
              required
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm text-[#A0A0B0] mb-2">Tipo *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
              required
            >
              <option value="carro">Carro</option>
              <option value="moto">Moto</option>
            </select>
          </div>

          {/* Marca */}
          <div>
            <label className="block text-sm text-[#A0A0B0] mb-2">Marca *</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="Ex: Honda, Toyota"
              className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
              required
            />
          </div>

          {/* Ano */}
          <div>
            <label className="block text-sm text-[#A0A0B0] mb-2">Ano *</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
              required
            />
          </div>

          {/* Quilometragem */}
          <div>
            <label className="block text-sm text-[#A0A0B0] mb-2">
              Quilometragem *
            </label>
            <input
              type="number"
              name="km"
              value={formData.km}
              onChange={handleInputChange}
              min="0"
              className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
              required
            />
          </div>

          {/* Preço */}
          <div>
            <label className="block text-sm text-[#A0A0B0] mb-2">Preço (R$) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm text-[#A0A0B0] mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
            >
              <option value="available">Disponível</option>
              <option value="paused">Pausado</option>
              <option value="sold">Vendido</option>
            </select>
          </div>

          {/* Descrição */}
          <div className="md:col-span-2">
            <label className="block text-sm text-[#A0A0B0] mb-2">Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition resize-none"
              placeholder="Descreva os detalhes do veículo..."
            />
          </div>
        </div>

        {/* Upload de Imagens */}
        <div>
          <label className="block text-sm text-[#A0A0B0] mb-2">
            Fotos do Veículo
          </label>
          <div className="bg-[#1A1A1F] border-2 border-dashed border-[#2A2A30] rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-[#6B6B7B] mx-auto mb-4" />
            <p className="text-[#A0A0B0] mb-4">
              Clique para selecionar fotos ou arraste e solte aqui
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-block bg-[#E84118] text-white px-6 py-2 rounded-lg hover:bg-[#FF5733] transition cursor-pointer"
            >
              Selecionar Fotos
            </label>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || uploadingImages}
            className="flex-1 bg-[#E84118] text-white px-6 py-3 rounded-lg hover:bg-[#FF5733] transition font-medium disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Veículo'}
          </button>
          <Link
            to="/admin/veiculos"
            className="px-6 py-3 bg-[#1A1A1F] text-white rounded-lg hover:bg-[#2A2A30] transition border border-[#2A2A30]"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

export default AdminNewVehicle
