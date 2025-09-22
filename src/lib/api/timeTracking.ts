import { createClient } from '../supabase/client'

export interface TimeEntry {
  id: string
  profile_id: string
  date: string
  check_in?: string
  lunch_out?: string
  lunch_in?: string
  check_out?: string
  total_hours?: string
  overtime_hours?: string
  status: 'present' | 'absent' | 'late' | 'early_leave' | 'holiday' | 'sick_leave'
  notes?: string
  created_at: string
  // Dados relacionados
  employee_name?: string
  employee_position?: string
}

export interface WorkSchedule {
  id: string
  profile_id: string
  day_of_week: number // 0=domingo, 1=segunda, etc
  start_time: string
  end_time: string
  lunch_duration: string
  active: boolean
  created_at: string
  // Dados relacionados
  employee_name?: string
}

export interface CreateTimeEntryData {
  profile_id: string
  date: string
  check_in?: string
  lunch_out?: string
  lunch_in?: string
  check_out?: string
  status?: 'present' | 'absent' | 'late' | 'early_leave' | 'holiday' | 'sick_leave'
  notes?: string
}

export interface UpdateTimeEntryData {
  check_in?: string
  lunch_out?: string
  lunch_in?: string
  check_out?: string
  status?: 'present' | 'absent' | 'late' | 'early_leave' | 'holiday' | 'sick_leave'
  notes?: string
}

export interface CreateWorkScheduleData {
  profile_id: string
  day_of_week: number
  start_time: string
  end_time: string
  lunch_duration?: string
}

export interface UpdateWorkScheduleData {
  start_time?: string
  end_time?: string
  lunch_duration?: string
  active?: boolean
}

class TimeTrackingAPI {
  private supabase = createClient()

