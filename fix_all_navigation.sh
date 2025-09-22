#!/bin/bash

# Módulos que precisam ser atualizados
modules=("gamificacao" "ponto" "projetos" "relatorios")

# Função para adicionar handleNavigation se não existir
add_navigation_function() {
    local file=$1
    if ! grep -q "handleNavigation" "$file"; then
        # Encontrar a linha após os useState e adicionar a função
        sed -i '/useState.*);$/a\\n  const handleNavigation = (module: string) => {\n    const routes: { [key: string]: string } = {\n      '\''Dashboard'\'': '\''/dashboard'\'',\n      '\''Funcionários'\'': '\''/funcionarios'\'',\n      '\''Projetos'\'': '\''/projetos'\'',\n      '\''Financeiro'\'': '\''/financeiro'\'',\n      '\''Chat'\'': '\''/chat'\'',\n      '\''Ponto Digital'\'': '\''/ponto'\'',\n      '\''Documentos'\'': '\''/documentos'\'',\n      '\''Relatórios'\'': '\''/relatorios'\'',\n      '\''Gamificação'\'': '\''/gamificacao'\'',\n      '\''Configurações'\'': '\''/configuracoes'\''\n    }\n    \n    if (routes[module]) {\n      window.location.href = routes[module]\n    }\n  };' "$file"
    fi
}

# Atualizar cada módulo
for module in "${modules[@]}"; do
    file="src/app/$module/page.tsx"
    if [ -f "$file" ]; then
        echo "Atualizando $file..."
        add_navigation_function "$file"
        echo "✅ $file atualizado"
    else
        echo "❌ $file não encontrado"
    fi
done

echo "Todos os módulos foram atualizados!"
