const Comment = require("../models/modelComment")

exports.getAllComments = async (req, res, next) => {
    try {
        const comments = await Comment.findAll();
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.createComment = async (req, res, next) => {
    try {
        const newComment = { ...req.body };
        const comment = await Comment.create(newComment);
        res.status(201).json({ message: 'Comment created', comment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getOneComment = async (req, res, next) => {
    try{ 
        const comment = await Comment.findByPk(req.params.id); 
        if (comment) {
            res.status(200).json(comment);
        } else {
            res.status(404).json({ message: 'Comment not found!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//UPDATE
exports.updatePost = async (req, res, next) => {
    try {
        const commentId = req.params.id; 
        const comment = await Comment.findByPk(commentId); 
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found!' }); 
        }

        if (comment.user_id !== req.auth.user_id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const commentObject = req.body;
        delete commentObject.id; 

        // Mettre à jour l'utilisateur
        await Comment.update(commentObject, {where: { id: commentId }});

        res.status(200).json({ message: 'Comment modified!' });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        
        const commentId = req.params.id; 

        const comment = await Comment.findByPk(commentId); 
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found!' }); 
        }
        if (comment.user_id !== req.auth.user_id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        await Comment.destroy({where: { id: commentId }});
        res.status(200).json({ message: 'Post deleted!' });

        }
     catch (error) {
        res.status(500).json({ error: error.message });
    }
};