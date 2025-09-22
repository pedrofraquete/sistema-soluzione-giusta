'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MCPDashboard from '../../components/mcp/MCPDashboard'

export default function AdminMCPPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [sqlQuery, setSqlQuery] = useState('')
  const [migrationName, setMigrationName] = useState('')
  const [migrationQuery, setMigrationQuery] = useState('')

  // Função de navegação padronizada
  const handleNavigation = (path: string) => {
    router.push(path)
  }

  // Executar SQL via MCP
  const executeSql = async () => {
    if (!sqlQuery.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/mcp/execute-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQuery })
      })
      
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Erro ao executar SQL:', error)
      setResults({ error: 'Erro ao executar consulta' })
    } finally {
      setIsLoading(false)
    }
  }

  // Aplicar migração via MCP
  const applyMigration = async () => {
    if (!migrationName.trim() || !migrationQuery.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/mcp/apply-migration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: migrationName,
          query: migrationQuery 
        })
      })
      
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Erro ao aplicar migração:', error)
      setResults({ error: 'Erro ao aplicar migração' })
    } finally {
      setIsLoading(false)
    }
  }

  // Listar tabelas via MCP
  const listTables = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/mcp/list-tables', {
        method: 'GET'
      })
      
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Erro ao listar tabelas:', error)
      setResults({ error: 'Erro ao listar tabelas' })
    } finally {
      setIsLoading(false)
    }
  }

  // Obter logs via MCP
  const getLogs = async (service: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/mcp/get-logs?service=${service}`, {
        method: 'GET'
      })
      
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Erro ao obter logs:', error)
      setResults({ error: 'Erro ao obter logs' })
    } finally {
      setIsLoading(false)
    }
  }

  // Obter advisors via MCP
  const getAdvisors = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/mcp/get-advisors', {
        method: 'GET'
      })
      
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Erro ao obter advisors:', error)
      setResults({ error: 'Erro ao obter advisors' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      color: '#ffffff',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            margin: 0,
            background: 'linear-gradient(45deg, #ffffff, #cccccc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🔧 Administração MCP
          </h1>
          <p style={{ 
            fontSize: '0.9rem', 
            color: '#cccccc', 
            margin: '0.25rem 0 0 0' 
          }}>
            Gerenciamento avançado via Model Context Protocol
          </p>
        </div>

        {/* Navegação */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { path: '/dashboard', label: '🏠 Dashboard' },
            { path: '/funcionarios', label: '👥 Funcionários' },
            { path: '/projetos', label: '📋 Projetos' },
            { path: '/financeiro', label: '💰 Financeiro' },
            { path: '/chat', label: '💬 Chat' },
            { path: '/ponto', label: '⏰ Ponto' },
            { path: '/documentos', label: '📄 Documentos' },
            { path: '/relatorios', label: '📈 Relatórios' },
            { path: '/gamificacao', label: '🏆 Gamificação' },
            { path: '/configuracoes', label: '⚙️ Configurações' }
          ].map(item => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div style={{ padding: '2rem' }}>
        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
            { id: 'database', label: '🗄️ Banco de Dados', icon: '🗄️' },
            { id: 'migrations', label: '🔄 Migrações', icon: '🔄' },
            { id: 'logs', label: '📋 Logs', icon: '📋' },
            { id: 'advisors', label: '⚠️ Advisors', icon: '⚠️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id 
                  ? 'linear-gradient(45deg, #4f46e5, #7c3aed)' 
                  : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo das Tabs */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Tab: Dashboard */}
          {activeTab === 'dashboard' && (
            <MCPDashboard />
          )}

          {/* Tab: Banco de Dados */}
          {activeTab === 'database' && (
            <div>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem',
                color: '#ffffff'
              }}>
                🗄️ Gerenciamento do Banco de Dados
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Executar SQL */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#ffffff' }}>
                    📝 Executar SQL
                  </h3>
                  <textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="SELECT * FROM companies LIMIT 10;"
                    style={{
                      width: '100%',
                      height: '120px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace',
                      resize: 'vertical'
                    }}
                  />
                  <button
                    onClick={executeSql}
                    disabled={isLoading || !sqlQuery.trim()}
                    style={{
                      background: 'linear-gradient(45deg, #10b981, #059669)',
                      border: 'none',
                      color: '#ffffff',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '6px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      marginTop: '1rem',
                      opacity: isLoading || !sqlQuery.trim() ? 0.6 : 1,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isLoading ? '⏳ Executando...' : '▶️ Executar SQL'}
                  </button>
                </div>

                {/* Ações Rápidas */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#ffffff' }}>
                    ⚡ Ações Rápidas
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                      onClick={listTables}
                      disabled={isLoading}
                      style={{
                        background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
                        border: 'none',
                        color: '#ffffff',
                        padding: '0.75rem 1rem',
                        borderRadius: '6px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        opacity: isLoading ? 0.6 : 1,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      📋 Listar Tabelas
                    </button>
                    <button
                      onClick={() => setSqlQuery('SELECT COUNT(*) as total_companies FROM companies;')}
                      style={{
                        background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                        border: 'none',
                        color: '#ffffff',
                        padding: '0.75rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      🏢 Contar Empresas
                    </button>
                    <button
                      onClick={() => setSqlQuery('SELECT COUNT(*) as total_employees FROM employees;')}
                      style={{
                        background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                        border: 'none',
                        color: '#ffffff',
                        padding: '0.75rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      👥 Contar Funcionários
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Migrações */}
          {activeTab === 'migrations' && (
            <div>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem',
                color: '#ffffff'
              }}>
                🔄 Gerenciamento de Migrações
              </h2>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#ffffff' }}>
                  📝 Nova Migração
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cccccc' }}>
                    Nome da Migração:
                  </label>
                  <input
                    type="text"
                    value={migrationName}
                    onChange={(e) => setMigrationName(e.target.value)}
                    placeholder="add_new_table_example"
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      color: '#ffffff',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cccccc' }}>
                    SQL da Migração:
                  </label>
                  <textarea
                    value={migrationQuery}
                    onChange={(e) => setMigrationQuery(e.target.value)}
                    placeholder="CREATE TABLE example (id UUID PRIMARY KEY DEFAULT gen_random_uuid());"
                    style={{
                      width: '100%',
                      height: '150px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <button
                  onClick={applyMigration}
                  disabled={isLoading || !migrationName.trim() || !migrationQuery.trim()}
                  style={{
                    background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                    border: 'none',
                    color: '#ffffff',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    cursor: isLoading || !migrationName.trim() || !migrationQuery.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    opacity: isLoading || !migrationName.trim() || !migrationQuery.trim() ? 0.6 : 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isLoading ? '⏳ Aplicando...' : '🚀 Aplicar Migração'}
                </button>
              </div>
            </div>
          )}

          {/* Tab: Logs */}
          {activeTab === 'logs' && (
            <div>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem',
                color: '#ffffff'
              }}>
                📋 Logs do Sistema
              </h2>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {['postgres', 'auth', 'realtime', 'storage', 'edge'].map(service => (
                  <button
                    key={service}
                    onClick={() => getLogs(service)}
                    disabled={isLoading}
                    style={{
                      background: 'linear-gradient(45deg, #6366f1, #4f46e5)',
                      border: 'none',
                      color: '#ffffff',
                      padding: '0.75rem 1rem',
                      borderRadius: '6px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      opacity: isLoading ? 0.6 : 1,
                      transition: 'all 0.3s ease',
                      textTransform: 'capitalize'
                    }}
                  >
                    📋 {service}
                  </button>
                ))}
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: '300px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: '#cccccc',
                overflow: 'auto'
              }}>
                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    ⏳ Carregando logs...
                  </div>
                ) : results ? (
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(results, null, 2)}
                  </pre>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    Selecione um serviço para visualizar os logs
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Advisors */}
          {activeTab === 'advisors' && (
            <div>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem',
                color: '#ffffff'
              }}>
                ⚠️ Advisors de Segurança
              </h2>

              <div style={{ marginBottom: '1.5rem' }}>
                <button
                  onClick={getAdvisors}
                  disabled={isLoading}
                  style={{
                    background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                    border: 'none',
                    color: '#ffffff',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    opacity: isLoading ? 0.6 : 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isLoading ? '⏳ Verificando...' : '🔍 Verificar Advisors'}
                </button>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '8px',
                padding: '1.5rem',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                minHeight: '300px'
              }}>
                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    ⏳ Verificando advisors de segurança...
                  </div>
                ) : results ? (
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#ffffff' }}>
                    {JSON.stringify(results, null, 2)}
                  </pre>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#f59e0b' }}>
                    ⚠️ Clique em "Verificar Advisors" para analisar possíveis problemas de segurança
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Resultados */}
        {results && activeTab !== 'dashboard' && (
          <div style={{
            marginTop: '2rem',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#ffffff' }}>
              📊 Resultados
            </h3>
            <pre style={{ 
              margin: 0, 
              whiteSpace: 'pre-wrap', 
              color: '#cccccc',
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              maxHeight: '400px',
              overflow: 'auto'
            }}>
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
