'use client'

import { useState, useEffect } from 'react'

export default function FinanceiroPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentCompany, setCurrentCompany] = useState('all')
  const [currentFilter, setCurrentFilter] = useState('all')
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)

  useEffect(() => {
    // Adicionar Font Awesome e Chart.js
    const fontAwesome = document.createElement('link')
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    fontAwesome.rel = 'stylesheet'
    document.head.appendChild(fontAwesome)

    const chartJs = document.createElement('script')
    chartJs.src = 'https://cdn.jsdelivr.net/npm/chart.js'
    chartJs.onload = () => {
      initializeCharts()
    }
    document.head.appendChild(chartJs)

    loadTransactions()
    loadUrgentAccounts()

    return () => {
      if (document.head.contains(fontAwesome)) {
        document.head.removeChild(fontAwesome)
      }
      if (document.head.contains(chartJs)) {
        document.head.removeChild(chartJs)
      }
    }
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
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

  const switchCompany = (company: string) => {
    setCurrentCompany(company)
    updateCompanyInfo(company)
    updateOverviewCards(company)
    loadTransactions()
    loadUrgentAccounts()
  }

  const updateCompanyInfo = (company: string) => {
    const companyData = {
      'all': {
        name: 'Visão Consolidada - Grupo Soluzione Giusta',
        description: 'Todas as empresas do grupo • Dados consolidados',
        employees: 19,
        projects: 47
      },
      'soluzione-giusta': {
        name: 'Soluzione Giusta',
        description: 'Empresa matriz • Gestão e coordenação',
        employees: 8,
        projects: 15
      },
      'sg-tech': {
        name: 'SG Tech',
        description: 'Desenvolvimento e tecnologia',
        employees: 5,
        projects: 12
      },
      'sg-marketing': {
        name: 'SG Marketing',
        description: 'Marketing digital e comunicação',
        employees: 3,
        projects: 8
      },
      'sg-consultoria': {
        name: 'SG Consultoria',
        description: 'Consultoria empresarial',
        employees: 2,
        projects: 6
      },
      'sg-digital': {
        name: 'SG Digital',
        description: 'Transformação digital',
        employees: 1,
        projects: 4
      }
    }

    const data = companyData[company as keyof typeof companyData] || companyData['all']
    
    const nameElement = document.getElementById('currentCompanyName')
    const descElement = document.getElementById('currentCompanyDescription')
    const employeeElement = document.getElementById('companyEmployeeCount')
    const projectElement = document.getElementById('companyProjectCount')

    if (nameElement) nameElement.textContent = data.name
    if (descElement) descElement.textContent = data.description
    if (employeeElement) employeeElement.textContent = data.employees.toString()
    if (projectElement) projectElement.textContent = data.projects.toString()
  }

  const updateOverviewCards = (company: string) => {
    // Dados simulados por empresa
    const financialData = {
      'all': {
        revenue: 'R$ 2.847.250',
        expenses: 'R$ 1.892.750',
        profit: 'R$ 954.500',
        pending: 'R$ 425.680'
      },
      'soluzione-giusta': {
        revenue: 'R$ 1.250.000',
        expenses: 'R$ 850.000',
        profit: 'R$ 400.000',
        pending: 'R$ 180.000'
      },
      'sg-tech': {
        revenue: 'R$ 680.000',
        expenses: 'R$ 420.000',
        profit: 'R$ 260.000',
        pending: 'R$ 95.000'
      },
      'sg-marketing': {
        revenue: 'R$ 450.000',
        expenses: 'R$ 280.000',
        profit: 'R$ 170.000',
        pending: 'R$ 65.000'
      }
    }

    const data = financialData[company as keyof typeof financialData] || financialData['all']
    
    const cards = document.querySelectorAll('.card-value')
    if (cards[0]) cards[0].textContent = data.revenue
    if (cards[1]) cards[1].textContent = data.expenses
    if (cards[2]) cards[2].textContent = data.profit
    if (cards[3]) cards[3].textContent = data.pending
  }

  const loadTransactions = () => {
    const transactions = [
      {
        id: 1,
        type: 'income',
        title: 'Pagamento Cliente ABC',
        subtitle: 'Projeto Sistema ERP',
        amount: 'R$ 45.000,00',
        date: '22/09/2024',
        company: 'sg-tech'
      },
      {
        id: 2,
        type: 'expense',
        title: 'Salários Setembro',
        subtitle: 'Folha de pagamento',
        amount: 'R$ 187.320,00',
        date: '20/09/2024',
        company: 'all'
      },
      {
        id: 3,
        type: 'income',
        title: 'Consultoria Estratégica',
        subtitle: 'Empresa XYZ',
        amount: 'R$ 25.000,00',
        date: '19/09/2024',
        company: 'sg-consultoria'
      },
      {
        id: 4,
        type: 'expense',
        title: 'Aluguel Escritório',
        subtitle: 'Setembro 2024',
        amount: 'R$ 12.500,00',
        date: '18/09/2024',
        company: 'soluzione-giusta'
      },
      {
        id: 5,
        type: 'pending',
        title: 'Fatura Fornecedor DEF',
        subtitle: 'Vencimento: 25/09',
        amount: 'R$ 8.750,00',
        date: '15/09/2024',
        company: 'sg-marketing'
      }
    ]

    const filteredTransactions = currentFilter === 'all' 
      ? transactions 
      : transactions.filter(t => t.type === currentFilter)

    const transactionsList = document.getElementById('transactionsList')
    if (transactionsList) {
      transactionsList.innerHTML = filteredTransactions.map(transaction => `
        <div class="transaction-item">
          <div class="transaction-icon ${transaction.type}">
            <i class="fas fa-${transaction.type === 'income' ? 'arrow-up' : transaction.type === 'expense' ? 'arrow-down' : 'clock'}"></i>
          </div>
          <div class="transaction-details">
            <div class="transaction-title">${transaction.title}</div>
            <div class="transaction-subtitle">${transaction.subtitle}</div>
          </div>
          <div>
            <div class="transaction-amount ${transaction.type === 'income' ? 'positive' : transaction.type === 'expense' ? 'negative' : 'pending'}">
              ${transaction.amount}
            </div>
            <div class="transaction-date">${transaction.date}</div>
          </div>
        </div>
      `).join('')
    }
  }

  const loadUrgentAccounts = () => {
    const urgentAccounts = [
      {
        title: 'Pagamento Fornecedor ABC',
        description: 'Vencimento: Hoje',
        amount: 'R$ 25.750,00',
        status: 'overdue'
      },
      {
        title: 'Salários do mês',
        description: 'Vencimento: Amanhã',
        amount: 'R$ 187.320,00',
        status: 'urgent'
      },
      {
        title: 'Aluguel Escritório SP',
        description: 'Vencimento: 25/09',
        amount: 'R$ 12.500,00',
        status: 'urgent'
      },
      {
        title: 'IPTU Escritório',
        description: 'Vencimento: 28/09',
        amount: 'R$ 3.200,00',
        status: 'urgent'
      }
    ]

    const urgentList = document.getElementById('urgentList')
    const urgentCount = document.getElementById('urgentCount')
    
    if (urgentCount) urgentCount.textContent = urgentAccounts.length.toString()
    
    if (urgentList) {
      urgentList.innerHTML = urgentAccounts.map(account => `
        <div class="urgent-item">
          <div class="urgent-content">
            <div class="urgent-info">
              <h4>${account.title}</h4>
              <p>${account.description}</p>
            </div>
            <div class="urgent-amount">
              <div class="urgent-value">${account.amount}</div>
              <div class="urgent-due ${account.status}">${account.status === 'overdue' ? 'VENCIDO' : 'URGENTE'}</div>
            </div>
          </div>
        </div>
      `).join('')
    }
  }

  const initializeCharts = () => {
    // Gráfico de Fluxo de Caixa
    const cashFlowCtx = document.getElementById('cashFlowChart') as HTMLCanvasElement
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (cashFlowCtx && (window as any).Chart) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (window as any).Chart(cashFlowCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
          datasets: [{
            label: 'Receitas',
            data: [1200000, 1350000, 1180000, 1420000, 1650000, 1580000, 1720000, 1890000, 2100000],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }, {
            label: 'Despesas',
            data: [980000, 1050000, 920000, 1100000, 1250000, 1180000, 1320000, 1450000, 1600000],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top' as const,
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value: number | string) {
                  return 'R$ ' + (Number(value) / 1000000).toFixed(1) + 'M'
                }
              }
            }
          }
        }
      })
    }

    // Gráfico de Despesas por Categoria
    const expensesCtx = document.getElementById('expensesChart') as HTMLCanvasElement
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (expensesCtx && (window as any).Chart) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (window as any).Chart(expensesCtx, {
        type: 'doughnut',
        data: {
          labels: ['Salários', 'Aluguel', 'Marketing', 'Tecnologia', 'Outros'],
          datasets: [{
            data: [45, 20, 15, 12, 8],
            backgroundColor: [
              '#3b82f6',
              '#ef4444',
              '#f59e0b',
              '#10b981',
              '#8b5cf6'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom' as const,
            }
          }
        }
      })
    }
  }

  const filterTransactions = (filter: string) => {
    setCurrentFilter(filter)
    
    // Atualizar botões ativos
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active')
    })
    document.querySelector(`[onclick="filterTransactions('${filter}')"]`)?.classList.add('active')
    
    loadTransactions()
  }

  const openIncomeModal = () => {
    setShowIncomeModal(true)
  }

  const openExpenseModal = () => {
    setShowExpenseModal(true)
  }

  const closeModal = (modalId: string) => {
    if (modalId === 'incomeModal') {
      setShowIncomeModal(false)
    } else if (modalId === 'expenseModal') {
      setShowExpenseModal(false)
    }
  }

  const exportFinancial = () => {
    alert('Exportando dados financeiros...\n\n✅ Relatório completo\n✅ Formato Excel\n✅ Dados atualizados\n\n(Funcionalidade em desenvolvimento)')
  }

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Receita cadastrada com sucesso!\n\n(Integração com Supabase em desenvolvimento)')
    setShowIncomeModal(false)
  }

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Despesa cadastrada com sucesso!\n\n(Integração com Supabase em desenvolvimento)')
    setShowExpenseModal(false)
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
          position: relative;
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

        .notification-dot {
          position: absolute;
          top: -2px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          border: 1px solid white;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
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

        .btn-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .btn-success:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }

        .btn-danger {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        .btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
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

        /* COMPANY TABS */
        .company-tabs-section {
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

        /* OVERVIEW SECTION */
        .overview-section {
          padding: 40px;
        }

        .company-info-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 25px 30px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .company-details h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 5px;
        }

        .company-details p {
          color: #64748b;
          font-size: 0.95rem;
        }

        .company-stats {
          display: flex;
          gap: 30px;
        }

        .stat-mini {
          text-align: center;
        }

        .stat-mini-value {
          display: block;
          font-size: 1.8rem;
          font-weight: 800;
          color: #3b82f6;
          line-height: 1;
        }

        .stat-mini-label {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
        }

        /* OVERVIEW CARDS */
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .overview-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          border: 1px solid #f1f5f9;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: slideInUp 0.8s ease forwards;
        }

        .overview-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }

        .overview-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: var(--accent-gradient);
        }

        .overview-card.revenue { --accent-gradient: linear-gradient(90deg, #10b981, #059669); }
        .overview-card.expenses { --accent-gradient: linear-gradient(90deg, #ef4444, #dc2626); }
        .overview-card.profit { --accent-gradient: linear-gradient(90deg, #3b82f6, #1d4ed8); }
        .overview-card.pending { --accent-gradient: linear-gradient(90deg, #f59e0b, #d97706); }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .card-icon {
          width: 70px;
          height: 70px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          color: white;
          background: var(--accent-gradient);
        }

        .card-value {
          font-size: 2.8rem;
          font-weight: 900;
          color: #1e293b;
          margin-bottom: 8px;
          line-height: 1;
        }

        .card-label {
          color: #64748b;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 15px;
        }

        .card-change {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .card-change.positive {
          color: #10b981;
        }

        .card-change.negative {
          color: #ef4444;
        }

        .card-change.neutral {
          color: #64748b;
        }

        /* CHARTS SECTION */
        .charts-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
          margin-bottom: 40px;
        }

        .chart-card {
          background: white;
          padding: 35px;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          border: 1px solid #f1f5f9;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .chart-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1e293b;
        }

        .chart-controls {
          display: flex;
          gap: 10px;
        }

        .chart-control {
          padding: 8px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #64748b;
        }

        .chart-control.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        /* TRANSACTIONS SECTION */
        .transactions-section {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 30px;
          margin-bottom: 40px;
        }

        .transactions-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          border: 1px solid #f1f5f9;
          overflow: hidden;
        }

        .transactions-header {
          padding: 25px 30px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fafbfc;
        }

        .transactions-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1e293b;
        }

        .transactions-filters {
          display: flex;
          gap: 10px;
        }

        .filter-btn {
          padding: 6px 12px;
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #64748b;
        }

        .filter-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .transactions-list {
          max-height: 600px;
          overflow-y: auto;
        }

        .transaction-item {
          display: flex;
          align-items: center;
          padding: 20px 30px;
          border-bottom: 1px solid #f8fafc;
          transition: all 0.3s ease;
        }

        .transaction-item:hover {
          background: #fafbfc;
        }

        .transaction-item:last-child {
          border-bottom: none;
        }

        .transaction-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          margin-right: 15px;
          color: white;
        }

        .transaction-icon.income {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .transaction-icon.expense {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .transaction-icon.pending {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .transaction-details {
          flex: 1;
          margin-right: 15px;
        }

        .transaction-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .transaction-subtitle {
          font-size: 0.85rem;
          color: #64748b;
        }

        .transaction-amount {
          font-size: 1.1rem;
          font-weight: 700;
          text-align: right;
        }

        .transaction-amount.positive {
          color: #10b981;
        }

        .transaction-amount.negative {
          color: #ef4444;
        }

        .transaction-amount.pending {
          color: #f59e0b;
        }

        .transaction-date {
          font-size: 0.8rem;
          color: #94a3b8;
          text-align: right;
          margin-top: 4px;
        }

        /* URGENT ACCOUNTS */
        .urgent-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          border: 1px solid #f1f5f9;
          overflow: hidden;
        }

        .urgent-header {
          padding: 25px 30px;
          border-bottom: 1px solid #f1f5f9;
          background: linear-gradient(135deg, #fef2f2, #fee2e2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .urgent-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #991b1b;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .urgent-count {
          background: #ef4444;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .urgent-list {
          max-height: 500px;
          overflow-y: auto;
        }

        .urgent-item {
          padding: 20px 30px;
          border-bottom: 1px solid #f8fafc;
          transition: all 0.3s ease;
          background: linear-gradient(90deg, rgba(255,245,245,0.5), rgba(255,255,255,0.5));
        }

        .urgent-item:hover {
          background: linear-gradient(90deg, rgba(255,235,235,0.8), rgba(255,245,245,0.8));
        }

        .urgent-item:last-child {
          border-bottom: none;
        }

        .urgent-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .urgent-info h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .urgent-info p {
          font-size: 0.85rem;
          color: #64748b;
        }

        .urgent-amount {
          text-align: right;
        }

        .urgent-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ef4444;
          margin-bottom: 4px;
        }

        .urgent-due {
          font-size: 0.8rem;
          color: #991b1b;
          font-weight: 600;
        }

        .overdue {
          color: #dc2626 !important;
          font-weight: 700 !important;
        }

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
          max-width: 700px;
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

        /* ANIMATIONS */
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .overview-card:nth-child(1) { animation-delay: 0.1s; }
        .overview-card:nth-child(2) { animation-delay: 0.2s; }
        .overview-card:nth-child(3) { animation-delay: 0.3s; }
        .overview-card:nth-child(4) { animation-delay: 0.4s; }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .charts-section {
            grid-template-columns: 1fr;
          }
          
          .transactions-section {
            grid-template-columns: 1fr;
          }
          
          .company-stats {
            flex-direction: column;
            gap: 15px;
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
          
          .overview-section {
            padding: 20px;
          }
          
          .overview-grid {
            grid-template-columns: 1fr;
          }
          
          .header {
            padding: 15px 20px;
          }
          
          .header-actions {
            flex-wrap: wrap;
            gap: 10px;
          }
          
          .tabs-container {
            overflow-x: scroll;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          
          .tabs-container::-webkit-scrollbar {
            display: none;
          }
          
          .tab-item span {
            font-size: 0.8rem;
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
              <div className="nav-link" onClick={() => handleNavigation('Funcionários')}>
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
              <div className="nav-link active">
                <i className="fas fa-dollar-sign"></i>
                <span>Financeiro</span>
                <div className="notification-dot"></div>
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
              <h2>Gestão Financeira</h2>
              <p>Controle completo das finanças do Grupo Soluzione Giusta</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-secondary" onClick={exportFinancial}>
                <i className="fas fa-download"></i>
                Exportar
              </button>
              <button className="btn btn-success" onClick={openIncomeModal}>
                <i className="fas fa-plus"></i>
                Nova Receita
              </button>
              <button className="btn btn-danger" onClick={openExpenseModal}>
                <i className="fas fa-minus"></i>
                Nova Despesa
              </button>
            </div>
          </header>

          {/* COMPANY TABS SECTION */}
          <section className="company-tabs-section">
            <div className="tabs-container">
              <div className="tabs-header">
                <div className={`tab-item ${currentCompany === 'all' ? 'active' : ''}`} onClick={() => switchCompany('all')}>
                  <i className="fas fa-chart-line"></i>
                  <span>Consolidado</span>
                </div>
                <div className={`tab-item ${currentCompany === 'soluzione-giusta' ? 'active' : ''}`} onClick={() => switchCompany('soluzione-giusta')}>
                  <i className="fas fa-building"></i>
                  <span>Soluzione Giusta</span>
                </div>
                <div className={`tab-item ${currentCompany === 'sg-tech' ? 'active' : ''}`} onClick={() => switchCompany('sg-tech')}>
                  <i className="fas fa-laptop-code"></i>
                  <span>SG Tech</span>
                </div>
                <div className={`tab-item ${currentCompany === 'sg-marketing' ? 'active' : ''}`} onClick={() => switchCompany('sg-marketing')}>
                  <i className="fas fa-bullhorn"></i>
                  <span>SG Marketing</span>
                </div>
                <div className={`tab-item ${currentCompany === 'sg-consultoria' ? 'active' : ''}`} onClick={() => switchCompany('sg-consultoria')}>
                  <i className="fas fa-handshake"></i>
                  <span>SG Consultoria</span>
                </div>
                <div className={`tab-item ${currentCompany === 'sg-digital' ? 'active' : ''}`} onClick={() => switchCompany('sg-digital')}>
                  <i className="fas fa-globe"></i>
                  <span>SG Digital</span>
                </div>
              </div>
            </div>
          </section>

          {/* OVERVIEW SECTION */}
          <section className="overview-section">
            <div className="company-info-header">
              <div className="company-details">
                <h3 id="currentCompanyName">Visão Consolidada - Grupo Soluzione Giusta</h3>
                <p id="currentCompanyDescription">Todas as empresas do grupo • Dados consolidados</p>
              </div>
              <div className="company-stats">
                <div className="stat-mini">
                  <span className="stat-mini-value" id="companyEmployeeCount">19</span>
                  <span className="stat-mini-label">Funcionários</span>
                </div>
                <div className="stat-mini">
                  <span className="stat-mini-value" id="companyProjectCount">47</span>
                  <span className="stat-mini-label">Projetos</span>
                </div>
              </div>
            </div>

            {/* OVERVIEW CARDS */}
            <div className="overview-grid">
              <div className="overview-card revenue">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="fas fa-arrow-up"></i>
                  </div>
                </div>
                <div className="card-value">R$ 2.847.250</div>
                <div className="card-label">Receitas do Mês</div>
                <div className="card-change positive">
                  <i className="fas fa-trending-up"></i>
                  +18.2% vs mês anterior
                </div>
              </div>

              <div className="overview-card expenses">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="fas fa-arrow-down"></i>
                  </div>
                </div>
                <div className="card-value">R$ 1.892.750</div>
                <div className="card-label">Despesas do Mês</div>
                <div className="card-change negative">
                  <i className="fas fa-trending-up"></i>
                  +8.5% vs mês anterior
                </div>
              </div>

              <div className="overview-card profit">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                </div>
                <div className="card-value">R$ 954.500</div>
                <div className="card-label">Lucro Líquido</div>
                <div className="card-change positive">
                  <i className="fas fa-trending-up"></i>
                  +33.6% margem
                </div>
              </div>

              <div className="overview-card pending">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                </div>
                <div className="card-value">R$ 425.680</div>
                <div className="card-label">Contas Pendentes</div>
                <div className="card-change neutral">
                  <i className="fas fa-exclamation-triangle"></i>
                  7 contas vencendo
                </div>
              </div>
            </div>

            {/* CHARTS SECTION */}
            <div className="charts-section">
              <div className="chart-card">
                <div className="chart-header">
                  <h3 className="chart-title">Fluxo de Caixa</h3>
                  <div className="chart-controls">
                    <div className="chart-control active">6M</div>
                    <div className="chart-control">1A</div>
                    <div className="chart-control">2A</div>
                  </div>
                </div>
                <canvas id="cashFlowChart" height="100"></canvas>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <h3 className="chart-title">Despesas por Categoria</h3>
                </div>
                <canvas id="expensesChart" height="200"></canvas>
              </div>
            </div>

            {/* TRANSACTIONS SECTION */}
            <div className="transactions-section">
              <div className="transactions-card">
                <div className="transactions-header">
                  <h3 className="transactions-title">Transações Recentes</h3>
                  <div className="transactions-filters">
                    <button className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`} onClick={() => filterTransactions('all')}>Todas</button>
                    <button className={`filter-btn ${currentFilter === 'income' ? 'active' : ''}`} onClick={() => filterTransactions('income')}>Receitas</button>
                    <button className={`filter-btn ${currentFilter === 'expense' ? 'active' : ''}`} onClick={() => filterTransactions('expense')}>Despesas</button>
                    <button className={`filter-btn ${currentFilter === 'pending' ? 'active' : ''}`} onClick={() => filterTransactions('pending')}>Pendentes</button>
                  </div>
                </div>
                <div className="transactions-list" id="transactionsList">
                  {/* Transações serão carregadas aqui */}
                </div>
              </div>

              <div className="urgent-card">
                <div className="urgent-header">
                  <h3 className="urgent-title">
                    <i className="fas fa-exclamation-triangle"></i>
                    Contas Urgentes
                  </h3>
                  <div className="urgent-count" id="urgentCount">7</div>
                </div>
                <div className="urgent-list" id="urgentList">
                  {/* Contas urgentes serão carregadas aqui */}
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* MODAL RECEITA */}
        <div className={`modal ${showIncomeModal ? 'show' : ''}`} onClick={() => closeModal('incomeModal')}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Nova Receita</h3>
              <button className="modal-close" onClick={() => closeModal('incomeModal')}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleIncomeSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Descrição</label>
                  <input type="text" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Valor (R$)</label>
                  <input type="number" className="form-input" step="0.01" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Empresa</label>
                  <select className="form-select" required>
                    <option value="">Selecione...</option>
                    <option value="soluzione-giusta">Soluzione Giusta</option>
                    <option value="sg-tech">SG Tech</option>
                    <option value="sg-marketing">SG Marketing</option>
                    <option value="sg-consultoria">SG Consultoria</option>
                    <option value="sg-digital">SG Digital</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select className="form-select" required>
                    <option value="">Selecione...</option>
                    <option value="vendas">Vendas</option>
                    <option value="servicos">Serviços</option>
                    <option value="consultoria">Consultoria</option>
                    <option value="licenciamento">Licenciamento</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Data de Recebimento</label>
                  <input type="date" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Cliente/Origem</label>
                  <input type="text" className="form-input" />
                </div>
                <div className="form-group full">
                  <label className="form-label">Observações</label>
                  <textarea className="form-textarea"></textarea>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => closeModal('incomeModal')}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  <i className="fas fa-save"></i>
                  Salvar Receita
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* MODAL DESPESA */}
        <div className={`modal ${showExpenseModal ? 'show' : ''}`} onClick={() => closeModal('expenseModal')}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Nova Despesa</h3>
              <button className="modal-close" onClick={() => closeModal('expenseModal')}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleExpenseSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Descrição</label>
                  <input type="text" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Valor (R$)</label>
                  <input type="number" className="form-input" step="0.01" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Empresa</label>
                  <select className="form-select" required>
                    <option value="">Selecione...</option>
                    <option value="soluzione-giusta">Soluzione Giusta</option>
                    <option value="sg-tech">SG Tech</option>
                    <option value="sg-marketing">SG Marketing</option>
                    <option value="sg-consultoria">SG Consultoria</option>
                    <option value="sg-digital">SG Digital</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select className="form-select" required>
                    <option value="">Selecione...</option>
                    <option value="salarios">Salários</option>
                    <option value="aluguel">Aluguel</option>
                    <option value="marketing">Marketing</option>
                    <option value="tecnologia">Tecnologia</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Data de Vencimento</label>
                  <input type="date" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Fornecedor</label>
                  <input type="text" className="form-input" />
                </div>
                <div className="form-group full">
                  <label className="form-label">Observações</label>
                  <textarea className="form-textarea"></textarea>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => closeModal('expenseModal')}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-danger">
                  <i className="fas fa-save"></i>
                  Salvar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
