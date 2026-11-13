SISTEMA WEB DE GESTÃO PARA CLÍNICA VETERINÁRIA - VETCARE

1. ESTRUTURA DE PASTAS DO PROJETO
- frontend/ : Arquivos da interface web (index.html, style.css e app.js)
- backend/  : Servidor e rotas da API REST (Node.js com Express e opção em Python)
- database/ : Scripts SQL (schema.sql, seed.sql) e banco SQLite (clinica_veterinaria.db)
- documentacao.pdf : Documento com explicação do sistema e telas de funcionamento

2. COMO EXECUTAR E TESTAR O SISTEMA

Opção 1 - Abrir direto no navegador (Mais rápido):
Basta dar dois cliques no arquivo "frontend/index.html" para abrir no navegador.
O sistema já carrega os dados iniciais e permite cadastrar animais, registrar serviços e consultar o histórico imediatamente.

Opção 2 - Rodando com o servidor Node.js:
1. Abra o terminal na pasta "backend"
2. Digite: npm install
3. Digite: npm start
4. Abra o navegador em: http://localhost:3000

Opção 3 - Rodando com Python (sem instalar pacotes):
1. Abra o terminal na pasta do projeto
2. Digite: python backend/server_python.py
3. Abra o navegador em: http://localhost:3000
