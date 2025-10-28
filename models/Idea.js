const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Título é obrigatório'],
    trim: true,
    minlength: [5, 'Título deve ter pelo menos 5 caracteres'],
    maxlength: [100, 'Título deve ter no máximo 100 caracteres']
  },
  description: { 
    type: String, 
    required: [true, 'Descrição é obrigatória'],
    trim: true,
    minlength: [10, 'Descrição deve ter pelo menos 10 caracteres'],
    maxlength: [1000, 'Descrição deve ter no máximo 1000 caracteres']
  },
  category: { 
    type: String, 
    required: [true, 'Categoria é obrigatória'],
    enum: {
      values: ['Tecnologia', 'Processos', 'Produtos', 'Sustentabilidade', 'RH', 'Marketing', 'Outros'],
      message: 'Categoria deve ser uma das opções válidas'
    }
  },
  authorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Autor é obrigatório']
  },
  status: {
    type: String,
    enum: ['Ativa', 'Em Análise', 'Aprovada', 'Rejeitada', 'Implementada'],
    default: 'Ativa'
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Método virtual para contar votos (será usado com populate)
IdeaSchema.virtual('voteCount', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'ideaId',
  count: true
});

// Método virtual para verificar se usuário votou
IdeaSchema.virtual('userVoted');

// Garante que virtuals sejam incluídos no JSON
IdeaSchema.set('toJSON', { virtuals: true });
IdeaSchema.set('toObject', { virtuals: true });

// Métodos básicos de CRUD
IdeaSchema.statics.createIdea = async function(data) {
  try {
    const idea = new this(data);
    return await idea.save();
  } catch (error) {
    throw error;
  }
};

IdeaSchema.statics.findOneIdea = async function(id) {
  try {
    return await this.findById(id).populate('authorId', 'name email');
  } catch (error) {
    throw error;
  }
};

IdeaSchema.statics.findAllIdeas = async function(filter = {}) {
  try {
    return await this.find(filter).populate('authorId', 'name email').sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

IdeaSchema.statics.updateIdea = async function(id, data) {
  try {
    return await this.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    }).populate('authorId', 'name email');
  } catch (error) {
    throw error;
  }
};

IdeaSchema.statics.deleteIdea = async function(id) {
  try {
    return await this.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};

// Método estático para buscar ideias com contagem de votos
IdeaSchema.statics.findWithVoteCount = function(filter = {}) {
  return this.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: 'votes',
        localField: '_id',
        foreignField: 'ideaId',
        as: 'votes'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'authorId',
        foreignField: '_id',
        as: 'author'
      }
    },
    {
      $addFields: {
        voteCount: { $size: '$votes' },
        author: { $arrayElemAt: ['$author', 0] }
      }
    },
    {
      $project: {
        title: 1,
        description: 1,
        category: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        voteCount: 1,
        'author.name': 1,
        'author.email': 1,
        'author._id': 1
      }
    },
    { $sort: { voteCount: -1, createdAt: -1 } }
  ]);
};

// Método estático para buscar ideias de um usuário específico
IdeaSchema.statics.findByAuthor = function(authorId) {
  return this.findWithVoteCount({ authorId: new mongoose.Types.ObjectId(authorId) });
};

module.exports = mongoose.model('Idea', IdeaSchema);
