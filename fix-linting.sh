#!/bin/bash

# Corrigir tipos any para unknown em arquivos de API
find src/app/api/mcp -name "*.ts" -exec sed -i 's/: any/: unknown/g' {} \;
find src/lib/api -name "*.ts" -exec sed -i 's/: any/: unknown/g' {} \;

# Remover variáveis não utilizadas
sed -i '/parseError.*never used/d' src/app/api/mcp/*.ts
sed -i '/request.*never used/d' src/app/api/mcp/*.ts

# Corrigir aspas não escapadas em arquivos TSX
find src -name "*.tsx" -exec sed -i 's/"/\&quot;/g' {} \;

# Remover imports não utilizados
sed -i '/useEffect.*never used/d' src/app/relatorios/page.tsx

echo "Correções aplicadas!"
