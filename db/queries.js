const mongoose = require('mongoose');
const Idea = require('../models/Idea');
const Vote = require('../models/Vote');
const User = require('../models/User');

/**
 * Classe para queries avançadas usando Aggregation Pipeline
 * Implementa as consultas mais complexas para otimizar performance
 */
class DatabaseQueries {

  /**
   * Busca todas as ideias com contagem de votos, ordenadas por popularidade
   * @param {Object} filter - Filtros opcionais
   * @param {Number} limit - Limite de resultados
   * @param {Number} skip - Pular resultados (paginação)
   * @returns {Array} Array de ideias com contagem de votos
   */
  static async getIdeasWithVoteCount(filter = {}, limit = 50, skip = 0) {
    try {
      const pipeline = [
        // Filtro inicial
        ...(Object.keys(filter).length > 0 ? [{ $match: filter }] : []),
        
        // Lookup para buscar votos
        {
          $lookup: {
            from: 'votes',
            localField: '_id',
            foreignField: 'ideaId',
            as: 'votes'
          }
        },
        
        // Lookup para buscar dados do autor
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author'
          }
        },
        
        // Adicionar campos calculados
        {
          $addFields: {
            voteCount: { $size: '$votes' },
            likeCount: {
              $size: {
                $filter: {
                  input: '$votes',
                  cond: { $eq: ['$$this.voteType', 'like'] }
                }
              }
            },
            dislikeCount: {
              $size: {
                $filter: {
                  input: '$votes',
                  cond: { $eq: ['$$this.voteType', 'dislike'] }
                }
              }
            },
            author: { $arrayElemAt: ['$author', 0] },
            score: {
              $subtract: [
                {
                  $size: {
                    $filter: {
                      input: '$votes',
                      cond: { $eq: ['$$this.voteType', 'like'] }
                    }
                  }
                },
                {
                  $size: {
                    $filter: {
                      input: '$votes',
                      cond: { $eq: ['$$this.voteType', 'dislike'] }
                    }
                  }
                }
              ]
            }
          }
        },
        
        // Projeção para limitar campos retornados
        {
          $project: {
            title: 1,
            description: 1,
            category: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            voteCount: 1,
            likeCount: 1,
            dislikeCount: 1,
            score: 1,
            'author._id': 1,
            'author.name': 1,
            'author.email': 1
          }
        },
        
        // Ordenação por score (likes - dislikes) e depois por data
        { $sort: { score: -1, voteCount: -1, createdAt: -1 } },
        
        // Paginação
        { $skip: skip },
        { $limit: limit }
      ];

