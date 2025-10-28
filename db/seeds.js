const mongoose = require('mongoose');
const User = require('../models/User');
const Idea = require('../models/Idea');
const Vote = require('../models/Vote');
const connectDB = require('./conn');

/**
 * Seeds para popular o banco de dados com dados de teste
 * Execute com: node db/seeds.js
 */

const categories = ['Tecnologia', 'Processos', 'Produtos', 'Sustentabilidade', 'RH', 'Marketing', 'Outros'];

const sampleUsers = [
  {
    name: 'João Silva',
    email: 'joao.silva@jf.com',
    password: '123456'
  },
  {
    name: 'Maria Santos',
    email: 'maria.santos@jf.com',
    password: '123456'
  },
  {
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@jf.com',
    password: '123456'
  },
  {
    name: 'Ana Costa',
    email: 'ana.costa@jf.com',
    password: '123456'
  },
  {
    name: 'Carlos Ferreira',
    email: 'carlos.ferreira@jf.com',
    password: '123456'
  }
];

const sampleIdeas = [
  {
    title: 'Sistema de Gestão de Conhecimento',
    description: 'Desenvolver uma plataforma interna para compartilhamento de conhecimento entre equipes, permitindo que colaboradores documentem processos, melhores práticas e lições aprendidas.',
    category: 'Tecnologia'
  },
  {
    title: 'Programa de Mentoria Reversa',
    description: 'Implementar um programa onde colaboradores mais jovens mentoram executivos sêniores em tecnologias digitais e tendências de mercado.',
    category: 'RH'
  },
  {
    title: 'App de Carona Corporativa',
    description: 'Criar um aplicativo para facilitar o compartilhamento de caronas entre colaboradores, reduzindo custos e pegada de carbono.',
    category: 'Sustentabilidade'
  },
  {
    title: 'Gamificação de Treinamentos',
    description: 'Transformar os treinamentos corporativos em experiências gamificadas para aumentar o engajamento e retenção de conhecimento.',
    category: 'RH'
  },
  {
    title: 'Chatbot para Atendimento Interno',
    description: 'Desenvolver um chatbot inteligente para responder dúvidas frequentes dos colaboradores sobre políticas internas, benefícios e processos.',
    category: 'Tecnologia'
  },
  {
    title: 'Espaços de Trabalho Flexíveis',
    description: 'Redesenhar os escritórios para criar espaços mais flexíveis e colaborativos, incluindo áreas de descompressão e trabalho em pé.',
    category: 'Processos'
  },
  {
    title: 'Programa Zero Desperdício',
    description: 'Implementar um programa abrangente para eliminar o desperdício em todas as operações, desde materiais até energia.',
    category: 'Sustentabilidade'
  },
  {
    title: 'Plataforma de Feedback 360°',
    description: 'Criar uma plataforma digital para facilitar o processo de feedback 360°, tornando-o mais ágil e eficiente.',
    category: 'RH'
  },
  {
    title: 'Sistema de Sugestões por IA',
    description: 'Desenvolver um sistema que usa inteligência artificial para sugerir melhorias nos processos baseado em dados históricos.',
    category: 'Tecnologia'
  },
  {
    title: 'Marketplace de Produtos Internos',
    description: 'Criar um marketplace interno onde diferentes unidades de negócio podem ofertar produtos e serviços entre si.',
    category: 'Produtos'
  }
];

/**
 * Limpa todos os dados do banco
 */
async function clearDatabase() {
  try {
    await User.deleteMany({});
    await Idea.deleteMany({});
    await Vote.deleteMany({});
    console.log('🗑️ Banco de dados limpo');
  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error);
    throw error;
  }
}

/**
 * Cria usuários de exemplo
 */
async function createUsers() {
  try {
    const users = await User.create(sampleUsers);
    console.log(`✅ ${users.length} usuários criados`);
    return users;
  } catch (error) {
    console.error('❌ Erro ao criar usuários:', error);
    throw error;
  }
}

/**
 * Cria ideias de exemplo
 */
async function createIdeas(users) {
  try {
    const ideasWithAuthors = sampleIdeas.map((idea, index) => ({
      ...idea,
      authorId: users[index % users.length]._id
    }));

    const ideas = await Idea.create(ideasWithAuthors);
    console.log(`✅ ${ideas.length} ideias criadas`);
    return ideas;
  } catch (error) {
    console.error('❌ Erro ao criar ideias:', error);
    throw error;
  }
}

/**
 * Cria votos de exemplo
 */
async function createVotes(users, ideas) {
  try {
    const votes = [];
    
    // Cada usuário vota em algumas ideias aleatórias
    for (const user of users) {
      const numVotes = Math.floor(Math.random() * 5) + 3; // 3-7 votos por usuário
      const shuffledIdeas = [...ideas].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < numVotes && i < shuffledIdeas.length; i++) {
        const idea = shuffledIdeas[i];
        
        // Não votar na própria ideia
        if (idea.authorId.toString() === user._id.toString()) continue;
        
        const voteType = Math.random() > 0.2 ? 'like' : 'dislike'; // 80% likes, 20% dislikes
        
        votes.push({
          userId: user._id,
          ideaId: idea._id,
          voteType
        });
      }
    }

    // Remover duplicatas (caso existam)
    const uniqueVotes = votes.filter((vote, index, self) => 
      index === self.findIndex(v => 
        v.userId.toString() === vote.userId.toString() && 
        v.ideaId.toString() === vote.ideaId.toString()
      )
    );

    const createdVotes = await Vote.create(uniqueVotes);
    console.log(`✅ ${createdVotes.length} votos criados`);
    return createdVotes;
  } catch (error) {
    console.error('❌ Erro ao criar votos:', error);
    throw error;
  }
}

/**
 * Função principal para executar todos os seeds
 */
async function runSeeds() {
  try {
    console.log('🌱 Iniciando seeds do banco de dados...\n');

    // Conectar ao banco
    await connectDB();

    // Limpar dados existentes
    await clearDatabase();

    // Criar dados de exemplo
    const users = await createUsers();
    const ideas = await createIdeas(users);
    const votes = await createVotes(users, ideas);

    console.log('\n🎉 Seeds executados com sucesso!');
    console.log(`📊 Resumo:`);
    console.log(`👥 Usuários: ${users.length}`);
    console.log(`💡 Ideias: ${ideas.length}`);
    console.log(`👍 Votos: ${votes.length}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro ao executar seeds:', error);
    process.exit(1);
  }
}

/**
 * Executa os seeds se o arquivo for chamado diretamente
 */
if (require.main === module) {
  runSeeds();
}

module.exports = {
  runSeeds,
  clearDatabase,
  createUsers,
  createIdeas,
  createVotes
};