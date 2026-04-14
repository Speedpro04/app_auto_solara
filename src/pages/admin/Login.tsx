import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, LogIn } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/admin')
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C0C0E] px-4">
      <div className="bg-[#1A1A1F] rounded-xl p-8 w-full max-w-md border border-[#2A2A30]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Car className="w-16 h-16 text-[#E84118]" />
          </div>
          <h1 className="text-4xl font-['Bebas_Neue'] text-white mb-2">
            Solara Auto
          </h1>
          <p className="text-[#A0A0B0]">Painel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-[#A0A0B0] mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0C0C0E] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#A0A0B0] mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0C0C0E] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#E84118] text-white px-6 py-3 rounded-lg hover:bg-[#FF5733] transition font-medium disabled:opacity-50"
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#6B6B7B]">
          <a href="/" className="text-[#E84118] hover:underline">
            Voltar para o site
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
