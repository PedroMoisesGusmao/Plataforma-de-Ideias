# **Guia de Recursos e Referências Técnicas 📚💡**

**Time, este é o seu *arsenal*\!** Aqui estão os links e as dicas mais importantes para tirar o projeto do papel e garantir a excelência técnica (Nota 10). Lembrem-se: a documentação oficial é sempre a *Fonte da Verdade*.

## **1\. Documentação Oficial (A Fonte da Verdade) 📜**

Para entender *como* as coisas funcionam de verdade, consultem a documentação.

| Tecnologia | Tópico Chave para o Projeto | Link (Verificado) |
| :---- | :---- | :---- |
| **Node.js** | Módulos Globais (fs, path) | https://nodejs.org/api/modules.html |
| **Express** | Definição de Rotas e Middlewares | https://expressjs.com/pt-br/guide/routing.html |
| **Mongoose** | Schemas, Models e Referências | https://mongoosejs.com/docs/schematypes.html |
| **Handlebars** | Helpers e Estruturas de Repetição (\#each) | https://handlebarsjs.com/guide/builtin-helpers.html |

## **2\. Pacotes Críticos para o MVP (As Ferramentas Certas) ⚙️**

Esses pacotes são obrigatórios para a segurança e funcionalidade do MVP.

| Pacote | Função no Projeto | Dica de Uso | Link (Verificado) |
| :---- | :---- | :---- | :---- |
| **dotenv** | Variáveis de Ambiente | Use **SEMPRE** para configurar a DB\_URL e o SESSION\_SECRET. | https://www.npmjs.com/package/dotenv |
| **bcrypt** | Segurança (Hash de Senhas) | **NUNCA** salve a senha do usuário. Use bcrypt.hash() no cadastro e bcrypt.compare() no login. | https://www.npmjs.com/package/bcrypt |
| **express-session** | Manter o Usuário Logado | Configure o secret com uma chave forte (process.env.SESSION\_SECRET). | https://www.npmjs.com/package/express-session |
| **Mongoose** | Conexão e CRUD | Foque em **Model.create()**, **Model.find()** e **Model.findOne()** para o CRUD básico. | https://mongoosejs.com/docs/queries.html |

## **3\. Guia de Implementação Avançada (Rumo ao 10\) 👑**

Estes tópicos resolvem os desafios de *segurança* e *performance* que separam a Nota 7 da Nota 10\.

### **🔒 Segurança: Autenticação e Autorização**

| Desafio | Pacote | Dica de Resolução | Link (Verificado) |
| :---- | :---- | :---- | :---- |
| **Bloquear sem Login** | **isLoggedIn** (Middleware Próprio) | Crie a função que verifica req.session.userId. Se não existir, use res.redirect('/login')\! | *Sem link externo \- lógica interna.* |
| **Proteção de Cabeçalhos** | **helmet** | Instale e use app.use(helmet()); no app.js. É um *boost* de segurança com uma linha de código. | https://helmetjs.github.io/ |
| **Proibir Edição de Outros** | **isAuthor** (Middleware Próprio) | O middleware deve buscar a ideia e checar se idea.autorId.toString() \=== req.session.userId. Se for falso, retorne um erro (403 Forbidden). | *Sem link externo \- lógica interna.* |

### **📊 DB e Lógica: Votação e Performance**

| Desafio | Pacote/Técnica | Dica de Resolução | Link (Verificado) |
| :---- | :---- | :---- | :---- |
| **Voto Único e Integridade** | **Mongoose Indexes** | No Vote Schema, configure um **índice único composto** para userId e ideaId para garantir integridade do DB. | https://mongoosejs.com/docs/guide.html\#indexes |
| **Contagem de Votos** | **Aggregation Pipeline** | Use $lookup e $group para somar votos por ideia. Esta é a técnica de performance ideal. | https://mongoosejs.com/docs/api/aggregate.html |

### **✨ Frontend: UX e Interação**

| Desafio | Pacote | Dica de Resolução | Link (Verificado) |
| :---- | :---- | :---- | :---- |
| **Feedback Após Ação** | **express-flash** | Use req.flash('success', 'Mensagem\!') no Controller após um res.redirect(). | https://www.npmjs.com/package/connect-flash |
| **Proteção de Formulários** | **csurf** | Garanta que o token CSRF gerado no Backend seja injetado como um campo hidden em **TODO** formulário POST. | https://www.npmjs.com/package/csurf |

## **4\. Repositórios de Estudo e Tutoriais (Exemplos Práticos) 💻**

**Atenção:** Estes links são modelos de estrutura de código. **NÃO COPIEM\!** Usem para ver como se organiza o MVC, as rotas e os Controllers em um projeto real.

| Recurso | O que Focar | Link (Verificado \- Estrutura) |
| :---- | :---- | :---- |
| **Exemplo de Boilerplate MVC** | Como as pastas /routes, /controllers e /models se conectam de forma organizada. | https://github.com/expressjs/express-generator (Estrutura padrão) |
| **Guia de Autenticação com Passport** | Não é obrigatório usar Passport, mas a lógica de fluxo de Auth é valiosa. | https://www.passportjs.org/docs/ |
| **Tutoriais Avançados de Mongoose** | Busque exemplos de como usar o $lookup (Aggregation) com Mongoose no Google/YouTube. | *Busca específica no Google/YouTube sobre Mongoose Aggregation.* |

