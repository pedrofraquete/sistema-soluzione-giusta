-- =====================================================
-- SCHEMA ESSENCIAL SUPABASE - SISTEMA ERP JOURNEY 100K
-- Execute este SQL no painel do Supabase > SQL Editor
-- =====================================================

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Desabilitar RLS temporariamente para aplicar schema
ALTER TABLE IF EXISTS companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS financial_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS budgets DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS time_tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS work_schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chat_channels DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chat_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS document_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS gamification DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS challenges DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS challenge_participations DISABLE ROW LEVEL SECURITY;

-- Budgets
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

-- Work Schedules
CREATE TABLE IF NOT EXISTS work_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id),
    day_of_week INTEGER NOT NULL, -- 0=domingo, 1=segunda, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    lunch_start TIME,
    lunch_end TIME,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Channels
CREATE TABLE IF NOT EXISTS chat_channels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) DEFAULT 'public', -- public, private, direct
    company_id UUID REFERENCES companies(id),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Members
CREATE TABLE IF NOT EXISTS chat_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    channel_id UUID REFERENCES chat_channels(id),
    profile_id UUID REFERENCES profiles(id),
    role VARCHAR(20) DEFAULT 'member', -- admin, member
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(channel_id, profile_id)
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_path TEXT,
    file_size BIGINT,
    file_type VARCHAR(100),
    category VARCHAR(100),
    tags JSONB DEFAULT '[]'::jsonb,
    company_id UUID REFERENCES companies(id),
    uploaded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document Permissions
CREATE TABLE IF NOT EXISTS document_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES documents(id),
    profile_id UUID REFERENCES profiles(id),
    permission_level VARCHAR(20) DEFAULT 'read', -- read, write, admin
    granted_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(document_id, profile_id)
);

-- System Settings
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Settings
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id),
    key VARCHAR(100) NOT NULL,
    value JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, key)
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved Reports
CREATE TABLE IF NOT EXISTS saved_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(50) NOT NULL,
    filters JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES profiles(id),
    company_id UUID REFERENCES companies(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenges
CREATE TABLE IF NOT EXISTS challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) DEFAULT 'daily', -- daily, weekly, monthly
    points_reward INTEGER DEFAULT 10,
    start_date DATE,
    end_date DATE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge Participations
CREATE TABLE IF NOT EXISTS challenge_participations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id UUID REFERENCES challenges(id),
    profile_id UUID REFERENCES profiles(id),
    status VARCHAR(20) DEFAULT 'active', -- active, completed, failed
    progress INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(challenge_id, profile_id)
);

-- Views essenciais
CREATE OR REPLACE VIEW employees_full AS
SELECT 
    e.*,
    p.full_name,
    p.email,
    p.avatar_url,
    p.phone,
    c.name as company_name
FROM employees e
LEFT JOIN profiles p ON e.profile_id = p.id
LEFT JOIN companies c ON p.company_id = c.id;

CREATE OR REPLACE VIEW projects_stats AS
SELECT 
    p.*,
    c.name as company_name,
    COUNT(t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    CASE 
        WHEN COUNT(t.id) > 0 THEN 
            ROUND((COUNT(CASE WHEN t.status = 'completed' THEN 1 END) * 100.0 / COUNT(t.id)), 2)
        ELSE 0 
    END as completion_percentage
FROM projects p
LEFT JOIN companies c ON p.company_id = c.id
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY p.id, c.name;

CREATE OR REPLACE VIEW gamification_ranking AS
SELECT 
    g.*,
    p.full_name,
    p.avatar_url,
    ROW_NUMBER() OVER (ORDER BY g.points DESC) as rank
FROM gamification g
LEFT JOIN profiles p ON g.profile_id = p.id
ORDER BY g.points DESC;

-- Inserir dados iniciais de desafios
INSERT INTO challenges (name, description, type, points_reward, active) VALUES
('Login Diário', 'Faça login no sistema todos os dias', 'daily', 5, true),
('Meta Semanal', 'Complete todas as tarefas da semana', 'weekly', 25, true),
('Colaboração', 'Participe de pelo menos 3 conversas no chat', 'daily', 10, true),
('Produtividade', 'Complete 5 tarefas em um dia', 'daily', 15, true),
('Relatório Mensal', 'Gere um relatório completo do mês', 'monthly', 50, true)
ON CONFLICT DO NOTHING;

-- Inserir configurações iniciais do sistema
INSERT INTO system_settings (key, value, description) VALUES
('app_name', '"Sistema ERP Journey 100k"', 'Nome da aplicação'),
('app_version', '"2.0.0"', 'Versão da aplicação'),
('company_name', '"Soluzione Giusta"', 'Nome da empresa'),
('maintenance_mode', 'false', 'Modo de manutenção'),
('max_file_size', '10485760', 'Tamanho máximo de arquivo em bytes (10MB)'),
('allowed_file_types', '["pdf", "doc", "docx", "xls", "xlsx", "png", "jpg", "jpeg"]', 'Tipos de arquivo permitidos')
ON CONFLICT (key) DO NOTHING;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_budgets_company ON budgets(company_id);
CREATE INDEX IF NOT EXISTS idx_work_schedules_profile ON work_schedules(profile_id);
CREATE INDEX IF NOT EXISTS idx_chat_channels_company ON chat_channels(company_id);
CREATE INDEX IF NOT EXISTS idx_chat_members_channel ON chat_members(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_members_profile ON chat_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_documents_company ON documents(company_id);
CREATE INDEX IF NOT EXISTS idx_document_permissions_document ON document_permissions(document_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participations_challenge ON challenge_participations(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participations_profile ON challenge_participations(profile_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_profile ON activity_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_saved_reports_company ON saved_reports(company_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_schedules_updated_at BEFORE UPDATE ON work_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_channels_updated_at BEFORE UPDATE ON chat_channels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_challenge_participations_updated_at BEFORE UPDATE ON challenge_participations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_saved_reports_updated_at BEFORE UPDATE ON saved_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();