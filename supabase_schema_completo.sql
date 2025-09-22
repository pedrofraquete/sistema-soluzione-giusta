-- =====================================================
-- SCHEMA COMPLETO SUPABASE - SISTEMA ERP JOURNEY 100K
-- =====================================================

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABELAS PRINCIPAIS
-- =====================================================

-- Empresas
CREATE TABLE IF NOT EXISTS companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    type VARCHAR(20) DEFAULT 'subsidiary',
    parent_id UUID REFERENCES companies(id),
    active BOOLEAN DEFAULT true,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usuários (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    company_id UUID REFERENCES companies(id),
    avatar_url TEXT,
    phone VARCHAR(20),
    bio TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Funcionários
CREATE TABLE IF NOT EXISTS employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id),
    cpf VARCHAR(14) UNIQUE NOT NULL,
    position VARCHAR(100),
    department VARCHAR(100),
    hire_date DATE,
    salary DECIMAL(12,2),
    manager_id UUID REFERENCES employees(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MÓDULO DE PROJETOS
-- =====================================================

-- Projetos
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    company_id UUID REFERENCES companies(id),
    status VARCHAR(30) DEFAULT 'planning',
    budget DECIMAL(12,2),
    start_date DATE,
    end_date DATE,
    progress INTEGER DEFAULT 0,
    priority VARCHAR(20) DEFAULT 'medium',
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tarefas
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES profiles(id),
    status VARCHAR(30) DEFAULT 'todo',
    priority VARCHAR(20) DEFAULT 'medium',
    due_date DATE,
    progress INTEGER DEFAULT 0,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MÓDULO FINANCEIRO
-- =====================================================

-- Transações Financeiras
CREATE TABLE IF NOT EXISTS financial_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES companies(id),
    type VARCHAR(20) NOT NULL, -- 'income' ou 'expense'
    category VARCHAR(100),
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    due_date DATE,
    paid_date DATE,
    status VARCHAR(30) DEFAULT 'pending',
    payment_method VARCHAR(50),
    reference_number VARCHAR(100),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orçamentos
CREATE TABLE IF NOT EXISTS budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    amount DECIMAL(12,2) NOT NULL,
    period VARCHAR(20) DEFAULT 'monthly',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MÓDULO DE PONTO DIGITAL
-- =====================================================

-- Ponto
CREATE TABLE IF NOT EXISTS time_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id),
    date DATE NOT NULL,
    check_in TIMESTAMPTZ,
    lunch_out TIMESTAMPTZ,
    lunch_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    total_hours INTERVAL,
    overtime_hours INTERVAL,
    status VARCHAR(20) DEFAULT 'present',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, date)
);

-- Horários de Trabalho
CREATE TABLE IF NOT EXISTS work_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id),
    day_of_week INTEGER, -- 0=domingo, 1=segunda, etc
    start_time TIME,
    end_time TIME,
    lunch_duration INTERVAL DEFAULT '1 hour',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MÓDULO DE CHAT
-- =====================================================

-- Canais de Chat
CREATE TABLE IF NOT EXISTS chat_channels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) DEFAULT 'public', -- 'public', 'private', 'direct'
    company_id UUID REFERENCES companies(id),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Membros dos Canais
CREATE TABLE IF NOT EXISTS chat_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    channel_id UUID REFERENCES chat_channels(id),
    profile_id UUID REFERENCES profiles(id),
    role VARCHAR(20) DEFAULT 'member', -- 'admin', 'member'
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(channel_id, profile_id)
);

-- Mensagens
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    channel_id UUID REFERENCES chat_channels(id),
    sender_id UUID REFERENCES profiles(id),
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'file', 'image'
    file_url TEXT,
    reply_to UUID REFERENCES messages(id),
    edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MÓDULO DE DOCUMENTOS
-- =====================================================

-- Documentos
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    folder VARCHAR(255),
    tags JSONB DEFAULT '[]'::jsonb,
    company_id UUID REFERENCES companies(id),
    uploaded_by UUID REFERENCES profiles(id),
    is_public BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permissões de Documentos
