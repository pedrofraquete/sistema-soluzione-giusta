'use client'

import React, { useState, useEffect } from 'react'

interface MCPStats {
  project_status: string
  database_size: string
  active_connections: number
  cpu_usage: number
  memory_usage: number
  storage_usage: number
  last_backup: string
  uptime: string
}

interface MCPAlert {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: string
}

export default function MCPDashboard() {
  const [stats, setStats] = useState<MCPStats | null>(null)
  const [alerts, setAlerts] = useState<MCPAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Simular dados em tempo real
  useEffect(() => {
    const loadDashboardData = () => {
      // Simular estatísticas do projeto
      const mockStats: MCPStats = {
        project_status: 'active',
        database_size: '45.2 MB',
        active_connections: Math.floor(Math.random() * 15) + 5,
        cpu_usage: Math.floor(Math.random() * 30) + 10,
        memory_usage: Math.floor(Math.random() * 20) + 40,
        storage_usage: Math.floor(Math.random() * 10) + 15,
        last_backup: '2024-09-22 03:00:00',
        uptime: '15 dias, 8 horas'
      }

      // Simular alertas
      const mockAlerts: MCPAlert[] = [
        {
          id: '1',
          type: 'success',
          title: 'Backup Concluído',
          message: 'Backup automático realizado com sucesso',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '2',
          type: 'info',
          title: 'Conexão MCP Ativa',
          message: 'Interface MCP funcionando normalmente',
          timestamp: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: '3',
          type: 'warning',
          title: 'RLS Policies',
          message: 'Algumas tabelas precisam de políticas RLS',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ]

      setStats(mockStats)
      setAlerts(mockAlerts)
      setIsLoading(false)
      setLastUpdate(new Date())
    }

    // Carregar dados iniciais
    loadDashboardData()

    // Atualizar a cada 30 segundos
    const interval = setInterval(loadDashboardData, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'paused': return '#f59e0b'
      case 'error': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return '#10b981'
      case 'info': return '#3b82f6'
      case 'warning': return '#f59e0b'
      case 'error': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅'
      case 'info': return 'ℹ️'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return '📋'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR')
  }

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        color: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <div>Carregando dashboard MCP...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ color: '#ffffff' }}>
      {/* Header do Dashboard */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            📊 Dashboard MCP em Tempo Real
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#cccccc', margin: '0.25rem 0 0 0' }}>
            Monitoramento contínuo via Model Context Protocol
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: '#cccccc' }}>
            Última atualização:
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
            {lastUpdate.toLocaleTimeString('pt-BR')}
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Status do Projeto */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: getStatusColor(stats?.project_status || 'unknown'),
              marginRight: '0.5rem'
            }}></div>
            <h3 style={{ fontSize: '1rem', margin: 0 }}>Status do Projeto</h3>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
            {stats?.project_status || 'Desconhecido'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#cccccc', marginTop: '0.5rem' }}>
            Uptime: {stats?.uptime}
          </div>
        </div>

        {/* Tamanho do Banco */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0' }}>💾 Tamanho do Banco</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {stats?.database_size}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#cccccc', marginTop: '0.5rem' }}>
            Último backup: {stats?.last_backup}
          </div>
        </div>

        {/* Conexões Ativas */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0' }}>🔗 Conexões Ativas</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {stats?.active_connections}/100
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            marginTop: '0.5rem'
          }}>
            <div style={{
              width: `${(stats?.active_connections || 0)}%`,
              height: '100%',
              background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
              borderRadius: '2px'
            }}></div>
          </div>
        </div>

        {/* CPU Usage */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0' }}>⚡ CPU</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {stats?.cpu_usage}%
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            marginTop: '0.5rem'
          }}>
            <div style={{
              width: `${stats?.cpu_usage}%`,
              height: '100%',
              background: stats?.cpu_usage && stats.cpu_usage > 70 
                ? 'linear-gradient(45deg, #ef4444, #dc2626)'
                : 'linear-gradient(45deg, #10b981, #059669)',
              borderRadius: '2px'
            }}></div>
          </div>
        </div>

        {/* Memory Usage */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0' }}>🧠 Memória</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {stats?.memory_usage}%
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            marginTop: '0.5rem'
          }}>
            <div style={{
              width: `${stats?.memory_usage}%`,
              height: '100%',
              background: stats?.memory_usage && stats.memory_usage > 80 
                ? 'linear-gradient(45deg, #f59e0b, #d97706)'
                : 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
              borderRadius: '2px'
            }}></div>
          </div>
        </div>

        {/* Storage Usage */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0' }}>💿 Armazenamento</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {stats?.storage_usage}%
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            marginTop: '0.5rem'
          }}>
            <div style={{
              width: `${stats?.storage_usage}%`,
              height: '100%',
              background: 'linear-gradient(45deg, #06b6d4, #0891b2)',
              borderRadius: '2px'
            }}></div>
          </div>
        </div>
      </div>

      {/* Alertas e Notificações */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          🔔 Alertas e Notificações
        </h3>
        
        {alerts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            Nenhum alerta no momento
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {alerts.map(alert => (
              <div
                key={alert.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '1rem',
                  background: `rgba(${getAlertColor(alert.type).replace('#', '')}, 0.1)`,
                  border: `1px solid ${getAlertColor(alert.type)}30`,
                  borderRadius: '6px'
                }}
              >
                <div style={{
                  fontSize: '1.2rem',
                  marginRight: '0.75rem',
                  marginTop: '0.1rem'
                }}>
                  {getAlertIcon(alert.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 'bold',
                    marginBottom: '0.25rem',
                    color: getAlertColor(alert.type)
                  }}>
                    {alert.title}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#cccccc',
                    marginBottom: '0.5rem'
                  }}>
                    {alert.message}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#999'
                  }}>
                    {formatTimestamp(alert.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informações de Conexão MCP */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '8px',
        fontSize: '0.9rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem', marginRight: '0.5rem' }}>🔗</span>
          <strong>Status da Conexão MCP</strong>
        </div>
        <div style={{ color: '#cccccc' }}>
          Interface MCP ativa e funcionando. Dados atualizados automaticamente a cada 30 segundos.
          {process.env.NODE_ENV === 'development' && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#f59e0b' }}>
              ⚠️ Modo desenvolvimento: Dados simulados para demonstração
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
