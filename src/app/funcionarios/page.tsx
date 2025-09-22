'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Plus, Filter, MoreHorizontal, Mail, Phone } from 'lucide-react'

// Dados mockados dos funcionários
const employees = [
  {
    id: 1,
    name: 'Pedro Fraquete',
    position: 'CEO',
    department: 'Diretoria',
    email: 'pedro@soluzionegiusta.com',
    phone: '(11) 99999-9999',
    company: 'Soluzione Giusta',
    status: 'Ativo',
    hireDate: '2020-01-15',
  },
  {
    id: 2,
    name: 'André Luiz',
    position: 'Diretor Técnico',
    department: 'Tecnologia',
    email: 'andre@soluzionegiusta.com',
    phone: '(11) 98888-8888',
    company: 'Soluzione Giusta',
    status: 'Ativo',
    hireDate: '2020-03-01',
  },
  {
    id: 3,
    name: 'Caroline Lanzilotti',
    position: 'Gerente de Marketing',
    department: 'Marketing',
    email: 'caroline@soluzionegiusta.com',
    phone: '(11) 97777-7777',
    company: 'Mavie',
    status: 'Ativo',
    hireDate: '2021-06-15',
  },
  {
    id: 4,
    name: 'Ana Silva',
    position: 'Desenvolvedora',
    department: 'Tecnologia',
    email: 'ana@soluzionegiusta.com',
    phone: '(11) 96666-6666',
    company: 'Innova Tiva',
    status: 'Ativo',
    hireDate: '2022-01-10',
  },
  {
    id: 5,
    name: 'Carlos Santos',
    position: 'Analista Financeiro',
    department: 'Financeiro',
    email: 'carlos@soluzionegiusta.com',
    phone: '(11) 95555-5555',
    company: 'Disbrigo Facile',
    status: 'Ativo',
    hireDate: '2021-11-20',
  },
]

export default function FuncionariosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = selectedDepartment === '' || employee.department === selectedDepartment
    
    return matchesSearch && matchesDepartment
  })

  const departments = [...new Set(employees.map(emp => emp.department))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Funcionários</h1>
          <p className="text-gray-600">Gerencie todos os colaboradores do grupo</p>
        </div>
        <Button className="bg-black hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Novo Funcionário
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar funcionários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-black focus:ring-black focus:ring-1 focus:outline-none"
              >
                <option value="">Todos os departamentos</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              <p className="text-sm text-gray-600">Total de Funcionários</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{employees.filter(e => e.status === 'Ativo').length}</p>
              <p className="text-sm text-gray-600">Ativos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
              <p className="text-sm text-gray-600">Departamentos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">6</p>
              <p className="text-sm text-gray-600">Empresas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Funcionários ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-700">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.position} • {employee.department}</p>
                    <p className="text-sm text-gray-500">{employee.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Mail className="w-4 h-4" />
                      {employee.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {employee.phone}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      {employee.status}
                    </span>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
