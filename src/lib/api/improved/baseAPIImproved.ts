// ==========================================
// EXEMPLO DE IMPLEMENTAÇÃO - MELHORIAS DO BACKEND
// Sistema ERP Journey 100k - Soluzione Giusta
// ==========================================

import { createClient } from '../supabase/client'

// Interfaces para padronização
export interface PaginationParams {
  page?: number
  limit?: number
  orderBy?: string
  direction?: 'asc' | 'desc'
}

export interface FilterParams {
  filters?: Record<string, any>
  search?: string
  dateFrom?: string
  dateTo?: string
}

export interface APIResponse<T> {
  success: boolean
  data: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

// ==========================================
// SISTEMA DE CACHE MELHORADO
// ==========================================
class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  
  set(key: string, data: any, ttl: number = 300000) { // 5min default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }
  
  get<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data as T
  }
  
  invalidate(pattern: string) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
  
  clear() {
    this.cache.clear()
  }
  
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

export const cacheManager = new CacheManager()

// ==========================================
// BASE API MELHORADA
// ==========================================
abstract class BaseAPIImproved<T> {
  protected abstract tableName: string
  protected abstract viewName?: string
  protected supabase = createClient()
  
  // Método genérico para buscar com paginação, filtros e cache
  async findAll(params?: PaginationParams & FilterParams): Promise<APIResponse<T[]>> {
    try {
      // Gerar chave de cache
      const cacheKey = `${this.tableName}_${JSON.stringify(params)}`
      
      // Verificar cache primeiro
      const cached = cacheManager.get<APIResponse<T[]>>(cacheKey)
      if (cached) {
        console.log(`Cache HIT: ${cacheKey}`)
        return cached
      }
      
      // Construir query
      let query = this.supabase
        .from(this.viewName || this.tableName)
        .select('*', { count: 'exact' })
      
      // Aplicar filtros
      if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            query = query.in(key, value)
          } else if (value !== undefined && value !== null) {
            query = query.eq(key, value)
          }
        })
      }
      
      // Aplicar busca textual
      if (params?.search) {
        query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`)
      }
      
      // Aplicar filtro de data
      if (params?.dateFrom) {
        query = query.gte('created_at', params.dateFrom)
      }
      if (params?.dateTo) {
        query = query.lte('created_at', params.dateTo)
      }
      
      // Aplicar ordenação
      const orderBy = params?.orderBy || 'created_at'
      const direction = params?.direction === 'asc'
      query = query.order(orderBy, { ascending: direction })
      
      // Aplicar paginação
      const page = params?.page || 1
      const limit = params?.limit || 20
      const offset = (page - 1) * limit
      
      if (limit > 0) {
        query = query.range(offset, offset + limit - 1)
      }
      
      // Executar query
      const { data, error, count } = await query
      
      if (error) {
        throw new Error(error.message)
      }
      
      const response: APIResponse<T[]> = {
        success: true,
        data: data || [],
        meta: {
          total: count || 0,
          page,
          limit,
          pages: Math.ceil((count || 0) / limit)
        }
      }
      
      // Salvar no cache (5 minutos para listas)
      cacheManager.set(cacheKey, response, 300000)
      console.log(`Cache MISS: ${cacheKey}`)
      
      return response
    } catch (error) {
      console.error(`Erro em ${this.tableName}.findAll:`, error)
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      }
    }
  }
  
  // Buscar por ID com cache
  async findById(id: string): Promise<APIResponse<T | null>> {
    try {
      const cacheKey = `${this.tableName}_${id}`
      
      // Verificar cache
      const cached = cacheManager.get<T>(cacheKey)
      if (cached) {
        return { success: true, data: cached }
      }
      
      const { data, error } = await this.supabase
        .from(this.viewName || this.tableName)
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        throw new Error(error.message)
      }
      
      // Cache por 15 minutos (dados específicos duram mais)
      cacheManager.set(cacheKey, data, 900000)
      
      return {
        success: true,
        data: data || null
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      }
    }
  }
  
  // Criar com invalidação de cache
  async create(data: Partial<T>): Promise<APIResponse<T | null>> {
    try {
      const { data: created, error } = await this.supabase
        .from(this.tableName)
        .insert(data)
        .select()
        .single()
      
      if (error) {
        throw new Error(error.message)
      }
      
      // Invalidar cache relacionado
      cacheManager.invalidate(this.tableName)
      
      return {
        success: true,
        data: created
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      }
    }
  }
  
  // Atualizar com invalidação de cache
  async update(id: string, data: Partial<T>): Promise<APIResponse<T | null>> {
    try {
      const { data: updated, error } = await this.supabase
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        throw new Error(error.message)
      }
      
      // Invalidar cache específico e listas
      cacheManager.invalidate(`${this.tableName}_${id}`)
      cacheManager.invalidate(this.tableName)
      
      return {
        success: true,
        data: updated
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      }
    }
  }
  
  // Deletar com invalidação de cache
  async delete(id: string): Promise<APIResponse<boolean>> {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)
      
      if (error) {
        throw new Error(error.message)
      }
      
      // Invalidar cache
      cacheManager.invalidate(`${this.tableName}_${id}`)
      cacheManager.invalidate(this.tableName)
      
      return {
        success: true,
        data: true
      }
    } catch (error) {
      return {
        success: false,
        data: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      }
    }
  }
  
  // Estatísticas com cache longo
  async getStats(): Promise<APIResponse<any>> {
    try {
      const cacheKey = `${this.tableName}_stats`
      
      // Cache de 1 hora para estatísticas
      const cached = cacheManager.get(cacheKey)
      if (cached) {
        return cached
      }
      
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
      
      if (error) {
        throw new Error(error.message)
      }
      
      // Calcular estatísticas básicas
      const stats = {
        total: data.length,
        created_today: data.filter(item => 
          new Date(item.created_at).toDateString() === new Date().toDateString()
        ).length,
        created_this_week: data.filter(item => {
          const itemDate = new Date(item.created_at)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return itemDate >= weekAgo
        }).length,
        created_this_month: data.filter(item => {
          const itemDate = new Date(item.created_at)
          return itemDate.getMonth() === new Date().getMonth() &&
                 itemDate.getFullYear() === new Date().getFullYear()
        }).length
      }
      
      const response = {
        success: true,
        data: stats
      }
      
      // Cache por 1 hora
      cacheManager.set(cacheKey, response, 3600000)
      
      return response
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      }
    }
  }
}

// ==========================================
// EXEMPLO DE IMPLEMENTAÇÃO - EMPLOYEES API MELHORADA
// ==========================================
interface Employee {
  id: string
  profile_id: string
  cpf: string
  position: string
  department: string
  hire_date: string
  salary: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  // Dados relacionados
  full_name?: string
  email?: string
  company_name?: string
}

class EmployeesAPIImproved extends BaseAPIImproved<Employee> {
  protected tableName = 'employees'
  protected viewName = 'employees_full'
  
  // Buscar funcionários por departamento com cache
  async getByDepartment(department: string, params?: PaginationParams): Promise<APIResponse<Employee[]>> {
    return this.findAll({
      ...params,
      filters: { department }
    })
  }
  
  // Buscar funcionários ativos com cache
  async getActive(params?: PaginationParams): Promise<APIResponse<Employee[]>> {
    return this.findAll({
      ...params,
      filters: { status: 'active' }
    })
  }
  
  // Buscar por nome com cache
  async searchByName(name: string, params?: PaginationParams): Promise<APIResponse<Employee[]>> {
    return this.findAll({
      ...params,
      search: name
    })
  }
  
  // Relatório de funcionários com cache longo
  async getDepartmentReport(): Promise<APIResponse<any>> {
    try {
      const cacheKey = 'employees_department_report'
      
      // Cache de 30 minutos para relatórios
      const cached = cacheManager.get(cacheKey)
      if (cached) {
        return cached
      }
      
      const { data, error } = await this.supabase
        .from('employees_full')
        .select('department, status, salary')
      
      if (error) {
        throw new Error(error.message)
      }
      
      // Processar dados para relatório
      const report = data.reduce((acc: any, emp: any) => {
        const dept = emp.department || 'Sem departamento'
        
        if (!acc[dept]) {
          acc[dept] = {
            total: 0,
            active: 0,
            inactive: 0,
            totalSalary: 0,
            averageSalary: 0
          }
        }
        
        acc[dept].total++
        acc[dept][emp.status]++
        acc[dept].totalSalary += emp.salary || 0
        acc[dept].averageSalary = acc[dept].totalSalary / acc[dept].total
        
        return acc
      }, {})
      
      const response = {
        success: true,
        data: report
      }
      
      // Cache por 30 minutos
      cacheManager.set(cacheKey, response, 1800000)
      
      return response
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      }
    }
  }
  
  // Estatísticas avançadas de funcionários
  async getAdvancedStats(): Promise<APIResponse<any>> {
    try {
      const cacheKey = 'employees_advanced_stats'
      
      // Cache de 1 hora
      const cached = cacheManager.get(cacheKey)
      if (cached) {
        return cached
      }
      
      const { data, error } = await this.supabase
        .from('employees_full')
        .select('*')
      
      if (error) {
        throw new Error(error.message)
      }
      
      const stats = {
        total: data.length,
        active: data.filter(e => e.status === 'active').length,
        inactive: data.filter(e => e.status === 'inactive').length,
        departments: [...new Set(data.map(e => e.department))].length,
        averageSalary: data.reduce((sum, e) => sum + (e.salary || 0), 0) / data.length,
        totalSalaryBudget: data.reduce((sum, e) => sum + (e.salary || 0), 0),
        newestEmployee: data.reduce((newest, emp) => 
          new Date(emp.hire_date) > new Date(newest.hire_date) ? emp : newest
        ),
        employeesByDepartment: data.reduce((acc: any, emp) => {
          const dept = emp.department || 'Sem departamento'
          acc[dept] = (acc[dept] || 0) + 1
          return acc
        }, {}),
        hiringTrend: this.calculateHiringTrend(data)
      }
      
      const response = {
        success: true,
        data: stats
      }
      
      cacheManager.set(cacheKey, response, 3600000)
      
      return response
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      }
    }
  }
  
  private calculateHiringTrend(employees: Employee[]): any {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      return {
        month: date.getMonth(),
        year: date.getFullYear(),
        monthName: date.toLocaleDateString('pt-BR', { month: 'long' }),
        hires: 0
      }
    }).reverse()
    
    employees.forEach(emp => {
      const hireDate = new Date(emp.hire_date)
      const monthData = last6Months.find(m => 
        m.month === hireDate.getMonth() && m.year === hireDate.getFullYear()
      )
      if (monthData) {
        monthData.hires++
      }
    })
    
    return last6Months
  }
}

// ==========================================
// SISTEMA DE MONITORAMENTO
// ==========================================
class PerformanceMonitor {
  private metrics: Array<{
    operation: string
    duration: number
    timestamp: Date
    success: boolean
  }> = []
  
  async trackOperation<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    const startTime = Date.now()
    let success = true
    
    try {
      const result = await fn()
      return result
    } catch (error) {
      success = false
      throw error
    } finally {
      const duration = Date.now() - startTime
      this.metrics.push({
        operation,
        duration,
        timestamp: new Date(),
        success
      })
      
      // Manter apenas as últimas 1000 métricas
      if (this.metrics.length > 1000) {
        this.metrics = this.metrics.slice(-1000)
      }
    }
  }
  
  getStats() {
    const last24h = this.metrics.filter(m => 
      m.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
    )
    
    return {
      total_operations: last24h.length,
      success_rate: last24h.filter(m => m.success).length / last24h.length * 100,
      average_duration: last24h.reduce((sum, m) => sum + m.duration, 0) / last24h.length,
      slowest_operations: last24h
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5),
      operations_by_type: last24h.reduce((acc: any, m) => {
        acc[m.operation] = (acc[m.operation] || 0) + 1
        return acc
      }, {})
    }
  }
}

export const performanceMonitor = new PerformanceMonitor()

// ==========================================
// INSTÂNCIA MELHORADA DA API DE FUNCIONÁRIOS
// ==========================================
export const employeesAPIImproved = new EmployeesAPIImproved()

// Exemplo de uso:
/*
// Buscar funcionários com paginação e filtros
const result = await employeesAPIImproved.findAll({
  page: 1,
  limit: 10,
  orderBy: 'hire_date',
  direction: 'desc',
  filters: { status: 'active', department: 'TI' },
  search: 'João',
  dateFrom: '2023-01-01'
})

// Buscar funcionários por departamento
const techEmployees = await employeesAPIImproved.getByDepartment('TI', {
  page: 1,
  limit: 20
})

// Obter relatório de departamentos (com cache)
const departmentReport = await employeesAPIImproved.getDepartmentReport()

// Obter estatísticas avançadas
const stats = await employeesAPIImproved.getAdvancedStats()

// Verificar estatísticas de cache
console.log('Cache Stats:', cacheManager.getStats())

// Verificar estatísticas de performance
console.log('Performance Stats:', performanceMonitor.getStats())
*/