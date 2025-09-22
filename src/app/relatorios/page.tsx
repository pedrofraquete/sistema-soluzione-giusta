'use client';

import React, { useState, useEffect } from 'react';

interface KPIData {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
  type: string;
}

interface CompanyData {
  name: string;
  avatar: string;
  revenue: string;
  status: 'completed' | 'progress' | 'pending';
  statusText: string;
}

export default function RelatoriosPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const kpiData: KPIData[] = [
    {
      title: 'Receita Total',
      value: 'R$ 2.847M',
      change: '+18.2% vs mês anterior',
      positive: true,
      icon: 'fas fa-dollar-sign',
      type: 'revenue'
    },
    {
      title: 'Taxa de Crescimento',
      value: '24.7%',
      change: '+3.2% vs trimestre',
      positive: true,
      icon: 'fas fa-trending-up',
      type: 'growth'
    },
    {
      title: 'Eficiência Operacional',
      value: '89.4%',
      change: '+2.1% vs meta',
      positive: true,
      icon: 'fas fa-tachometer-alt',
      type: 'efficiency'
    },
    {
      title: 'Satisfação Clientes',
      value: '4.8/5',
      change: '+0.3 vs mês anterior',
      positive: true,
      icon: 'fas fa-heart',
      type: 'satisfaction'
    }
  ];

  const companyData: CompanyData[] = [
    {
      name: 'Soluzione Giusta',
      avatar: 'SG',
      revenue: 'R$ 1.245M',
      status: 'completed',
      statusText: 'Meta Atingida'
    },
    {
      name: 'SG Tech',
      avatar: 'ST',
      revenue: 'R$ 892K',
      status: 'progress',
      statusText: 'Em Progresso'
    },
    {
      name: 'SG Marketing',
      avatar: 'SM',
      revenue: 'R$ 456K',
      status: 'completed',
      statusText: 'Meta Atingida'
    },
    {
      name: 'SG Consultoria',
      avatar: 'SC',
      revenue: 'R$ 254K',
      status: 'pending',
      statusText: 'Atenção'
    }
  ];

  const showNotification = (message: string, type: string) => {
    // Implementação de notificação seria aqui
    console.log(`${type}: ${message}`);
  };

  const exportReport = () => {
    showNotification('Preparando relatório para exportação...', 'info');
    setTimeout(() => {
      showNotification('Relatório exportado com sucesso!', 'success');
    }, 2000);
  };

  const refreshData = () => {
    showNotification('Dados atualizados com sucesso!', 'success');
  };

  const openCategory = (category: string) => {
    const categories: { [key: string]: string } = {
      'financial': 'Relatórios Financeiros',
      'projects': 'Análise de Projetos',
      'hr': 'Recursos Humanos',
      'performance': 'Performance Geral',
      'marketing': 'Marketing & Vendas',
      'operational': 'Operacional'
    };
    
    showNotification(`Abrindo: ${categories[category]}`, 'info');
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: '#f8fafc', color: '#334155', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <nav style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: sidebarCollapsed ? '80px' : '280px',
        height: '100vh',
        background: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)',
        padding: '20px 0',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '-15px',
            width: '30px',
            height: '30px',
            background: '#3b82f6',
            border: 'none',
            borderRadius: '50%',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          <i className="fas fa-bars"></i>
        </button>
        
        <div style={{ padding: '0 25px 30px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
          <i className="fas fa-rocket" style={{
            fontSize: '2.5rem',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'block',
            marginBottom: '10px'
          }}></i>
          {!sidebarCollapsed && (
            <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginTop: '10px', transition: 'all 0.3s ease' }}>Journey 100k</h1>
          )}
        </div>
        
        <ul style={{ listStyle: 'none', padding: '0 15px' }}>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => window.location.href = '/dashboard'} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-chart-pie" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Dashboard</span>}
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => window.location.href = '/funcionarios'} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-users" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Funcionários</span>}
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => window.location.href = '/projetos'} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-project-diagram" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Projetos</span>}
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => window.location.href = '/financeiro'} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.3s ease',
              position: 'relative'
            }}>
              <i className="fas fa-dollar-sign" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Financeiro</span>}
              <div style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                width: '12px',
                height: '12px',
                background: '#ef4444',
                borderRadius: '50%',
                border: '2px solid white'
              }}></div>
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => window.location.href = '/chat'} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.3s ease',
              position: 'relative'
            }}>
              <i className="fas fa-comments" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Chat</span>}
              <div style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                width: '12px',
                height: '12px',
                background: '#ef4444',
                borderRadius: '50%',
                border: '2px solid white'
              }}></div>
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => window.location.href = '/ponto'} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-clock" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Ponto Digital</span>}
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => window.location.href = '/documentos'} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-file-alt" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Documentos</span>}
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              color: '#3b82f6',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transform: 'translateX(5px)'
            }}>
              <i className="fas fa-chart-bar" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Relatórios</span>}
            </div>
          </li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ marginLeft: sidebarCollapsed ? '80px' : '280px', transition: 'all 0.3s ease', minHeight: '100vh' }}>
        {/* HEADER */}
        <header style={{
          background: 'white',
          padding: '20px 40px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '5px' }}>Relatórios Avançados</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Análises inteligentes e dashboards personalizáveis - Journey 100k</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.1rem'
            }}>PF</div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>Pedro Fraquete</h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>CEO • Online</p>
            </div>
          </div>
        </header>

        {/* REPORTS CONTENT */}
        <div style={{ padding: '40px' }}>
          {/* TOOLBAR */}
          <div style={{
            background: 'white',
            padding: '25px 30px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px' }}>
                {['7d', '30d', '3m', '1y'].map((period, index) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      background: selectedPeriod === period ? 'white' : 'transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: selectedPeriod === period ? '#3b82f6' : '#64748b',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      boxShadow: selectedPeriod === period ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    {period === '7d' ? '7 dias' : period === '30d' ? '30 dias' : period === '3m' ? '3 meses' : '1 ano'}
                  </button>
                ))}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 15px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                background: 'white'
              }}>
                <i className="fas fa-calendar" style={{ color: '#64748b' }}></i>
                <input type="date" defaultValue="2025-09-15" style={{ border: 'none', outline: 'none', color: '#1e293b', fontSize: '0.9rem' }} />
                <span style={{ color: '#64748b' }}>até</span>
                <input type="date" defaultValue="2025-09-22" style={{ border: 'none', outline: 'none', color: '#1e293b', fontSize: '0.9rem' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button
                onClick={refreshData}
                style={{
                  padding: '12px',
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: '#64748b',
                  transition: 'all 0.3s ease'
                }}
                title="Atualizar dados"
              >
                <i className="fas fa-sync-alt"></i>
              </button>
              <button
                onClick={exportReport}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-download"></i>
                Exportar
              </button>
            </div>
          </div>

          {/* REPORT CATEGORIES */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {[
              { id: 'financial', title: 'Relatórios Financeiros', desc: 'Receitas, despesas, fluxo de caixa e análises de rentabilidade', icon: 'fas fa-dollar-sign', color: 'linear-gradient(90deg, #10b981, #059669)', stat1: 'R$ 2.8M', label1: 'Faturamento', stat2: '18.2%', label2: 'Crescimento' },
              { id: 'projects', title: 'Análise de Projetos', desc: 'Performance, prazos, recursos e produtividade por projeto', icon: 'fas fa-project-diagram', color: 'linear-gradient(90deg, #3b82f6, #1d4ed8)', stat1: '47', label1: 'Projetos', stat2: '94%', label2: 'Taxa Sucesso' },
              { id: 'hr', title: 'Recursos Humanos', desc: 'Desempenho da equipe, presença e análise de produtividade', icon: 'fas fa-users', color: 'linear-gradient(90deg, #8b5cf6, #7c3aed)', stat1: '29', label1: 'Funcionários', stat2: '97.5%', label2: 'Presença' },
              { id: 'performance', title: 'Performance Geral', desc: 'KPIs principais, metas alcançadas e eficiência operacional', icon: 'fas fa-tachometer-alt', color: 'linear-gradient(90deg, #f59e0b, #d97706)', stat1: '89%', label1: 'Eficiência', stat2: '12', label2: 'Metas Ativas' },
              { id: 'marketing', title: 'Marketing & Vendas', desc: 'Conversões, leads, campanhas e análise de ROI', icon: 'fas fa-bullhorn', color: 'linear-gradient(90deg, #ef4444, #dc2626)', stat1: '2,340', label1: 'Leads', stat2: '24.8%', label2: 'Conversão' },
              { id: 'operational', title: 'Operacional', desc: 'Processos, workflows, tempos de execução e gargalos', icon: 'fas fa-cogs', color: 'linear-gradient(90deg, #06b6d4, #0891b2)', stat1: '15.3h', label1: 'Tempo Médio', stat2: '3', label2: 'Gargalos' }
            ].map((category, index) => (
              <div
                key={category.id}
                onClick={() => openCategory(category.id)}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '25px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #f1f5f9',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  animation: `fadeInUp 0.6s ease forwards`,
                  animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.12)';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#f1f5f9';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: category.color,
                  borderRadius: '16px 16px 0 0'
                }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <div style={{
                    width: '55px',
                    height: '55px',
                    borderRadius: '14px',
                    background: category.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    color: 'white'
                  }}>
                    <i className={category.icon}></i>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', marginBottom: '5px' }}>{category.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.4 }}>{category.desc}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>{category.stat1}</div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>{category.label1}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>{category.stat2}</div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>{category.label2}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DASHBOARD SECTION */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '40px' }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b' }}>Análise de Receitas por Empresa</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['Mensal', 'Trimestral', 'Anual'].map((period, index) => (
                    <button
                      key={period}
                      style={{
                        padding: '6px 12px',
                        background: index === 0 ? '#3b82f6' : '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        color: index === 0 ? 'white' : '#64748b',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <i className="fas fa-chart-line" style={{ fontSize: '3rem', marginBottom: '15px' }}></i>
                  <p>Gráfico de Receitas por Empresa</p>
                  <p style={{ fontSize: '0.85rem' }}>(Chart.js seria implementado aqui)</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              {kpiData.map((kpi, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    borderLeft: `4px solid ${
                      kpi.type === 'revenue' ? '#10b981' :
                      kpi.type === 'growth' ? '#3b82f6' :
                      kpi.type === 'efficiency' ? '#f59e0b' : '#8b5cf6'
                    }`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <div style={{
                      width: '35px',
                      height: '35px',
                      borderRadius: '8px',
                      background: kpi.type === 'revenue' ? '#10b981' :
                                 kpi.type === 'growth' ? '#3b82f6' :
                                 kpi.type === 'efficiency' ? '#f59e0b' : '#8b5cf6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      color: 'white'
                    }}>
                      <i className={kpi.icon}></i>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>{kpi.title}</div>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>{kpi.value}</div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: kpi.positive ? '#10b981' : '#ef4444'
                  }}>
                    <i className={`fas fa-arrow-${kpi.positive ? 'up' : 'down'}`}></i>
                    {kpi.change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DETAILED REPORTS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>Performance por Empresa</h3>
                <a href="#" style={{
                  padding: '8px 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease'
                }}>Ver detalhes</a>
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{
                      textAlign: 'left',
                      padding: '12px 0',
                      borderBottom: '2px solid #f1f5f9',
                      color: '#64748b',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Empresa</th>
                    <th style={{
                      textAlign: 'left',
                      padding: '12px 0',
                      borderBottom: '2px solid #f1f5f9',
                      color: '#64748b',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Receita</th>
                    <th style={{
                      textAlign: 'left',
                      padding: '12px 0',
                      borderBottom: '2px solid #f1f5f9',
                      color: '#64748b',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {companyData.map((company, index) => (
                    <tr key={index} style={{ transition: 'all 0.3s ease' }}>
                      <td style={{ padding: '15px 0', borderBottom: '1px solid #f8fafc', color: '#1e293b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.8rem'
                          }}>{company.avatar}</div>
                          <span>{company.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '15px 0', borderBottom: '1px solid #f8fafc', fontWeight: 700, color: '#10b981' }}>
                        {company.revenue}
                      </td>
                      <td style={{ padding: '15px 0', borderBottom: '1px solid #f8fafc' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          background: company.status === 'completed' ? '#dcfce7' : company.status === 'progress' ? '#fef3c7' : '#fee2e2',
                          color: company.status === 'completed' ? '#166534' : company.status === 'progress' ? '#92400e' : '#991b1b'
                        }}>
                          {company.statusText}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>Projetos por Status</h3>
                <a href="#" style={{
                  padding: '8px 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease'
                }}>Gerenciar</a>
              </div>
              
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <i className="fas fa-chart-pie" style={{ fontSize: '3rem', marginBottom: '15px' }}></i>
                  <p>Gráfico de Projetos por Status</p>
                  <p style={{ fontSize: '0.85rem' }}>(Chart.js seria implementado aqui)</p>
                </div>
              </div>
            </div>
          </div>

          {/* INSIGHTS SECTION */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.2rem'
              }}>
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b' }}>Insights Inteligentes</h3>
            </div>

            <div style={{ padding: '20px', borderRadius: '12px', marginBottom: '15px', borderLeft: '4px solid #10b981', background: '#f0fdf4' }}>
              <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Crescimento Excepcional</div>
              <div style={{ color: '#64748b', lineHeight: 1.5 }}>
                O faturamento do SG Tech cresceu 32% no último mês, superando a meta trimestral. 
                O projeto "Sistema Journey 100k" foi o principal responsável por este resultado.
              </div>
            </div>

            <div style={{ padding: '20px', borderRadius: '12px', marginBottom: '15px', borderLeft: '4px solid #f59e0b', background: '#fffbeb' }}>
              <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Atenção: SG Consultoria</div>
              <div style={{ color: '#64748b', lineHeight: 1.5 }}>
                A receita da SG Consultoria está 15% abaixo da meta mensal. 
                Recomenda-se revisar a estratégia comercial e pipeline de projetos.
              </div>
            </div>

            <div style={{ padding: '20px', borderRadius: '12px', borderLeft: '4px solid #3b82f6', background: '#f0f9ff' }}>
              <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Oportunidade Identificada</div>
              <div style={{ color: '#64748b', lineHeight: 1.5 }}>
                94% dos projetos estão sendo entregues no prazo, indicando alta eficiência operacional. 
                Considere aumentar a capacidade para aproveitar a demanda crescente.
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
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

        @media (max-width: 1200px) {
          .dashboard-section {
            grid-template-columns: 1fr !important;
          }
          
          .detailed-reports {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
          }
          
          .reports-content {
            padding: 20px !important;
          }
          
          .reports-toolbar {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          
          .report-categories {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
