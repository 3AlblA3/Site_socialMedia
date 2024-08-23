const Post = require("../models/modelPost")

exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.findAll();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.createPost = async (req, res, next) => {
    try {
        const newPost = { ...req.body };
        const post = await Post.create(newPost);
        res.status(201).json({ message: 'Post created', post });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getOnePost = async (req, res, next) => {
    try{ 
        const post = await Post.findByPk(req.params.id); 
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//UPDATE
exports.updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id; 
        const post = await Post.findByPk(postId); 
        if (!post) {
            return res.status(404).json({ message: 'Post not found!' }); 
        }

        const postObject = req.body;
        delete postObject.id; 

        // Mettre à jour l'utilisateur
        await Post.update(postObject, {where: { id: postId }});

        res.status(200).json({ message: 'Post modified!' });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        
        const postId = req.params.id; 

        const post = await Post.findByPk(postId); 
        if (!post) {
            return res.status(404).json({ message: 'Post not found!' }); 
        }
        await Post.destroy({where: { id: postId }});
        res.status(200).json({ message: 'Post deleted!' });

        }
     catch (error) {
        res.status(500).json({ error: error.message });
    }
};