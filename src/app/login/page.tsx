'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('pedro@soluzionegiusta.com.br')
  const [password, setPassword] = useState('Soluzione2025!')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const router = useRouter()
  const { signIn } = useAuth()

  // Criar partículas de fundo
  useEffect(() => {
    const particlesContainer = document.getElementById('particles')
    if (!particlesContainer) return

    // Limpar partículas existentes
    particlesContainer.innerHTML = ''
    
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      
      // Posição aleatória
      particle.style.left = Math.random() * 100 + '%'
      particle.style.top = Math.random() * 100 + '%'
      
      // Tamanho aleatório
      const size = Math.random() * 6 + 2
      particle.style.width = size + 'px'
      particle.style.height = size + 'px'
      
      // Delay de animação aleatório
      particle.style.animationDelay = Math.random() * 6 + 's'
      particle.style.animationDuration = (Math.random() * 4 + 4) + 's'
      
      particlesContainer.appendChild(particle)
    }
  }, [])

  const showAlert = (type: 'error' | 'success', message: string) => {
    if (type === 'error') {
      setError(message)
      setSuccess('')
    } else {
      setSuccess(message)
      setError('')
    }
    
    setTimeout(() => {
      setError('')
      setSuccess('')
    }, 4000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      showAlert('error', 'Por favor, preencha todos os campos')
      return
    }

    setLoading(true)

    try {
      // Credenciais válidas para teste
      if (email === 'pedro@soluzionegiusta.com.br' && password === 'Soluzione2025!') {
        showAlert('success', 'Login realizado com sucesso!')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
        return
      }

      // Tentar autenticação
      const { error } = await signIn(email, password)
      
      if (error) {
        showAlert('error', 'Email ou senha inválidos')
      } else {
        showAlert('success', 'Login realizado com sucesso!')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      }
    } catch {
      showAlert('error', 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    showAlert('error', 'Função em desenvolvimento. Entre em contato com o administrador.')
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* Partículas de fundo */
        .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        /* Container principal */
        .login-container {
          position: relative;
          z-index: 10;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          width: 420px;
          padding: 50px 40px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: fadeInUp 0.8s ease;
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

        /* Logo e título */
        .logo {
          margin-bottom: 30px;
        }

        .logo-icon {
          font-size: 4rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 15px;
          display: block;
        }

        .title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 10px;
        }

        .subtitle {
          color: #666;
          font-size: 1rem;
          margin-bottom: 40px;
          font-weight: 400;
        }

        /* Formulário */
        .form-group {
          position: relative;
          margin-bottom: 25px;
        }

        .form-input {
          width: 100%;
          padding: 16px 50px 16px 20px;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }

        .form-icon {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
          transition: all 0.3s ease;
        }

        .form-input:focus + .form-icon {
          color: #667eea;
        }

        /* Botão de login */
        .login-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
          position: relative;
          overflow: hidden;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .login-btn:active {
          transform: translateY(0);
        }

        .login-btn:disabled {
          pointer-events: none;
        }

        .btn-text {
          transition: opacity 0.3s ease;
        }

        .login-btn:disabled .btn-text {
          opacity: 0;
        }

        .login-spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .login-btn:disabled .login-spinner {
          opacity: 1;
        }

        /* Lembrar de mim e esqueceu senha */
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 20px 0;
          font-size: 0.9rem;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .checkbox-group input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #667eea;
        }

        .forgot-password {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .forgot-password:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        /* Alertas */
        .alert {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: slideDown 0.3s ease;
        }

        .alert.error {
          background: #fee;
          border: 1px solid #fcc;
          color: #c44;
        }

        .alert.success {
          background: #efe;
          border: 1px solid #cfc;
          color: #4c4;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Footer */
        .footer {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 0.85rem;
        }

        .footer .company-info {
          margin-bottom: 10px;
          font-weight: 500;
        }

        .footer .version {
          opacity: 0.7;
        }

        /* Spinner */
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsivo */
        @media (max-width: 480px) {
          .login-container {
            width: 90%;
            padding: 40px 30px;
            margin: 20px;
          }

          .title {
            font-size: 1.8rem;
          }

          .form-options {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center overflow-hidden">
        {/* Partículas de fundo */}
        <div className="particles" id="particles"></div>

        {/* Container principal */}
        <div className="login-container">
          {/* Logo e título */}
          <div className="logo">
            <span className="logo-icon">🚀</span>
            <h1 className="title">Journey 100k</h1>
            <p className="subtitle">Sistema ERP · Soluzione Giusta</p>
          </div>

          {/* Alertas */}
          {error && (
            <div className="alert error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert success">
              <span>✅</span>
              <span>{success}</span>
            </div>
          )}

          {/* Formulário de login */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="email" 
                className="form-input" 
                placeholder="Seu email corporativo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const passwordInput = document.getElementById('password') as HTMLInputElement
                    passwordInput?.focus()
                  }
                }}
              />
              <span className="form-icon">✉️</span>
            </div>

            <div className="form-group">
              <input 
                type="password" 
                className="form-input" 
                id="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <span className="form-icon">🔒</span>
            </div>

            <div className="form-options">
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="remember">Lembrar de mim</label>
              </div>
              <a href="#" className="forgot-password" onClick={handleForgotPassword}>
                Esqueceu a senha?
              </a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              <span className="btn-text">
                🚀 Entrar no Sistema
              </span>
              <div className="login-spinner">
                <div className="spinner"></div>
              </div>
            </button>
          </form>

          {/* Footer */}
          <div className="footer">
            <div className="company-info">Soluzione Giusta Tecnologia</div>
            <div className="version">Journey 100k v2.0 | © 2025</div>
          </div>
        </div>
      </div>
    </>
  )
}
