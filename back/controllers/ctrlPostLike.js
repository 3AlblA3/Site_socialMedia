const PostLike = require("../models/modelPostLike")

exports.getAllPostLikes = async (req, res, next) => {
    try {
        const postLikes = await PostLike.findAll();
        res.status(200).json(postLikes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPostLike = async (req, res, next) => {
    try {
        const newPostLike = { ...req.body, user_id: req.auth.user_id};
        const postLike = await PostLike.create(newPostLike);
        res.status(200).json(postLike);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getOnePostLike = async (req, res, next) => {
    try{ const postLike = await PostLike.findByPk(req.params.id); 
        if (postLike) {
            res.status(200).json(postLike);
        } else {
            res.status(404).json({ message: 'PostLike not found!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePostLike = async (req, res, next) => {
    try {
        const postLikeId = req.params.id; 
        await PostLike.destroy({where: { id: postLikeId }});
        res.status(200).json({ message: 'PostLike deleted!' });

        }
     catch (error) {
        res.status(500).json({ error: error.message });
    }
};


