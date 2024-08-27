const Post = require("../models/modelPost")

//Afficher tout les posts

exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.findAll();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

//Créer un post

exports.createPost = async (req, res, next) => {
    try {
        const newPost = { ...req.body };
        const post = await Post.create(newPost);
        res.status(201).json({ message: 'Post created', post });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Afficher un seul post

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

//Mettre à jour un post

exports.updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id; 
        const post = await Post.findByPk(postId); 
        if (!post) {
            return res.status(404).json({ message: 'Post not found!' }); 
        }

        if (post.user_id !== req.auth.user_id) {
            return res.status(403).json({ message: 'Forbidden' });
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

//Supprimer un post

exports.deletePost = async (req, res, next) => {
    try {
        
        const postId = req.params.id; 

        const post = await Post.findByPk(postId); 
        if (!post) {
            return res.status(404).json({ message: 'Post not found!' }); 
        }
        if (post.user_id !== req.auth.user_id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        await Post.destroy({where: { id: postId }});
        res.status(200).json({ message: 'Post deleted!' });

        }
     catch (error) {
        res.status(500).json({ error: error.message });
    }
};