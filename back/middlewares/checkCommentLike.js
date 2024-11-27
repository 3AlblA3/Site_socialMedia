const CommentLike = require('../models/modelCommentLike');

module.exports = async (req, res, next) => {
    try {
        const commentLikeId = req.params.id; 
        const commentLike = await CommentLike.findByPk(commentLikeId); 
        if (!commentLike) {
            return res.status(404).json({ message: 'Like not found!' }); 
        }   
        if (commentLike.user_id !== req.auth.user_id && req.auth.role_id !== 3) {
            return res.status(403).json({ message: 'Forbidden: you are not allowed to do that!' });
        }
        req.commentLike = commentLike;  // On passe le post au controller si besoin
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
