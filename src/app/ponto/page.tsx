'use client';

import { useState, useEffect } from 'react';

interface PunchEntry {
  type: 'in' | 'break' | 'out';
  label: string;
  time: string;
}

export default function PontoDigital() {
  const [currentTime, setCurrentTime] = useState('');

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
  const [currentDate, setCurrentDate] = useState('');

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
  const [currentStatus, setCurrentStatus] = useState<'working' | 'break' | 'out'>('working');

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
  const [entries, setEntries] = useState<PunchEntry[]>([
    { type: 'in', label: 'Entrada', time: '08:00:00' },
    { type: 'break', label: 'Pausa Almoço', time: '12:00:00' },
    { type: 'in', label: 'Retorno', time: '13:00:00' }
  ]);
  const [hoursWorked, setHoursWorked] = useState('05:32');

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

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      
      const timeString = now.toLocaleTimeString('pt-BR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(timeString);
      
      const dateString = now.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      setCurrentDate(dateString);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    // Implementação simples de notificação
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const addEntry = (type: 'in' | 'break' | 'out', label: string, time: string) => {
    setEntries(prev => [...prev, { type, label, time }]);
  };

  const punchIn = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour12: false });
    
    addEntry('in', 'Entrada', timeString);
    setCurrentStatus('working');
    showNotification('Entrada registrada com sucesso!', 'success');
  };

  const punchBreak = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour12: false });
    
    if (currentStatus === 'working') {
      addEntry('break', 'Pausa', timeString);
      setCurrentStatus('break');
      showNotification('Pausa iniciada', 'info');
    } else if (currentStatus === 'break') {
      addEntry('in', 'Retorno', timeString);
      setCurrentStatus('working');
      showNotification('Retorno da pausa registrado', 'success');
    }
  };

  const punchOut = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour12: false });
    
    addEntry('out', 'Saída', timeString);
    setCurrentStatus('out');
    showNotification('Saída registrada com sucesso!', 'success');
  };

  const getStatusText = () => {
    switch(currentStatus) {
      case 'working': return 'Trabalhando desde 08:00';
      case 'break': return 'Em pausa';
      case 'out': return 'Expediente finalizado';
    }
  };

  const getBreakButtonText = () => {
    return currentStatus === 'break' ? 'Retornar' : 'Pausar';
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: '#f8fafc', color: '#334155', overflowX: 'hidden' }}>
      {/* SIDEBAR */}
      <nav style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '280px',
        height: '100vh',
        background: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)',
        padding: '20px 0',
        zIndex: 1000,
        boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ padding: '0 25px 30px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
          <i className="fas fa-rocket" style={{
            fontSize: '2.5rem',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'block',
            marginBottom: '10px'
          }}></i>
          <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginTop: '10px' }}>Journey 100k</h1>
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
              <span>Dashboard</span>
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
              <span>Funcionários</span>
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
              <span>Projetos</span>
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
              <span>Financeiro</span>
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
              <span>Chat</span>
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              color: '#3b82f6',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 500,
              background: 'rgba(59, 130, 246, 0.2)',
              transform: 'translateX(5px)'
            }}>
              <i className="fas fa-clock" style={{ fontSize: '1.2rem', marginRight: '15px', minWidth: '20px', textAlign: 'center' }}></i>
              <span>Ponto Digital</span>
            </div>
          </li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ marginLeft: '280px', minHeight: '100vh' }}>
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
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '5px' }}>Ponto Digital</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Sistema de controle de ponto eletrônico - Journey 100k</p>
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

        {/* PONTO CONTENT */}
        <div style={{ padding: '40px' }}>
          {/* CLOCK SECTION */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '40px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981)'
            }}></div>
            
            <div style={{
              fontSize: '4rem',
              fontWeight: 800,
              color: '#1e293b',
              marginBottom: '10px',
              fontFamily: "'Courier New', monospace"
            }}>{currentTime}</div>
            
            <div style={{
              fontSize: '1.2rem',
              color: '#64748b',
              marginBottom: '30px'
            }}>{currentDate}</div>
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 24px',
              background: currentStatus === 'working' ? '#f0fdf4' : '#f0f9ff',
              border: `2px solid ${currentStatus === 'working' ? '#10b981' : '#0ea5e9'}`,
              borderRadius: '12px',
              color: currentStatus === 'working' ? '#10b981' : '#0ea5e9',
              fontWeight: 600,
              marginBottom: '30px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'currentColor',
                animation: 'pulse 2s infinite'
              }}></div>
              <span>{getStatusText()}</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <button
                onClick={punchIn}
                disabled={currentStatus === 'working' || currentStatus === 'break'}
                style={{
                  padding: '20px 30px',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  cursor: currentStatus === 'working' || currentStatus === 'break' ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: currentStatus === 'working' || currentStatus === 'break' ? 0.6 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-sign-in-alt"></i>
                Entrada
              </button>
              
              <button
                onClick={punchBreak}
                disabled={currentStatus === 'out'}
                style={{
                  padding: '20px 30px',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  cursor: currentStatus === 'out' ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: currentStatus === 'out' ? 0.6 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                <i className={`fas fa-${currentStatus === 'break' ? 'play' : 'coffee'}`}></i>
                {getBreakButtonText()}
              </button>
              
              <button
                onClick={punchOut}
                disabled={currentStatus === 'out'}
                style={{
                  padding: '20px 30px',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  cursor: currentStatus === 'out' ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: currentStatus === 'out' ? 0.6 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-sign-out-alt"></i>
                Saída
              </button>
            </div>
          </div>

          {/* TODAY'S RECORD */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginBottom: '40px'
          }}>
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.3rem'
                }}>
                  <i className="fas fa-list"></i>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>Registros de Hoje</div>
              </div>
              
              <div>
                {entries.map((entry, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: index < entries.length - 1 ? '1px solid #f1f5f9' : 'none'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 600,
                      color: entry.type === 'in' ? '#10b981' : entry.type === 'break' ? '#f59e0b' : '#ef4444'
                    }}>
                      <i className={`fas fa-${entry.type === 'in' ? 'sign-in-alt' : entry.type === 'break' ? 'coffee' : 'sign-out-alt'}`}></i>
                      {entry.label}
                    </div>
                    <div style={{
                      fontFamily: "'Courier New', monospace",
                      fontWeight: 600,
                      color: '#1e293b'
                    }}>{entry.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.3rem'
                }}>
                  <i className="fas fa-clock"></i>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>Horas Trabalhadas</div>
              </div>
              
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>{hoursWorked}</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>de 8h00 previstas</div>
              
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Progresso</span>
                  <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>69%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '69%', height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '4px', transition: 'width 0.3s ease' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* WEEKLY REPORT */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 350px',
            gap: '30px',
            marginBottom: '40px'
          }}>
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b' }}>Relatório Semanal</h3>
                <select style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                  <option>Esta semana (16-22 Set)</option>
                  <option>Semana anterior (09-15 Set)</option>
                  <option>Há 2 semanas (02-08 Set)</option>
                </select>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '10px',
                marginTop: '20px'
              }}>
                {[
                  { day: 'DOM', number: '16', hours: 'Folga', isWeekend: true },
                  { day: 'SEG', number: '17', hours: '8h15' },
                  { day: 'TER', number: '18', hours: '8h00' },
                  { day: 'QUA', number: '19', hours: '8h30' },
                  { day: 'QUI', number: '20', hours: '7h45' },
                  { day: 'SEX', number: '21', hours: '8h10' },
                  { day: 'SÁB', number: '22', hours: '5h32', isToday: true }
                ].map((day, index) => (
                  <div key={index} style={{
                    textAlign: 'center',
                    padding: '15px 8px',
                    borderRadius: '12px',
                    border: day.isToday ? '2px solid #3b82f6' : '2px solid #f1f5f9',
                    background: day.isToday ? 'linear-gradient(135deg, #dbeafe, #bfdbfe)' : day.isWeekend ? '#f8fafc' : 'white',
                    opacity: day.isWeekend ? 0.7 : 1
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '8px' }}>{day.day}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>{day.number}</div>
                    <div style={{ fontSize: '0.75rem', color: day.hours === 'Folga' ? '#ef4444' : '#10b981', fontWeight: 600 }}>{day.hours}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b' }}>Resumo</h3>
              </div>

              <div style={{ display: 'grid', gap: '20px' }}>
                {[
                  { label: 'Horas Trabalhadas', value: '46h12' },
                  { label: 'Horas Esperadas', value: '44h00' },
                  { label: 'Banco de Horas', value: '+2h12', positive: true },
                  { label: 'Atrasos', value: '0' },
                  { label: 'Faltas', value: '0' },
                  { label: 'Média Diária', value: '8h13' },
                  { label: 'Pontualidade', value: '100%', positive: true }
                ].map((stat, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px 0',
                    borderBottom: index < 6 ? '1px solid #f1f5f9' : 'none'
                  }}>
                    <div style={{ fontWeight: 600, color: '#64748b' }}>{stat.label}</div>
                    <div style={{
                      fontWeight: 700,
                      color: stat.positive ? '#10b981' : '#1e293b'
                    }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 1024px) {
          .weekly-report {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          nav {
            transform: translateX(-100%) !important;
          }
          
          main {
            margin-left: 0 !important;
          }
          
          .punch-buttons {
            grid-template-columns: 1fr !important;
            max-width: 300px !important;
          }
          
          .today-record {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
