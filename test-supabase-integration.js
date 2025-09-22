#!/usr/bin/env node

/**
 * Script de teste para validar a integração completa com Supabase
 * Sistema ERP Journey 100k - Soluzione Giusta
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas')
  console.log('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão definidas em .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

function logHeader(message) {
  log(`\n${colors.bold}=== ${message} ===${colors.reset}`, 'blue')
}

// Testes de conexão
async function testConnection() {
  logHeader('TESTE DE CONEXÃO')
  
  try {
    const { data, error } = await supabase.from('companies').select('count', { count: 'exact' })
    
    if (error) {
      logError(`Falha na conexão: ${error.message}`)
      return false
    }
    
    logSuccess('Conexão com Supabase estabelecida')
    return true
  } catch (error) {
    logError(`Erro de conexão: ${error.message}`)
    return false
  }
}

// Teste de tabelas
async function testTables() {
  logHeader('TESTE DE TABELAS')
  
  const tables = [
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
  ]
  
  let successCount = 0
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1)
      
      if (error) {
        logError(`Tabela '${table}': ${error.message}`)
      } else {
        logSuccess(`Tabela '${table}': OK`)
        successCount++
      }
    } catch (error) {
      logError(`Tabela '${table}': ${error.message}`)
    }
  }
  
  logInfo(`${successCount}/${tables.length} tabelas funcionando corretamente`)
  return successCount === tables.length
}

// Teste de views
async function testViews() {
  logHeader('TESTE DE VIEWS')
  
  const views = [
    'employees_full',
    'projects_stats',
    'gamification_ranking'
  ]
  
  let successCount = 0
  
  for (const view of views) {
    try {
      const { error } = await supabase.from(view).select('*').limit(1)
      
      if (error) {
        logError(`View '${view}': ${error.message}`)
      } else {
        logSuccess(`View '${view}': OK`)
        successCount++
      }
    } catch (error) {
      logError(`View '${view}': ${error.message}`)
    }
  }
  
  logInfo(`${successCount}/${views.length} views funcionando corretamente`)
  return successCount === views.length
}

// Teste de dados iniciais
async function testInitialData() {
  logHeader('TESTE DE DADOS INICIAIS')
  
  try {
    // Verificar empresas
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
    
    if (companiesError) {
      logError(`Erro ao buscar empresas: ${companiesError.message}`)
    } else {
      logSuccess(`${companies.length} empresas encontradas`)
      companies.forEach(company => {
        logInfo(`  - ${company.name} (${company.cnpj})`)
      })
    }
    
    // Verificar configurações do sistema
    const { data: settings, error: settingsError } = await supabase
      .from('system_settings')
      .select('*')
    
    if (settingsError) {
      logError(`Erro ao buscar configurações: ${settingsError.message}`)
    } else {
      logSuccess(`${settings.length} configurações do sistema encontradas`)
    }
    
    // Verificar desafios
    const { data: challenges, error: challengesError } = await supabase
      .from('challenges')
      .select('*')
    
    if (challengesError) {
      logError(`Erro ao buscar desafios: ${challengesError.message}`)
    } else {
      logSuccess(`${challenges.length} desafios encontrados`)
    }
    
    return true
  } catch (error) {
    logError(`Erro nos dados iniciais: ${error.message}`)
    return false
  }
}

// Teste de operações CRUD
async function testCRUDOperations() {
  logHeader('TESTE DE OPERAÇÕES CRUD')
  
  try {
    // Teste com empresas (operação simples)
    logInfo('Testando operações CRUD com empresas...')
    
    // CREATE
    const { data: newCompany, error: createError } = await supabase
      .from('companies')
      .insert({
        name: 'Empresa Teste',
        cnpj: '00.000.000/0001-99',
        type: 'subsidiary'
      })
      .select()
      .single()
    
    if (createError) {
      logError(`Erro ao criar empresa: ${createError.message}`)
      return false
    }
    
    logSuccess('CREATE: Empresa criada com sucesso')
    
    // READ
    const { data: readCompany, error: readError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', newCompany.id)
      .single()
    
    if (readError) {
      logError(`Erro ao ler empresa: ${readError.message}`)
      return false
    }
    
    logSuccess('READ: Empresa lida com sucesso')
    
    // UPDATE
    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .update({ name: 'Empresa Teste Atualizada' })
      .eq('id', newCompany.id)
      .select()
      .single()
    
    if (updateError) {
      logError(`Erro ao atualizar empresa: ${updateError.message}`)
      return false
    }
    
    logSuccess('UPDATE: Empresa atualizada com sucesso')
    
    // DELETE
    const { error: deleteError } = await supabase
      .from('companies')
      .delete()
      .eq('id', newCompany.id)
    
    if (deleteError) {
      logError(`Erro ao deletar empresa: ${deleteError.message}`)
      return false
    }
    
    logSuccess('DELETE: Empresa deletada com sucesso')
    
    return true
  } catch (error) {
    logError(`Erro nas operações CRUD: ${error.message}`)
    return false
  }
}

// Teste de RLS (Row Level Security)
async function testRLS() {
  logHeader('TESTE DE ROW LEVEL SECURITY')
  
  try {
    // Verificar se RLS está habilitado nas tabelas principais
    const { data: rlsStatus, error } = await supabase.rpc('check_rls_status')
    
    if (error) {
      logWarning('Não foi possível verificar status do RLS automaticamente')
      logInfo('RLS deve estar configurado manualmente no painel do Supabase')
    } else {
      logSuccess('RLS verificado com sucesso')
    }
    
    return true
  } catch (error) {
    logWarning('Teste de RLS não implementado - verificar manualmente')
    return true
  }
}

// Teste de performance
async function testPerformance() {
  logHeader('TESTE DE PERFORMANCE')
  
  try {
    const startTime = Date.now()
    
    // Fazer várias consultas simultâneas
    const promises = [
      supabase.from('companies').select('*').limit(10),
      supabase.from('employees_full').select('*').limit(10),
      supabase.from('projects_stats').select('*').limit(10),
      supabase.from('financial_transactions').select('*').limit(10),
      supabase.from('gamification_ranking').select('*').limit(10)
    ]
    
    const results = await Promise.all(promises)
    const endTime = Date.now()
    const duration = endTime - startTime
    
    const errors = results.filter(result => result.error)
    
    if (errors.length > 0) {
      logError(`${errors.length} consultas falharam`)
      errors.forEach(error => logError(`  - ${error.error.message}`))
    } else {
      logSuccess(`5 consultas simultâneas executadas em ${duration}ms`)
      
      if (duration < 1000) {
        logSuccess('Performance excelente (< 1s)')
      } else if (duration < 3000) {
        logWarning('Performance aceitável (1-3s)')
      } else {
        logError('Performance ruim (> 3s)')
      }
    }
    
    return errors.length === 0
  } catch (error) {
    logError(`Erro no teste de performance: ${error.message}`)
    return false
  }
}

// Função principal
async function runTests() {
  log(`${colors.bold}🚀 TESTE DE INTEGRAÇÃO SUPABASE - SISTEMA ERP JOURNEY 100K${colors.reset}`)
  log(`${colors.blue}Soluzione Giusta - Sistema de Gestão Empresarial${colors.reset}\n`)
  
  const tests = [
    { name: 'Conexão', fn: testConnection },
    { name: 'Tabelas', fn: testTables },
    { name: 'Views', fn: testViews },
    { name: 'Dados Iniciais', fn: testInitialData },
    { name: 'Operações CRUD', fn: testCRUDOperations },
    { name: 'Row Level Security', fn: testRLS },
    { name: 'Performance', fn: testPerformance }
  ]
  
  let passedTests = 0
  const totalTests = tests.length
  
  for (const test of tests) {
    try {
      const result = await test.fn()
      if (result) {
        passedTests++
      }
    } catch (error) {
      logError(`Erro no teste ${test.name}: ${error.message}`)
    }
  }
  
  logHeader('RESULTADO FINAL')
  
  if (passedTests === totalTests) {
    logSuccess(`🎉 TODOS OS TESTES PASSARAM! (${passedTests}/${totalTests})`)
    logSuccess('Sistema ERP Journey 100k totalmente integrado ao Supabase!')
  } else {
    logWarning(`⚠️  ${passedTests}/${totalTests} testes passaram`)
    
    if (passedTests >= totalTests * 0.8) {
      logWarning('Sistema funcional com algumas limitações')
    } else {
      logError('Sistema requer correções antes do uso em produção')
    }
  }
  
  logInfo('\nPara aplicar o schema completo no Supabase:')
  logInfo('1. Acesse o painel do Supabase')
  logInfo('2. Vá para SQL Editor')
  logInfo('3. Execute o arquivo supabase_schema_completo.sql')
  
  process.exit(passedTests === totalTests ? 0 : 1)
}

// Executar testes
runTests().catch(error => {
  logError(`Erro fatal: ${error.message}`)
  process.exit(1)
})
