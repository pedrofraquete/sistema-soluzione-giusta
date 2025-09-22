import { StatsCard } from '@/components/dashboard/StatsCard'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { Users, Briefcase, TrendingUp, TrendingDown } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema Soluzione Giusta</p>
        </div>
        <div className="text-sm text-gray-500">
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Funcionários Ativos"
          value="18"
          change="+2 este mês"
          icon={Users}
          trend="up"
        />
        <StatsCard
          title="Projetos Ativos"
          value="7"
          change="+3 novos"
          icon={Briefcase}
          trend="up"
        />
        <StatsCard
          title="Receita Mensal"
          value="R$ 185.420"
          change="+15.3%"
          icon={TrendingUp}
          trend="up"
        />
        <StatsCard
          title="Despesas"
          value="R$ 142.180"
          change="-5.2%"
          icon={TrendingDown}
          trend="down"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions />
      </div>

      {/* Companies Overview */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Empresas do Grupo</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Soluzione Giusta', type: 'Matriz', active: true },
            { name: 'Disbrigo Facile', type: 'Filial', active: true },
            { name: 'Innova Tiva', type: 'Filial', active: true },
            { name: 'Mavie', type: 'Filial', active: true },
            { name: 'SVL Fraqueie', type: 'Filial', active: true },
            { name: 'Via Giusta', type: 'Filial', active: true },
          ].map((company) => (
            <div
              key={company.name}
              className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {company.name.charAt(0)}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">{company.name}</p>
              <p className="text-xs text-gray-500">{company.type}</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Ativa
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
