import { createClient } from '../supabase/client'

export interface FinancialTransaction {
  id: string
  company_id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description?: string
  due_date?: string
  paid_date?: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  payment_method?: string
  reference_number?: string
  created_by: string
  created_at: string
  updated_at: string
  // Dados relacionados
  company_name?: string
  created_by_name?: string
}

export interface Budget {
  id: string
  company_id: string
  name: string
  category: string
  amount: number
  period: 'monthly' | 'quarterly' | 'yearly'
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
  // Dados relacionados
  company_name?: string
  spent_amount?: number
  remaining_amount?: number
}

export interface CreateTransactionData {
  company_id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description?: string
  due_date?: string
  payment_method?: string
  reference_number?: string
  created_by: string
}

export interface UpdateTransactionData {
  category?: string
  amount?: number
  description?: string
  due_date?: string
  paid_date?: string
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled'
  payment_method?: string
  reference_number?: string
}

export interface CreateBudgetData {
  company_id: string
  name: string
  category: string
  amount: number
  period: 'monthly' | 'quarterly' | 'yearly'
  start_date: string
  end_date: string
}

export interface UpdateBudgetData {
  name?: string
  category?: string
  amount?: number
  period?: 'monthly' | 'quarterly' | 'yearly'
  start_date?: string
  end_date?: string
}

class FinancialAPI {
  private supabase = createClient()

  // TRANSAÇÕES FINANCEIRAS
  async getAllTransactions(): Promise<{ data: FinancialTransaction[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('financial_transactions')
        .select(`
          *,
          company_name:companies(name),
          created_by_name:profiles(full_name)
        `)
        .order('created_at', { ascending: false })

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(transaction => ({
        ...transaction,
        company_name: transaction.company_name?.name,
        created_by_name: transaction.created_by_name?.full_name
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar transações:', error)
      return { data: null, error }
    }
  }

  async getTransactionById(id: string): Promise<{ data: FinancialTransaction | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('financial_transactions')
        .select(`
          *,
          company_name:companies(name),
          created_by_name:profiles(full_name)
        `)
        .eq('id', id)
        .single()

      if (data) {
        data.company_name = data.company_name?.name
        data.created_by_name = data.created_by_name?.full_name
      }

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar transação:', error)
      return { data: null, error }
    }
  }

  async createTransaction(transactionData: CreateTransactionData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('financial_transactions')
        .insert({
          ...transactionData,
          status: 'pending'
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao criar transação:', error)
      return { data: null, error }
    }
  }

  async updateTransaction(id: string, transactionData: UpdateTransactionData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('financial_transactions')
        .update(transactionData)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar transação:', error)
      return { data: null, error }
    }
  }

  async deleteTransaction(id: string): Promise<{ error: any }> {
    try {
      const { error } = await this.supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id)

      return { error }
    } catch (error) {
      console.error('Erro ao deletar transação:', error)
      return { error }
    }
  }

  // ORÇAMENTOS
  async getAllBudgets(): Promise<{ data: Budget[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('budgets')
        .select(`
          *,
          company_name:companies(name)
        `)
        .order('created_at', { ascending: false })

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(budget => ({
        ...budget,
        company_name: budget.company_name?.name
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error)
      return { data: null, error }
    }
  }

  async createBudget(budgetData: CreateBudgetData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('budgets')
        .insert(budgetData)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao criar orçamento:', error)
      return { data: null, error }
    }
  }

  async updateBudget(id: string, budgetData: UpdateBudgetData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('budgets')
        .update(budgetData)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error)
      return { data: null, error }
    }
  }

  async deleteBudget(id: string): Promise<{ error: any }> {
    try {
      const { error } = await this.supabase
        .from('budgets')
        .delete()
        .eq('id', id)

      return { error }
    } catch (error) {
      console.error('Erro ao deletar orçamento:', error)
      return { error }
    }
  }

