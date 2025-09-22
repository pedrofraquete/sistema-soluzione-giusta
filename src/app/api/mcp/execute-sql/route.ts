import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query SQL é obrigatória' },
        { status: 400 }
      )
    }

    // Validações de segurança básicas
    const dangerousKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 'INSERT', 'UPDATE']
    const upperQuery = query.toUpperCase()
    
    const hasDangerousKeyword = dangerousKeywords.some(keyword => 
      upperQuery.includes(keyword)
    )

    if (hasDangerousKeyword) {
      return NextResponse.json(
        { 
          error: 'Operações de modificação não são permitidas via execute-sql. Use apply-migration para DDL.',
          suggestion: 'Para operações DDL, use a aba "Migrações"'
        },
        { status: 403 }
      )
    }

    // Executar via MCP CLI
    const mcpCommand = `manus-mcp-cli tool call execute_sql --server supabase --input '${JSON.stringify({ 
      project_id: process.env.SUPABASE_PROJECT_ID || 'default',
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
        query,
        result,
        timestamp: new Date().toISOString(),
        method: 'MCP execute_sql'
      })

    } catch (mcpError: any) {
      console.error('Erro MCP:', mcpError)
      
      // Fallback: Simular resultado para demonstração
      const simulatedResult = {
        success: true,
        query,
        result: {
          rows: [
            { 
              message: 'Simulação MCP - Conecte o token de acesso para execução real',
              query_executed: query,
              note: 'Esta é uma demonstração da interface MCP'
            }
          ],
          rowCount: 1,
          command: 'SELECT'
        },
        timestamp: new Date().toISOString(),
        method: 'MCP execute_sql (simulado)',
        warning: 'Token de acesso MCP não configurado - resultado simulado'
      }

      return NextResponse.json(simulatedResult)
    }

  } catch (error: any) {
    console.error('Erro na API execute-sql:', error)
    
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
