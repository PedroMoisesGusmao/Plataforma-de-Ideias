const Idea = require('../models/Idea');

module.exports = {
    async getAllIdeas (req, res) {
        const ideas = await Idea.find({ raw: true });
        return res.render('all', { ideas });
    },

    async saveIdea (req, res) {
        await Idea.create({
            title : req.body.title,
            description : req.body.description,
            category : req.body.category,
            authorId : req.user._id,
            status : req.body.status
        })
        res.redirect('/home');
    },
 
    async updateIdea (req, res) {
         await Idea.updateIdea({
            title : req.body.title,
            description : req.body.description,
            category : req.body.category,
            authorId : req.userId,
            status : req.body.status
        },
        { where: { id: req.params.id } }
    )
        res.redirect('/ideas');
    },
 
    async deleteIdea (req, res) {
        const id = req.body.id;
        await Idea.deleteIdea({ where: { id: id } });
        res.redirect('/ideas');
    }
}
 