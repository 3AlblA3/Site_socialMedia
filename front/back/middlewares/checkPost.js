const Post = require('../models/modelPost');

module.exports = async (req, res, next) => {
    try {
        const postId = req.params.id; 
        const post = await Post.findByPk(postId); 
        if (!post) {
            return res.status(404).json({ message: 'Post not found!' }); 
        }   
        if (post.user_id !== req.auth.user_id && req.auth.role_id !== 3) {
            return res.status(403).json({ message: 'Forbidden: you are not allowed to do that!' });
        }
        req.post = post;  // On passe le post au controller si besoin
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

