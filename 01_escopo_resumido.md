# **ESPECIFICAÇÃO: Plataforma de Ideias para Inovação 💡⚙️🎯**

## **Introdução ao Desafio**

O Grupo J\&F está de olho na inovação e precisa do talento de vocês\! 🧠 A missão é criar a **Plataforma de Ideias**, uma ferramenta que vai ser o motor da criatividade dos colaboradores, permitindo que enviem, votem e acompanhem propostas que podem mudar o jogo. 📈

Vocês são o time de elite do **Instituto J\&F Tech**, responsáveis por entregar o **MVP (Produto Mínimo Viável)**. Isso significa construir a base essencial do sistema, com foco em Qualidade Top, Clareza e Muita Segurança. É hora de aplicar o Node.js e o Express para criar algo real e valioso\! 💪

## **O Produto Mínimo Viável (MVP) – Requisitos Funcionais 🛠️**

O MVP deve ser uma aplicação web completa, combinando o poder do Node.js, Express, Handlebars e banco de dados, com as seguintes funcionalidades:

### **1\. Sistema de Autenticação Robusto (Seu Portal Seguro) 🔑**

* **Cadastro e Login:** Fluxo seguro. Use **bcrypt** para *hash* de senhas.  
* **Gestão de Sessão:** Use **Sessões (express-session)** e crie um *middleware* (isLoggedIn) para bloquear o acesso às páginas restritas.  
* **Logout:** Rota para sair de forma limpa e segura.

### **2\. Gestão de Ideias (CRUD Completo) 📝**

* **CRUD:** Implementar Criação, Listagem, Detalhe, Edição e Remoção de Ideias.  
* **Autorização:** Apenas o autor da ideia pode editar/remover.  
* **Atributos da Ideia:** Título, Descrição detalhada e Categoria.

### **3\. Mecanismo de Votação (A Voz do Colaborador) 🗳️**

* **Voto Único:** Cada colaborador autenticado vota apenas uma vez em cada ideia.  
* **Modelagem:** Criar um Model/Tabela de Votos separado que liga userId a ideaId.  
* **Contagem e Ordenação:** A lista de ideias deve ser ordenada decrescentemente pelo total de votos, com cálculo via *Aggregation* (MongoDB) ou *JOINs* (MySQL).

### **4\. Usabilidade e Experiência (Foco no Usuário) 🖥️**

* Interface Handlebars, **express-flash** para mensagens de feedback e tela de Perfil Simples.

### **5\. Segurança e Qualidade de Código (O Padrão Ouro) 💎**

* Uso obrigatório de **dotenv** para variáveis de ambiente.  
* Validação de Dados em duas camadas (**express-validator** e Mongoose Schema).

## **Critérios de Avaliação Técnica 🎯 Sua Jornada de Notas**

### **A. A Missão Cumprida (Nota 7 \- Mínimo para Aprovação) ✅**

* **Arquitetura:** Código organizado em rotas, models e controllers (MVC Básico).  
* **Funcionalidade:** Cadastro, Login e CRUD básico para ideias operando 100%.  
* **Segurança Base:** Uso de **bcrypt** e **dotenv**. Tratamento básico de erros (try...catch).  
* **Modelagem:** Estrutura de banco de dados que suporta o CRUD principal.  
* **Documentação:** Documentação simples, mas clara, para instalar e rodar o projeto.

### **B. Nível Expert (Nota 10 \- Maestria Técnica) 🚀**

* **Arquitetura:** MVC completo e modular (com pastas para Middlewares e Config).  
* **Funcionalidade:** Votação robusta (integridade via DB) e autorização por perfil (isAuthor implementado).  
* **Segurança (Blindagem):** Implementação de **helmet** e proteção **CSRF (csurf)**.  
* **Estabilidade Assíncrona:** Gerenciamento eficiente de erros de DB com **express-async-errors**.  
* **Modelagem:** Uso de **Aggregation** ou **JOINs** otimizados para calcular votos no banco.  
* **Documentação:** Documentação técnica detalhada (Diagrama de Banco de Dados e Fluxograma).

## **Organização e Entrega (Grupos de 3\) 🤝**

* O projeto é feito em trios, simulando uma equipe de desenvolvimento real.  
* **Papéis:** Especialista em Banco de Dados, Desenvolvedor Backend / Lógica de Negócio e Desenvolvedor Frontend / Documentação.  
* **Apresentação:** Apresentação de 10 minutos focada em Workflow, Demonstração e Desafios.