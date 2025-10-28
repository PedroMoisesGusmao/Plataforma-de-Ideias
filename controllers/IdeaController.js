const { queries } = require('../db/queries');
const Idea = require('../models/Idea');
 
module.exports = {
    async getAllIdeas (req, res) {
        const ideas = await queries.getAllIdeas();
        console.log(ideas);
        res.render('all', { ideas });
    },
 
    async saveIdea (req, res) {
        await Idea.create({
            title : req.body.title,
            description : req.body.description,
            category : req.body.category,
            authorId : req.user._id,
            status : req.status
        })
        res.redirect('/ideas');
    },
 
    async updateIdea (req, res) {
         await Idea.updateIdea({
            title : req.body.title,
            description : req.body.description,
            category : req.body.category,
            authorId : req.user._id,
            status : req.status
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
 