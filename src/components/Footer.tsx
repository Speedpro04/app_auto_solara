import { Car } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-[#1A1A1F] border-t border-[#2A2A30] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Car className="w-6 h-6 text-[#E84118]" />
            <span className="text-xl font-['Bebas_Neue'] text-white">
              Solara Auto
            </span>
          </div>
          <p className="text-[#6B6B7B] text-sm text-center">
            © 2025 Solara Auto - Plataforma AxosHub. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-sm text-[#A0A0B0]">
            <a href="#" className="hover:text-white transition">
              Termos
            </a>
            <a href="#" className="hover:text-white transition">
              Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
