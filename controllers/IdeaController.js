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
        authorEmail: req.session.user?.email || 'desconhecido',
        status: req.body.status
      });
      res.redirect('/home');
    } catch (error) {
      console.error('Erro ao salvar ideia:', error);
      res.redirect('/create');
    }
  },

  async updateIdea(req, res) {
    try {
      await Idea.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        authorEmail: req.session.user?.email || 'desconhecido',
        status: req.body.status
      });
      res.redirect('/home');
    } catch (error) {
      console.error('Erro ao atualizar ideia:', error);
      res.redirect('/home');
    }
  },

  async deleteIdea(req, res) {
    try {
      await Idea.findByIdAndDelete(req.body.id);
      res.redirect('/home');
    } catch (error) {
      console.error('Erro ao deletar ideia:', error);
      res.redirect('/home');
    }
  }
};
