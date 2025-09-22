#!/bin/bash

# Lista de módulos que precisam ser atualizados
modules=("documentos" "gamificacao" "ponto" "projetos" "relatorios")

# Função de navegação padronizada
navigation_function='  const handleNavigation = (module: string) => {
    const routes: { [key: string]: string } = {
      '\''Dashboard'\'': '\''/dashboard'\'',
      '\''Funcionários'\'': '\''/funcionarios'\'',
      '\''Projetos'\'': '\''/projetos'\'',
      '\''Financeiro'\'': '\''/financeiro'\'',
      '\''Chat'\'': '\''/chat'\'',
      '\''Ponto Digital'\'': '\''/ponto'\'',
      '\''Documentos'\'': '\''/documentos'\'',
      '\''Relatórios'\'': '\''/relatorios'\'',
      '\''Gamificação'\'': '\''/gamificacao'\'',
      '\''Configurações'\'': '\''/configuracoes'\''
    }
    
    if (routes[module]) {
      window.location.href = routes[module]
    }
  }'

echo "Atualizando navegação nos módulos..."

for module in "${modules[@]}"; do
    file="src/app/$module/page.tsx"
    if [ -f "$file" ]; then
        echo "Processando $file..."
        # Verificar se já tem handleNavigation
        if ! grep -q "handleNavigation" "$file"; then
            echo "Adicionando handleNavigation em $file"
        fi
    fi
done

echo "Script preparado!"
