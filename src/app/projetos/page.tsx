'use client'

import { useState, useEffect } from 'react'

export default function ProjectsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentCompany, setCurrentCompany] = useState('all')
  const [currentView, setCurrentView] = useState('kanban')
  const [projects] = useState([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])

  const handleNavigation = (module: string) => {
    const routes: { [key: string]: string } = {
      'Dashboard': '/dashboard',
      'Funcionários': '/funcionarios',
      'Projetos': '/projetos',
      'Financeiro': '/financeiro',
      'Chat': '/chat',
      'Ponto Digital': '/ponto',
      'Documentos': '/documentos',
      'Relatórios': '/relatorios',
      'Gamificação': '/gamificacao',
      'Configurações': '/configuracoes'
    }
    
    if (routes[module]) {
      window.location.href = routes[module]
    }
  };

  interface Task {
    id: number
    title: string
    project: string
    company: string
    assignee: string
    status: string
    priority: string
    progress: number
    dueDate: string
    description: string
    tags: string[]
  }

  useEffect(() => {
    // Adicionar Font Awesome e SortableJS
    const fontAwesome = document.createElement('link')
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    fontAwesome.rel = 'stylesheet'
    document.head.appendChild(fontAwesome)

    const sortableScript = document.createElement('script')
    sortableScript.src = 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js'
    document.head.appendChild(sortableScript)

    // Carregar dados iniciais
    loadProjects()
    loadTasks()

    return () => {
      if (document.head.contains(fontAwesome)) {
        document.head.removeChild(fontAwesome)
      }
      if (document.head.contains(sortableScript)) {
        document.head.removeChild(sortableScript)
      }
    }
  }, [])

  const loadProjects = () => {
    const mockProjects = [
      {
        id: 1,
        name: 'Sistema ERP Journey 100k',
        company: 'soluzione-giusta',
        manager: 'Pedro Fraquete',
        status: 'progress',
        progress: 75,
        startDate: '2024-01-15',
        endDate: '2024-03-30',
        priority: 'high',
        description: 'Desenvolvimento completo do sistema ERP para gestão empresarial'
      },
      {
        id: 2,
        name: 'Campanha Digital Inovativa',
        company: 'innovativa-comunicazione',
        manager: 'Caroline Lanzilotti',
        status: 'review',
        progress: 90,
        startDate: '2024-02-01',
        endDate: '2024-02-28',
        priority: 'high',
        description: 'Campanha de marketing digital para novos clientes'
      },
      {
        id: 3,
        name: 'Portal Disbrigo Digital',
        company: 'disbrigo-facile',
        manager: 'André Luiz',
        status: 'progress',
        progress: 60,
        startDate: '2024-01-20',
        endDate: '2024-04-15',
        priority: 'medium',
        description: 'Portal online para serviços de despachante'
      },
      {
        id: 4,
        name: 'App Mavie Saúde',
        company: 'mavie',
        manager: 'Camila Mantovani',
        status: 'todo',
        progress: 25,
        startDate: '2024-03-01',
        endDate: '2024-06-30',
        priority: 'medium',
        description: 'Aplicativo mobile para gestão de saúde'
      }
    ]
    // setProjects(mockProjects) - removido pois não está sendo usado
  }

  const loadTasks = () => {
    const mockTasks = [
      {
        id: 1,
        title: 'Implementar Dashboard Principal',
        project: 'Sistema ERP Journey 100k',
        company: 'soluzione-giusta',
        assignee: 'Pedro Fraquete',
        status: 'progress',
        priority: 'high',
        progress: 80,
        dueDate: '2024-02-15',
        description: 'Criar dashboard com métricas e estatísticas em tempo real',
        tags: ['frontend', 'dashboard']
      },
      {
        id: 2,
        title: 'API de Autenticação',
        project: 'Sistema ERP Journey 100k',
        company: 'soluzione-giusta',
        assignee: 'André Luiz',
        status: 'done',
        priority: 'high',
        progress: 100,
        dueDate: '2024-01-30',
        description: 'Sistema completo de login e autenticação',
        tags: ['backend', 'auth']
      },
      {
        id: 3,
        title: 'Design System Components',
        project: 'Sistema ERP Journey 100k',
        company: 'soluzione-giusta',
        assignee: 'Caroline Lanzilotti',
        status: 'review',
        priority: 'medium',
        progress: 95,
        dueDate: '2024-02-10',
        description: 'Componentes reutilizáveis do design system',
        tags: ['design', 'components']
      },
      {
        id: 4,
        title: 'Módulo Financeiro',
        project: 'Sistema ERP Journey 100k',
        company: 'soluzione-giusta',
        assignee: 'Camila Mantovani',
        status: 'progress',
        priority: 'high',
        progress: 70,
        dueDate: '2024-02-20',
        description: 'Gestão completa de receitas e despesas',
        tags: ['frontend', 'financeiro']
      },
      {
        id: 5,
        title: 'Estratégia de Conteúdo',
        project: 'Campanha Digital Inovativa',
        company: 'innovativa-comunicazione',
        assignee: 'Caroline Lanzilotti',
        status: 'review',
        priority: 'high',
        progress: 90,
        dueDate: '2024-02-25',
        description: 'Planejamento de conteúdo para redes sociais',
        tags: ['marketing', 'conteudo']
      },
      {
        id: 6,
        title: 'Portal Frontend',
        project: 'Portal Disbrigo Digital',
        company: 'disbrigo-facile',
        assignee: 'Leonardo',
        status: 'todo',
        priority: 'medium',
        progress: 30,
        dueDate: '2024-03-15',
        description: 'Interface do usuário do portal',
        tags: ['frontend', 'portal']
      }
    ]
    setTasks(mockTasks)
    setFilteredTasks(mockTasks)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const switchCompany = (company: string) => {
    setCurrentCompany(company)
    filterTasks(company)
  }

  const switchView = (view: string) => {
    setCurrentView(view)
  }

  const filterTasks = (company: string) => {
    if (company === 'all') {
      setFilteredTasks(tasks)
    } else {
      setFilteredTasks(tasks.filter(task => task.company === company))
    }
  }

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter(task => task.status === status)
  }

  const getProjectStats = () => {
    const total = filteredTasks.length
    const active = filteredTasks.filter(t => t.status === 'progress').length
    const completed = filteredTasks.filter(t => t.status === 'done').length
    const overdue = filteredTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length

    return { total, active, completed, overdue }
  }

  const stats = getProjectStats()

  const openProjectModal = () => {
    const modal = document.getElementById('projectModal')
    if (modal) {
      modal.classList.add('show')
    }
  }

  const openTaskModal = () => {
    const modal = document.getElementById('taskModal')
    if (modal) {
      modal.classList.add('show')
    }
  }

  const closeModal = (modalId: string) => {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.classList.remove('show')
    }
  }

  const exportProjects = () => {
    alert('Funcionalidade de exportação em desenvolvimento!')
  }

  const getAssigneeAvatar = (assignee: string) => {
    const names = assignee.split(' ')
    return names.map(n => n[0]).join('').toUpperCase()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'done'
  }

  const isUrgent = (dueDate: string, status: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays >= 0 && status !== 'done'
  }

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f8fafc;
          color: #334155;
          overflow-x: hidden;
        }

        /* SIDEBAR */
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          width: 280px;
          height: 100vh;
          background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
          padding: 20px 0;
          z-index: 1000;
          transition: all 0.3s ease;
          box-shadow: 4px 0 20px rgba(0,0,0,0.1);
        }

        .sidebar.collapsed {
          width: 80px;
        }

        .logo {
          padding: 0 25px 30px;
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 30px;
        }

        .logo h1 {
          color: #fff;
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 10px;
          transition: all 0.3s ease;
        }

        .sidebar.collapsed .logo h1 {
          opacity: 0;
        }

        .logo .rocket {
          font-size: 2.5rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: block;
          margin-bottom: 10px;
        }

        .nav-menu {
          list-style: none;
          padding: 0 15px;
        }

        .nav-item {
          margin-bottom: 8px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 15px 15px;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.3s ease;
          font-weight: 500;
          cursor: pointer;
        }

        .nav-link:hover,
        .nav-link.active {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          transform: translateX(5px);
        }

        .nav-link i {
          font-size: 1.2rem;
          margin-right: 15px;
          min-width: 20px;
          text-align: center;
        }

        .sidebar.collapsed .nav-link span {
          opacity: 0;
          width: 0;
        }

        .toggle-sidebar {
          position: absolute;
          top: 20px;
          right: -15px;
          width: 30px;
          height: 30px;
          background: #3b82f6;
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
        }

        .toggle-sidebar:hover {
          transform: scale(1.1);
        }

        /* MAIN CONTENT */
        .main-content {
          margin-left: 280px;
          transition: all 0.3s ease;
          min-height: 100vh;
        }

        .sidebar.collapsed + .main-content {
          margin-left: 80px;
        }

        /* HEADER */
        .header {
          background: white;
          padding: 20px 40px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .header-left h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 5px;
        }

        .header-left p {
          color: #64748b;
          font-size: 0.95rem;
        }

        .header-actions {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .btn-secondary {
          background: #f8fafc;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        .btn-secondary:hover {
          background: #e2e8f0;
          color: #334155;
        }

        .btn-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        /* PROJECT TABS */
        .project-tabs-section {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 81px;
          z-index: 90;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .tabs-container {
          max-width: 100%;
          overflow-x: auto;
          padding: 0 40px;
          scrollbar-width: none;
        }

        .tabs-container::-webkit-scrollbar {
          display: none;
        }

        .tabs-header {
          display: flex;
          gap: 5px;
          min-width: max-content;
          padding: 20px 0 0;
        }

        .tab-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 12px 12px 0 0;
          font-weight: 600;
          color: #64748b;
          position: relative;
          white-space: nowrap;
          background: #f8fafc;
          border: 2px solid transparent;
          border-bottom: none;
        }

        .tab-item:hover {
          color: #3b82f6;
          background: #f1f5f9;
          transform: translateY(-2px);
        }

        .tab-item.active {
          color: #3b82f6;
          background: white;
          border-color: #e2e8f0;
          border-bottom: 2px solid white;
          transform: translateY(2px);
        }

        .tab-item i {
          font-size: 1.1rem;
        }

        /* PROJECT STATS */
        .project-stats-section {
          padding: 30px 40px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-bottom: 1px solid #e2e8f0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 25px;
        }

        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--accent-color);
        }

        .stat-card.total { --accent-color: linear-gradient(90deg, #3b82f6, #1d4ed8); }
        .stat-card.active { --accent-color: linear-gradient(90deg, #10b981, #059669); }
        .stat-card.completed { --accent-color: linear-gradient(90deg, #8b5cf6, #7c3aed); }
        .stat-card.overdue { --accent-color: linear-gradient(90deg, #ef4444, #dc2626); }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          color: white;
          background: var(--accent-color);
        }

        .stat-value {
          font-size: 2.2rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 5px;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* VIEW CONTROLS */
        .view-controls {
          padding: 30px 40px 20px;
          background: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
        }

        .view-toggles {
          display: flex;
          gap: 10px;
        }

        .view-toggle {
          padding: 10px 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #64748b;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .view-toggle.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .project-filters {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .filter-select {
          padding: 8px 15px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          background: white;
          color: #64748b;
        }

        /* KANBAN BOARD */
        .kanban-section {
          padding: 30px 40px;
          min-height: 600px;
        }

        .kanban-board {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 25px;
          align-items: start;
        }

        .kanban-column {
          background: #f8fafc;
          border-radius: 16px;
          border: 2px solid #e2e8f0;
          min-height: 500px;
          transition: all 0.3s ease;
        }

        .column-header {
          padding: 20px 25px;
          border-bottom: 2px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          border-radius: 14px 14px 0 0;
        }

        .column-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .column-icon {
          width: 35px;
          height: 35px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          color: white;
        }

        .column-icon.todo { background: linear-gradient(135deg, #6b7280, #4b5563); }
        .column-icon.progress { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
        .column-icon.review { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .column-icon.done { background: linear-gradient(135deg, #10b981, #059669); }

        .column-count {
          background: #e2e8f0;
          color: #64748b;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .column-tasks {
          padding: 20px;
          min-height: 400px;
        }

        /* TASK CARDS */
        .task-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          border: 1px solid #f1f5f9;
          cursor: grab;
          transition: all 0.3s ease;
          position: relative;
        }

        .task-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }

        .task-priority {
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          height: 4px;
          border-radius: 12px 12px 0 0;
        }

        .priority-high { background: linear-gradient(90deg, #ef4444, #dc2626); }
        .priority-medium { background: linear-gradient(90deg, #f59e0b, #d97706); }
        .priority-low { background: linear-gradient(90deg, #10b981, #059669); }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .task-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .task-company {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
        }

        .task-description {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 15px;
        }

        .task-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .task-progress {
          flex: 1;
          margin-right: 15px;
        }

        .progress-label {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 4px;
          display: flex;
          justify-content: space-between;
        }

        .progress-bar {
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .task-due {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .task-due.overdue {
          color: #ef4444;
        }

        .task-due.urgent {
          color: #f59e0b;
        }

        .task-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .task-assignees {
          display: flex;
          gap: -8px;
        }

        .assignee-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
          border: 2px solid white;
          margin-left: -8px;
          position: relative;
          z-index: 1;
        }

        .assignee-avatar:first-child {
          margin-left: 0;
        }

        .task-tags {
          display: flex;
          gap: 6px;
        }

        .task-tag {
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .tag-frontend { background: #dbeafe; color: #1e40af; }
        .tag-backend { background: #dcfce7; color: #166534; }
        .tag-design { background: #fef3c7; color: #92400e; }
        .tag-dashboard { background: #e0e7ff; color: #3730a3; }
        .tag-auth { background: #fce7f3; color: #be185d; }
        .tag-components { background: #ecfdf5; color: #065f46; }
        .tag-financeiro { background: #fef3c7; color: #92400e; }
        .tag-marketing { background: #fce7f3; color: #be185d; }
        .tag-conteudo { background: #e0e7ff; color: #3730a3; }
        .tag-portal { background: #ecfdf5; color: #065f46; }

        /* MODAL */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .modal.show {
          opacity: 1;
          visibility: visible;
        }

        .modal-content {
          background: white;
          border-radius: 24px;
          padding: 40px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          transform: scale(0.9);
          transition: all 0.3s ease;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .modal.show .modal-content {
          transform: scale(1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 35px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f1f5f9;
        }

        .modal-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #1e293b;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.8rem;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 5px;
        }

        .modal-close:hover {
          color: #ef4444;
          transform: scale(1.1);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
          margin-bottom: 30px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-group.full {
          grid-column: 1 / -1;
        }

        .form-label {
          font-weight: 700;
          color: #374151;
          font-size: 0.95rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          padding: 14px 18px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #fafbfc;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          background: white;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .modal-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 40px;
          padding-top: 25px;
          border-top: 2px solid #f1f5f9;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .kanban-board {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          
          .sidebar.open {
            transform: translateX(0);
          }
          
          .main-content {
            margin-left: 0;
          }
          
          .header {
            padding: 15px 20px;
          }
          
          .kanban-section {
            padding: 20px;
          }
          
          .kanban-board {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ANIMATIONS */
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .task-card {
          animation: slideInUp 0.6s ease forwards;
        }

        .task-card:nth-child(1) { animation-delay: 0.1s; }
        .task-card:nth-child(2) { animation-delay: 0.2s; }
        .task-card:nth-child(3) { animation-delay: 0.3s; }
        .task-card:nth-child(4) { animation-delay: 0.4s; }
        .task-card:nth-child(5) { animation-delay: 0.5s; }
      `}</style>

      {/* SIDEBAR */}
      <nav className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} id="sidebar">
        <button className="toggle-sidebar" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
        
        <div className="logo">
          <i className="fas fa-rocket rocket"></i>
          <h1>Journey 100k</h1>
        </div>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <div className="nav-link" onClick={() => window.location.href = '/dashboard'}>
              <i className="fas fa-chart-pie"></i>
              <span>Dashboard</span>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link" onClick={() => window.location.href = '/funcionarios'}>
              <i className="fas fa-users"></i>
              <span>Funcionários</span>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link active">
              <i className="fas fa-project-diagram"></i>
              <span>Projetos</span>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link" onClick={() => window.location.href = '/financeiro'}>
              <i className="fas fa-dollar-sign"></i>
              <span>Financeiro</span>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <i className="fas fa-comments"></i>
              <span>Chat</span>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <i className="fas fa-clock"></i>
              <span>Ponto Digital</span>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <i className="fas fa-file-alt"></i>
              <span>Documentos</span>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <i className="fas fa-chart-bar"></i>
              <span>Relatórios</span>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <i className="fas fa-trophy"></i>
              <span>Gamificação</span>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <i className="fas fa-cog"></i>
              <span>Configurações</span>
            </div>
          </li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* HEADER */}
        <header className="header">
          <div className="header-left">
            <h2>Gestão de Projetos</h2>
            <p>Controle completo de projetos do Grupo Soluzione Giusta</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={exportProjects}>
              <i className="fas fa-download"></i>
              Exportar
            </button>
            <button className="btn btn-success" onClick={openTaskModal}>
              <i className="fas fa-plus"></i>
              Nova Tarefa
            </button>
            <button className="btn btn-primary" onClick={openProjectModal}>
              <i className="fas fa-folder-plus"></i>
              Novo Projeto
            </button>
          </div>
        </header>

        {/* COMPANY TABS */}
        <section className="project-tabs-section">
          <div className="tabs-container">
            <div className="tabs-header">
              <div 
                className={`tab-item ${currentCompany === 'all' ? 'active' : ''}`} 
                onClick={() => switchCompany('all')}
              >
                <i className="fas fa-chart-line"></i>
                <span>Todos os Projetos</span>
              </div>
              <div 
                className={`tab-item ${currentCompany === 'soluzione-giusta' ? 'active' : ''}`} 
                onClick={() => switchCompany('soluzione-giusta')}
              >
                <i className="fas fa-building"></i>
                <span>Soluzione Giusta</span>
              </div>
              <div 
                className={`tab-item ${currentCompany === 'innovativa-comunicazione' ? 'active' : ''}`} 
                onClick={() => switchCompany('innovativa-comunicazione')}
              >
                <i className="fas fa-bullhorn"></i>
                <span>Innovativa</span>
              </div>
              <div 
                className={`tab-item ${currentCompany === 'disbrigo-facile' ? 'active' : ''}`} 
                onClick={() => switchCompany('disbrigo-facile')}
              >
                <i className="fas fa-handshake"></i>
                <span>Disbrigo Facile</span>
              </div>
              <div 
                className={`tab-item ${currentCompany === 'mavie' ? 'active' : ''}`} 
                onClick={() => switchCompany('mavie')}
              >
                <i className="fas fa-heart"></i>
                <span>Mavie</span>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECT STATS */}
        <section className="project-stats-section">
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-header">
                <div className="stat-icon">
                  <i className="fas fa-tasks"></i>
                </div>
              </div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total de Tarefas</div>
            </div>

            <div className="stat-card active">
              <div className="stat-header">
                <div className="stat-icon">
                  <i className="fas fa-play-circle"></i>
                </div>
              </div>
              <div className="stat-value">{stats.active}</div>
              <div className="stat-label">Em Progresso</div>
            </div>

            <div className="stat-card completed">
              <div className="stat-header">
                <div className="stat-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
              </div>
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Concluídas</div>
            </div>

            <div className="stat-card overdue">
              <div className="stat-header">
                <div className="stat-icon">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
              </div>
              <div className="stat-value">{stats.overdue}</div>
              <div className="stat-label">Em Atraso</div>
            </div>
          </div>
        </section>

        {/* VIEW CONTROLS */}
        <section className="view-controls">
          <div className="view-toggles">
            <div 
              className={`view-toggle ${currentView === 'kanban' ? 'active' : ''}`} 
              onClick={() => switchView('kanban')}
            >
              <i className="fas fa-columns"></i>
              Kanban
            </div>
            <div 
              className={`view-toggle ${currentView === 'list' ? 'active' : ''}`} 
              onClick={() => switchView('list')}
            >
              <i className="fas fa-list"></i>
              Lista
            </div>
          </div>
          <div className="project-filters">
            <select className="filter-select">
              <option value="">Todas as Prioridades</option>
              <option value="high">Alta Prioridade</option>
              <option value="medium">Média Prioridade</option>
              <option value="low">Baixa Prioridade</option>
            </select>
            <select className="filter-select">
              <option value="">Todos os Responsáveis</option>
              <option value="pedro">Pedro Fraquete</option>
              <option value="andre">André Luiz</option>
              <option value="caroline">Caroline Lanzilotti</option>
              <option value="camila">Camila Mantovani</option>
            </select>
          </div>
        </section>

        {/* KANBAN BOARD */}
        {currentView === 'kanban' && (
          <section className="kanban-section">
            <div className="kanban-board">
              {/* TO DO COLUMN */}
              <div className="kanban-column">
                <div className="column-header">
                  <div className="column-title">
                    <div className="column-icon todo">
                      <i className="fas fa-clipboard-list"></i>
                    </div>
                    Para Fazer
                  </div>
                  <div className="column-count">{getTasksByStatus('todo').length}</div>
                </div>
                <div className="column-tasks">
                  {getTasksByStatus('todo').map(task => (
                    <div key={task.id} className="task-card">
                      <div className={`task-priority priority-${task.priority}`}></div>
                      <div className="task-header">
                        <div>
                          <div className="task-title">{task.title}</div>
                          <div className="task-company">{task.project}</div>
                        </div>
                      </div>
                      <div className="task-description">{task.description}</div>
                      <div className="task-meta">
                        <div className="task-progress">
                          <div className="progress-label">
                            <span>Progresso</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${task.progress}%` }}></div>
                          </div>
                        </div>
                        <div className={`task-due ${isOverdue(task.dueDate, task.status) ? 'overdue' : isUrgent(task.dueDate, task.status) ? 'urgent' : ''}`}>
                          <i className="fas fa-calendar"></i>
                          {formatDate(task.dueDate)}
                        </div>
                      </div>
                      <div className="task-footer">
                        <div className="task-assignees">
                          <div className="assignee-avatar">
                            {getAssigneeAvatar(task.assignee)}
                          </div>
                        </div>
                        <div className="task-tags">
                          {task.tags.map((tag: string, index: number) => (
                            <span key={index} className={`task-tag tag-${tag}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* IN PROGRESS COLUMN */}
              <div className="kanban-column">
                <div className="column-header">
                  <div className="column-title">
                    <div className="column-icon progress">
                      <i className="fas fa-play-circle"></i>
                    </div>
                    Em Progresso
                  </div>
                  <div className="column-count">{getTasksByStatus('progress').length}</div>
                </div>
                <div className="column-tasks">
                  {getTasksByStatus('progress').map(task => (
                    <div key={task.id} className="task-card">
                      <div className={`task-priority priority-${task.priority}`}></div>
                      <div className="task-header">
                        <div>
                          <div className="task-title">{task.title}</div>
                          <div className="task-company">{task.project}</div>
                        </div>
                      </div>
                      <div className="task-description">{task.description}</div>
                      <div className="task-meta">
                        <div className="task-progress">
                          <div className="progress-label">
                            <span>Progresso</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${task.progress}%` }}></div>
                          </div>
                        </div>
                        <div className={`task-due ${isOverdue(task.dueDate, task.status) ? 'overdue' : isUrgent(task.dueDate, task.status) ? 'urgent' : ''}`}>
                          <i className="fas fa-calendar"></i>
                          {formatDate(task.dueDate)}
                        </div>
                      </div>
                      <div className="task-footer">
                        <div className="task-assignees">
                          <div className="assignee-avatar">
                            {getAssigneeAvatar(task.assignee)}
                          </div>
                        </div>
                        <div className="task-tags">
                          {task.tags.map((tag: string, index: number) => (
                            <span key={index} className={`task-tag tag-${tag}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* IN REVIEW COLUMN */}
              <div className="kanban-column">
                <div className="column-header">
                  <div className="column-title">
                    <div className="column-icon review">
                      <i className="fas fa-eye"></i>
                    </div>
                    Em Revisão
                  </div>
                  <div className="column-count">{getTasksByStatus('review').length}</div>
                </div>
                <div className="column-tasks">
                  {getTasksByStatus('review').map(task => (
                    <div key={task.id} className="task-card">
                      <div className={`task-priority priority-${task.priority}`}></div>
                      <div className="task-header">
                        <div>
                          <div className="task-title">{task.title}</div>
                          <div className="task-company">{task.project}</div>
                        </div>
                      </div>
                      <div className="task-description">{task.description}</div>
                      <div className="task-meta">
                        <div className="task-progress">
                          <div className="progress-label">
                            <span>Progresso</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${task.progress}%` }}></div>
                          </div>
                        </div>
                        <div className={`task-due ${isOverdue(task.dueDate, task.status) ? 'overdue' : isUrgent(task.dueDate, task.status) ? 'urgent' : ''}`}>
                          <i className="fas fa-calendar"></i>
                          {formatDate(task.dueDate)}
                        </div>
                      </div>
                      <div className="task-footer">
                        <div className="task-assignees">
                          <div className="assignee-avatar">
                            {getAssigneeAvatar(task.assignee)}
                          </div>
                        </div>
                        <div className="task-tags">
                          {task.tags.map((tag: string, index: number) => (
                            <span key={index} className={`task-tag tag-${tag}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DONE COLUMN */}
              <div className="kanban-column">
                <div className="column-header">
                  <div className="column-title">
                    <div className="column-icon done">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    Concluído
                  </div>
                  <div className="column-count">{getTasksByStatus('done').length}</div>
                </div>
                <div className="column-tasks">
                  {getTasksByStatus('done').map(task => (
                    <div key={task.id} className="task-card">
                      <div className={`task-priority priority-${task.priority}`}></div>
                      <div className="task-header">
                        <div>
                          <div className="task-title">{task.title}</div>
                          <div className="task-company">{task.project}</div>
                        </div>
                      </div>
                      <div className="task-description">{task.description}</div>
                      <div className="task-meta">
                        <div className="task-progress">
                          <div className="progress-label">
                            <span>Progresso</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${task.progress}%` }}></div>
                          </div>
                        </div>
                        <div className={`task-due ${isOverdue(task.dueDate, task.status) ? 'overdue' : isUrgent(task.dueDate, task.status) ? 'urgent' : ''}`}>
                          <i className="fas fa-calendar"></i>
                          {formatDate(task.dueDate)}
                        </div>
                      </div>
                      <div className="task-footer">
                        <div className="task-assignees">
                          <div className="assignee-avatar">
                            {getAssigneeAvatar(task.assignee)}
                          </div>
                        </div>
                        <div className="task-tags">
                          {task.tags.map((tag: string, index: number) => (
                            <span key={index} className={`task-tag tag-${tag}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* MODAL NOVO PROJETO */}
      <div className="modal" id="projectModal">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Novo Projeto</h3>
            <button className="modal-close" onClick={() => closeModal('projectModal')}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nome do Projeto</label>
              <input type="text" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Empresa</label>
              <select className="form-select" required>
                <option value="">Selecione...</option>
                <option value="soluzione-giusta">Soluzione Giusta</option>
                <option value="innovativa-comunicazione">Innovativa Comunicazione</option>
                <option value="disbrigo-facile">Disbrigo Facile</option>
                <option value="mavie">Mavie</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Gerente do Projeto</label>
              <select className="form-select" required>
                <option value="">Selecione...</option>
                <option value="pedro">Pedro Fraquete</option>
                <option value="andre">André Luiz Fernandes</option>
                <option value="caroline">Caroline Lanzilotti</option>
                <option value="camila">Camila Mantovani</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Prioridade</label>
              <select className="form-select" required>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div className="form-group full">
              <label className="form-label">Descrição</label>
              <textarea className="form-textarea" rows={4}></textarea>
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => closeModal('projectModal')}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-save"></i>
              Criar Projeto
            </button>
          </div>
        </div>
      </div>

      {/* MODAL NOVA TAREFA */}
      <div className="modal" id="taskModal">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Nova Tarefa</h3>
            <button className="modal-close" onClick={() => closeModal('taskModal')}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Título da Tarefa</label>
              <input type="text" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Projeto</label>
              <select className="form-select" required>
                <option value="">Selecione...</option>
                <option value="sistema-erp">Sistema ERP Journey 100k</option>
                <option value="campanha-digital">Campanha Digital Inovativa</option>
                <option value="portal-disbrigo">Portal Disbrigo Digital</option>
                <option value="app-mavie">App Mavie Saúde</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Responsável</label>
              <select className="form-select" required>
                <option value="">Selecione...</option>
                <option value="pedro">Pedro Fraquete</option>
                <option value="andre">André Luiz Fernandes</option>
                <option value="caroline">Caroline Lanzilotti</option>
                <option value="camila">Camila Mantovani</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Prioridade</label>
              <select className="form-select" required>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div className="form-group full">
              <label className="form-label">Descrição</label>
              <textarea className="form-textarea" rows={4}></textarea>
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => closeModal('taskModal')}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-save"></i>
              Criar Tarefa
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
