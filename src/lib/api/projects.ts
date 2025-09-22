import { createClient } from '../supabase/client'

export interface Project {
  id: string
  name: string
  description?: string
  company_id: string
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
  budget?: number
  start_date?: string
  end_date?: string
  progress: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  created_by: string
  created_at: string
  updated_at: string
  // Dados relacionados
  company_name?: string
  total_tasks?: number
  completed_tasks?: number
  completion_percentage?: number
}

export interface Task {
  id: string
  project_id: string
  title: string
  description?: string
  assigned_to?: string
  status: 'todo' | 'in_progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date?: string
  progress: number
  tags: string[]
  created_at: string
  updated_at: string
  // Dados relacionados
  assigned_name?: string
  project_name?: string
}

export interface CreateProjectData {
  name: string
  description?: string
  company_id: string
  budget?: number
  start_date?: string
  end_date?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  created_by: string
}

export interface UpdateProjectData {
  name?: string
  description?: string
  status?: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
  budget?: number
  start_date?: string
  end_date?: string
  progress?: number
  priority?: 'low' | 'medium' | 'high' | 'urgent'
}

export interface CreateTaskData {
  project_id: string
  title: string
  description?: string
  assigned_to?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  due_date?: string
  tags?: string[]
}

export interface UpdateTaskData {
  title?: string
  description?: string
  assigned_to?: string
  status?: 'todo' | 'in_progress' | 'review' | 'completed'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  due_date?: string
  progress?: number
  tags?: string[]
}

class ProjectsAPI {
  private supabase = createClient()

  // PROJETOS
  async getAllProjects(): Promise<{ data: Project[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('projects_stats')
        .select('*')
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar projetos:', error)
      return { data: null, error }
    }
  }

  async getProjectById(id: string): Promise<{ data: Project | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('projects_stats')
        .select('*')
        .eq('id', id)
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar projeto:', error)
      return { data: null, error }
    }
  }

  async createProject(projectData: CreateProjectData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('projects')
        .insert({
          ...projectData,
          status: 'planning',
          progress: 0
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      return { data: null, error }
    }
  }

  async updateProject(id: string, projectData: UpdateProjectData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('projects')
        .update(projectData)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error)
      return { data: null, error }
    }
  }

  async deleteProject(id: string): Promise<{ error: any }> {
    try {
      // Primeiro deletar todas as tarefas do projeto
      await this.supabase
        .from('tasks')
        .delete()
        .eq('project_id', id)

      // Depois deletar o projeto
      const { error } = await this.supabase
        .from('projects')
        .delete()
        .eq('id', id)

      return { error }
    } catch (error) {
      console.error('Erro ao deletar projeto:', error)
      return { error }
    }
  }

  // TAREFAS
  async getAllTasks(): Promise<{ data: Task[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('tasks')
        .select(`
          *,
          assigned_name:profiles(full_name),
          project_name:projects(name)
        `)
        .order('created_at', { ascending: false })

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(task => ({
        ...task,
        assigned_name: task.assigned_name?.full_name,
        project_name: task.project_name?.name
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error)
      return { data: null, error }
    }
  }

  async getTasksByProject(projectId: string): Promise<{ data: Task[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('tasks')
        .select(`
          *,
          assigned_name:profiles(full_name)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(task => ({
        ...task,
        assigned_name: task.assigned_name?.full_name
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar tarefas do projeto:', error)
      return { data: null, error }
    }
  }

  async getTaskById(id: string): Promise<{ data: Task | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('tasks')
        .select(`
          *,
          assigned_name:profiles(full_name),
          project_name:projects(name)
        `)
        .eq('id', id)
        .single()

      if (data) {
        data.assigned_name = data.assigned_name?.full_name
        data.project_name = data.project_name?.name
      }

      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error)
      return { data: null, error }
    }
  }

  async createTask(taskData: CreateTaskData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('tasks')
        .insert({
          ...taskData,
          status: 'todo',
          progress: 0,
          tags: taskData.tags || []
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error)
      return { data: null, error }
    }
  }

  async updateTask(id: string, taskData: UpdateTaskData): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('tasks')
        .update(taskData)
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
      return { data: null, error }
    }
  }

  async deleteTask(id: string): Promise<{ error: any }> {
    try {
      const { error } = await this.supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      return { error }
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error)
      return { error }
    }
  }

  // ESTATÍSTICAS
  async getProjectStats(): Promise<{ data: any; error: any }> {
    try {
      const { data: projects, error: projectsError } = await this.supabase
        .from('projects')
        .select('status')

      if (projectsError) {
        return { data: null, error: projectsError }
      }

      const { data: tasks, error: tasksError } = await this.supabase
        .from('tasks')
        .select('status')

      if (tasksError) {
        return { data: null, error: tasksError }
      }

      // Contar projetos por status
      const projectStats = projects?.reduce((acc: any, project: any) => {
        acc[project.status] = (acc[project.status] || 0) + 1
        return acc
      }, {}) || {}

      // Contar tarefas por status
      const taskStats = tasks?.reduce((acc: any, task: any) => {
        acc[task.status] = (acc[task.status] || 0) + 1
        return acc
      }, {}) || {}

      const stats = {
        projects: {
          total: projects?.length || 0,
          planning: projectStats.planning || 0,
          in_progress: projectStats.in_progress || 0,
          completed: projectStats.completed || 0,
          on_hold: projectStats.on_hold || 0,
          cancelled: projectStats.cancelled || 0
        },
        tasks: {
          total: tasks?.length || 0,
          todo: taskStats.todo || 0,
          in_progress: taskStats.in_progress || 0,
          review: taskStats.review || 0,
          completed: taskStats.completed || 0
        }
      }

      return { data: stats, error: null }
    } catch (error) {
      console.error('Erro ao buscar estatísticas de projetos:', error)
      return { data: null, error }
    }
  }

  async getTasksByStatus(status: string): Promise<{ data: Task[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('tasks')
        .select(`
          *,
          assigned_name:profiles(full_name),
          project_name:projects(name)
        `)
        .eq('status', status)
        .order('created_at', { ascending: false })

      // Transformar os dados para o formato esperado
      const transformedData = data?.map(task => ({
        ...task,
        assigned_name: task.assigned_name?.full_name,
        project_name: task.project_name?.name
      }))

      return { data: transformedData, error }
    } catch (error) {
      console.error('Erro ao buscar tarefas por status:', error)
      return { data: null, error }
    }
  }
}

export const projectsAPI = new ProjectsAPI()
