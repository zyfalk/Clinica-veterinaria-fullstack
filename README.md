# 🐾 VetCare — Sistema Web de Gestão para Clínica Veterinária

Sistema web fullstack desenvolvido em arquitetura de camadas para informatizar a rotina de atendimento veterinário, permitindo o cadastro de pacientes e tutores, o lançamento de procedimentos clínicos, a consulta de prontuários individuais e o acompanhamento de indicadores financeiros e operacionais em tempo real.

---

##  Funcionalidades

* **Painel Geral (Dashboard):** Cálculo automático de animais cadastrados, total de serviços realizados, receita acumulada e ticket médio por atendimento.
* **Cadastro de Animais:** Registro completo de pacientes (nome, espécie, raça, idade, peso) e dados de contato do tutor, com busca dinâmica instantânea na listagem.
* **Registro de Serviços Clínicos:** Lançamento de consultas, vacinações, exames laboratoriais, exames de imagem, cirurgias e retornos vinculados ao paciente.
* **Prontuário e Histórico por Animal:** Consulta individual detalhada com linha do tempo de atendimentos, resumo financeiro investido e opção de impressão direta do histórico.

---

##  Arquitetura e Tecnologias

* **Front-end (`frontend/`):** HTML5, CSS3 Responsivo e JavaScript ES6+ (Fetch API e persistência local de contingência).
* **Back-end (`backend/`):** API REST em Node.js com Express e CORS (acompanhada de servidor alternativo nativo em Python 3 em `server_python.py`).
* **Banco de Dados (`database/`):** SQLite 3 (`clinica_veterinaria.db`) com integridade referencial e scripts SQL (`schema.sql` e `seed.sql`).
* **Documentação (`documentacao.pdf`):** Especificação técnica das camadas, endpoints da API e telas de funcionamento do sistema.

---

##  Rotas da API REST

* `GET /api/animais` — Lista todos os animais cadastrados em ordem alfabética.
* `POST /api/animais` — Cadastra um novo animal e os dados do seu tutor.
* `DELETE /api/animais/:id` — Remove o cadastro de um animal pelo ID.
* `GET /api/servicos` — Lista o histórico geral de procedimentos realizados na clínica.
* `POST /api/servicos` — Registra um novo serviço clínico vinculado a um animal.
* `GET /api/animais/:id/historico` — Retorna a ficha cadastral, resumo financeiro e histórico completo de serviços de um animal específico.

---

##  Como Executar o Projeto

### Opção 1: Execução rápida no navegador
Abra diretamente o arquivo `frontend/index.html` em qualquer navegador web para testar todas as abas e funcionalidades com os dados iniciais carregados.

### Opção 2: Servidor Node.js + SQLite
```bash
cd backend
npm install
npm start
