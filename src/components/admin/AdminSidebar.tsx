import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Car, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Car, label: 'Veículos', path: '/admin/veiculos' },
  { icon: Settings, label: 'Perfil da Loja', path: '/admin/loja' },
]

function AdminSidebar() {
  const location = useLocation()
  const { logout } = useAuth()

  return (
    <aside className="w-64 bg-[#1A1A1F] border-r border-[#2A2A30] min-h-screen flex flex-col">
      <div className="p-6 border-b border-[#2A2A30]">
        <h1 className="text-3xl font-['Bebas_Neue'] text-[#E84118]">
          Solara Auto
        </h1>
        <p className="text-sm text-[#6B6B7B] mt-1">Painel Admin</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-[#E84118] text-white'
                  : 'text-[#A0A0B0] hover:bg-[#2A2A30] hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#2A2A30]">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-[#A0A0B0] hover:bg-[#2A2A30] hover:text-white transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