  // REGISTROS DE PONTO
  async getAllTimeEntries(): Promise<{ data: TimeEntry[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('time_tracking')
        .select(`
          *,
          employee_name:profiles(full_name),
          employee_position:employees(position)
        `)
        .order('date', { ascending: false })

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(entry => ({
        ...entry,
        employee_name: entry.employee_name?.full_name,
        employee_position: entry.employee_position?.position
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar registros de ponto:', error)
      return { data: null, error }
    }
  }

  async getTimeEntryById(id: string): Promise<{ data: TimeEntry | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('time_tracking')
        .select(`
          *,
          employee_name:profiles(full_name),
          employee_position:employees(position)
        `)
        .eq('id', id)
        .single()

      if (data) {
        data.employee_name = data.employee_name?.full_name
        data.employee_position = data.employee_position?.position
      }

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar registro de ponto:', error)
      return { data: null, error }
    }
  }

  async getTimeEntriesByEmployee(profileId: string, startDate?: string, endDate?: string): Promise<{ data: TimeEntry[] | null; error: any }> {
    try {
      let query = this.supabase
        .from('time_tracking')
        .select(`
          *,
          employee_name:profiles(full_name),
          employee_position:employees(position)
        `)
        .eq('profile_id', profileId)

      if (startDate) {
        query = query.gte('date', startDate)
      }

      if (endDate) {
        query = query.lte('date', endDate)
      }

      const { data, error } = await query.order('date', { ascending: false })

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(entry => ({
        ...entry,
        employee_name: entry.employee_name?.full_name,
        employee_position: entry.employee_position?.position
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar registros do funcionário:', error)
      return { data: null, error }
    }
  }

  async getTodayTimeEntry(profileId: string): Promise<{ data: TimeEntry | null; error: any }> {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { data, error } = await this.supabase
        .from('time_tracking')
        .select(`
          *,
          employee_name:profiles(full_name),
          employee_position:employees(position)
        `)
        .eq('profile_id', profileId)
        .eq('date', today)
        .single()

      if (data) {
        data.employee_name = data.employee_name?.full_name
        data.employee_position = data.employee_position?.position
      }

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar registro de hoje:', error)
      return { data: null, error }
    }
  }

  async createTimeEntry(timeEntryData: CreateTimeEntryData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('time_tracking')
        .insert({
          ...timeEntryData,
          status: timeEntryData.status || 'present'
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao criar registro de ponto:', error)
      return { data: null, error }
    }
  }

  async updateTimeEntry(id: string, timeEntryData: UpdateTimeEntryData): Promise<{ data: any; error: any }> {
    try {
      // Calcular horas trabalhadas se check_in e check_out estiverem presentes
      let updateData = { ...timeEntryData }
      
      if (timeEntryData.check_in && timeEntryData.check_out) {
        const checkIn = new Date(`1970-01-01T${timeEntryData.check_in}`)
        const checkOut = new Date(`1970-01-01T${timeEntryData.check_out}`)
        const lunchOut = timeEntryData.lunch_out ? new Date(`1970-01-01T${timeEntryData.lunch_out}`) : null
        const lunchIn = timeEntryData.lunch_in ? new Date(`1970-01-01T${timeEntryData.lunch_in}`) : null
        
        let totalMinutes = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60)
        
        // Subtrair tempo de almoço se ambos estiverem presentes
        if (lunchOut && lunchIn) {
          const lunchMinutes = (lunchIn.getTime() - lunchOut.getTime()) / (1000 * 60)
          totalMinutes -= lunchMinutes
        }
        
        const hours = Math.floor(totalMinutes / 60)
        const minutes = Math.floor(totalMinutes % 60)
        updateData.total_hours = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`
      }

      const { data, error } = await this.supabase
        .from('time_tracking')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar registro de ponto:', error)
      return { data: null, error }
    }
  }

  async deleteTimeEntry(id: string): Promise<{ error: any }> {
    try {
      const { error } = await this.supabase
        .from('time_tracking')
        .delete()
        .eq('id', id)

      return { error }
    } catch (error) {
      console.error('Erro ao deletar registro de ponto:', error)
      return { error }
    }
  }

  // HORÁRIOS DE TRABALHO
  async getWorkSchedules(): Promise<{ data: WorkSchedule[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('work_schedules')
        .select(`
          *,
          employee_name:profiles(full_name)
        `)
        .eq('active', true)
        .order('profile_id')
        .order('day_of_week')

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(schedule => ({
        ...schedule,
        employee_name: schedule.employee_name?.full_name
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar horários de trabalho:', error)
      return { data: null, error }
    }
  }

  async getEmployeeWorkSchedule(profileId: string): Promise<{ data: WorkSchedule[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('work_schedules')
        .select(`
          *,
          employee_name:profiles(full_name)
        `)
        .eq('profile_id', profileId)
        .eq('active', true)
        .order('day_of_week')

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(schedule => ({
        ...schedule,
        employee_name: schedule.employee_name?.full_name
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar horário do funcionário:', error)
      return { data: null, error }
    }
  }

  async createWorkSchedule(scheduleData: CreateWorkScheduleData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('work_schedules')
        .insert({
          ...scheduleData,
          lunch_duration: scheduleData.lunch_duration || '01:00:00',
          active: true
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao criar horário de trabalho:', error)
      return { data: null, error }
    }
  }

  async updateWorkSchedule(id: string, scheduleData: UpdateWorkScheduleData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('work_schedules')
        .update(scheduleData)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar horário de trabalho:', error)
      return { data: null, error }
    }
  }

  async deleteWorkSchedule(id: string): Promise<{ error: any }> {
    try {
      const { error } = await this.supabase
        .from('work_schedules')
        .delete()
        .eq('id', id)

      return { error }
    } catch (error) {
      console.error('Erro ao deletar horário de trabalho:', error)
      return { error }
    }
  }

  // AÇÕES DE PONTO
  async clockIn(profileId: string): Promise<{ data: any; error: any }> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const now = new Date().toTimeString().split(' ')[0]

      // Verificar se já existe registro para hoje
      const { data: existingEntry } = await this.getTodayTimeEntry(profileId)

      if (existingEntry) {
        // Atualizar registro existente
        return await this.updateTimeEntry(existingEntry.id, {
          check_in: now,
          status: 'present'
        })
      } else {
        // Criar novo registro
        return await this.createTimeEntry({
          profile_id: profileId,
          date: today,
          check_in: now,
          status: 'present'
        })
      }
    } catch (error) {
      console.error('Erro ao registrar entrada:', error)
      return { data: null, error }
    }
  }

  async clockOut(profileId: string): Promise<{ data: any; error: any }> {
    try {
      const now = new Date().toTimeString().split(' ')[0]
      const { data: todayEntry, error } = await this.getTodayTimeEntry(profileId)

      if (error || !todayEntry) {
        return { data: null, error: error || new Error('Registro de hoje não encontrado') }
      }

      return await this.updateTimeEntry(todayEntry.id, {
        check_out: now
      })
    } catch (error) {
      console.error('Erro ao registrar saída:', error)
      return { data: null, error }
    }
  }

  async lunchOut(profileId: string): Promise<{ data: any; error: any }> {
    try {
      const now = new Date().toTimeString().split(' ')[0]
      const { data: todayEntry, error } = await this.getTodayTimeEntry(profileId)

      if (error || !todayEntry) {
        return { data: null, error: error || new Error('Registro de hoje não encontrado') }
      }

      return await this.updateTimeEntry(todayEntry.id, {
        lunch_out: now
      })
    } catch (error) {
      console.error('Erro ao registrar saída para almoço:', error)
      return { data: null, error }
    }
  }

  async lunchIn(profileId: string): Promise<{ data: any; error: any }> {
    try {
      const now = new Date().toTimeString().split(' ')[0]
      const { data: todayEntry, error } = await this.getTodayTimeEntry(profileId)

      if (error || !todayEntry) {
        return { data: null, error: error || new Error('Registro de hoje não encontrado') }
      }

      return await this.updateTimeEntry(todayEntry.id, {
        lunch_in: now
      })
    } catch (error) {
      console.error('Erro ao registrar volta do almoço:', error)
      return { data: null, error }
    }
  }

  // RELATÓRIOS E ESTATÍSTICAS
  async getTimeTrackingStats(): Promise<{ data: any; error: any }> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

      // Funcionários presentes hoje
      const { data: todayEntries, error: todayError } = await this.supabase
        .from('time_tracking')
        .select('status')
        .eq('date', today)

      if (todayError) {
        return { data: null, error: todayError }
      }

      // Registros do mês
      const { data: monthEntries, error: monthError } = await this.supabase
        .from('time_tracking')
        .select('status, total_hours')
        .gte('date', startOfMonth)

      if (monthError) {
        return { data: null, error: monthError }
      }

      // Total de funcionários
      const { data: employees, error: employeesError } = await this.supabase
        .from('employees')
        .select('id')
        .eq('status', 'active')

      if (employeesError) {
        return { data: null, error: employeesError }
      }

      const totalEmployees = employees?.length || 0
      const presentToday = todayEntries?.filter(entry => entry.status === 'present').length || 0
      const absentToday = todayEntries?.filter(entry => entry.status === 'absent').length || 0
      const lateToday = todayEntries?.filter(entry => entry.status === 'late').length || 0

      // Estatísticas por status no mês
      const monthlyStats = monthEntries?.reduce((acc: any, entry: any) => {
        acc[entry.status] = (acc[entry.status] || 0) + 1
        return acc
      }, {}) || {}

      const stats = {
        totalEmployees,
        presentToday,
        absentToday,
        lateToday,
        attendanceRate: totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0,
        monthlyStats,
        totalRecords: monthEntries?.length || 0
      }

      return { data: stats, error: null }
    } catch (error) {
      console.error('Erro ao buscar estatísticas de ponto:', error)
      return { data: null, error }
    }
  }

  async getEmployeeReport(profileId: string, startDate: string, endDate: string): Promise<{ data: any; error: any }> {
    try {
      const { data: entries, error } = await this.getTimeEntriesByEmployee(profileId, startDate, endDate)

      if (error) {
        return { data: null, error }
      }

      const totalDays = entries?.length || 0
      const presentDays = entries?.filter(entry => entry.status === 'present').length || 0
      const absentDays = entries?.filter(entry => entry.status === 'absent').length || 0
      const lateDays = entries?.filter(entry => entry.status === 'late').length || 0

      // Calcular total de horas trabalhadas
      const totalHours = entries?.reduce((sum, entry) => {
        if (entry.total_hours) {
          const [hours, minutes] = entry.total_hours.split(':').map(Number)
          return sum + hours + (minutes / 60)
        }
        return sum
      }, 0) || 0

      const report = {
        profileId,
        startDate,
        endDate,
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        attendanceRate: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0,
        totalHours: Math.round(totalHours * 100) / 100,
        averageHoursPerDay: totalDays > 0 ? Math.round((totalHours / totalDays) * 100) / 100 : 0,
        entries
      }

      return { data: report, error: null }
    } catch (error) {
      console.error('Erro ao gerar relatório do funcionário:', error)
      return { data: null, error }
    }
  }
}

export const timeTrackingAPI = new TimeTrackingAPI()
