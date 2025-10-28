const mongoose = require('mongoose');

// Importa todos os models para garantir que os índices sejam criados
const User = require('../models/User');
const Idea = require('../models/Idea');
const Vote = require('../models/Vote');

/**
 * Configura todos os índices necessários para otimização de performance
 * Este arquivo deve ser executado após a conexão com o banco
 */
async function createIndexes() {
  try {
    console.log('🔧 Criando índices do banco de dados...');

    // Índices para User
    await User.createIndexes();
    console.log('✅ Índices do User criados (email único)');

    // Índices para Idea
    await Idea.createIndexes();
    console.log('✅ Índices da Idea criados (authorId, category, status, timestamps)');

    // Índices para Vote (o mais importante - índice único composto)
    await Vote.createIndexes();
    console.log('✅ Índices do Vote criados (userId + ideaId único composto)');

    // Índices adicionais para performance
    await createAdditionalIndexes();
    
    console.log('🎉 Todos os índices foram criados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao criar índices:', error);
    throw error;
  }
}

/**
 * Cria índices adicionais para otimização de queries específicas
 */
async function createAdditionalIndexes() {
  try {
    // Índice composto para buscar ideias por categoria e data
    await Idea.collection.createIndex(
      { category: 1, createdAt: -1 },
      { name: 'category_createdAt_idx' }
    );

    // Índice para buscar ideias por status
    await Idea.collection.createIndex(
      { status: 1, createdAt: -1 },
      { name: 'status_createdAt_idx' }
    );

    // Índice para buscar ideias por autor e data
    await Idea.collection.createIndex(
      { authorId: 1, createdAt: -1 },
      { name: 'author_createdAt_idx' }
    );

    // Índice para contar votos por ideia (otimiza aggregations)
    await Vote.collection.createIndex(
      { ideaId: 1, voteType: 1 },
      { name: 'idea_voteType_idx' }
    );

    // Índice para buscar votos por usuário
    await Vote.collection.createIndex(
      { userId: 1, createdAt: -1 },
      { name: 'user_vote_history_idx' }
    );

    console.log('✅ Índices adicionais de performance criados');
    
  } catch (error) {
    console.error('❌ Erro ao criar índices adicionais:', error);
    throw error;
  }
}

/**
 * Lista todos os índices existentes para debug
 */
async function listIndexes() {
  try {
    console.log('\n📋 Índices existentes:');
    
    const userIndexes = await User.collection.listIndexes().toArray();
    console.log('User:', userIndexes.map(idx => idx.name));
    
    const ideaIndexes = await Idea.collection.listIndexes().toArray();
    console.log('Idea:', ideaIndexes.map(idx => idx.name));
    
    const voteIndexes = await Vote.collection.listIndexes().toArray();
    console.log('Vote:', voteIndexes.map(idx => idx.name));
    
  } catch (error) {
    console.error('❌ Erro ao listar índices:', error);
  }
}

/**
 * Remove todos os índices (útil para desenvolvimento)
 */
async function dropAllIndexes() {
  try {
    console.log('🗑️ Removendo todos os índices...');
    
    await User.collection.dropIndexes();
    await Idea.collection.dropIndexes();
    await Vote.collection.dropIndexes();
    
    console.log('✅ Todos os índices foram removidos');
    
  } catch (error) {
    console.error('❌ Erro ao remover índices:', error);
  }
}

module.exports = {
  createIndexes,
  createAdditionalIndexes,
  listIndexes,
  dropAllIndexes
};