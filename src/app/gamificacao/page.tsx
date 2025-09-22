'use client';

import React, { useState, useEffect } from 'react';

interface PlayerData {
  name: string;
  role: string;
  level: number;
  xp: number;
  maxXp: number;
  totalPoints: number;
  achievements: number;
  rank: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: string;
}

interface Challenge {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  title: string;
  description: string;
  progress: number;
  reward: number;
  deadline: string;
  completed: boolean;
}

interface LeaderboardItem {
  rank: number;
  name: string;
  role: string;
  avatar: string;
  points: number;
  isCurrentUser?: boolean;
}

interface Activity {
  id: string;
  type: 'achievement' | 'level' | 'challenge' | 'project';
  title: string;
  description: string;
  time: string;
  points: number;
}

export default function GamificacaoPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
  const [playerData, setPlayerData] = useState<PlayerData>({
    name: 'Pedro Fraquete',
    role: 'CEO • Líder da Revolução',
    level: 15,
    xp: 7350,
    maxXp: 10000,
    totalPoints: 47890,
    achievements: 23,
    rank: 1
  });

  const achievements: Achievement[] = [
    {
      id: 'ceo-visionario',
      title: 'CEO Visionário',
      description: 'Lidere a empresa por 365 dias consecutivos',
      icon: 'fas fa-crown',
      unlocked: true,
      progress: 'Conquistado!'
    },
    {
      id: 'inovador',
      title: 'Inovador',
      description: 'Implemente 5 sistemas revolucionários',
      icon: 'fas fa-rocket',
      unlocked: true,
      progress: '5/5 sistemas'
    },
    {
      id: 'construtor-equipes',
      title: 'Construtor de Equipes',
      description: 'Contrate 25 funcionários talentosos',
      icon: 'fas fa-users',
      unlocked: true,
      progress: '29/25 funcionários'
    },
    {
      id: 'mestre-crescimento',
      title: 'Mestre do Crescimento',
      description: 'Alcance R$ 2M em faturamento mensal',
      icon: 'fas fa-chart-line',
      unlocked: true,
      progress: 'R$ 2,8M atingidos'
    },
    {
      id: 'expansao-global',
      title: 'Expansão Global',
      description: 'Abra filiais em 3 países diferentes',
      icon: 'fas fa-globe',
      unlocked: false,
      progress: '1/3 países'
    },
    {
      id: 'hall-fama',
      title: 'Hall da Fama',
      description: 'Alcance 100,000 pontos totais',
      icon: 'fas fa-medal',
      unlocked: false,
      progress: '47,890/100,000'
    }
  ];

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 'lider-presente',
      type: 'daily',
      title: 'Líder Presente',
      description: 'Faça check-in no sistema e responda a pelo menos 5 mensagens importantes hoje.',
      progress: 80,
      reward: 250,
      deadline: 'Expira em: 3h 45min',
      completed: false
    },
    {
      id: 'visionario-estrategico',
      type: 'weekly',
      title: 'Visionário Estratégico',
      description: 'Revise e aprove 10 projetos, participe de 3 reuniões estratégicas e defina 2 metas semanais.',
      progress: 67,
      reward: 750,
      deadline: 'Expira em: 2 dias',
      completed: false
    },
    {
      id: 'revolucao-completa',
      type: 'monthly',
      title: 'Revolução Completa',
      description: 'Implemente 1 novo módulo do Journey 100k, aumente o faturamento em 15% e contrate 2 talentos.',
      progress: 100,
      reward: 2000,
      deadline: 'Completo!',
      completed: true
    }
  ]);

  const leaderboard: LeaderboardItem[] = [
    { rank: 1, name: 'Pedro Fraquete', role: 'CEO', avatar: 'PF', points: 47890, isCurrentUser: true },
    { rank: 2, name: 'André Luiz', role: 'Dev Sênior', avatar: 'AL', points: 42350 },
    { rank: 3, name: 'Camila Mantovani', role: 'Projetos', avatar: 'CM', points: 39720 },
    { rank: 4, name: 'Renata Bariani', role: 'Financeiro', avatar: 'RB', points: 37180 },
    { rank: 5, name: 'Caroline Lanzilotti', role: 'Marketing', avatar: 'CL', points: 34650 }
  ];

  const activities: Activity[] = [
    {
      id: '1',
      type: 'achievement',
      title: 'Nova conquista desbloqueada!',
      description: '"Mestre do Crescimento" - Por atingir R$ 2,8M mensais',
      time: '2h atrás',
      points: 1500
    },
    {
      id: '2',
      type: 'level',
      title: 'Subiu de nível!',
      description: 'Parabéns! Você alcançou o Nível 15',
      time: '1 dia atrás',
      points: 2000
    },
    {
      id: '3',
      type: 'challenge',
      title: 'Desafio mensal completado',
      description: '"Revolução Completa" - Todos os objetivos atingidos',
      time: '2 dias atrás',
      points: 2000
    },
    {
      id: '4',
      type: 'project',
      title: 'Projeto finalizado',
      description: 'Sistema ERP Journey 100k - Módulo de Relatórios',
      time: '3 dias atrás',
      points: 1200
    }
  ];

  useEffect(() => {
    // Adicionar Font Awesome
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Notificação de boas-vindas
    setTimeout(() => {
      showNotification('Sistema de Gamificação carregado! 🏆', 'success');
    }, 1000);

    setTimeout(() => {
      showNotification('Você está no 1° lugar do ranking! Continue assim!', 'info');
    }, 3000);

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
      <i class="fas fa-${type === 'success' ? 'trophy' : type === 'warning' ? 'exclamation' : type === 'error' ? 'times' : 'info'}"></i>
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

  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => {
      if (challenge.id === challengeId && !challenge.completed) {
        setPlayerData(prevPlayer => ({
          ...prevPlayer,
          xp: prevPlayer.xp + challenge.reward,
          totalPoints: prevPlayer.totalPoints + challenge.reward
        }));
        
        showNotification(`Desafio completado! +${challenge.reward} XP`, 'success');
        
        return { ...challenge, completed: true, progress: 100 };
      }
      return challenge;
    }));
  };

  const createParticleExplosion = () => {
    const colors = ['#f59e0b', '#fbbf24', '#f97316'];
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: particle-float 3s ease-out forwards;
      `;
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle);
        }
      }, 3000);
    }
  };

  const handleAchievementClick = (achievement: Achievement) => {
    if (achievement.unlocked) {
      showNotification(`Conquista: ${achievement.title} - ${achievement.description}`, 'success');
      createParticleExplosion();
    } else {
      showNotification(`Bloqueado: ${achievement.title} - ${achievement.description}`, 'info');
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    const iconMap = {
      achievement: 'fas fa-trophy',
      level: 'fas fa-arrow-up',
      challenge: 'fas fa-check-circle',
      project: 'fas fa-project-diagram'
    };
    return iconMap[type];
  };

  const getActivityIconColor = (type: Activity['type']) => {
    const colorMap = {
      achievement: 'linear-gradient(135deg, #f59e0b, #d97706)',
      level: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      challenge: 'linear-gradient(135deg, #10b981, #059669)',
      project: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
    };
    return colorMap[type];
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
            <div onClick={() => window.location.href = '/relatorios'} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-chart-bar" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Relatórios</span>}
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
              <i className="fas fa-trophy" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              {!sidebarCollapsed && <span>Gamificação</span>}
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
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '5px' }}>Centro de Gamificação</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Sistema de motivação e engajamento da equipe - Journey 100k</p>
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
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>CEO • Nível {playerData.level}</p>
            </div>
          </div>
        </header>

        {/* GAMIFICATION CONTENT */}
        <div style={{ padding: '40px' }}>
          {/* PLAYER PROFILE */}
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '40px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'relative',
              zIndex: 1,
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              gap: '30px',
              alignItems: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 800,
                border: '4px solid rgba(255,255,255,0.3)'
              }}>PF</div>
              
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>{playerData.name}</h2>
                <div style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '15px' }}>{playerData.role}</div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <div style={{
                    padding: '8px 20px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '25px',
                    fontWeight: 700,
                    fontSize: '1.1rem'
                  }}>Nível {playerData.level}</div>
                  <div style={{ flex: 1, height: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #10b981, #059669)',
                      borderRadius: '6px',
                      width: `${(playerData.xp / playerData.maxXp) * 100}%`,
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {playerData.xp.toLocaleString()} / {playerData.maxXp.toLocaleString()} XP
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
                    {playerData.totalPoints.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Pontos Totais</div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>{playerData.achievements}</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Conquistas</div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>{playerData.rank}°</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Ranking</div>
                </div>
              </div>
            </div>
          </div>

          {/* ACHIEVEMENTS SECTION */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', marginBottom: '40px' }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
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
                    <i className="fas fa-trophy"></i>
                  </div>
                  Conquistas Desbloqueadas
                </h3>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>23 de 45 conquistadas</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    onClick={() => handleAchievementClick(achievement)}
                    style={{
                      padding: '20px',
                      border: `2px solid ${achievement.unlocked ? '#f59e0b' : '#f1f5f9'}`,
                      borderRadius: '12px',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative',
                      background: achievement.unlocked ? 'linear-gradient(135deg, #fffbeb, #fef3c7)' : '#f8fafc',
                      opacity: achievement.unlocked ? 1 : 0.6,
                      transform: achievement.unlocked ? 'scale(1.02)' : 'scale(1)'
                    }}
                  >
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      margin: '0 auto 15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      color: 'white',
                      background: achievement.unlocked ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#94a3b8'
                    }}>
                      <i className={achievement.icon}></i>
                    </div>
                    <h4 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>{achievement.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>{achievement.description}</p>
                    <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>{achievement.progress}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* LEADERBOARD */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.1rem'
                  }}>
                    <i className="fas fa-medal"></i>
                  </div>
                  Ranking da Equipe
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {leaderboard.map((item) => (
                  <div
                    key={item.rank}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px',
                      borderRadius: '12px',
                      background: item.isCurrentUser ? 'linear-gradient(135deg, #dbeafe, #bfdbfe)' : '#f8fafc',
                      border: item.isCurrentUser ? '2px solid #3b82f6' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: item.rank === 1 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' :
                                 item.rank === 2 ? 'linear-gradient(135deg, #94a3b8, #64748b)' :
                                 item.rank === 3 ? 'linear-gradient(135deg, #cd7c0f, #92400e)' :
                                 'linear-gradient(135deg, #64748b, #475569)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}>
                      {item.rank}
                    </div>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      {item.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.role}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#f59e0b', fontSize: '1.1rem' }}>
                      {item.points.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CHALLENGES SECTION */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '25px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  borderLeft: `4px solid ${
                    challenge.type === 'daily' ? '#10b981' :
                    challenge.type === 'weekly' ? '#3b82f6' : '#8b5cf6'
                  }`,
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: challenge.type === 'daily' ? '#dcfce7' :
                               challenge.type === 'weekly' ? '#dbeafe' : '#ede9fe',
                    color: challenge.type === 'daily' ? '#166534' :
                           challenge.type === 'weekly' ? '#1e40af' : '#6b21a8'
                  }}>
                    {challenge.type === 'daily' ? 'Diário' :
                     challenge.type === 'weekly' ? 'Semanal' : 'Mensal'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f59e0b', fontWeight: 700 }}>
                    <i className="fas fa-coins"></i>
                    +{challenge.reward} XP
                  </div>
                </div>
                
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '10px' }}>
                  {challenge.title}
                </h3>
                <p style={{ color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
                  {challenge.description}
                </p>
                
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>Progresso</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>{challenge.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease',
                      width: `${challenge.progress}%`,
                      background: challenge.type === 'daily' ? 'linear-gradient(90deg, #10b981, #059669)' :
                                 challenge.type === 'weekly' ? 'linear-gradient(90deg, #3b82f6, #1d4ed8)' :
                                 'linear-gradient(90deg, #8b5cf6, #7c3aed)'
                    }}></div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{challenge.deadline}</div>
                  <button
                    onClick={() => completeChallenge(challenge.id)}
                    disabled={challenge.completed}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: challenge.completed ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      background: challenge.completed ? '#f1f5f9' : 'linear-gradient(135deg, #10b981, #059669)',
                      color: challenge.completed ? '#64748b' : 'white'
                    }}
                  >
                    {challenge.completed ? (
                      <>
                        <i className="fas fa-check"></i> Concluído
                      </>
                    ) : (
                      challenge.progress === 100 ? 'Concluir' : 'Continuar'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RECENT ACTIVITIES */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
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
                  <i className="fas fa-history"></i>
                </div>
                Atividades Recentes
              </h3>
            </div>

            {activities.map((activity) => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px 0',
                  borderBottom: '1px solid #f1f5f9'
                }}
              >
                <div style={{
                  width: '35px',
                  height: '35px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.9rem',
                  background: getActivityIconColor(activity.type)
                }}>
                  <i className={getActivityIcon(activity.type)}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>{activity.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{activity.description}</div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{activity.time}</div>
                <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>
                  +{activity.points}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes particle-float {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(0);
          }
        }

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
          .achievements-section {
            grid-template-columns: 1fr !important;
          }
          
          .profile-content {
            grid-template-columns: 1fr !important;
            text-align: center !important;
          }
          
          .challenges-section {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
          }
          
          .gamification-content {
            padding: 20px !important;
          }
          
          .achievements-grid {
            grid-template-columns: 1fr !important;
          }
          
          .profile-stats {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
