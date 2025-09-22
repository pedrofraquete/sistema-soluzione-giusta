import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, UserPlus, FileText, Calendar, MessageSquare } from 'lucide-react'

const actions = [
  {
    title: 'Novo Funcionário',
    description: 'Cadastrar novo colaborador',
    icon: UserPlus,
    href: '/funcionarios/novo',
  },
  {
    title: 'Nova Despesa',
    description: 'Registrar transação financeira',
    icon: FileText,
    href: '/financeiro/nova-despesa',
  },
  {
    title: 'Novo Projeto',
    description: 'Criar projeto para cliente',
    icon: Plus,
    href: '/projetos/novo',
  },
  {
    title: 'Agendar Reunião',
    description: 'Marcar compromisso',
    icon: Calendar,
    href: '/calendario/nova-reuniao',
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-gray-50"
            >
              <action.icon className="w-5 h-5 text-gray-600" />
              <div className="text-left">
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MessageSquare className="w-4 h-4" />
            <span>Lembretes Importantes</span>
          </div>
          <div className="space-y-2">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                Reunião com cliente Mavie às 14h
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                Relatório mensal vence em 3 dias
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
