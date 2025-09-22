import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, User, DollarSign, Briefcase } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'user',
    message: 'Pedro Fraquete fez login no sistema',
    time: '2 min atrás',
    icon: User,
  },
  {
    id: 2,
    type: 'financial',
    message: 'Nova despesa cadastrada: R$ 2.500,00',
    time: '15 min atrás',
    icon: DollarSign,
  },
  {
    id: 3,
    type: 'project',
    message: 'Projeto "Website Mavie" foi atualizado',
    time: '1h atrás',
    icon: Briefcase,
  },
  {
    id: 4,
    type: 'user',
    message: 'Caroline Lanzilotti registrou ponto',
    time: '2h atrás',
    icon: Clock,
  },
  {
    id: 5,
    type: 'financial',
    message: 'Pagamento recebido: R$ 15.000,00',
    time: '3h atrás',
    icon: DollarSign,
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <activity.icon className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
