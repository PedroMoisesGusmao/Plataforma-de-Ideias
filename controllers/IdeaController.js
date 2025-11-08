const Idea = require('../models/Idea');

module.exports = {
  async getAllIdeas(req, res) {
    try {
      const ideas = await Idea.find().lean();
      res.render('all', { ideas });
    } catch (error) {
      console.error('Erro ao buscar ideias:', error);
      res.render('all', { ideas: [] });
    }
  },

  async saveIdea(req, res) {
    try {
      await Idea.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        authorEmail: req.session.user?.email,
        status: req.body.status
      });
      res.redirect('/home');
    } catch (error) {
      console.error('Erro ao salvar ideia:', error);
      res.redirect('/create');
    }
  },

    async getIdeaById(req, res) {
        try {
            const idea = await Idea.findById(req.params.id).lean();
            if (!idea) {
                req.flash('error_msg', 'Ideia não encontrada');
                return res.redirect('/home');
            }
            res.render('edit', { idea });
        } catch (error) {
            console.error('Erro ao carregar ideia:', error);
            req.flash('error_msg', 'Erro ao carregar ideia');
            res.redirect('/home');
        }
    },

    async updateIdea(req, res) {
        try {
            const id = req.params.id;
            await Idea.findByIdAndUpdate(id, {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                status: req.body.status,
                authorEmail: req.session.user?.email
            });
            req.flash('success_msg', 'Ideia atualizada com sucesso!');
            res.redirect('/home');
        } catch (error) {
            console.error('Erro ao atualizar ideia:', error);
            req.flash('error_msg', 'Erro ao atualizar ideia');
            res.redirect('/home');
        }
    },

    async deleteIdea(req, res) {
        try {
            await Idea.findByIdAndDelete(req.params.id);
            req.flash('success_msg', 'Ideia deletada com sucesso!');
            res.redirect('/home');
        } catch (error) {
            console.error('Erro ao deletar ideia:', error);
            req.flash('error_msg', 'Erro ao deletar ideia');
            res.redirect('/home');
        }
    }
};
