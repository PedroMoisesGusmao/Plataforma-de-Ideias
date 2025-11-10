const Idea = require('../models/Idea');
const Vote = require('../models/Vote');

module.exports = {
    async getAllIdeas(req, res) {
        try {
            const userEmail = req.session.user?.email;
            const ideas = await Idea.find().lean();

            for (let idea of ideas) {
                const votes = await Vote.countVotesForIdea(idea._id);
                idea.votesTotal = votes.total || 0;

                if (userEmail) {
                    const userVote = await Vote.findOne({ userEmail, ideaId: idea._id });
                    idea.userVoted = !!userVote;
                } else {
                    idea.userVoted = false;
                }
            }

            res.render('all', { ideas });
        } catch (error) {
            console.error('Erro ao buscar ideias:', error);
            res.render('all', { ideas: [] });
        }
    },

  async saveIdea(req, res) {
    const userEmail = req.session.user?.email;

    if (!userEmail) {
        req.flash('error_msg', 'Você precisa estar logado para votar.');
        return res.redirect('/user/login');
    }
    
    try {
      await Idea.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        authorEmail: userEmail,
        status: req.body.status
      });
      res.redirect('/idea/home');
    } catch (error) {
      console.error('Erro ao salvar ideia:', error);
      res.redirect('/idea/create');
    }
  },

    async getIdeaById(req, res) {
        try {
            const idea = await Idea.findById(req.params.id).lean();
            if (!idea) {
                req.flash('error_msg', 'Ideia não encontrada');
                return res.redirect('/idea/home');
            }
            res.render('edit', { idea });
        } catch (error) {
            console.error('Erro ao carregar ideia:', error);
            req.flash('error_msg', 'Erro ao carregar ideia');
            res.redirect('/idea/home');
        }
    },

    async updateIdea(req, res) {
        const userEmail = req.session.user?.email;

        if (!userEmail) {
            req.flash('error_msg', 'Você precisa estar logado para votar.');
            return res.redirect('/user/login');
        }
        
        try {
            const { id } = req.params;
            await Idea.findByIdAndUpdate(id, {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                status: req.body.status,
                authorEmail: userEmail
            });
            req.flash('success_msg', 'Ideia atualizada com sucesso!');
            res.redirect('/idea/home');
        } catch (error) {
            console.error('Erro ao atualizar ideia:', error);
            req.flash('error_msg', 'Erro ao atualizar ideia');
            res.redirect('/idea/home');
        }
    },

    async deleteIdea(req, res) {
        try {
            await Idea.findByIdAndDelete(req.params.id);
            req.flash('success_msg', 'Ideia deletada com sucesso!');
            res.redirect('/idea/home');
        } catch (error) {
            console.error('Erro ao deletar ideia:', error);
            req.flash('error_msg', 'Erro ao deletar ideia');
            res.redirect('/idea/home');
        }
    }
};
