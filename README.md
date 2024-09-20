# Recikla-Maricá


Este repositório contém dois projetos separados que fazem parte da iniciativa Recikla-Maricá. Cada um pode ser executado e gerenciado independentemente. Abaixo, você encontrará instruções para configuração, execução e dependências de cada projeto.
## Projetos
- Projeto 1: API de Gerenciamento de Reciclagem (Backend)
- Projeto 2: Aplicativo Web de Monitoramento (Frontend)

## Projeto 1: API de Gerenciamento de Reciclagem (Backend)
Este projeto é uma API desenvolvida em Node.js usando Express para gerenciar os dados de reciclagem, como coleta de resíduos, usuários, e pontos de entrega. Utiliza MySqL como banco de dados.

## Tecnologias Utilizadas
- Node.js - Ambiente de execução JavaScript.
- Express - Framework para construção de APIs em Node.js.
- Sequelize - ORM para manipulação do banco de dados relacional.
- MySQL - Banco de dados relacional.
- JWT - Autenticação via JSON Web Tokens.
- dotenv - Gerenciamento de variáveis de ambiente..


## Instalação e Configuração
1. Clone o repositório:
- git clone https://github.com/recikla-marica/recikla-marica.git
- cd recikla-marica/my-express-api
2. Instale as dependências:
- npm install

3. Configuração do banco de dados
Certifique-se de que o MySQL esteja instalado e rodando em sua máquina ou em um servidor remoto. Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

- PORT=3000
- DB_NAME=recikla_marica_api
- DB_USER=root
- DB_PASSWORD=sua_senha
- DB_HOST=localhost
- DB_PORT=3306
- JWT_SECRET=seu_segredo_jwt


4. Configuração do Sequelize
Inicialize o banco de dados com o Sequelize CLI:


- npx sequelize-cli db:create
- npx sequelize-cli db:migrate
5. Executando o projeto:
Inicie a API:
npm start
A API estará disponível em http://localhost:3000.

### Endpoints da API
- POST /auth/register - Registra um novo usuário.
- POST /auth/login - Autentica o usuário e retorna um token JWT.
- POST /auth/forgot-password - Gera um token para redefinição de senha e envia para o email do usuário.
- POST /auth/reset-password - Redefine a senha do usuário utilizando o token recebido por email.
