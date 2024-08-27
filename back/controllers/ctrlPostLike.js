const PostLike = require("../models/modelPostLike")

exports.getAllPostLikes = async (req, res, next) => {
    try {
        const postLikes = await PostLike.findAll();
        res.status(200).json(postLikes);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.createPostLike = async (req, res, next) => {
    try {
        const newPostLike = { ...req.body };
        const postLike = await PostLike.create(newPostLike);
        res.status(200).json(postLike);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};


exports.getOnePostLike = async (req, res, next) => {
    try{ const postLike = await PostLike.findByPk(req.params.id); 
        if (postLike) {
            res.status(200).json(postLike);
        } else {
            res.status(404).json({ message: 'postLike not found!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePostLike = async (req, res, next) => {
    try {
        const postLikeId = req.params.id; 
        const postLike = await PostLike.findByPk(postLikeId); 
        if (!postLike) {
            return res.status(404).json({ message: 'postLike not found!' }); 
        }
        await PostLike.destroy({where: { id: postLikeId }});
        res.status(200).json({ message: 'postLike deleted!' });

        }
     catch (error) {
        res.status(500).json({ error: error.message });
    }
};


