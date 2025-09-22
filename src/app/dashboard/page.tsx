'use client'

import { useState, useEffect } from 'react'


export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    // Adicionar Font Awesome
    const link = document.createElement('link')
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    // Simular notificações
    setTimeout(() => {
      showNotification('Sistema carregado com sucesso!', 'success')
    }, 1000)
    
    setTimeout(() => {
      showNotification('3 contas urgentes precisam de atenção', 'error')
    }, 5000)

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [])

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      z-index: 10000;
      font-weight: 500;
      animation: slideInRight 0.3s ease;
    `
    notification.textContent = message
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease'
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 4000)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleNavigation = (module: string) => {
    if (module === 'Funcionários') {
      window.location.href = '/funcionarios'
    } else {
      showNotification(`Navegando para: ${module}`, 'info')
    }
  }

  const showQuickActions = () => {
    alert('Ações rápidas:\n\n• Novo Projeto\n• Novo Funcionário\n• Nova Transação\n• Novo Documento\n\n(Em desenvolvimento)')
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

        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 10px 20px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .user-avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .user-details h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1e293b;
        }

        .user-details p {
          font-size: 0.8rem;
          color: #64748b;
        }

        /* DASHBOARD CONTENT */
        .dashboard-content {
          padding: 40px;
        }

        /* STATS CARDS */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #f1f5f9;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: fadeInUp 0.6s ease forwards;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 40px rgba(0,0,0,0.12);
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

        .stat-card.revenue { --accent-color: linear-gradient(90deg, #10b981, #059669); }
        .stat-card.projects { --accent-color: linear-gradient(90deg, #3b82f6, #1d4ed8); }
        .stat-card.employees { --accent-color: linear-gradient(90deg, #8b5cf6, #7c3aed); }
        .stat-card.tasks { --accent-color: linear-gradient(90deg, #f59e0b, #d97706); }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
        }

        .stat-card.revenue .stat-icon { background: linear-gradient(135deg, #10b981, #059669); }
        .stat-card.projects .stat-icon { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
        .stat-card.employees .stat-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .stat-card.tasks .stat-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .stat-change {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 12px;
        }

        .stat-change.positive {
          color: #10b981;
        }

        /* ACTIVITIES SECTION */
        .activities-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .activity-card {
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #f1f5f9;
          animation: fadeInUp 0.6s ease forwards;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .activity-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1e293b;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .activity-content {
          flex: 1;
        }

        .activity-content h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .activity-content p {
          font-size: 0.85rem;
          color: #64748b;
        }

        .activity-time {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        /* URGENT ACCOUNTS */
        .urgent-account {
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          border-left: 4px solid #ef4444;
        }

        .urgent-account .activity-avatar {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        /* QUICK ACTIONS */
        .quick-actions {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1000;
        }

        .fab {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fab:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 35px rgba(59, 130, 246, 0.5);
        }

        /* NOTIFICATION DOT */
        .notification-dot {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 12px;
          height: 12px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid white;
        }

        /* ANIMATIONS */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100px);
          }
        }

        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .activities-section {
            grid-template-columns: 1fr;
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
          
          .dashboard-content {
            padding: 20px;
          }
          
          .stats-grid {
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
              <div className="nav-link active">
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
              <div className="nav-link" onClick={() => window.location.href = '/projetos'}>
                <i className="fas fa-project-diagram"></i>
                <span>Projetos</span>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link" onClick={() => window.location.href = '/financeiro'}>
                <i className="fas fa-dollar-sign"></i>
                <span>Financeiro</span>
                <div className="notification-dot"></div>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link" onClick={() => window.location.href = '/chat'}>
                <i className="fas fa-comments"></i>
                <span>Chat</span>
                <div className="notification-dot"></div>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link" onClick={() => window.location.href = '/ponto'}>
                <i className="fas fa-clock"></i>
                <span>Ponto Digital</span>
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link" onClick={() => window.location.href = '/documentos'}>
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
              <h2>Dashboard Principal</h2>
              <p>Bem-vindo ao sistema Journey 100k - Visão geral da Soluzione Giusta</p>
            </div>
            <div className="header-right">
              <div className="user-info">
                <div className="user-avatar">PF</div>
                <div className="user-details">
                  <h4>Pedro Fraquete</h4>
                  <p>CEO • Super Admin</p>
                </div>
              </div>
            </div>
          </header>

          {/* DASHBOARD CONTENT */}
          <div className="dashboard-content">
            {/* STATS CARDS */}
            <div className="stats-grid">
              <div className="stat-card revenue">
                <div className="stat-header">
                  <div className="stat-icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                </div>
                <div className="stat-value">R$ 2,8M</div>
                <div className="stat-label">Faturamento Total</div>
                <div className="stat-change positive">
                  <i className="fas fa-arrow-up"></i>
                  +18.2% vs mês anterior
                </div>
              </div>

              <div className="stat-card projects">
                <div className="stat-header">
                  <div className="stat-icon">
                    <i className="fas fa-project-diagram"></i>
                  </div>
                </div>
                <div className="stat-value">47</div>
                <div className="stat-label">Projetos Ativos</div>
                <div className="stat-change positive">
                  <i className="fas fa-arrow-up"></i>
                  +12 novos este mês
                </div>
              </div>

              <div className="stat-card employees">
                <div className="stat-header">
                  <div className="stat-icon">
                    <i className="fas fa-users"></i>
                  </div>
                </div>
                <div className="stat-value">29</div>
                <div className="stat-label">Funcionários</div>
                <div className="stat-change positive">
                  <i className="fas fa-arrow-up"></i>
                  +3 contratados
                </div>
              </div>

              <div className="stat-card tasks">
                <div className="stat-header">
                  <div className="stat-icon">
                    <i className="fas fa-tasks"></i>
                  </div>
                </div>
                <div className="stat-value">284</div>
                <div className="stat-label">Tarefas Concluídas</div>
                <div className="stat-change positive">
                  <i className="fas fa-arrow-up"></i>
                  94% taxa de conclusão
                </div>
              </div>
            </div>

            {/* ACTIVITIES SECTION */}
            <div className="activities-section">
              <div className="activity-card">
                <div className="activity-header">
                  <h3 className="activity-title">Atividades Recentes</h3>
                  <a href="#" style={{color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem'}}>Ver todas</a>
                </div>
                
                <div className="activity-item">
                  <div className="activity-avatar">JM</div>
                  <div className="activity-content">
                    <h4>Projeto Sistema ERP finalizado</h4>
                    <p>João Marcos concluiu todas as tarefas do projeto</p>
                  </div>
                  <div className="activity-time">2h atrás</div>
                </div>

                <div className="activity-item">
                  <div className="activity-avatar">MC</div>
                  <div className="activity-content">
                    <h4>Novo funcionário contratado</h4>
                    <p>Mariana Costa foi adicionada ao setor de Marketing</p>
                  </div>
                  <div className="activity-time">4h atrás</div>
                </div>

                <div className="activity-item">
                  <div className="activity-avatar">LS</div>
                  <div className="activity-content">
                    <h4>Meta de vendas atingida</h4>
                    <p>Luciano Silva bateu a meta mensal de R$ 150k</p>
                  </div>
                  <div className="activity-time">6h atrás</div>
                </div>

                <div className="activity-item">
                  <div className="activity-avatar">RF</div>
                  <div className="activity-content">
                    <h4>Relatório financeiro enviado</h4>
                    <p>Roberto Ferreira enviou o relatório do Q3</p>
                  </div>
                  <div className="activity-time">8h atrás</div>
                </div>
              </div>

              <div className="activity-card">
                <div className="activity-header">
                  <h3 className="activity-title">Contas Urgentes</h3>
                  <span style={{color: '#ef4444', fontSize: '0.9rem', fontWeight: '600'}}>3 pendentes</span>
                </div>
                
                <div className="activity-item urgent-account">
                  <div className="activity-avatar">!</div>
                  <div className="activity-content">
                    <h4>Pagamento Fornecedor ABC</h4>
                    <p>Vencimento: Hoje • R$ 25.750,00</p>
                  </div>
                  <div className="activity-time">Urgente</div>
                </div>

                <div className="activity-item urgent-account">
                  <div className="activity-avatar">!</div>
                  <div className="activity-content">
                    <h4>Salários do mês</h4>
                    <p>Vencimento: Amanhã • R$ 187.320,00</p>
                  </div>
                  <div className="activity-time">1 dia</div>
                </div>

                <div className="activity-item urgent-account">
                  <div className="activity-avatar">!</div>
                  <div className="activity-content">
                    <h4>Aluguel Escritório SP</h4>
                    <p>Vencimento: 25/09 • R$ 12.500,00</p>
                  </div>
                  <div className="activity-time">3 dias</div>
                </div>

                <div className="activity-item">
                  <div className="activity-avatar">$</div>
                  <div className="activity-content">
                    <h4>Recebimento Cliente XYZ</h4>
                    <p>Previsão: 30/09 • R$ 45.000,00</p>
                  </div>
                  <div className="activity-time">8 dias</div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* QUICK ACTIONS */}
        <div className="quick-actions">
          <button className="fab" onClick={showQuickActions} title="Ações rápidas">
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </>
  )
}
