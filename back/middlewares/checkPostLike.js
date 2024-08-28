const PostLike = require('../models/modelPostLike');

module.exports = async (req, res, next) => {
    try {
        const postLikeId = req.params.id; 
        const postLike = await PostLike.findByPk(postLikeId); 
        if (!postLike) {
            return res.status(404).json({ message: 'Like not found!' }); 
        }   
        if (postLike.user_id !== req.auth.user_id && req.auth.role_id !== 3) {
            return res.status(403).json({ message: 'Forbidden: you are not allowed to do that!' });
        }
        req.postLike = postLike;  // On passe le post au controller si besoin
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