  // RELATÓRIOS E ESTATÍSTICAS
  async getFinancialStats(): Promise<{ data: any; error: any }> {
    try {
      // Buscar todas as transações
      const { data: transactions, error: transactionsError } = await this.supabase
        .from('financial_transactions')
        .select('type, amount, status, created_at')

      if (transactionsError) {
        return { data: null, error: transactionsError }
      }

      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      // Calcular estatísticas
      const totalIncome = transactions
        ?.filter(t => t.type === 'income' && t.status === 'paid')
        .reduce((sum, t) => sum + t.amount, 0) || 0

      const totalExpenses = transactions
        ?.filter(t => t.type === 'expense' && t.status === 'paid')
        .reduce((sum, t) => sum + t.amount, 0) || 0

      const monthlyIncome = transactions
        ?.filter(t => {
          const date = new Date(t.created_at)
          return t.type === 'income' && 
                 t.status === 'paid' && 
                 date.getMonth() === currentMonth && 
                 date.getFullYear() === currentYear
        })
        .reduce((sum, t) => sum + t.amount, 0) || 0

      const monthlyExpenses = transactions
        ?.filter(t => {
          const date = new Date(t.created_at)
          return t.type === 'expense' && 
                 t.status === 'paid' && 
                 date.getMonth() === currentMonth && 
                 date.getFullYear() === currentYear
        })
        .reduce((sum, t) => sum + t.amount, 0) || 0

      const pendingTransactions = transactions
        ?.filter(t => t.status === 'pending').length || 0

      const overdueTransactions = transactions
        ?.filter(t => t.status === 'overdue').length || 0

      // Receitas por categoria
      const incomeByCategory = transactions
        ?.filter(t => t.type === 'income' && t.status === 'paid')
        .reduce((acc: any, t: any) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount
          return acc
        }, {}) || {}

      // Despesas por categoria
      const expensesByCategory = transactions
        ?.filter(t => t.type === 'expense' && t.status === 'paid')
        .reduce((acc: any, t: any) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount
          return acc
        }, {}) || {}

      const stats = {
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
        monthlyIncome,
        monthlyExpenses,
        monthlyProfit: monthlyIncome - monthlyExpenses,
        pendingTransactions,
        overdueTransactions,
        incomeByCategory,
        expensesByCategory,
        totalTransactions: transactions?.length || 0
      }

      return { data: stats, error: null }
    } catch (error) {
      console.error('Erro ao buscar estatísticas financeiras:', error)
      return { data: null, error }
    }
  }

  async getTransactionsByType(type: 'income' | 'expense'): Promise<{ data: FinancialTransaction[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('financial_transactions')
        .select(`
          *,
          company_name:companies(name),
          created_by_name:profiles(full_name)
        `)
        .eq('type', type)
        .order('created_at', { ascending: false })

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(transaction => ({
        ...transaction,
        company_name: transaction.company_name?.name,
        created_by_name: transaction.created_by_name?.full_name
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar transações por tipo:', error)
      return { data: null, error }
    }
  }

  async getTransactionsByStatus(status: string): Promise<{ data: FinancialTransaction[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('financial_transactions')
        .select(`
          *,
          company_name:companies(name),
          created_by_name:profiles(full_name)
        `)
        .eq('status', status)
        .order('created_at', { ascending: false })

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(transaction => ({
        ...transaction,
        company_name: transaction.company_name?.name,
        created_by_name: transaction.created_by_name?.full_name
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar transações por status:', error)
      return { data: null, error }
    }
  }

  async getMonthlyReport(year: number, month: number): Promise<{ data: any; error: any }> {
    try {
      const startDate = new Date(year, month - 1, 1).toISOString()
      const endDate = new Date(year, month, 0).toISOString()

      const { data: transactions, error } = await this.supabase
        .from('financial_transactions')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .eq('status', 'paid')

      if (error) {
        return { data: null, error }
      }

      const income = transactions
        ?.filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0) || 0

      const expenses = transactions
        ?.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0) || 0

      const report = {
        month,
        year,
        income,
        expenses,
        profit: income - expenses,
        transactionCount: transactions?.length || 0,
        transactions
      }

      return { data: report, error: null }
    } catch (error) {
      console.error('Erro ao gerar relatório mensal:', error)
      return { data: null, error }
    }
  }
}

export const financialAPI = new FinancialAPI()
