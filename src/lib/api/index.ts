// Centralizador de todas as APIs do Sistema ERP Journey 100k

// APIs principais
export { employeesAPI } from './employees'
export { projectsAPI } from './projects'
export { financialAPI } from './financial'

// APIs avançadas
export { chatAPI } from './chat'
export { documentsAPI } from './documents'
export { timeTrackingAPI } from './timeTracking'
export { gamificationAPI } from './gamification'

// Tipos principais
export type {
  Employee,
  CreateEmployeeData,
  UpdateEmployeeData
} from './employees'

export type {
  Project,
  Task,
  CreateProjectData,
  UpdateProjectData,
  CreateTaskData,
  UpdateTaskData
} from './projects'

export type {
  FinancialTransaction,
  Budget,
  CreateTransactionData,
  UpdateTransactionData,
  CreateBudgetData,
  UpdateBudgetData
} from './financial'

export type {
  ChatChannel,
  ChatMember,
  Message,
  CreateChannelData,
  UpdateChannelData,
  CreateMessageData,
  UpdateMessageData
} from './chat'

export type {
  Document,
  DocumentPermission,
  CreateDocumentData,
  UpdateDocumentData,
  CreatePermissionData
} from './documents'

export type {
  TimeEntry,
  WorkSchedule,
  CreateTimeEntryData,
  UpdateTimeEntryData,
  CreateWorkScheduleData,
  UpdateWorkScheduleData
} from './timeTracking'

export type {
  GamificationProfile,
  Achievement,
  Challenge,
  ChallengeParticipation,
  CreateChallengeData,
  UpdateChallengeData,
  UpdateParticipationData
} from './gamification'

// Utilitários para APIs
export class APIUtils {
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  static formatDateTime(date: Date): string {
    return date.toISOString()
  }

  static formatTime(date: Date): string {
    return date.toTimeString().split(' ')[0]
  }

  static parseError(error: any): string {
    if (typeof error === 'string') return error
    if (error?.message) return error.message
    if (error?.error_description) return error.error_description
    return 'Erro desconhecido'
  }

  static handleAPIResponse<T>(response: { data: T | null; error: any }) {
    if (response.error) {
      throw new Error(this.parseError(response.error))
    }
    return response.data
  }

  static async withErrorHandling<T>(
    apiCall: () => Promise<{ data: T | null; error: any }>,
    errorMessage?: string
  ): Promise<T> {
    try {
      const response = await apiCall()
      return this.handleAPIResponse(response)
    } catch (error) {
      console.error(errorMessage || 'Erro na API:', error)
      throw error
    }
  }
}

// Constantes úteis
export const API_CONSTANTS = {
  EMPLOYEE_STATUSES: ['active', 'inactive'] as const,
  PROJECT_STATUSES: ['planning', 'in_progress', 'completed', 'on_hold', 'cancelled'] as const,
  TASK_STATUSES: ['todo', 'in_progress', 'review', 'completed'] as const,
  PRIORITIES: ['low', 'medium', 'high', 'urgent'] as const,
  TRANSACTION_TYPES: ['income', 'expense'] as const,
  TRANSACTION_STATUSES: ['pending', 'paid', 'overdue', 'cancelled'] as const,
  CHANNEL_TYPES: ['public', 'private', 'direct'] as const,
  MESSAGE_TYPES: ['text', 'file', 'image'] as const,
  PERMISSION_LEVELS: ['read', 'write', 'admin'] as const,
  TIME_STATUSES: ['present', 'absent', 'late', 'early_leave', 'holiday', 'sick_leave'] as const,
  CHALLENGE_TYPES: ['daily', 'weekly', 'monthly'] as const,
  MEMBER_ROLES: ['admin', 'member'] as const
}

// Validadores
export class APIValidators {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static isValidCPF(cpf: string): boolean {
    // Remove caracteres não numéricos
    const cleanCPF = cpf.replace(/\D/g, '')
    
    // Verifica se tem 11 dígitos
    if (cleanCPF.length !== 11) return false
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false
    
    // Validação dos dígitos verificadores
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false
    
    return true
  }

