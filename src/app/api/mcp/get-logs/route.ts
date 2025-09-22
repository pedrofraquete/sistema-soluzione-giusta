import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const service = searchParams.get('service')

    if (!service) {
      return NextResponse.json(
        { error: 'Parâmetro service é obrigatório' },
        { status: 400 }
      )
    }

    // Validar serviços permitidos
    const allowedServices = ['postgres', 'auth', 'realtime', 'storage', 'edge']
    if (!allowedServices.includes(service)) {
      return NextResponse.json(
        { error: `Serviço inválido. Permitidos: ${allowedServices.join(', ')}` },
        { status: 400 }
      )
    }

    // Executar via MCP CLI
    const mcpCommand = `manus-mcp-cli tool call get_logs --server supabase --input '${JSON.stringify({ 
      project_id: process.env.SUPABASE_PROJECT_ID || 'default',
      service: service
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
        service,
        result,
        timestamp: new Date().toISOString(),
        method: 'MCP get_logs'
      })

    } catch (mcpError: any) {
      console.error('Erro MCP:', mcpError)
      
      // Fallback: Simular logs para demonstração
      const simulatedLogs = generateSimulatedLogs(service)

      const simulatedResult = {
        success: true,
        service,
        result: {
          logs: simulatedLogs,
          service_name: service,
          time_range: 'Último minuto',
          note: 'Esta é uma demonstração da interface MCP',
          warning: 'Conecte o token de acesso para logs reais'
        },
        timestamp: new Date().toISOString(),
        method: 'MCP get_logs (simulado)',
        warning: 'Token de acesso MCP não configurado - resultado simulado'
      }

      return NextResponse.json(simulatedResult)
    }

  } catch (error: any) {
    console.error('Erro na API get-logs:', error)
    
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

function generateSimulatedLogs(service: string) {
  const now = new Date()
  const logs = []

  // Gerar logs simulados baseados no serviço
  switch (service) {
    case 'postgres':
      logs.push(
        {
          timestamp: new Date(now.getTime() - 30000).toISOString(),
          level: 'INFO',
          message: 'Connection established from 192.168.1.100',
          details: 'User: postgres, Database: postgres'
        },
        {
          timestamp: new Date(now.getTime() - 25000).toISOString(),
          level: 'INFO',
          message: 'Query executed successfully',
          details: 'SELECT * FROM companies LIMIT 10'
        },
        {
          timestamp: new Date(now.getTime() - 15000).toISOString(),
          level: 'INFO',
          message: 'Connection closed',
          details: 'Duration: 15.2s'
        }
      )
      break

    case 'auth':
      logs.push(
        {
          timestamp: new Date(now.getTime() - 45000).toISOString(),
          level: 'INFO',
          message: 'User login successful',
          details: 'Email: pedro@soluzionegiusta.com.br'
        },
        {
          timestamp: new Date(now.getTime() - 20000).toISOString(),
          level: 'INFO',
          message: 'JWT token refreshed',
          details: 'User ID: 123e4567-e89b-12d3-a456-426614174000'
        }
      )
      break

    case 'realtime':
      logs.push(
        {
          timestamp: new Date(now.getTime() - 35000).toISOString(),
          level: 'INFO',
          message: 'WebSocket connection established',
          details: 'Channel: chat_messages'
        },
        {
          timestamp: new Date(now.getTime() - 10000).toISOString(),
          level: 'INFO',
          message: 'Message broadcasted',
          details: 'Channel: chat_messages, Subscribers: 5'
        }
      )
      break

    case 'storage':
      logs.push(
        {
          timestamp: new Date(now.getTime() - 40000).toISOString(),
          level: 'INFO',
          message: 'File uploaded successfully',
          details: 'Bucket: documents, File: contract_2024.pdf'
        },
        {
          timestamp: new Date(now.getTime() - 12000).toISOString(),
          level: 'INFO',
          message: 'File access granted',
          details: 'User: admin, File: contract_2024.pdf'
        }
      )
      break

    case 'edge':
      logs.push(
        {
          timestamp: new Date(now.getTime() - 50000).toISOString(),
          level: 'INFO',
          message: 'Edge function invoked',
          details: 'Function: process-webhook, Duration: 245ms'
        },
        {
          timestamp: new Date(now.getTime() - 8000).toISOString(),
          level: 'INFO',
          message: 'Edge function completed',
          details: 'Function: send-notification, Status: 200'
        }
      )
      break

    default:
      logs.push(
        {
          timestamp: now.toISOString(),
          level: 'INFO',
          message: `Logs do serviço ${service}`,
          details: 'Serviço funcionando normalmente'
        }
      )
  }

  return logs
}
