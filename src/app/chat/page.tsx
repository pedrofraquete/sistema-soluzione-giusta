'use client'

import { useState, useEffect } from 'react'

export default function ChatPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentTab, setCurrentTab] = useState('chats')
  const [currentChat, setCurrentChat] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')

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
  }

  interface Employee {
    id: string
    name: string
    avatar: string
    position: string
    company: string
    status: 'online' | 'away' | 'offline'
    lastSeen: Date
  }

  interface Channel {
    id: string
    name: string
    description: string
    type: string
    members: number
    icon: string
  }

  interface Conversation {
    id: string
    type: 'direct' | 'channel'
    participant?: Employee
    channel?: Channel
    lastMessage: string
    lastTime: Date
    unread: number
    isActive: boolean
  }

  interface Message {
    id: number
    sender: string
    content: string
    time: Date
    type: string
  }

  const employees: Employee[] = [
    {
      id: 'pedro',
      name: 'Pedro Fraquete',
      avatar: 'PF',
      position: 'CEO',
      company: 'Soluzione Giusta',
      status: 'online',
      lastSeen: new Date()
    },
    {
      id: 'andre',
      name: 'André Luiz Fernandes',
      avatar: 'AF',
      position: 'Desenvolvedor Sênior',
      company: 'Soluzione Giusta',
      status: 'online',
      lastSeen: new Date(Date.now() - 5 * 60000)
    },
    {
      id: 'caroline',
      name: 'Caroline Lanzilotti',
      avatar: 'CS',
      position: 'Analista Marketing',
      company: 'Innovativa',
      status: 'away',
      lastSeen: new Date(Date.now() - 15 * 60000)
    },
    {
      id: 'renata',
      name: 'Renata Bariani',
      avatar: 'RB',
      position: 'Financeiro & RH',
      company: 'Soluzione Giusta',
      status: 'online',
      lastSeen: new Date(Date.now() - 1 * 60000)
    }
  ]

  const channels: Channel[] = [
    {
      id: 'geral',
      name: '🏢 Geral',
      description: 'Canal principal do grupo',
      type: 'public',
      members: employees.length,
      icon: 'fas fa-users'
    },
    {
      id: 'tech-team',
      name: '💻 Tech Team',
      description: 'Equipe de desenvolvimento',
      type: 'department',
      members: 6,
      icon: 'fas fa-code'
    }
  ]

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-andre',
      type: 'direct',
      participant: employees.find(e => e.id === 'andre'),
      lastMessage: 'O módulo de projetos ficou excelente! Vamos fazer deploy?',
      lastTime: new Date(Date.now() - 5 * 60000),
      unread: 2,
      isActive: false
    },
    {
      id: 'conv-renata',
      type: 'direct',
      participant: employees.find(e => e.id === 'renata'),
      lastMessage: 'Pedro, preciso falar sobre o relatório financeiro',
      lastTime: new Date(Date.now() - 15 * 60000),
      unread: 0,
      isActive: false
    }
  ])

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    'conv-andre': [
      {
        id: 1,
        sender: 'andre',
        content: 'Pedro, terminei de implementar o sistema Kanban no módulo de projetos!',
        time: new Date(Date.now() - 25 * 60000),
        type: 'text'
      },
      {
        id: 2,
        sender: 'pedro',
        content: 'Fantástico André! Como ficou o drag and drop?',
        time: new Date(Date.now() - 20 * 60000),
        type: 'text'
      }
    ]
  })

  const currentUser = 'pedro'

  useEffect(() => {
    // Adicionar Font Awesome
    const link = document.createElement('link')
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'agora'
    if (minutes < 60) return `${minutes}m`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`
    return date.toLocaleDateString()
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online'
      case 'away': return 'Ausente'
      case 'offline': return 'Offline'
      default: return 'Desconhecido'
    }
  }

  const openChat = (chatId: string) => {
    setConversations(prev => prev.map(c => ({
      ...c,
      isActive: c.id === chatId,
      unread: c.id === chatId ? 0 : c.unread
    })))
    setCurrentChat(chatId)
  }

  const sendMessage = () => {
    if (!messageInput.trim() || !currentChat) return

    const newMessage: Message = {
      id: Date.now(),
      sender: currentUser,
      content: messageInput,
      time: new Date(),
      type: 'text'
    }

    setMessages(prev => ({
      ...prev,
      [currentChat]: [...(prev[currentChat] || []), newMessage]
    }))

    setConversations(prev => prev.map(c => 
      c.id === currentChat 
        ? { ...c, lastMessage: messageInput, lastTime: new Date() }
        : c
    ))

    setMessageInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const currentChatData = conversations.find(c => c.id === currentChat)

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: '#f8fafc', color: '#334155', height: '100vh', overflow: 'hidden' }}>
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
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}
        >
          <i className="fas fa-bars"></i>
        </button>
        
        <div style={{ padding: '0 25px 30px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
          <i className="fas fa-rocket" style={{ fontSize: '2.5rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block', marginBottom: '10px' }}></i>
          {!sidebarCollapsed && <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginTop: '10px' }}>Journey 100k</h1>}
        </div>
        
        <ul style={{ listStyle: 'none', padding: '0 15px' }}>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => handleNavigation('Dashboard')} style={{ display: 'flex', alignItems: 'center', padding: '15px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 500 }}>
              <i className="fas fa-chart-pie" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Dashboard</span>}
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => handleNavigation('Funcionários')} style={{ display: 'flex', alignItems: 'center', padding: '15px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 500 }}>
              <i className="fas fa-users" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Funcionários</span>}
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => handleNavigation('Projetos')} style={{ display: 'flex', alignItems: 'center', padding: '15px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 500 }}>
              <i className="fas fa-project-diagram" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Projetos</span>}
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => handleNavigation('Financeiro')} style={{ display: 'flex', alignItems: 'center', padding: '15px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 500 }}>
              <i className="fas fa-dollar-sign" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Financeiro</span>}
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '15px', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '12px', cursor: 'pointer', fontWeight: 500, position: 'relative' }}>
              <i className="fas fa-comments" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Chat</span>}
              <div style={{ position: 'absolute', top: '-2px', right: '8px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '1px solid white' }}></div>
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => handleNavigation('Ponto Digital')} style={{ display: 'flex', alignItems: 'center', padding: '15px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 500 }}>
              <i className="fas fa-clock" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Ponto Digital</span>}
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => handleNavigation('Documentos')} style={{ display: 'flex', alignItems: 'center', padding: '15px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 500 }}>
              <i className="fas fa-file-alt" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Documentos</span>}
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => handleNavigation('Relatórios')} style={{ display: 'flex', alignItems: 'center', padding: '15px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 500 }}>
              <i className="fas fa-chart-bar" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Relatórios</span>}
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => handleNavigation('Gamificação')} style={{ display: 'flex', alignItems: 'center', padding: '15px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 500 }}>
              <i className="fas fa-trophy" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Gamificação</span>}
            </div>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <div onClick={() => handleNavigation('Configurações')} style={{ display: 'flex', alignItems: 'center', padding: '15px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 500 }}>
              <i className="fas fa-cog" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Configurações</span>}
            </div>
          </li>
        </ul>
      </nav>

      {/* CHAT CONTAINER */}
      <div style={{ marginLeft: sidebarCollapsed ? '80px' : '280px', height: '100vh', display: 'flex', transition: 'all 0.3s ease' }}>
        {/* CHAT SIDEBAR */}
        <div style={{ width: '350px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <div style={{ padding: '20px 25px', borderBottom: '1px solid #e2e8f0', background: '#fafbfc' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', marginBottom: '5px' }}>Chat Corporativo</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Comunicação interna do grupo</p>
          </div>
          
          <div style={{ padding: '20px 25px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type="text" 
                placeholder="Buscar conversas..." 
                style={{ 
                  width: '100%', 
                  padding: '12px 45px 12px 15px', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '25px', 
                  fontSize: '0.9rem', 
                  background: '#f8fafc' 
                }}
              />
              <i className="fas fa-search" style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}></i>
            </div>
          </div>
          
          <div style={{ display: 'flex', padding: '0 25px', borderBottom: '1px solid #e2e8f0' }}>
            <div 
              onClick={() => setCurrentTab('chats')}
              style={{ 
                flex: 1, 
                padding: '15px 0', 
                textAlign: 'center', 
                cursor: 'pointer', 
                fontWeight: 600, 
                color: currentTab === 'chats' ? '#3b82f6' : '#64748b', 
                borderBottom: currentTab === 'chats' ? '2px solid #3b82f6' : '2px solid transparent',
                fontSize: '0.9rem' 
              }}
            >
              Conversas
            </div>
            <div 
              onClick={() => setCurrentTab('channels')}
              style={{ 
                flex: 1, 
                padding: '15px 0', 
                textAlign: 'center', 
                cursor: 'pointer', 
                fontWeight: 600, 
                color: currentTab === 'channels' ? '#3b82f6' : '#64748b', 
                borderBottom: currentTab === 'channels' ? '2px solid #3b82f6' : '2px solid transparent',
                fontSize: '0.9rem' 
              }}
            >
              Canais
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
            {conversations.filter(c => currentTab === 'chats' ? c.type === 'direct' : c.type === 'channel').map(chat => (
              <div 
                key={chat.id}
                onClick={() => openChat(chat.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '15px 25px', 
                  cursor: 'pointer', 
                  background: chat.isActive ? 'linear-gradient(135deg, #e0f2fe, #f0f9ff)' : 'transparent',
                  borderRight: chat.isActive ? '3px solid #3b82f6' : 'none'
                }}
              >
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 700, 
                  fontSize: '1.1rem', 
                  marginRight: '15px',
                  position: 'relative'
                }}>
                  {chat.type === 'direct' ? chat.participant?.avatar : chat.channel?.name.substring(0, 2)}
                  {chat.type === 'direct' && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '2px', 
                      right: '2px', 
                      width: '14px', 
                      height: '14px', 
                      borderRadius: '50%', 
                      border: '2px solid white',
                      background: chat.participant?.status === 'online' ? '#10b981' : chat.participant?.status === 'away' ? '#f59e0b' : '#6b7280'
                    }}></div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '2px', fontSize: '0.95rem' }}>
                    {chat.type === 'direct' ? chat.participant?.name : chat.channel?.name}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {chat.lastMessage}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{formatTime(chat.lastTime)}</div>
                  {chat.unread > 0 && (
                    <div style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600, minWidth: '18px', textAlign: 'center' }}>
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CHAT */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
          {!currentChat ? (
            <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{ textAlign: 'center', color: '#64748b' }}>
                <i className="fas fa-comments" style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.3 }}></i>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#374151' }}>Bem-vindo ao Chat Corporativo</h3>
                <p style={{ fontSize: '1rem' }}>Selecione uma conversa para começar</p>
              </div>
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}
              <div style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 700, 
                    fontSize: '1.1rem',
                    position: 'relative'
                  }}>
                    {currentChatData?.type === 'direct' ? currentChatData.participant?.avatar : currentChatData?.channel?.name.substring(0, 2)}
                    {currentChatData?.type === 'direct' && (
                      <div style={{ 
                        position: 'absolute', 
                        bottom: '2px', 
                        right: '2px', 
                        width: '14px', 
                        height: '14px', 
                        borderRadius: '50%', 
                        border: '2px solid white',
                        background: currentChatData.participant?.status === 'online' ? '#10b981' : currentChatData.participant?.status === 'away' ? '#f59e0b' : '#6b7280'
                      }}></div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '2px' }}>
                      {currentChatData?.type === 'direct' ? currentChatData.participant?.name : currentChatData?.channel?.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {currentChatData?.type === 'direct' ? (
                        <>
                          <i className={`fas fa-circle ${currentChatData.participant?.status}`}></i>
                          {getStatusText(currentChatData.participant?.status || '')}
                        </>
                      ) : (
                        <>
                          <i className="fas fa-users"></i>
                          {currentChatData?.channel?.members} membros
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{ width: '40px', height: '40px', border: 'none', borderRadius: '50%', background: '#f8fafc', color: '#64748b', cursor: 'pointer' }}>
                    <i className="fas fa-phone"></i>
                  </button>
                  <button style={{ width: '40px', height: '40px', border: 'none', borderRadius: '50%', background: '#f8fafc', color: '#64748b', cursor: 'pointer' }}>
                    <i className="fas fa-video"></i>
                  </button>
                  <button style={{ width: '40px', height: '40px', border: 'none', borderRadius: '50%', background: '#f8fafc', color: '#64748b', cursor: 'pointer' }}>
                    <i className="fas fa-info-circle"></i>
                  </button>
                </div>
              </div>

              {/* MESSAGES */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 30px', background: '#fafbfc' }}>
                {(messages[currentChat] || []).map(message => {
                  const sender = employees.find(e => e.id === message.sender)
                  const isSent = message.sender === currentUser
                  
                  return (
                    <div key={message.id} style={{ display: 'flex', marginBottom: '20px', justifyContent: isSent ? 'flex-end' : 'flex-start' }}>
                      <div style={{ 
                        width: '35px', 
                        height: '35px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
                        color: 'white', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: 600, 
                        fontSize: '0.8rem', 
                        margin: '0 10px',
                        order: isSent ? 2 : 0
                      }}>
                        {sender?.avatar}
                      </div>
                      <div style={{ maxWidth: '60%' }}>
                        <div style={{ 
                          padding: '12px 18px', 
                          borderRadius: '18px', 
                          fontSize: '0.95rem', 
                          lineHeight: 1.4,
                          background: isSent ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'white',
                          color: isSent ? 'white' : '#1e293b',
                          border: isSent ? 'none' : '1px solid #e2e8f0',
                          borderBottomRightRadius: isSent ? '4px' : '18px',
                          borderBottomLeftRadius: isSent ? '18px' : '4px'
                        }}>
                          {message.content}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '5px', textAlign: isSent ? 'right' : 'left' }}>
                          {formatTime(message.time)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* MESSAGE INPUT */}
              <div style={{ padding: '20px 30px', background: 'white', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '25px', padding: '15px 20px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button style={{ width: '32px', height: '32px', border: 'none', borderRadius: '50%', background: 'transparent', color: '#64748b', cursor: 'pointer' }}>
                      <i className="fas fa-paperclip"></i>
                    </button>
                    <button style={{ width: '32px', height: '32px', border: 'none', borderRadius: '50%', background: 'transparent', color: '#64748b', cursor: 'pointer' }}>
                      <i className="fas fa-smile"></i>
                    </button>
                  </div>
                  <textarea 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..." 
                    style={{ 
                      flex: 1, 
                      border: 'none', 
                      background: 'transparent', 
                      fontSize: '0.95rem', 
                      resize: 'none', 
                      maxHeight: '120px', 
                      lineHeight: 1.4, 
                      color: '#1e293b',
                      outline: 'none'
                    }}
                    rows={1}
                  />
                  <button 
                    onClick={sendMessage}
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      border: 'none', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                      color: 'white', 
                      cursor: 'pointer' 
                    }}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