  static isValidCNPJ(cnpj: string): boolean {
    // Remove caracteres não numéricos
    const cleanCNPJ = cnpj.replace(/\D/g, '')
    
    // Verifica se tem 14 dígitos
    if (cleanCNPJ.length !== 14) return false
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false
    
    // Validação dos dígitos verificadores
    let length = cleanCNPJ.length - 2
    let numbers = cleanCNPJ.substring(0, length)
    let digits = cleanCNPJ.substring(length)
    let sum = 0
    let pos = length - 7
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--
      if (pos < 2) pos = 9
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11
    if (result !== parseInt(digits.charAt(0))) return false
    
    length = length + 1
    numbers = cleanCNPJ.substring(0, length)
    sum = 0
    pos = length - 7
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--
      if (pos < 2) pos = 9
    }
    
    result = sum % 11 < 2 ? 0 : 11 - sum % 11
    if (result !== parseInt(digits.charAt(1))) return false
    
    return true
  }

  static isValidPhone(phone: string): boolean {
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '')
    
    // Verifica se tem 10 ou 11 dígitos (com ou sem 9 no celular)
    return cleanPhone.length === 10 || cleanPhone.length === 11
  }

  static isValidDate(date: string): boolean {
    const dateObj = new Date(date)
    return dateObj instanceof Date && !isNaN(dateObj.getTime())
  }

  static isValidTime(time: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(time)
  }

  static isValidAmount(amount: number): boolean {
    return typeof amount === 'number' && amount >= 0 && isFinite(amount)
  }

  static isValidFileSize(size: number, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    return size <= maxSizeBytes
  }

  static isValidFileType(type: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(type.toLowerCase())
  }
}

// Formatadores
export class APIFormatters {
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  static formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('pt-BR').format(dateObj)
  }

  static formatDateTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj)
  }

  static formatTime(time: string): string {
    return time.substring(0, 5) // Remove segundos se presentes
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  static formatCPF(cpf: string): string {
    const cleanCPF = cpf.replace(/\D/g, '')
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  static formatCNPJ(cnpj: string): string {
    const cleanCNPJ = cnpj.replace(/\D/g, '')
    return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }

  static formatPhone(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '')
    
    if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
    
    return phone
  }

  static formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`
  }

  static formatDuration(hours: string): string {
    const [h, m] = hours.split(':').map(Number)
    return `${h}h ${m}min`
  }
}

// Status de conexão com Supabase
export class SupabaseStatus {
  static async checkConnection(): Promise<boolean> {
    try {
      const { data, error } = await employeesAPI.getStats()
      return !error
    } catch {
      return false
    }
  }

  static async getSystemHealth(): Promise<{
    supabase: boolean
    employees: boolean
    projects: boolean
    financial: boolean
    chat: boolean
    documents: boolean
    timeTracking: boolean
    gamification: boolean
  }> {
    const health = {
      supabase: false,
      employees: false,
      projects: false,
      financial: false,
      chat: false,
      documents: false,
      timeTracking: false,
      gamification: false
    }

    try {
      // Testar conexão básica
      health.supabase = await this.checkConnection()

      // Testar cada módulo
      const [
        employeesTest,
        projectsTest,
        financialTest,
        chatTest,
        documentsTest,
        timeTrackingTest,
        gamificationTest
      ] = await Promise.allSettled([
        employeesAPI.getStats(),
        projectsAPI.getProjectStats(),
        financialAPI.getFinancialStats(),
        chatAPI.getChatStats(),
        documentsAPI.getDocumentStats(),
        timeTrackingAPI.getTimeTrackingStats(),
        gamificationAPI.getGamificationStats()
      ])

      health.employees = employeesTest.status === 'fulfilled' && !employeesTest.value.error
      health.projects = projectsTest.status === 'fulfilled' && !projectsTest.value.error
      health.financial = financialTest.status === 'fulfilled' && !financialTest.value.error
      health.chat = chatTest.status === 'fulfilled' && !chatTest.value.error
      health.documents = documentsTest.status === 'fulfilled' && !documentsTest.value.error
      health.timeTracking = timeTrackingTest.status === 'fulfilled' && !timeTrackingTest.value.error
      health.gamification = gamificationTest.status === 'fulfilled' && !gamificationTest.value.error

    } catch (error) {
      console.error('Erro ao verificar saúde do sistema:', error)
    }

    return health
  }
}
