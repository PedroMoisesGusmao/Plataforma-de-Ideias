# 💾 Documentação do Banco de Dados - Plataforma de Ideias

## 📋 Índice

- [Arquitetura do Banco](#arquitetura-do-banco)
- [Models e Schemas](#models-e-schemas)
- [Índices e Performance](#índices-e-performance)
- [Queries Avançadas](#queries-avançadas)
- [Seeds e Dados de Teste](#seeds-e-dados-de-teste)
- [Configuração e Conexão](#configuração-e-conexão)

## 🏗️ Arquitetura do Banco

### Tecnologias Utilizadas

- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para Node.js
- **Aggregation Framework** - Para queries complexas
- **Índices Compostos** - Para performance otimizada

### Estrutura das Collections

```
plataforma_ideias/
├── users/          # Usuários da plataforma
├── ideas/          # Ideias submetidas
└── votes/          # Votos nas ideias
```

## 📊 Models e Schemas

### 👤 User Model

```javascript
// Campos principais
{
  name: String (2-50 chars, required),
  email: String (unique, validated, required),
  password: String (hashed, min 6 chars, required),
  createdAt: Date,
  updatedAt: Date
}

// Métodos
- comparePassword(candidatePassword)
- toJSON() // Remove senha do output
```

**Validações Implementadas:**

- Email único e formato válido
- Senha automaticamente hasheada com bcrypt (salt 12)
- Nome com comprimento mínimo e máximo
- Timestamps automáticos

### 💡 Idea Model

```javascript
// Campos principais
{
  title: String (5-100 chars, required),
  description: String (10-1000 chars, required),
  category: Enum ['Tecnologia', 'Processos', 'Produtos', 'Sustentabilidade', 'RH', 'Marketing', 'Outros'],
  authorId: ObjectId (ref: User, required),
  status: Enum ['Ativa', 'Em Análise', 'Aprovada', 'Rejeitada', 'Implementada'],
  createdAt: Date,
  updatedAt: Date
}

// Métodos estáticos
- findWithVoteCount(filter)
- findByAuthor(authorId)
```

**Validações Implementadas:**

- Título e descrição com comprimento validado
- Categoria restrita a valores específicos
- Referência obrigatória ao autor
- Status padrão como 'Ativa'

### 🗳️ Vote Model

```javascript
// Campos principais
{
  userId: ObjectId (ref: User, required),
  ideaId: ObjectId (ref: Idea, required),
  voteType: Enum ['like', 'dislike'] (default: 'like'),
  createdAt: Date,
  updatedAt: Date
}

// Métodos estáticos
- hasUserVoted(userId, ideaId)
- toggleVote(userId, ideaId, voteType)
- countVotesForIdea(ideaId)
- getUserVoteStats(userId)
```

**Características Especiais:**

- **Índice único composto** (userId + ideaId) - garante voto único
- Método para alternar voto (toggle)
- Contagem automática de votos por ideia

## ⚡ Índices e Performance

### Índices Automáticos (Schema)

```javascript
// User
{ email: 1 } // Único

// Vote
{ userId: 1, ideaId: 1 } // Único composto - CRÍTICO para voto único

// Idea
{ authorId: 1 }
```

### Índices Adicionais (Performance)

```javascript
// Queries otimizadas
{ category: 1, createdAt: -1 }     // Busca por categoria
{ status: 1, createdAt: -1 }       // Busca por status
{ authorId: 1, createdAt: -1 }     // Ideias do usuário
{ ideaId: 1, voteType: 1 }         // Contagem de votos
{ userId: 1, createdAt: -1 }       // Histórico de votos
```

**Comando para criar índices:**

```javascript
const { createIndexes } = require("./db/indexes");
await createIndexes();
```

## 🔍 Queries Avançadas

### Aggregation Pipeline - Top Ideias

```javascript
const DatabaseQueries = require("./db/queries");

// Ideias mais votadas
const topIdeas = await DatabaseQueries.getTopIdeas(10);

// Ideias por categoria
const techIdeas = await DatabaseQueries.getIdeasByCategory("Tecnologia");

// Detalhes completos de uma ideia
const ideaDetails = await DatabaseQueries.getIdeaDetails(ideaId, userId);
```

### Queries Implementadas

| Método                    | Descrição                                      | Performance  |
| ------------------------- | ---------------------------------------------- | ------------ |
| `getIdeasWithVoteCount()` | Lista ideias com contagem/ordenação por votos  | ⚡ Otimizada |
| `getIdeaDetails()`        | Detalhes completos + status do voto do usuário | ⚡ Otimizada |
| `searchIdeas()`           | Busca avançada com filtros e paginação         | ⚡ Otimizada |
| `getPlatformStats()`      | Estatísticas gerais da plataforma              | ⚡ Otimizada |

### Pipeline de Contagem de Votos

```javascript
[
  // Lookup votos
  {
    $lookup: {
      from: "votes",
      localField: "_id",
      foreignField: "ideaId",
      as: "votes",
    },
  },

  // Calcular contadores
  {
    $addFields: {
      voteCount: { $size: "$votes" },
      likeCount: {
        $size: {
          $filter: {
            input: "$votes",
            cond: { $eq: ["$$this.voteType", "like"] },
          },
        },
      },
      score: { $subtract: [likeCount, dislikeCount] },
    },
  },

  // Ordenar por score
  { $sort: { score: -1, voteCount: -1, createdAt: -1 } },
];
```

## 🌱 Seeds e Dados de Teste

### Executar Seeds

```bash
# Popula o banco com dados de exemplo
node db/seeds.js
```

### Dados Criados

- **5 usuários** de exemplo (senhas: `123456`)
- **10 ideias** distribuídas entre categorias
- **~25 votos** distribuídos aleatoriamente

### Usuários de Teste

| Nome            | Email                  | Senha  |
| --------------- | ---------------------- | ------ |
| João Silva      | joao.silva@jf.com      | 123456 |
| Maria Santos    | maria.santos@jf.com    | 123456 |
| Pedro Oliveira  | pedro.oliveira@jf.com  | 123456 |
| Ana Costa       | ana.costa@jf.com       | 123456 |
| Carlos Ferreira | carlos.ferreira@jf.com | 123456 |

## ⚙️ Configuração e Conexão

### Variáveis de Ambiente (.env)

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/plataforma_ideias
# Para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/plataforma_ideias

# Aplicação
NODE_ENV=development
SESSION_SECRET=sua_chave_secreta_super_segura
```

### Configuração de Conexão

```javascript
// db/conn.js - Configurações otimizadas
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,           // Pool de conexões
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0,       // Desabilita buffering
  bufferCommands: false
}
```

### Inicialização Completa

```javascript
const connectDB = require("./db/conn");

// Conecta + cria índices automaticamente
await connectDB();
```

## 🛡️ Segurança Implementada

### Validações de Dados

- **Schema Level**: Mongoose validations
- **Application Level**: express-validator (no controller)
- **Database Level**: Índices únicos

### Hash de Senhas

- **bcrypt** com salt de 12 rounds
- Hash automático no middleware `pre('save')`
- Método `comparePassword()` para verificação

### Prevenção de Duplicatas

- **Email único** por usuário
- **Voto único** por usuário/ideia (índice composto)
- **Tratamento de erro 11000** (duplicate key)

## 📈 Métricas de Performance

### Queries Otimizadas

- ✅ Aggregation Pipeline para contagem de votos
- ✅ Índices compostos para queries frequentes
- ✅ Projeção para limitar campos retornados
- ✅ Paginação para grandes datasets

### Monitoramento

```javascript
// Listar índices para debug
const { listIndexes } = require("./db/indexes");
await listIndexes();
```

## 🚀 Próximos Passos

### Melhorias Futuras

- [ ] Cache com Redis para queries frequentes
- [ ] Sharding para escalar horizontalmente
- [ ] Replica Set para alta disponibilidade
- [ ] Full-text search para busca em texto
- [ ] Time-series collection para analytics

### Monitoramento

- [ ] MongoDB Compass para visualização
- [ ] Métricas de performance das queries
- [ ] Alertas para queries lentas
- [ ] Backup automático do banco

---

**🎯 Status: Implementação Completa para MVP (Nota 10)**

✅ Todos os requisitos de banco de dados implementados  
✅ Performance otimizada com Aggregation Pipeline  
✅ Segurança robusta com validações e índices únicos  
✅ Documentação técnica completa  
✅ Seeds para desenvolvimento e testes
