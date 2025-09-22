-- =====================================================
-- SCRIPT DE VALIDAÇÃO DO SCHEMA SUPABASE
-- Sistema ERP Journey 100k - Soluzione Giusta
-- =====================================================

-- Verificar quais tabelas existem
SELECT 
    'TABELAS EXISTENTES' as tipo,
    table_name as nome,
    'OK' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Verificar quais views existem
SELECT 
    'VIEWS EXISTENTES' as tipo,
    table_name as nome,
    'OK' as status
FROM information_schema.views 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar extensões instaladas
SELECT 
    'EXTENSÕES' as tipo,
    extname as nome,
    'INSTALADA' as status
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'pgcrypto');

-- Verificar políticas RLS
SELECT 
    'POLÍTICAS RLS' as tipo,
    schemaname || '.' || tablename as nome,
    CASE 
        WHEN rowsecurity THEN 'RLS HABILITADO'
        ELSE 'RLS DESABILITADO'
    END as status
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verificar triggers
SELECT 
    'TRIGGERS' as tipo,
    trigger_name as nome,
    event_object_table as tabela
FROM information_schema.triggers
WHERE trigger_schema = 'public'
    AND trigger_name LIKE '%updated_at%'
ORDER BY event_object_table;

-- Verificar índices importantes
SELECT 
    'ÍNDICES' as tipo,
    indexname as nome,
    tablename as tabela
FROM pg_indexes
WHERE schemaname = 'public'
    AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Verificar dados iniciais
SELECT 
    'DADOS - EMPRESAS' as tipo,
    name as nome,
    cnpj as status
FROM companies
ORDER BY name;

-- Verificar configurações do sistema (se a tabela existir)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'system_settings') THEN
        RAISE NOTICE 'Verificando configurações do sistema...';
        PERFORM * FROM system_settings LIMIT 1;
    ELSE
        RAISE NOTICE 'Tabela system_settings não existe';
    END IF;
END $$;

-- Verificar desafios (se a tabela existir)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'challenges') THEN
        RAISE NOTICE 'Verificando desafios...';
        PERFORM * FROM challenges LIMIT 1;
    ELSE
        RAISE NOTICE 'Tabela challenges não existe';
    END IF;
END $$;

-- Lista de tabelas que DEVEM existir
SELECT 
    'TABELAS NECESSÁRIAS' as tipo,
    unnest(ARRAY[
        'companies',
        'profiles', 
        'employees',
        'projects',
        'tasks',
        'financial_transactions',
        'budgets',
        'time_tracking',
        'work_schedules',
        'chat_channels',
        'chat_members',
        'messages',
        'documents',
        'document_permissions',
        'saved_reports',
        'gamification',
        'challenges',
        'challenge_participations',
        'system_settings',
        'user_settings',
        'notifications',
        'activity_logs'
    ]) as nome,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = unnest(ARRAY[
                'companies',
                'profiles', 
                'employees',
                'projects',
                'tasks',
                'financial_transactions',
                'budgets',
                'time_tracking',
                'work_schedules',
                'chat_channels',
                'chat_members',
                'messages',
                'documents',
                'document_permissions',
                'saved_reports',
                'gamification',
                'challenges',
                'challenge_participations',
                'system_settings',
                'user_settings',
                'notifications',
                'activity_logs'
            ]) AND table_schema = 'public'
        ) THEN '✅ EXISTE'
        ELSE '❌ FALTANDO'
    END as status;

-- Lista de views que DEVEM existir
SELECT 
    'VIEWS NECESSÁRIAS' as tipo,
    unnest(ARRAY[
        'employees_full',
        'projects_stats',
        'gamification_ranking'
    ]) as nome,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.views 
            WHERE table_name = unnest(ARRAY[
                'employees_full',
                'projects_stats',
                'gamification_ranking'
            ]) AND table_schema = 'public'
        ) THEN '✅ EXISTE'
        ELSE '❌ FALTANDO'
    END as status;

-- Resumo final
SELECT 
    'RESUMO' as tipo,
    'Total de tabelas existentes' as nome,
    COUNT(*)::text as status
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

SELECT 
    'RESUMO' as tipo,
    'Total de views existentes' as nome,
    COUNT(*)::text as status
FROM information_schema.views 
WHERE table_schema = 'public';

-- Verificar se o schema está completo
WITH required_tables AS (
    SELECT unnest(ARRAY[
        'companies', 'profiles', 'employees', 'projects', 'tasks',
        'financial_transactions', 'budgets', 'time_tracking', 'work_schedules',
        'chat_channels', 'chat_members', 'messages', 'documents', 'document_permissions',
        'saved_reports', 'gamification', 'challenges', 'challenge_participations',
        'system_settings', 'user_settings', 'notifications', 'activity_logs'
    ]) as table_name
),
existing_tables AS (
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
),
missing_tables AS (
    SELECT r.table_name
    FROM required_tables r
    LEFT JOIN existing_tables e ON r.table_name = e.table_name
    WHERE e.table_name IS NULL
)
SELECT 
    'STATUS GERAL' as tipo,
    CASE 
        WHEN (SELECT COUNT(*) FROM missing_tables) = 0 THEN 
            '✅ SCHEMA COMPLETO - Todas as tabelas necessárias existem'
        ELSE 
            '❌ SCHEMA INCOMPLETO - ' || (SELECT COUNT(*) FROM missing_tables) || ' tabelas faltando'
    END as nome,
    CASE 
        WHEN (SELECT COUNT(*) FROM missing_tables) = 0 THEN 'PRONTO PARA PRODUÇÃO'
        ELSE 'REQUER APLICAÇÃO DO SCHEMA COMPLETO'
    END as status;

-- Listar tabelas faltando
WITH required_tables AS (
    SELECT unnest(ARRAY[
        'companies', 'profiles', 'employees', 'projects', 'tasks',
        'financial_transactions', 'budgets', 'time_tracking', 'work_schedules',
        'chat_channels', 'chat_members', 'messages', 'documents', 'document_permissions',
        'saved_reports', 'gamification', 'challenges', 'challenge_participations',
        'system_settings', 'user_settings', 'notifications', 'activity_logs'
    ]) as table_name
),
existing_tables AS (
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
)
SELECT 
    'TABELAS FALTANDO' as tipo,
    r.table_name as nome,
    'PRECISA SER CRIADA' as status
FROM required_tables r
LEFT JOIN existing_tables e ON r.table_name = e.table_name
WHERE e.table_name IS NULL
ORDER BY r.table_name;