CREATE TABLE IF NOT EXISTS document_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES documents(id),
    profile_id UUID REFERENCES profiles(id),
    permission VARCHAR(20) DEFAULT 'read', -- 'read', 'write', 'admin'
    granted_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(document_id, profile_id)
);

-- =====================================================
-- MÓDULO DE RELATÓRIOS
-- =====================================================

-- Relatórios Salvos
CREATE TABLE IF NOT EXISTS saved_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(50) NOT NULL,
    parameters JSONB,
    company_id UUID REFERENCES companies(id),
    created_by UUID REFERENCES profiles(id),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MÓDULO DE GAMIFICAÇÃO
-- =====================================================

-- Gamificação
CREATE TABLE IF NOT EXISTS gamification (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) UNIQUE,
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    badges JSONB DEFAULT '[]'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Desafios
CREATE TABLE IF NOT EXISTS challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) DEFAULT 'daily', -- 'daily', 'weekly', 'monthly'
    points_reward INTEGER DEFAULT 0,
    requirements JSONB,
    active BOOLEAN DEFAULT true,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participação em Desafios
CREATE TABLE IF NOT EXISTS challenge_participations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id UUID REFERENCES challenges(id),
    profile_id UUID REFERENCES profiles(id),
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(challenge_id, profile_id)
);

-- =====================================================
-- MÓDULO DE CONFIGURAÇÕES
-- =====================================================

-- Configurações do Sistema
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    category VARCHAR(100),
    updated_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configurações do Usuário
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id),
    key VARCHAR(255) NOT NULL,
    value JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, key)
);

-- =====================================================
-- NOTIFICAÇÕES
-- =====================================================

-- Notificações
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id),
    type VARCHAR(50),
    title VARCHAR(255),
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- LOGS E AUDITORIA
-- =====================================================

