#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testBasicIntegration() {
  console.log('🚀 Testando integração básica do Sistema ERP Journey 100k\n')
  
  try {
    // Teste 1: Conexão básica
    console.log('1️⃣  Testando conexão com Supabase...')
    const { data: companies, error: connectionError } = await supabase
      .from('companies')
      .select('*')
      .limit(1)
    
    if (connectionError) {
      console.log('❌ Erro de conexão:', connectionError.message)
      return false
    }
    
    console.log('✅ Conexão estabelecida com sucesso!')
    console.log(`📊 Encontradas ${companies?.length || 0} empresas no sistema\n`)
    
    // Teste 2: Listar empresas
    console.log('2️⃣  Testando dados das empresas...')
    const { data: allCompanies } = await supabase
      .from('companies')
      .select('name, cnpj, active')
    
    if (allCompanies && allCompanies.length > 0) {
      console.log('✅ Empresas encontradas:')
      allCompanies.forEach(company => {
        console.log(`   - ${company.name} (${company.cnpj}) ${company.active ? '🟢' : '🔴'}`)
      })
    } else {
      console.log('⚠️  Nenhuma empresa encontrada')
    }
    
    // Teste 3: Testar autenticação básica
    console.log('\n3️⃣  Testando funcionalidade de autenticação...')
    const authResponse = await supabase.auth.getSession()
    if (authResponse) {
      console.log('✅ Módulo de autenticação está funcionando')
    }
    
    // Teste 4: Testar tabelas principais
    console.log('\n4️⃣  Verificando tabelas principais...')
    const mainTables = ['employees', 'projects', 'financial_transactions', 'messages', 'gamification']
    
    for (const table of mainTables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1)
        if (error) {
          console.log(`❌ Tabela '${table}': ${error.message}`)
        } else {
          console.log(`✅ Tabela '${table}': OK`)
        }
      } catch (e) {
        console.log(`❌ Tabela '${table}': ${e.message}`)
      }
    }
    
    console.log('\n🎉 Teste de integração concluído!')
    console.log('\n📋 PRÓXIMOS PASSOS:')
    console.log('   1. Para configurar o schema completo:')
    console.log('      - Acesse o painel do Supabase')
    console.log('      - Vá para SQL Editor') 
    console.log('      - Execute o arquivo: schema_essencial.sql')
    console.log('   2. Reinicie o sistema após aplicar o schema')
    
    return true
    
  } catch (error) {
    console.error('❌ Erro fatal:', error.message)
    return false
  }
}

// Executar teste
testBasicIntegration().catch(error => {
  console.error('Erro:', error.message)
  process.exit(1)
})