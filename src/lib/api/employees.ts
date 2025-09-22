import { createClient } from '../supabase/client'

export interface Employee {
  id: string
  profile_id: string
  cpf: string
  position: string
  department: string
  hire_date: string
  salary: number
  manager_id?: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  // Dados do perfil
  full_name: string
  email: string
  avatar_url?: string
  phone?: string
  company_name: string
}

export interface CreateEmployeeData {
  full_name: string
  email: string
  cpf: string
  position: string
  department: string
  hire_date: string
  salary: number
  phone?: string
  company_id: string
}

export interface UpdateEmployeeData {
  full_name?: string
  email?: string
  cpf?: string
  position?: string
  department?: string
  hire_date?: string
  salary?: number
  phone?: string
  status?: 'active' | 'inactive'
}

class EmployeesAPI {
  private supabase = createClient()

  async getAll(): Promise<{ data: Employee[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('employees_full')
        .select('*')
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error)
      return { data: null, error }
    }
  }

  async getById(id: string): Promise<{ data: Employee | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('employees_full')
        .select('*')
        .eq('id', id)
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar funcionário:', error)
      return { data: null, error }
    }
  }

  async create(employeeData: CreateEmployeeData): Promise<{ data: any; error: any }> {
    try {
      // Primeiro, criar o perfil do usuário
      const { data: profileData, error: profileError } = await this.supabase
        .from('profiles')
        .insert({
          email: employeeData.email,
          full_name: employeeData.full_name,
          role: 'employee',
          company_id: employeeData.company_id,
          phone: employeeData.phone,
          active: true
        })
        .select()
        .single()

      if (profileError) {
        return { data: null, error: profileError }
      }

      // Depois, criar o funcionário
      const { data: employeeDataResult, error: employeeError } = await this.supabase
        .from('employees')
        .insert({
          profile_id: profileData.id,
          cpf: employeeData.cpf,
          position: employeeData.position,
          department: employeeData.department,
          hire_date: employeeData.hire_date,
          salary: employeeData.salary,
          status: 'active'
        })
        .select()
        .single()

      if (employeeError) {
        // Se falhar, tentar limpar o perfil criado
        await this.supabase.from('profiles').delete().eq('id', profileData.id)
        return { data: null, error: employeeError }
      }

      return { data: employeeDataResult, error: null }
    } catch (error) {
      console.error('Erro ao criar funcionário:', error)
      return { data: null, error }
    }
  }

  async update(id: string, employeeData: UpdateEmployeeData): Promise<{ data: any; error: any }> {
    try {
      // Buscar o funcionário para obter o profile_id
      const { data: employee, error: fetchError } = await this.supabase
        .from('employees')
        .select('profile_id')
        .eq('id', id)
        .single()

      if (fetchError) {
        return { data: null, error: fetchError }
      }

      // Atualizar dados do perfil se necessário
      const profileUpdates: any = {}
      if (employeeData.full_name) profileUpdates.full_name = employeeData.full_name
      if (employeeData.email) profileUpdates.email = employeeData.email
      if (employeeData.phone) profileUpdates.phone = employeeData.phone

      if (Object.keys(profileUpdates).length > 0) {
        const { error: profileError } = await this.supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', employee.profile_id)

        if (profileError) {
          return { data: null, error: profileError }
        }
      }

      // Atualizar dados do funcionário
      const employeeUpdates: any = {}
      if (employeeData.cpf) employeeUpdates.cpf = employeeData.cpf
      if (employeeData.position) employeeUpdates.position = employeeData.position
      if (employeeData.department) employeeUpdates.department = employeeData.department
      if (employeeData.hire_date) employeeUpdates.hire_date = employeeData.hire_date
      if (employeeData.salary) employeeUpdates.salary = employeeData.salary
      if (employeeData.status) employeeUpdates.status = employeeData.status

      const { data, error } = await this.supabase
        .from('employees')
        .update(employeeUpdates)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error)
      return { data: null, error }
    }
  }

  async delete(id: string): Promise<{ error: any }> {
    try {
      // Buscar o funcionário para obter o profile_id
      const { data: employee, error: fetchError } = await this.supabase
        .from('employees')
        .select('profile_id')
        .eq('id', id)
        .single()

      if (fetchError) {
        return { error: fetchError }
      }

      // Deletar o funcionário
      const { error: employeeError } = await this.supabase
        .from('employees')
        .delete()
        .eq('id', id)

      if (employeeError) {
        return { error: employeeError }
      }

      // Deletar o perfil
      const { error: profileError } = await this.supabase
        .from('profiles')
        .delete()
        .eq('id', employee.profile_id)

      return { error: profileError }
    } catch (error) {
      console.error('Erro ao deletar funcionário:', error)
      return { error }
    }
  }

  async getByDepartment(department: string): Promise<{ data: Employee[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('employees_full')
        .select('*')
        .eq('department', department)
        .order('full_name')

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar funcionários por departamento:', error)
      return { data: null, error }
    }
  }

  async getStats(): Promise<{ data: any; error: any }> {
    try {
      const { data: totalEmployees, error: totalError } = await this.supabase
        .from('employees')
        .select('id', { count: 'exact' })

      if (totalError) {
        return { data: null, error: totalError }
      }

      const { data: activeEmployees, error: activeError } = await this.supabase
        .from('employees')
        .select('id', { count: 'exact' })
        .eq('status', 'active')

      if (activeError) {
        return { data: null, error: activeError }
      }

      const { data: departmentStats, error: deptError } = await this.supabase
        .from('employees')
        .select('department')
        .eq('status', 'active')

      if (deptError) {
        return { data: null, error: deptError }
      }

      // Contar funcionários por departamento
      const departmentCounts = departmentStats?.reduce((acc: any, emp: any) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1
        return acc
      }, {}) || {}

      const stats = {
        total: totalEmployees?.length || 0,
        active: activeEmployees?.length || 0,
        inactive: (totalEmployees?.length || 0) - (activeEmployees?.length || 0),
        departments: departmentCounts
      }

      return { data: stats, error: null }
    } catch (error) {
      console.error('Erro ao buscar estatísticas de funcionários:', error)
      return { data: null, error }
    }
  }
}

export const employeesAPI = new EmployeesAPI()
