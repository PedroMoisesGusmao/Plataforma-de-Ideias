# 💡 Plataforma de Ideias  
---

## Objetivo

A **Plataforma de Ideias para Inovação** é um sistema web desenvolvido para permitir que colaboradores do Grupo J&F proponham, votem e acompanhem ideias inovadoras.  

## Tecnologias

- **Node.js + Express.js**
- **Handlebars** 
- **MongoDB (via Mongoose)**  
- **Express-Session + bcrypt + helmet**
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
| Segurança | helmet + csurf | Proteções contra ataques comuns |

---

## ( ͡• ͜ʖ ͡• ) Rotas (URL)

| Módulo                | Funcionalidade                                     |
|-----------------------|----------------------------------------------------|
| /                     | Começo, onde o usuário escolhe o login ou cadastro |
| /user/login           | Login                                              |
| /user/logout          | Logout                                             |
| /user/register        | Cadastro                                           |
| /idea/home            | Tela inicial, com listagem das ideias              |
| /idea/create          | Criar uma nova ideia                               |
| /idea/update/:id      | Edição de ideias existentes                        |
| /idea/delete/:id      | Exclusão de ideias existentes                      |
| /vote/toggle/:ideaId  | Alterna voto (adiciona ou remove).                 |
| /vote/count/:ideaId   | Retorna contagem de votos para uma ideia.          |

---

## 🛹 Como rodar o projeto locamente

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
# Configuração do Banco de Dados MongoDB
MONGODB_URI=mongodb://localhost:27017/plataforma_ideias

# Para MongoDB Atlas (cloud), use o formato:
# MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/plataforma_ideias?retryWrites=true&w=majority

# Configurações da Aplicação
NODE_ENV=development
PORT=3000

# Configurações de Sessão
SESSION_SECRET=sua_chave_secreta_super_segura_aqui
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

---

## Modelagem do banco

<img width="613" height="520" alt="image" src="https://github.com/user-attachments/assets/6a063903-53ea-454d-8f0a-7587cb41f6ce" />


---







