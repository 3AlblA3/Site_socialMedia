const Comment = require('../models/modelComment');

module.exports = async (req, res, next) => {
    try {
        const commentId = req.params.id; 
        const comment = await Comment.findByPk(commentId); 
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found!' }); 
        }   
        if (comment.user_id !== req.auth.user_id && req.auth.role_id !== 3) {
            return res.status(403).json({ message: 'Forbidden: you are not allowed to do that!' });
        }
        req.comment = comment; 
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
