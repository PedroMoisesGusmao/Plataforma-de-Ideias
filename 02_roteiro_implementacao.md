# **Roteiro de Implementação: O Guia Passo a Passo 🛠️🎯**

Este é o seu *manual de instruções* completo. Sigam este passo a passo cirúrgico para garantir o sucesso do projeto, dividindo as tarefas conforme a responsabilidade.

## **1\. Decisões Iniciais Estratégicas (Consenso Obrigatório do Trio) 🤝**

| Decisão | Detalhe Técnico e Prescrição (O que FAZER) | Responsável pela Ação Inicial |
| :---- | :---- | :---- |
| **1\. 💾 Tipo de Banco de Dados** | **ESCOLHAM MONGOOSE\!** Instalem npm install mongoose. | Especialista em Banco de Dados |
| **2\. 🔑 Sistema de Autenticação** | **ESCOLHAM SESSÕES\!** Instalem npm install express-session. | Desenvolvedor Backend |
| **3\. 🔒 Variáveis de Ambiente** | **OBRIGATÓRIO\!** Instalem npm install dotenv e usem **require('dotenv').config()** no app.js. | Desenvolvedor Backend |
| **4\. 📂 Estrutura de Pastas** | Criem IMEDIATAMENTE: /models, /routes, /controllers, /views, /public, /middlewares. | Frontend/Documentação |

## **PARTE 1: Roteiro para a Nota 7 (MVP Funcional) 💻**

### **Tarefas Chave (DB e Backend) 💾⚙️**

| Passo | Objetivo | Prescrição Técnica |
| :---- | :---- | :---- |
| **DB 2.2-2.4** | Modelagem Básica (User, Ideia, Voto) | Crie Models com **referências** (ref: 'User') e garanta required: true nos campos essenciais. |
| **Backend 2.5** | Autenticação com HASH | Use **bcrypt.hash()** no cadastro e **bcrypt.compare()** no login. |
| **Backend 2.7** | Middleware isLoggedIn | Crie a função que verifica req.session.userId. Se não existir, res.redirect('/login'). |
| **Backend 2.8** | Rotas CRUD Básico | Implemente POST /ideias (usando req.session.userId para o autor) e GET /ideias. |
| **Backend 2.9** | Tratamento de Erro BÁSICO | Envolva o código do DB em **try...catch** para evitar que o servidor quebre. |

### **Tarefas Chave (Frontend) 🖼️**

| Passo | Objetivo | Prescrição Técnica |
| :---- | :---- | :---- |
| **Frontend 2.11** | Views de Auth | Crie formulários de Login/Cadastro com method="POST" e action apontando para as rotas do Backend. |
| **Frontend 2.12** | Views CRUD (Listagem) | Use o loop do Handlebars ({{\#each ideias}}) para exibir os dados dinâmicos. |
| **Frontend 2.13** | Documentação Simples | Entregue um **README.md** com as instruções básicas para iniciar o projeto (npm install, npm start). |

## **PARTE 2: Fase de Excelência (Rumo à Nota 10\) 👑✨**

### **Tarefas Chave (DB e Backend Avançado) 💾⚙️**

| Passo | Objetivo | Prescrição Técnica |
| :---- | :---- | :---- |
| **DB 4.1** | Voto Único Robusto | Crie um **índice único composto** no Schema de Voto (userId e ideaId) para que o DB garanta a integridade. |
| **DB 4.2** | Contagem e Ordenação | Use **Mongoose Aggregation Pipeline** ($lookup, $group, $sort) para calcular os votos e ordenar a lista de ideias. |
| **DB 4.3** | Views de Perfil | Implementar a busca de ideias cadastradas pelo usuário logado. |
| **Backend 4.4** | Blindagem HTTP | Instale e use **helmet** (app.use(helmet());) no app.js. |
| **Backend 4.5** | Estabilidade Assíncrona | Instale e use **express-async-errors** para tratamento global de erros do DB. |
| **Backend 4.7** | Autorização isAuthor | Crie um *middleware* que busca a ideia, compara o autorId com o req.session.userId, e retorna 403 se for diferente. |

### **Tarefas Chave (Frontend e Documentação Sênior) 🖼️📄**

| Passo | Objetivo | Prescrição Técnica |
| :---- | :---- | :---- |
| **Frontend 4.8** | Proteção CSRF | Instale **csurf**. Adicione um campo HIDDEN (name="\_csrf" value="{{csrfToken}}") em **TODOS** os formulários POST. |
| **Frontend 4.9** | Mensagens de Feedback | Instale **express-flash**. Use req.flash() no Controller e exiba as mensagens na View após o redirect. |
| **Doc. 4.10** | Documentação Sênior | Crie um **Diagrama de Entidade-Relacionamento** e uma **Tabela de Endpoints** no README.md. |

