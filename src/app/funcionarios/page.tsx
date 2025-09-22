'use client'

import { useState, useEffect } from 'react'

export default function FuncionariosPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentView, setCurrentView] = useState('grid')
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  interface Employee {
    id: number
    fullName: string
    email: string
    phone: string
    position: string
    department: string
    company: string
    salary: number
    hireDate: string
    status: string
    avatar: string
    onlineStatus: string
  }

  // Dados dos funcionários
  const employees = [
    {
      id: 1,
      fullName: 'Pedro Fraquete',
      email: 'pedro@soluzionegiusta.com.br',
      phone: '(11) 99999-9999',
      position: 'CEO & Founder',
      department: 'Diretoria',
      company: 'soluzione-giusta',
      salary: 25000,
      hireDate: '2020-01-01',
      status: 'ativo',
      avatar: 'PF',
      onlineStatus: 'online'
    },
    {
      id: 2,
      fullName: 'João Marcos',
      email: 'joao@soluzionegiusta.com.br',
      phone: '(11) 98765-4321',
      position: 'Desenvolvedor Full Stack',
      department: 'Tecnologia',
      company: 'sg-tech',
      salary: 8500,
      hireDate: '2021-03-15',
      status: 'ativo',
      avatar: 'JM',
      onlineStatus: 'online'
    },
    {
      id: 3,
      fullName: 'Mariana Costa',
      email: 'mariana@soluzionegiusta.com.br',
      phone: '(11) 98765-4322',
      position: 'Gerente de Marketing',
      department: 'Marketing',
      company: 'sg-marketing',
      salary: 9200,
      hireDate: '2021-06-20',
      status: 'ativo',
      avatar: 'MC',
      onlineStatus: 'away'
    },
    {
      id: 4,
      fullName: 'Roberto Ferreira',
      email: 'roberto@soluzionegiusta.com.br',
      phone: '(11) 98765-4323',
      position: 'Contador',
      department: 'Financeiro',
      company: 'soluzione-giusta',
      salary: 7800,
      hireDate: '2020-11-10',
      status: 'ativo',
      avatar: 'RF',
      onlineStatus: 'online'
    },
    {
      id: 5,
      fullName: 'Ana Silva',
      email: 'ana@soluzionegiusta.com.br',
      phone: '(11) 98765-4324',
      position: 'Designer UX/UI',
      department: 'Tecnologia',
      company: 'sg-tech',
      salary: 7200,
      hireDate: '2021-08-05',
      status: 'ativo',
      avatar: 'AS',
      onlineStatus: 'online'
    },
    {
      id: 6,
      fullName: 'Carlos Mendes',
      email: 'carlos@soluzionegiusta.com.br',
      phone: '(11) 98765-4325',
      position: 'Analista de Vendas',
      department: 'Vendas',
      company: 'sg-vendas',
      salary: 6500,
      hireDate: '2022-02-14',
      status: 'ferias',
      avatar: 'CM',
      onlineStatus: 'offline'
    }
  ]

  useEffect(() => {
    // Adicionar Font Awesome
    const link = document.createElement('link')
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    setFilteredEmployees(employees)

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const switchView = (view: string) => {
    setCurrentView(view)
  }

  const applyFilters = () => {
    const filtered = employees.filter(emp => {
      const matchesSearch = !searchTerm || 
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = !departmentFilter || emp.department === departmentFilter
      const matchesStatus = !statusFilter || emp.status === statusFilter
      const matchesCompany = !companyFilter || emp.company === companyFilter

      return matchesSearch && matchesDepartment && matchesStatus && matchesCompany
    })

    setFilteredEmployees(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [searchTerm, departmentFilter, statusFilter, companyFilter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const openAddEmployeeModal = () => {
    setEditingEmployee(null)
    setShowModal(true)
  }

  const editEmployee = (id: number) => {
    const employee = employees.find(emp => emp.id === id)
    setEditingEmployee(employee || null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingEmployee(null)
  }

  const viewEmployeeDetails = (id: number) => {
    const employee = employees.find(emp => emp.id === id)
    if (employee) {
      alert(`Detalhes do Funcionário:\n\n${employee.fullName}\n${employee.position}\n${employee.department}\n${employee.email}\n\n(Modal de detalhes em desenvolvimento)`)
    }
  }

  const exportEmployees = () => {
    alert('Exportando funcionários...\n\n✅ ' + filteredEmployees.length + ' funcionários\n✅ Formato Excel\n✅ Dados atualizados\n\n(Funcionalidade em desenvolvimento)')
  }

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
      'Gamificação': '/gamificacao'
    }
    
    if (routes[module]) {
      window.location.href = routes[module]
    } else {
      alert(`Navegando para: ${module}\n\n(Em desenvolvimento)`)
    }
  }

  // Estatísticas
  const totalEmployees = filteredEmployees.length
  const activeEmployees = filteredEmployees.filter(emp => emp.status === 'ativo').length
  const departments = new Set(filteredEmployees.map(emp => emp.department)).size
  const currentMonth = new Date().getMonth()
  const newEmployees = filteredEmployees.filter(emp => {
    const hireMonth = new Date(emp.hireDate).getMonth()
    return hireMonth === currentMonth
  }).length

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

        /* FILTERS SECTION */
        .filters-section {
          padding: 30px 40px;
          background: white;
          border-bottom: 1px solid #e2e8f0;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr auto;
          gap: 20px;
          align-items: end;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
        }

        .filter-input {
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .filter-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-input {
          position: relative;
        }

        .search-input input {
          padding-left: 45px;
        }

        .search-input i {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        /* STATS BAR */
        .stats-bar {
          padding: 25px 40px;
          background: white;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 30px;
          border-bottom: 1px solid #e2e8f0;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 5px;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .stat-item.total .stat-number { color: #3b82f6; }
        .stat-item.active .stat-number { color: #10b981; }
        .stat-item.departments .stat-number { color: #8b5cf6; }
        .stat-item.new .stat-number { color: #f59e0b; }

        /* EMPLOYEES SECTION */
        .employees-section {
          padding: 40px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .view-toggles {
          display: flex;
          gap: 10px;
        }

        .view-toggle {
          padding: 10px 15px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #64748b;
        }

        .view-toggle.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        /* EMPLOYEES GRID */
        .employees-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .employee-card {
          background: white;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
          position: relative;
        }

        .employee-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 40px rgba(0,0,0,0.12);
        }

        .employee-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .employee-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.3rem;
          position: relative;
        }

        .status-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 3px solid white;
        }

        .status-indicator.online { background: #10b981; }
        .status-indicator.away { background: #f59e0b; }
        .status-indicator.offline { background: #6b7280; }

        .employee-info h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .employee-info p {
          color: #64748b;
          font-size: 0.9rem;
        }

        .employee-details {
          margin-bottom: 20px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-size: 0.9rem;
        }

        .detail-label {
          color: #64748b;
          font-weight: 500;
        }

        .detail-value {
          color: #1e293b;
          font-weight: 600;
        }

        .employee-actions {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .action-btn.primary {
          background: #3b82f6;
          color: white;
        }

        .action-btn.primary:hover {
          background: #1d4ed8;
        }

        .action-btn.secondary {
          background: #f8fafc;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        .action-btn.secondary:hover {
          background: #e2e8f0;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-ativo {
          background: #dcfce7;
          color: #166534;
        }

        .status-ferias {
          background: #fef3c7;
          color: #92400e;
        }

        .status-inativo {
          background: #fee2e2;
          color: #991b1b;
        }

        /* MODAL */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
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
          border-radius: 16px;
          padding: 30px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          transform: scale(0.9);
          transition: all 0.3s ease;
        }

        .modal.show .modal-content {
          transform: scale(1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #64748b;
          cursor: pointer;
          padding: 5px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: #f1f5f9;
          color: #1e293b;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 25px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
        }

        .form-input {
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .modal-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .filters-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .stats-bar {
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
          
          .employees-section {
            padding: 20px;
          }
          
          .employees-grid {
            grid-template-columns: 1fr;
          }
          
          .stats-bar {
            grid-template-columns: 1fr;
            padding: 20px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="min-h-screen">
        {/* SIDEBAR */}
        <nav className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <button className="toggle-sidebar" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          
          <div className="logo">
            <span className="rocket">🚀</span>
            <h1>Journey 100k</h1>
          </div>
          
          <ul className="nav-menu">
            <li className="nav-item">
              <div className="nav-link" onClick={() => handleNavigation('Dashboard')}>
                <i className="fas fa-chart-pie"></i>
                <span>Dashboard</span>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link active">
                <i className="fas fa-users"></i>
                <span>Funcionários</span>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link" onClick={() => handleNavigation('Projetos')}>
                <i className="fas fa-project-diagram"></i>
                <span>Projetos</span>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link" onClick={() => handleNavigation('Financeiro')}>
                <i className="fas fa-dollar-sign"></i>
                <span>Financeiro</span>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link" onClick={() => handleNavigation('Chat')}>
                <i className="fas fa-comments"></i>
                <span>Chat</span>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link" onClick={() => handleNavigation('Ponto Digital')}>
                <i className="fas fa-clock"></i>
                <span>Ponto Digital</span>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link" onClick={() => handleNavigation('Documentos')}>
                <i className="fas fa-file-alt"></i>
                <span>Documentos</span>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link" onClick={() => handleNavigation('Relatórios')}>
                <i className="fas fa-chart-bar"></i>
                <span>Relatórios</span>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link" onClick={() => handleNavigation('Gamificação')}>
                <i className="fas fa-trophy"></i>
                <span>Gamificação</span>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link" onClick={() => handleNavigation('Configurações')}>
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
              <h2>Gestão de Funcionários</h2>
              <p>Gerencie toda a equipe da Soluzione Giusta e empresas do grupo</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-secondary" onClick={exportEmployees}>
                <i className="fas fa-download"></i>
                Exportar
              </button>
              <button className="btn btn-primary" onClick={openAddEmployeeModal}>
                <i className="fas fa-plus"></i>
                Novo Funcionário
              </button>
            </div>
          </header>

          {/* FILTERS SECTION */}
          <div className="filters-section">
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">Buscar funcionário</label>
                <div className="search-input">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Nome, email ou cargo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="filter-group">
                <label className="filter-label">Departamento</label>
                <select
                  className="filter-input"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Diretoria">Diretoria</option>
                  <option value="Tecnologia">Tecnologia</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Vendas">Vendas</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label className="filter-label">Status</label>
                <select
                  className="filter-input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="ativo">Ativo</option>
                  <option value="ferias">Férias</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label className="filter-label">Empresa</label>
                <select
                  className="filter-input"
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="soluzione-giusta">Soluzione Giusta</option>
                  <option value="sg-tech">SG Tech</option>
                  <option value="sg-marketing">SG Marketing</option>
                  <option value="sg-vendas">SG Vendas</option>
                </select>
              </div>
            </div>
          </div>

          {/* STATS BAR */}
          <div className="stats-bar">
            <div className="stat-item total">
              <div className="stat-number">{totalEmployees}</div>
              <div className="stat-label">Total de Funcionários</div>
            </div>
            <div className="stat-item active">
              <div className="stat-number">{activeEmployees}</div>
              <div className="stat-label">Funcionários Ativos</div>
            </div>
            <div className="stat-item departments">
              <div className="stat-number">{departments}</div>
              <div className="stat-label">Departamentos</div>
            </div>
            <div className="stat-item new">
              <div className="stat-number">{newEmployees}</div>
              <div className="stat-label">Novos este Mês</div>
            </div>
          </div>

          {/* EMPLOYEES SECTION */}
          <div className="employees-section">
            <div className="section-header">
              <h3 style={{fontSize: '1.3rem', fontWeight: '700', color: '#1e293b'}}>
                Funcionários ({filteredEmployees.length})
              </h3>
              <div className="view-toggles">
                <button
                  className={`view-toggle ${currentView === 'grid' ? 'active' : ''}`}
                  onClick={() => switchView('grid')}
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button
                  className={`view-toggle ${currentView === 'table' ? 'active' : ''}`}
                  onClick={() => switchView('table')}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>

            {/* GRID VIEW */}
            {currentView === 'grid' && (
              <div className="employees-grid">
                {filteredEmployees.map(emp => (
                  <div key={emp.id} className="employee-card">
                    <div className="employee-header">
                      <div className="employee-avatar">
                        {emp.avatar}
                        <div className={`status-indicator ${emp.onlineStatus}`}></div>
                      </div>
                      <div className="employee-info">
                        <h3>{emp.fullName}</h3>
                        <p>{emp.position}</p>
                      </div>
                    </div>
                    
                    <div className="employee-details">
                      <div className="detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{emp.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Departamento:</span>
                        <span className="detail-value">{emp.department}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Admissão:</span>
                        <span className="detail-value">{formatDate(emp.hireDate)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value">
                          <span className={`status-badge status-${emp.status}`}>
                            {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                          </span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="employee-actions">
                      <button className="action-btn primary" onClick={() => editEmployee(emp.id)}>
                        <i className="fas fa-edit"></i>
                        Editar
                      </button>
                      <button className="action-btn secondary" onClick={() => viewEmployeeDetails(emp.id)}>
                        <i className="fas fa-eye"></i>
                        Ver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TABLE VIEW */}
            {currentView === 'table' && (
              <div className="employees-table active">
                <div className="table-header">
                  Lista de Funcionários
                </div>
                <div className="table-content">
                  <div style={{display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr auto', padding: '20px 25px', background: '#f8fafc', fontWeight: '600', borderBottom: '1px solid #e2e8f0'}}>
                    <div>Funcionário</div>
                    <div>Departamento</div>
                    <div>Status</div>
                    <div>Admissão</div>
                    <div>Salário</div>
                    <div>Ações</div>
                  </div>
                  {filteredEmployees.map(emp => (
                    <div key={emp.id} style={{display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr auto', padding: '20px 25px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', transition: 'all 0.3s ease'}} className="table-row">
                      <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                        <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '0.9rem'}}>
                          {emp.avatar}
                        </div>
                        <div>
                          <h4 style={{fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', marginBottom: '4px'}}>{emp.fullName}</h4>
                          <p style={{fontSize: '0.85rem', color: '#64748b'}}>{emp.position}</p>
                        </div>
                      </div>
                      <div>
                        <span style={{padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', background: '#e0e7ff', color: '#3730a3'}}>
                          {emp.department}
                        </span>
                      </div>
                      <div>
                        <span className={`status-badge status-${emp.status}`}>
                          {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                        </span>
                      </div>
                      <div>{formatDate(emp.hireDate)}</div>
                      <div>R$ {emp.salary.toLocaleString('pt-BR')}</div>
                      <div style={{display: 'flex', gap: '5px'}}>
                        <button className="action-btn primary" onClick={() => editEmployee(emp.id)} style={{padding: '5px 10px'}}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn secondary" onClick={() => viewEmployeeDetails(emp.id)} style={{padding: '5px 10px'}}>
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* MODAL */}
        <div className={`modal ${showModal ? 'show' : ''}`} onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}
              </h3>
              <button className="close-btn" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              alert('Funcionário salvo com sucesso!\n\n(Integração com Supabase em desenvolvimento)')
              closeModal()
            }}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nome Completo</label>
                  <input
                    type="text"
                    className="form-input"
                    defaultValue={editingEmployee?.fullName || ''}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    defaultValue={editingEmployee?.email || ''}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Telefone</label>
                  <input
                    type="tel"
                    className="form-input"
                    defaultValue={editingEmployee?.phone || ''}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Cargo</label>
                  <input
                    type="text"
                    className="form-input"
                    defaultValue={editingEmployee?.position || ''}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Departamento</label>
                  <select className="form-input" defaultValue={editingEmployee?.department || ''} required>
                    <option value="">Selecione...</option>
                    <option value="Diretoria">Diretoria</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Vendas">Vendas</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Empresa</label>
                  <select className="form-input" defaultValue={editingEmployee?.company || ''} required>
                    <option value="">Selecione...</option>
                    <option value="soluzione-giusta">Soluzione Giusta</option>
                    <option value="sg-tech">SG Tech</option>
                    <option value="sg-marketing">SG Marketing</option>
                    <option value="sg-vendas">SG Vendas</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Salário</label>
                  <input
                    type="number"
                    className="form-input"
                    defaultValue={editingEmployee?.salary || ''}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Data de Admissão</label>
                  <input
                    type="date"
                    className="form-input"
                    defaultValue={editingEmployee?.hireDate || ''}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-input" defaultValue={editingEmployee?.status || 'ativo'} required>
                    <option value="ativo">Ativo</option>
                    <option value="ferias">Férias</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-save"></i>
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