      return await Idea.aggregate(pipeline);
      
    } catch (error) {
      console.error('Erro ao buscar ideias com contagem de votos:', error);
      throw error;
    }
  }

  /**
   * Busca ideias de um usuário específico com contagem de votos
   * @param {String} userId - ID do usuário
   * @returns {Array} Array de ideias do usuário
   */
  static async getIdeasByUser(userId) {
    try {
      return await this.getIdeasWithVoteCount({ 
        authorId: new mongoose.Types.ObjectId(userId) 
      });
    } catch (error) {
      console.error('Erro ao buscar ideias do usuário:', error);
      throw error;
    }
  }

  /**
   * Busca ideias por categoria com contagem de votos
   * @param {String} category - Categoria das ideias
   * @param {Number} limit - Limite de resultados
   * @returns {Array} Array de ideias da categoria
   */
  static async getIdeasByCategory(category, limit = 20) {
    try {
      return await this.getIdeasWithVoteCount({ category }, limit);
    } catch (error) {
      console.error('Erro ao buscar ideias por categoria:', error);
      throw error;
    }
  }

  /**
   * Busca uma ideia específica com detalhes completos
   * @param {String} ideaId - ID da ideia
   * @param {String} userId - ID do usuário logado (opcional)
   * @returns {Object} Ideia com detalhes completos
   */
  static async getIdeaDetails(ideaId, userId = null) {
    try {
      const pipeline = [
        { $match: { _id: new mongoose.Types.ObjectId(ideaId) } },
        
        // Buscar votos
        {
          $lookup: {
            from: 'votes',
            localField: '_id',
            foreignField: 'ideaId',
            as: 'votes'
          }
        },
        
        // Buscar autor
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author'
          }
        },
        
        // Adicionar campos calculados
        {
          $addFields: {
            voteCount: { $size: '$votes' },
            likeCount: {
              $size: {
                $filter: {
                  input: '$votes',
                  cond: { $eq: ['$$this.voteType', 'like'] }
                }
              }
            },
            dislikeCount: {
              $size: {
                $filter: {
                  input: '$votes',
                  cond: { $eq: ['$$this.voteType', 'dislike'] }
                }
              }
            },
            author: { $arrayElemAt: ['$author', 0] },
            userVoted: userId ? {
              $in: [new mongoose.Types.ObjectId(userId), '$votes.userId']
            } : false,
            userVoteType: userId ? {
              $arrayElemAt: [
                {
                  $map: {
                    input: {
                      $filter: {
                        input: '$votes',
                        cond: { $eq: ['$$this.userId', new mongoose.Types.ObjectId(userId)] }
                      }
                    },
                    as: 'vote',
                    in: '$$vote.voteType'
                  }
                },
                0
              ]
            } : null
          }
        },
        
        // Projeção
        {
          $project: {
            votes: 0 // Remove array de votos da resposta
          }
        }
      ];

      const result = await Idea.aggregate(pipeline);
      return result[0] || null;
      
    } catch (error) {
      console.error('Erro ao buscar detalhes da ideia:', error);
      throw error;
    }
  }

  /**
   * Ranking das ideias mais votadas
   * @param {Number} limit - Número de ideias no ranking
   * @returns {Array} Top ideias ordenadas por votos
   */
  static async getTopIdeas(limit = 10) {
    try {
      return await this.getIdeasWithVoteCount({}, limit, 0);
    } catch (error) {
      console.error('Erro ao buscar top ideias:', error);
      throw error;
    }
  }

  /**
   * Estatísticas gerais da plataforma
   * @returns {Object} Objeto com estatísticas
   */
  static async getPlatformStats() {
    try {
      const [userStats, ideaStats, voteStats] = await Promise.all([
        // Estatísticas de usuários
        User.aggregate([
          {
            $group: {
              _id: null,
              totalUsers: { $sum: 1 },
              newUsersThisMonth: {
                $sum: {
                  $cond: [
                    { $gte: ['$createdAt', new Date(new Date().getFullYear(), new Date().getMonth(), 1)] },
                    1,
                    0
                  ]
                }
              }
            }
          }
        ]),
        
        // Estatísticas de ideias
        Idea.aggregate([
          {
            $group: {
              _id: null,
              totalIdeas: { $sum: 1 },
              ideasByCategory: {
                $push: '$category'
              },
              newIdeasThisMonth: {
                $sum: {
                  $cond: [
                    { $gte: ['$createdAt', new Date(new Date().getFullYear(), new Date().getMonth(), 1)] },
                    1,
                    0
                  ]
                }
              }
            }
          }
        ]),
        
        // Estatísticas de votos
        Vote.aggregate([
          {
            $group: {
              _id: null,
              totalVotes: { $sum: 1 },
              totalLikes: {
                $sum: {
                  $cond: [{ $eq: ['$voteType', 'like'] }, 1, 0]
                }
              },
              totalDislikes: {
                $sum: {
                  $cond: [{ $eq: ['$voteType', 'dislike'] }, 1, 0]
                }
              }
            }
          }
        ])
      ]);

      // Processar categorias
      const categoryCount = {};
      if (ideaStats[0]?.ideasByCategory) {
        ideaStats[0].ideasByCategory.forEach(cat => {
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
      }

      return {
        users: userStats[0] || { totalUsers: 0, newUsersThisMonth: 0 },
        ideas: {
          ...ideaStats[0],
          ideasByCategory: categoryCount
        } || { totalIdeas: 0, newIdeasThisMonth: 0, ideasByCategory: {} },
        votes: voteStats[0] || { totalVotes: 0, totalLikes: 0, totalDislikes: 0 }
      };
      
    } catch (error) {
      console.error('Erro ao buscar estatísticas da plataforma:', error);
      throw error;
    }
  }

  /**
   * Busca com filtros avançados e paginação
   * @param {Object} filters - Filtros de busca
   * @param {Object} pagination - Configurações de paginação
   * @returns {Object} Resultado com dados e metadados de paginação
   */
  static async searchIdeas(filters = {}, pagination = { page: 1, limit: 20 }) {
    try {
      const { page = 1, limit = 20 } = pagination;
      const skip = (page - 1) * limit;

      // Construir filtro do MongoDB
      const mongoFilter = {};
      
      if (filters.category) {
        mongoFilter.category = filters.category;
      }
      
      if (filters.status) {
        mongoFilter.status = filters.status;
      }
      
      if (filters.author) {
        mongoFilter.authorId = new mongoose.Types.ObjectId(filters.author);
      }
      
      if (filters.search) {
        mongoFilter.$or = [
          { title: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } }
        ];
      }

      // Buscar dados com paginação
      const [ideas, totalCount] = await Promise.all([
        this.getIdeasWithVoteCount(mongoFilter, limit, skip),
        Idea.countDocuments(mongoFilter)
      ]);

      return {
        ideas,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1
        }
      };
      
    } catch (error) {

        
      console.error('Erro na busca avançada de ideias:', error);
      throw error;
    }
  }
}

module.exports = DatabaseQueries;