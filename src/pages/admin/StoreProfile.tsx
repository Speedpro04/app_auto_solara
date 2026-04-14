import { useState, useEffect } from 'react'
import { Car, Upload, Save } from 'lucide-react'
import api from '../../lib/api'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Store } from '../../types'

function AdminStoreProfile() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [currentLogo, setCurrentLogo] = useState<string>('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const { data } = await api.get('/store')
        setFormData({
          name: data.name,
          phone: data.phone,
          city: data.city || '',
        })
        setCurrentLogo(data.logo_url || '')
      } catch (error) {
        console.error('Erro ao carregar dados da loja:', error)
      } finally {
        setFetching(false)
      }
    }

    fetchStore()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLogoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let logoUrl = currentLogo

      // Upload de nova logo
      if (logoFile && user?.store_id) {
        const fileExt = logoFile.name.split('.').pop()
        const fileName = `${user.store_id}/logo.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('vehicles')
          .upload(fileName, logoFile, { upsert: true })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('vehicles')
          .getPublicUrl(fileName)

        logoUrl = urlData.publicUrl
      }

      await api.put('/admin/store', {
        ...formData,
        logo_url: logoUrl,
      })

      setSuccess('Dados atualizados com sucesso!')
      if (logoUrl) setCurrentLogo(logoUrl)
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar dados')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="text-center py-12 text-[#A0A0B0]">Carregando...</div>
  }

  return (
    <div>
      <h1 className="text-4xl font-['Bebas_Neue'] text-white mb-8">Perfil da Loja</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm text-[#A0A0B0] mb-2">Logo da Loja</label>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 bg-[#1A1A1F] rounded-lg border border-[#2A2A30] flex items-center justify-center overflow-hidden">
              {logoPreview || currentLogo ? (
                <img
                  src={logoPreview || currentLogo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <Car className="w-16 h-16 text-[#6B6B7B]" />
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoSelect}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="inline-flex items-center gap-2 bg-[#1A1A1F] text-white px-4 py-2 rounded-lg hover:bg-[#2A2A30] transition border border-[#2A2A30] cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Alterar Logo
              </label>
              <p className="text-xs text-[#6B6B7B] mt-2">
                PNG, JPG ou SVG. Máximo 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Nome */}
        <div>
          <label className="block text-sm text-[#A0A0B0] mb-2">Nome da Loja *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
            required
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm text-[#A0A0B0] mb-2">WhatsApp *</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="5511999999999"
            className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
            required
          />
          <p className="text-xs text-[#6B6B7B] mt-1">
            Formato: 55 + DDD + número (ex: 5511999999999)
          </p>
        </div>

        {/* Cidade */}
        <div>
          <label className="block text-sm text-[#A0A0B0] mb-2">Cidade</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-[#E84118] text-white px-6 py-3 rounded-lg hover:bg-[#FF5733] transition font-medium disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  )
}

export default AdminStoreProfile
