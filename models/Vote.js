const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  userEmail: { 
    type: String, 
    required: [true, 'Usuário é obrigatório']
  },
  ideaId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Idea', 
    required: [true, 'Ideia é obrigatória']
  },
  voteType: {
    type: String,
    enum: ['like', 'dislike'],
    default: 'like'
  }
}, {
  timestamps: true
});

// Índice único composto para garantir que um usuário vote apenas uma vez por ideia
VoteSchema.index({ userEmail: 1, ideaId: 1 }, { unique: true });

// Método para verificar se já existe voto
VoteSchema.statics.hasUserVoted = async function(userEmail, ideaId) {
  const vote = await this.findOne({ userEmail, ideaId });
  return !!vote;
};

// Método para alternar voto (toggle vote)
VoteSchema.statics.toggleVote = async function(userEmail, ideaId, voteType = 'like') {
  try {
    const existingVote = await this.findOne({ userEmail, ideaId });
    
    if (existingVote) {
      // Se já votou, remove o voto
      await this.deleteOne({ userEmail, ideaId });
      return { action: 'removed', vote: null };
    } else {
      // Se não votou, adiciona o voto
      const newVote = await this.create({ userEmail, ideaId, voteType });
      return { action: 'added', vote: newVote };
    }
  } catch (error) {
    if (error.code === 11000) {
      // Erro de duplicata - usuário já votou
      throw new Error('Usuário já votou nesta ideia');
    }
    throw error;
  }
};

// Método para contar votos de uma ideia
VoteSchema.statics.countVotesForIdea = async function(ideaId) {
  const result = await this.aggregate([
    { $match: { ideaId: new mongoose.Types.ObjectId(ideaId) } },
    {
      $group: {
        _id: '$voteType',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const voteCounts = { like: 0, dislike: 0, total: 0 };
  result.forEach(item => {
    voteCounts[item._id] = item.count;
    voteCounts.total += item.count;
  });
  
  return voteCounts;
};

// Método para obter estatísticas de votação do usuário
VoteSchema.statics.getUserVoteStats = async function(userEmail) {
  return await this.aggregate([
    { $match: { userEmail: new mongoose.Types.ObjectId(userEmail) } },
    {
      $group: {
        _id: '$voteType',
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Vote', VoteSchema);