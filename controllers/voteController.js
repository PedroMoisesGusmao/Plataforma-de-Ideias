const Vote = require('../models/Vote');
const Idea = require('../models/Idea');

module.exports = {
    async toggleVote(req, res) {
        try {
            const userEmail = req.session.user?.email;
            const { ideaId } = req.params;

            if (!userEmail) {
                req.flash('error_msg', 'Você precisa estar logado para votar.');
                return res.redirect('/user/login');
            }

            const result = await Vote.toggleVote(userEmail, ideaId, 'like');
            const counts = await Vote.countVotesForIdea(ideaId);

            req.flash(
                'success_msg',
                result.action === 'added'
                    ? 'Voto registrado com sucesso!'
                    : 'Voto removido com sucesso!'
            );

            res.redirect('/home');
        } catch (error) {
            console.error('Erro ao votar:', error);
            req.flash('error_msg', 'Erro ao processar o voto');
            res.redirect('/home');
        }
    },

    async getVoteCount(req, res) {
        try {
            const { ideaId } = req.params;
            const votes = await Vote.countVotesForIdea(ideaId);
            res.json(votes);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar contagem de votos' });
        }
    }
};
