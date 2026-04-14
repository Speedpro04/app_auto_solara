import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Car, Phone } from 'lucide-react'
import { Store } from '../types'
import api from '../lib/api'

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [store, setStore] = useState<Store | null>(null)

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const subdomain = window.location.hostname.split('.')[0]
        if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
          const { data } = await api.get('/store')
          setStore(data)
        }
      } catch (error) {
        console.error('Erro ao carregar loja:', error)
      }
    }

    fetchStore()
  }, [])

  return (
    <header className="bg-[#1A1A1F] border-b border-[#2A2A30] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            {store?.logo_url ? (
              <img src={store.logo_url} alt={store.name} className="h-10" />
            ) : (
              <div className="flex items-center gap-2">
                <Car className="w-8 h-8 text-[#E84118]" />
                <span className="text-2xl font-['Bebas_Neue'] text-white">
                  {store?.name || 'Solara Auto'}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-[#A0A0B0] hover:text-white transition">
              Início
            </Link>
            <Link to="/stores" className="text-[#A0A0B0] hover:text-white transition">
              Lojas
            </Link>
            {store && (
              <a
                href={`https://wa.me/${store.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#E84118] text-white px-4 py-2 rounded-lg hover:bg-[#FF5733] transition"
              >
                <Phone className="w-4 h-4" />
                Contato
              </a>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#1A1A1F] border-t border-[#2A2A30]">
          <nav className="flex flex-col p-4 gap-4">
            <Link
              to="/"
              className="text-[#A0A0B0] hover:text-white transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/stores"
              className="text-[#A0A0B0] hover:text-white transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Lojas
            </Link>
            {store && (
              <a
                href={`https://wa.me/${store.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#E84118] text-white px-4 py-2 rounded-lg hover:bg-[#FF5733] transition"
                onClick={() => setIsOpen(false)}
              >
                <Phone className="w-4 h-4" />
                Contato
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
