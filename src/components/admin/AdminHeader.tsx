import { useAuth } from '../../hooks/useAuth'

function AdminHeader() {
  const { user } = useAuth()

  return (
    <header className="bg-[#1A1A1F] border-b border-[#2A2A30] px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-['Bebas_Neue'] text-white">
          Painel Administrativo
        </h2>
        <div className="text-sm text-[#A0A0B0]">
          {user?.email}
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
