'use client';

import React, { useState, useEffect } from 'react';

interface SettingsState {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  compactSidebar: boolean;
  animations: boolean;
  notifications: {
    newProjects: boolean;
    chatMessages: boolean;
    automaticReports: boolean;
    achievements: boolean;
    weeklyDigest: boolean;
    financialAlerts: boolean;
    businessHours: boolean;
  };
}

export default function ConfiguracoesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState<SettingsState>({
    theme: 'light',
    primaryColor: '#3b82f6',
    compactSidebar: false,
    animations: true,
    notifications: {
      newProjects: true,
      chatMessages: true,
      automaticReports: false,
      achievements: true,
      weeklyDigest: true,
      financialAlerts: true,
      businessHours: true
    }
  });

  const [userProfile, setUserProfile] = useState({
    name: 'Pedro Fraquete',
    email: 'pedro@soluzionegiusta.com.br',
    phone: '(11) 99999-9999',
    position: 'CEO',
    department: 'Diretoria',
    company: 'Soluzione Giusta',
    bio: 'CEO e fundador da Soluzione Giusta, especialista em transformação digital e gestão empresarial.',
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR'
  });

  useEffect(() => {
    // Adicionar Font Awesome
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Notificação de boas-vindas
    setTimeout(() => {
      showNotification('Configurações carregadas com sucesso!', 'success');
    }, 1000);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 15px 25px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      z-index: 10000;
      font-weight: 600;
      transform: translateX(400px);
      transition: all 0.3s ease;
      max-width: 350px;
    `;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check' : type === 'warning' ? 'exclamation' : type === 'error' ? 'times' : 'info'}"></i>
      ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 5000);
  };

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
    };
    
    if (routes[module]) {
      window.location.href = routes[module];
    } else {
      showNotification(`Navegando para: ${module}`, 'info');
    }
  };

  const toggleSwitch = (key: string, subKey?: string) => {
    if (subKey) {
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [subKey]: !prev.notifications[subKey as keyof typeof prev.notifications]
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [key]: !prev[key as keyof SettingsState]
      }));
    }
  };

  const changeTheme = (theme: 'light' | 'dark' | 'auto') => {
    setSettings(prev => ({ ...prev, theme }));
    showNotification(`Tema alterado para: ${theme === 'light' ? 'Claro' : theme === 'dark' ? 'Escuro' : 'Automático'}`, 'info');
  };

  const changePrimaryColor = (color: string) => {
    setSettings(prev => ({ ...prev, primaryColor: color }));
    showNotification('Cor principal alterada!', 'success');
  };

  const saveSettings = (section: string) => {
    showNotification(`Configurações de ${section} salvas com sucesso!`, 'success');
  };

  const saveProfile = () => {
    showNotification('Perfil atualizado com sucesso!', 'success');
  };

  const resetSettings = () => {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      setSettings({
        theme: 'light',
        primaryColor: '#3b82f6',
        compactSidebar: false,
        animations: true,
        notifications: {
          newProjects: true,
          chatMessages: true,
          automaticReports: false,
          achievements: true,
          weeklyDigest: true,
          financialAlerts: true,
          businessHours: true
        }
      });
      showNotification('Configurações restauradas para o padrão!', 'success');
    }
  };

  const exportData = () => {
    showNotification('Exportação iniciada! Você receberá um email com os dados.', 'info');
  };

  const colors = [
    { color: '#3b82f6', name: 'Azul' },
    { color: '#10b981', name: 'Verde' },
    { color: '#f59e0b', name: 'Amarelo' },
    { color: '#ef4444', name: 'Vermelho' },
    { color: '#8b5cf6', name: 'Roxo' },
    { color: '#06b6d4', name: 'Ciano' }
  ];

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-chart-pie', active: true, description: 'Visão geral do sistema' },
    { id: 'funcionarios', name: 'Funcionários', icon: 'fas fa-users', active: true, description: 'Gestão de equipe' },
    { id: 'projetos', name: 'Projetos', icon: 'fas fa-project-diagram', active: true, description: 'Controle de projetos' },
    { id: 'financeiro', name: 'Financeiro', icon: 'fas fa-dollar-sign', active: true, description: 'Gestão financeira' },
    { id: 'chat', name: 'Chat', icon: 'fas fa-comments', active: true, description: 'Comunicação interna' },
    { id: 'ponto', name: 'Ponto Digital', icon: 'fas fa-clock', active: true, description: 'Controle de presença' },
    { id: 'documentos', name: 'Documentos', icon: 'fas fa-file-alt', active: true, description: 'Gestão documental' },
    { id: 'relatorios', name: 'Relatórios', icon: 'fas fa-chart-bar', active: true, description: 'Análises e relatórios' },
    { id: 'gamificacao', name: 'Gamificação', icon: 'fas fa-trophy', active: true, description: 'Sistema de conquistas' },
    { id: 'configuracoes', name: 'Configurações', icon: 'fas fa-cog', active: true, description: 'Configurações do sistema' }
  ];

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
          {[
            { name: 'Dashboard', icon: 'fas fa-chart-pie' },
            { name: 'Funcionários', icon: 'fas fa-users' },
            { name: 'Projetos', icon: 'fas fa-project-diagram' },
            { name: 'Financeiro', icon: 'fas fa-dollar-sign', notification: true },
            { name: 'Chat', icon: 'fas fa-comments', notification: true },
            { name: 'Ponto Digital', icon: 'fas fa-clock' },
            { name: 'Documentos', icon: 'fas fa-file-alt' },
            { name: 'Relatórios', icon: 'fas fa-chart-bar' },
            { name: 'Gamificação', icon: 'fas fa-trophy' }
          ].map((item) => (
            <li key={item.name} style={{ marginBottom: '8px' }}>
              <div onClick={() => handleNavigation(item.name)} style={{
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
                <i className={item.icon} style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
                {!sidebarCollapsed && <span>{item.name}</span>}
                {item.notification && (
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
                )}
              </div>
            </li>
          ))}
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
              <i className="fas fa-cog" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Configurações</span>}
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
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '5px' }}>Configurações do Sistema</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Personalize sua experiência no Journey 100k</p>
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
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>CEO • Super Admin</p>
            </div>
          </div>
        </header>

        {/* SETTINGS CONTENT */}
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 100px)' }}>
          {/* SETTINGS SIDEBAR */}
          <div style={{
            width: '300px',
            background: 'white',
            borderRight: '1px solid #e2e8f0',
            padding: '30px 0'
          }}>
            <div style={{ padding: '0 30px', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Configurações</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Gerencie suas preferências</p>
            </div>

            <nav>
              {[
                { id: 'profile', name: 'Perfil', icon: 'fas fa-user' },
                { id: 'appearance', name: 'Aparência', icon: 'fas fa-paint-brush' },
                { id: 'notifications', name: 'Notificações', icon: 'fas fa-bell' },
                { id: 'modules', name: 'Módulos', icon: 'fas fa-th-large' },
                { id: 'security', name: 'Segurança', icon: 'fas fa-shield-alt' },
                { id: 'data', name: 'Dados', icon: 'fas fa-database' }
              ].map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px 30px',
                    cursor: 'pointer',
                    borderLeft: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent',
                    background: activeTab === tab.id ? '#f8fafc' : 'transparent',
                    color: activeTab === tab.id ? '#3b82f6' : '#64748b',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className={tab.icon} style={{ fontSize: '1.1rem', marginRight: '15px', minWidth: '20px' }}></i>
                  <span style={{ fontWeight: activeTab === tab.id ? 600 : 500 }}>{tab.name}</span>
                </div>
              ))}
            </nav>
          </div>

          {/* SETTINGS PANELS */}
          <div style={{ flex: 1, padding: '40px' }}>
            {/* PROFILE PANEL */}
            {activeTab === 'profile' && (
              <div>
                <div style={{ marginBottom: '40px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Informações do Perfil</h2>
                  <p style={{ color: '#64748b' }}>Gerencie suas informações pessoais e profissionais</p>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '30px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  marginBottom: '30px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: 800,
                      marginRight: '20px'
                    }}>PF</div>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', marginBottom: '5px' }}>{userProfile.name}</h3>
                      <p style={{ color: '#64748b', marginBottom: '5px' }}>{userProfile.position} • {userProfile.company}</p>
                      <button style={{
                        background: 'none',
                        border: '1px solid #3b82f6',
                        color: '#3b82f6',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 500
                      }}>
                        Alterar Foto
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.95rem',
                          transition: 'border-color 0.3s ease'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.95rem',
                          transition: 'border-color 0.3s ease'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                        Telefone
                      </label>
                      <input
                        type="tel"
                        value={userProfile.phone}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.95rem',
                          transition: 'border-color 0.3s ease'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                        Cargo
                      </label>
                      <input
                        type="text"
                        value={userProfile.position}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, position: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.95rem',
                          transition: 'border-color 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                      Biografia
                    </label>
                    <textarea
                      value={userProfile.bio}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        resize: 'vertical',
                        transition: 'border-color 0.3s ease'
                      }}
                    />
                  </div>

                  <div style={{ textAlign: 'right', marginTop: '30px' }}>
                    <button
                      onClick={saveProfile}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* APPEARANCE PANEL */}
            {activeTab === 'appearance' && (
              <div>
                <div style={{ marginBottom: '40px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Aparência</h2>
                  <p style={{ color: '#64748b' }}>Personalize a aparência do sistema</p>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '30px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  marginBottom: '30px'
                }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.1rem'
                    }}>
                      <i className="fas fa-paint-brush"></i>
                    </div>
                    Tema do Sistema
                  </h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '5px' }}>Tema</div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Escolha entre tema claro ou escuro</div>
                    </div>
                    <select
                      value={settings.theme}
                      onChange={(e) => changeTheme(e.target.value as 'light' | 'dark' | 'auto')}
                      style={{
                        padding: '10px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        minWidth: '150px'
                      }}
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Escuro</option>
                      <option value="auto">Automático</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '5px' }}>Cor Principal</div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Cor de destaque do sistema</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {colors.map((colorOption) => (
                        <div
                          key={colorOption.color}
                          onClick={() => changePrimaryColor(colorOption.color)}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: colorOption.color,
                            cursor: 'pointer',
                            border: settings.primaryColor === colorOption.color ? '3px solid #1e293b' : '3px solid transparent',
                            transition: 'all 0.3s ease',
                            transform: settings.primaryColor === colorOption.color ? 'scale(1.1)' : 'scale(1)'
                          }}
                          title={colorOption.name}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '5px' }}>Sidebar Compacta</div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Manter sidebar sempre compacta</div>
                    </div>
                    <div
                      onClick={() => toggleSwitch('compactSidebar')}
                      style={{
                        width: '50px',
                        height: '26px',
                        borderRadius: '13px',
                        background: settings.compactSidebar ? '#3b82f6' : '#d1d5db',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: 'white',
                        position: 'absolute',
                        top: '2px',
                        left: settings.compactSidebar ? '26px' : '2px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '5px' }}>Animações</div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Ativar animações da interface</div>
                    </div>
                    <div
                      onClick={() => toggleSwitch('animations')}
                      style={{
                        width: '50px',
                        height: '26px',
                        borderRadius: '13px',
                        background: settings.animations ? '#3b82f6' : '#d1d5db',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: 'white',
                        position: 'absolute',
                        top: '2px',
                        left: settings.animations ? '26px' : '2px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}></div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', marginTop: '30px' }}>
                    <button
                      onClick={() => saveSettings('aparência')}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS PANEL */}
            {activeTab === 'notifications' && (
              <div>
                <div style={{ marginBottom: '40px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Notificações</h2>
                  <p style={{ color: '#64748b' }}>Configure como e quando receber notificações</p>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '30px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  marginBottom: '30px'
                }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.1rem'
                    }}>
                      <i className="fas fa-bell"></i>
                    </div>
                    Notificações Push
                  </h3>

                  {[
                    { key: 'newProjects', label: 'Novos Projetos', description: 'Quando novos projetos forem criados' },
                    { key: 'chatMessages', label: 'Mensagens do Chat', description: 'Para mensagens diretas e menções' },
                    { key: 'automaticReports', label: 'Relatórios Automáticos', description: 'Quando relatórios forem gerados' },
                    { key: 'achievements', label: 'Conquistas', description: 'Para novas conquistas desbloqueadas' }
                  ].map((notification) => (
                    <div key={notification.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '5px' }}>{notification.label}</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{notification.description}</div>
                      </div>
                      <div
                        onClick={() => toggleSwitch('notifications', notification.key)}
                        style={{
                          width: '50px',
                          height: '26px',
                          borderRadius: '13px',
                          background: settings.notifications[notification.key as keyof typeof settings.notifications] ? '#3b82f6' : '#d1d5db',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: 'white',
                          position: 'absolute',
                          top: '2px',
                          left: settings.notifications[notification.key as keyof typeof settings.notifications] ? '26px' : '2px',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}></div>
                      </div>
                    </div>
                  ))}

                  <div style={{ textAlign: 'right', marginTop: '30px' }}>
                    <button
                      onClick={() => saveSettings('notificações')}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODULES PANEL */}
            {activeTab === 'modules' && (
              <div>
                <div style={{ marginBottom: '40px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Módulos do Sistema</h2>
                  <p style={{ color: '#64748b' }}>Gerencie os módulos ativos do Journey 100k</p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '20px',
                  marginBottom: '30px'
                }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>Versão do Sistema</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>Journey 100k v2.0</div>
                  </div>
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>Módulos Ativos</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981' }}>10 de 10</div>
                  </div>
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>Última Atualização</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>22/09/2025</div>
                  </div>
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>Próxima Manutenção</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b' }}>01/10/2025</div>
                  </div>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '30px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>Módulos Disponíveis</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {modules.map((module) => (
                      <div key={module.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '20px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease'
                      }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '12px',
                          background: module.active ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: module.active ? 'white' : '#64748b',
                          fontSize: '1.2rem',
                          marginRight: '15px'
                        }}>
                          <i className={module.icon}></i>
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '5px' }}>{module.name}</h4>
                          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{module.description}</p>
                        </div>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: module.active ? '#10b981' : '#ef4444'
                        }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY PANEL */}
            {activeTab === 'security' && (
              <div>
                <div style={{ marginBottom: '40px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Segurança</h2>
                  <p style={{ color: '#64748b' }}>Gerencie suas configurações de segurança</p>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '30px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  marginBottom: '30px'
                }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>Alterar Senha</h3>
                  
                  <div style={{ display: 'grid', gap: '20px', maxWidth: '400px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                        Senha Atual
                      </label>
                      <input
                        type="password"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                        Nova Senha
                      </label>
                      <input
                        type="password"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                        Confirmar Nova Senha
                      </label>
                      <input
                        type="password"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>
                    <button
                      onClick={() => showNotification('Senha alterada com sucesso!', 'success')}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Alterar Senha
                    </button>
                  </div>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '30px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>Sessões Ativas</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {[
                      { device: 'Chrome - Windows', location: 'São Paulo, Brasil', current: true, time: 'Agora' },
                      { device: 'Safari - iPhone', location: 'São Paulo, Brasil', current: false, time: '2h atrás' },
                      { device: 'Edge - Windows', location: 'São Paulo, Brasil', current: false, time: '1 dia atrás' }
                    ].map((session, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}>
                        <div>
                          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
                            {session.device} {session.current && <span style={{ color: '#10b981' }}>(Atual)</span>}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{session.location} • {session.time}</div>
                        </div>
                        {!session.current && (
                          <button style={{
                            background: 'none',
                            border: '1px solid #ef4444',
                            color: '#ef4444',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}>
                            Encerrar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DATA PANEL */}
            {activeTab === 'data' && (
              <div>
                <div style={{ marginBottom: '40px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Dados</h2>
                  <p style={{ color: '#64748b' }}>Gerencie seus dados e configurações do sistema</p>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '30px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  marginBottom: '30px'
                }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>Exportar Dados</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    <div style={{
                      padding: '20px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <i className="fas fa-download" style={{ fontSize: '2rem', color: '#3b82f6', marginBottom: '15px' }}></i>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '10px' }}>Dados Completos</h4>
                      <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '15px' }}>Exportar todos os seus dados do sistema</p>
                      <button
                        onClick={exportData}
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Exportar
                      </button>
                    </div>
                    <div style={{
                      padding: '20px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <i className="fas fa-undo" style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '15px' }}></i>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '10px' }}>Restaurar Padrão</h4>
                      <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '15px' }}>Restaurar configurações padrão</p>
                      <button
                        onClick={resetSettings}
                        style={{
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Restaurar
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '16px',
                  padding: '30px'
                }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#dc2626', marginBottom: '15px' }}>Zona de Perigo</h3>
                  <p style={{ color: '#7f1d1d', marginBottom: '20px' }}>
                    Estas ações são irreversíveis. Tenha certeza antes de prosseguir.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) {
                        showNotification('Solicitação de exclusão enviada. Você receberá um email de confirmação.', 'warning');
                      }
                    }}
                    style={{
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Excluir Conta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        @media (max-width: 1200px) {
          .main-content {
            margin-left: 0 !important;
          }
          
          .settings-content {
            flex-direction: column !important;
          }
          
          .settings-sidebar {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid #e2e8f0 !important;
          }
        }

        @media (max-width: 768px) {
          .settings-content {
            padding: 20px !important;
          }
          
          .system-info {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          .modules-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
