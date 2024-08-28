const CommentLike = require("../models/modelCommentLike")

exports.getAllCommentLikes = async (req, res, next) => {
    try {
        const commentLikes = await CommentLike.findAll();
        res.status(200).json(commentLikes);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.createCommentLike = async (req, res, next) => {
    try {
        const newCommentLike = { ...req.body, user_id: req.auth.user_id};
        const commentLike = await CommentLike.create(newCommentLike);
        res.status(200).json(commentLike);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};


exports.getOneCommentLike = async (req, res, next) => {
    try{ const commentLike = await CommentLike.findByPk(req.params.id); 
        if (commentLike) {
            res.status(200).json(commentLike);
        } else {
            res.status(404).json({ message: 'commentLike not found!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCommentLike = async (req, res, next) => {
    try {
        const commentLikeId = req.params.id; 

        await CommentLike.destroy({where: { id: commentLikeId }});
        res.status(200).json({ message: 'commentLike deleted!' });

        }
     catch (error) {
        res.status(500).json({ error: error.message });
    }
};