-- Log de Atividades
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_employees_profile ON employees(profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_company ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_financial_company ON financial_transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_financial_type ON financial_transactions(type);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_time_tracking_profile ON time_tracking(profile_id);
CREATE INDEX IF NOT EXISTS idx_time_tracking_date ON time_tracking(date);
CREATE INDEX IF NOT EXISTS idx_documents_company ON documents(company_id);
CREATE INDEX IF NOT EXISTS idx_documents_folder ON documents(folder);
CREATE INDEX IF NOT EXISTS idx_notifications_profile ON notifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_profile ON activity_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_gamification_points ON gamification(points DESC);

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Inserir empresas
INSERT INTO companies (name, cnpj, type, address, phone, email) VALUES
('Soluzione Giusta', '00.000.000/0001-00', 'matriz', 'Rua Principal, 123 - São Paulo/SP', '(11) 99999-9999', 'contato@soluzionegiusta.com.br'),
('Disbrigo Facile', '00.000.000/0002-00', 'subsidiary', 'Av. Secundária, 456 - Rio de Janeiro/RJ', '(21) 88888-8888', 'contato@disbrigofacile.com.br'),
('Innova Tiva', '00.000.000/0003-00', 'subsidiary', 'Rua Inovação, 789 - Belo Horizonte/MG', '(31) 77777-7777', 'contato@innovativa.com.br'),
('Mavie', '00.000.000/0004-00', 'subsidiary', 'Av. Tecnologia, 321 - Porto Alegre/RS', '(51) 66666-6666', 'contato@mavie.com.br'),
('SVL Fraqueie', '00.000.000/0005-00', 'subsidiary', 'Rua Desenvolvimento, 654 - Curitiba/PR', '(41) 55555-5555', 'contato@svlfraqueie.com.br'),
('Via Giusta', '00.000.000/0006-00', 'subsidiary', 'Av. Soluções, 987 - Salvador/BA', '(71) 44444-4444', 'contato@viagiusta.com.br')
ON CONFLICT (cnpj) DO NOTHING;

-- Inserir configurações padrão do sistema
INSERT INTO system_settings (key, value, description, category) VALUES
('company_name', '"Soluzione Giusta"', 'Nome da empresa principal', 'general'),
('default_language', '"pt-BR"', 'Idioma padrão do sistema', 'general'),
('timezone', '"America/Sao_Paulo"', 'Fuso horário padrão', 'general'),
('work_hours_per_day', '8', 'Horas de trabalho por dia', 'time_tracking'),
('lunch_duration', '60', 'Duração do almoço em minutos', 'time_tracking'),
('gamification_enabled', 'true', 'Sistema de gamificação ativo', 'gamification'),
('notification_email', 'true', 'Notificações por email ativas', 'notifications')
ON CONFLICT (key) DO NOTHING;

-- Inserir desafios padrão
INSERT INTO challenges (name, description, type, points_reward, requirements, start_date, end_date) VALUES
('Líder Presente', 'Faça check-in no sistema e responda a pelo menos 5 mensagens importantes hoje', 'daily', 250, '{"checkin": true, "messages": 5}', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day'),
('Visionário Estratégico', 'Revise e aprove 10 projetos, participe de 3 reuniões estratégicas e defina 2 metas semanais', 'weekly', 750, '{"projects_reviewed": 10, "meetings": 3, "goals": 2}', CURRENT_DATE - EXTRACT(DOW FROM CURRENT_DATE) * INTERVAL '1 day', CURRENT_DATE - EXTRACT(DOW FROM CURRENT_DATE) * INTERVAL '1 day' + INTERVAL '7 days'),
('Revolução Completa', 'Implemente 1 novo módulo do Journey 100k, aumente o faturamento em 15% e contrate 2 talentos', 'monthly', 2000, '{"modules": 1, "revenue_increase": 15, "hires": 2}', DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')
ON CONFLICT DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de RLS (permitir tudo para usuários autenticados)
CREATE POLICY "Allow all for authenticated users" ON companies FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON employees FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON financial_transactions FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON budgets FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON time_tracking FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON work_schedules FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON chat_channels FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON chat_members FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON messages FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON documents FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON document_permissions FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON saved_reports FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON gamification FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON challenges FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON challenge_participations FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON system_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON user_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON notifications FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON activity_logs FOR ALL TO authenticated USING (true);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON financial_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_channels_updated_at BEFORE UPDATE ON chat_channels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_saved_reports_updated_at BEFORE UPDATE ON saved_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gamification_updated_at BEFORE UPDATE ON gamification FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para funcionários com informações completas
CREATE OR REPLACE VIEW employees_full AS
SELECT 
    e.*,
    p.full_name,
    p.email,
    p.avatar_url,
    p.phone,
    c.name as company_name
FROM employees e
JOIN profiles p ON e.profile_id = p.id
JOIN companies c ON p.company_id = c.id;

-- View para projetos com estatísticas
CREATE OR REPLACE VIEW projects_stats AS
SELECT 
    p.*,
    c.name as company_name,
    COUNT(t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    ROUND(
        CASE 
            WHEN COUNT(t.id) > 0 THEN 
                (COUNT(CASE WHEN t.status = 'completed' THEN 1 END)::float / COUNT(t.id)::float) * 100
            ELSE 0 
        END, 2
    ) as completion_percentage
FROM projects p
LEFT JOIN companies c ON p.company_id = c.id
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY p.id, c.name;

-- View para ranking de gamificação
CREATE OR REPLACE VIEW gamification_ranking AS
SELECT 
    g.*,
    p.full_name,
    p.avatar_url,
    e.position,
    ROW_NUMBER() OVER (ORDER BY g.points DESC) as ranking
FROM gamification g
JOIN profiles p ON g.profile_id = p.id
LEFT JOIN employees e ON p.id = e.profile_id
ORDER BY g.points DESC;

-- =====================================================
-- SCHEMA COMPLETO CRIADO COM SUCESSO!
-- =====================================================
