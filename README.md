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
- git clone (https://github.com/FabioCorreiaLima/Recikla-Marica.git)
- cd recikla-marica/my-express-api
2. Instale as dependências:
- npm install

3. Criando banco de dados (Postgres)

- Conentando no Postgres: ```psql -U postgres -h localhost```
- Criando banco de dados: ```create database recikla_marica_api;```

3.1. Configuração do banco de dados (mysql ou postgres)
Certifique-se de que o MySQL ou o Postgres esteja instalado e rodando em sua máquina ou em um servidor remoto. Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

# MySQL configuration
- DB_NAME=recikla_marica_api
- DB_USER=root
- DB_PASSWORD=sua_senha
- DB_HOST=localhost
- DB_PORT=3306

# PostgreSQL configuration
- PGDATABASE=recikla_marica_api
- PGUSER=postgres
- PGPASSWORD=your_password
- PGHOST=localhost
- PGPORT=5432

4. Configuração do Sequelize
Inicialize o banco de dados com o Sequelize CLI:

- npx sequelize-cli db:create
- npx sequelize-cli db:migrate
5. Executando o projeto:
- Inicie a API:
- npm run dev
- A API estará disponível em http://localhost:3001

### Endpoints da API
- POST /auth/register - Registra um novo usuário.
- POST /auth/login - Autentica o usuário e retorna um token JWT.
- POST /auth/forgot-password - Gera um token para redefinição de senha e envia para o email do usuário.
- POST /auth/reset-password - Redefine a senha do usuário utilizando o token recebido por email.

## Projeto 2: Aplicativo Web de Monitoramento (Frontend)
Este é um aplicativo web desenvolvido com next.js que permite aos usuários monitorar a coleta de materiais recicláveis. O sistema inclui visualizações de dados e mapas de pontos de coleta, entre outras.

## Tecnologias Utilizadas
- React.js - Biblioteca JavaScript para criação de interfaces de usuário.
- Axios - Biblioteca para requisições HTTP.
- React Router - Navegação entre páginas no React.
- Bootstrap - Framework de CSS para estilização.
## Instalação e Configuração
1. Clone o repositório (se não tiver feito ainda):
- git clone (https://github.com/FabioCorreiaLima/Recikla-Marica.git)
- cd Recikla-Marica/recikla-marica
2. Instale as dependências:
- npm install
3. Configuração do ambiente:
- Crie um arquivo .env na raiz do projeto com as variáveis de ambiente:
- REACT_APP_API_URL=http://localhost:3000
- REACT_APP_MAPBOX_TOKEN=seu_token_do_mapbox
- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_api_key

4. Executando o projeto:
## Inicie o servidor de desenvolvimento:
- npm run dev
- O aplicativo estará disponível em http://localhost:3000

## Funcionalidades
- Monitoramento de Coleta: Veja os pontos de coleta e quantidades de materiais reciclados.
- Mapa com Localização do Usuário e Rastreamento em Tempo Real
- Login de Usuário: Faça login e veja dados personalizados.
- 
## Executando Ambos os Projetos
### Se você deseja rodar os dois projetos ao mesmo tempo:

- Abra dois terminais.
- No primeiro terminal, vá até o diretório my-express-api e execute o comando npm run dev para iniciar a API, que estará disponível em http://localhost:3001
- Somente após a API estar em execução, vá até o segundo terminal, acesse o diretório recikla-marica e execute o comando npm run dev para iniciar o aplicativo web, que estará disponível em http://localhost:3000
