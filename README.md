# 💡 Plataforma de Ideias  
---

## Objetivo

A **Plataforma de Ideias para Inovação** é um sistema web desenvolvido para permitir que colaboradores do Grupo J&F proponham, votem e acompanhem ideias inovadoras.  

## Tecnologias

- **Node.js + Express.js**
- **Handlebars** 
- **MongoDB (via Mongoose)**  
- **Express-Session + bcrypt + csurf + helmet**
- **express-validator** 
- **dotenv** 

---

## ⚙️ Funcionalidades Principais

| Módulo | Funcionalidade | Descrição |
|--------|----------------|------------|
| Autenticação | Cadastro, Login, Logout | Criptografia com bcrypt, sessões com express-session |
| Ideias | CRUD Completo | Criação, leitura, edição e exclusão de ideias |
| Votação | Voto Único por Usuário | Relaciona usuários e ideias, impedindo votos duplicados |
| Autorização | Controle de Acesso | Apenas o autor pode editar/excluir suas ideias |
| Interface | Handlebars + Flash | Feedback amigável e design simples |
| Segurança | helmet + csurf | Proteções contra ataques comuns |

---

## ( ͡• ͜ʖ ͡• ) Rotas (URL)

| Módulo         | Funcionalidade                                     |
|----------------|----------------------------------------------------|
| /              | Começo, onde o usuário escolhe o login ou cadastro |
| /user/login    | Login                                              |
| /user/register | Cadastro                                           |
| /home          | Tela inicial, com listagem das ideias              |
| /create        | Criação de ideias                                  |

---

## 🗄️ Modelagem do Banco de Dados

inserir a modelagem

---

## 🧰 Como iniciar o projeto

### 1️⃣ Clonar o projeto
```bash
git clone https://github.com/seuusuario/plataforma-ideias.git
cd plataforma-ideias
```

### 2️⃣ Instalar dependências
```bash
npm install
```

### 3️⃣ Configurar variáveis de ambiente
Crie um arquivo `.env` com:
```bash
DB_HOST=localhost
DB_USER=root
DB_PASS=senha
DB_NAME=plataforma_ideias
SESSION_SECRET=segredo_seguro
PORT=3000
```

### 4️⃣ Executar o servidor
```bash
npm start
```
Acesse em: [http://localhost:3000](http://localhost:3000)

---

## 🔒 Segurança e Boas Práticas

- `helmet` → Proteção de headers HTTP  
- `csurf` → Proteção contra CSRF  
- `bcrypt` → Hash seguro de senhas  
- `express-validator` → Validação de formulários  
- `dotenv` → Segredos protegidos fora do código  
- `try...catch` + `express-async-errors` → Tratamento global de exceções  

---

## Fluxograma

<img width="2342" height="1272" alt="image" src="https://github.com/user-attachments/assets/184470a2-c323-4715-bb45-06d4faf3fc33" />


---





