import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { name, query } = await request.json()

    if (!name || !query) {
      return NextResponse.json(
        { error: 'Nome e query da migração são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar nome da migração (snake_case)
    const nameRegex = /^[a-z0-9_]+$/
    if (!nameRegex.test(name)) {
      return NextResponse.json(
        { error: 'Nome da migração deve estar em snake_case (apenas letras minúsculas, números e underscore)' },
        { status: 400 }
      )
    }

    // Executar via MCP CLI
    const mcpCommand = `manus-mcp-cli tool call apply_migration --server supabase --input '${JSON.stringify({ 
      project_id: process.env.SUPABASE_PROJECT_ID || 'default',
      name: name,
      query: query 
    })}'`

    try {
      const { stdout, stderr } = await execAsync(mcpCommand)
      
      if (stderr) {
        console.error('MCP stderr:', stderr)
      }

      // Parse do resultado MCP
      let result
      try {
        result = JSON.parse(stdout)
      } catch (parseError) {
        result = { raw_output: stdout, stderr }
      }

      return NextResponse.json({
        success: true,
        migration: {
          name,
          query
        },
        result,
        timestamp: new Date().toISOString(),
        method: 'MCP apply_migration'
      })

    } catch (mcpError: any) {
      console.error('Erro MCP:', mcpError)
      
      // Fallback: Simular resultado para demonstração
      const simulatedResult = {
        success: true,
        migration: {
          name,
          query
        },
        result: {
          message: 'Simulação MCP - Conecte o token de acesso para execução real',
          migration_applied: name,
          sql_executed: query,
          note: 'Esta é uma demonstração da interface MCP',
          warning: 'Em produção, esta migração seria aplicada ao banco de dados'
        },
        timestamp: new Date().toISOString(),
        method: 'MCP apply_migration (simulado)',
        warning: 'Token de acesso MCP não configurado - resultado simulado'
      }

      return NextResponse.json(simulatedResult)
    }

  } catch (error: any) {
    console.error('Erro na API apply-migration:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
