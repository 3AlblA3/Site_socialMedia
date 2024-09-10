const Post = require("../models/modelPost")
const fs = require('fs');

//Afficher tout les posts

exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.findAll();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Créer un post


exports.createPost = async (req, res, next) => {
    try {
        const newPost = { 
            ...req.body, 
            user_id: req.auth.user_id,  
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
        };
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
        const postObject = req.file ? {
            ...req.body,
            user_id: req.auth.user_id,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {
            ...req.body,
            user_id: req.auth.user_id,
        }
        
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
        const post = await Post.findByPk(postId)
        if (!post) {
            return res.status(404).json({ message: 'Post not found!' });
        }
        if (post.imageUrl) {
            const filename = post.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, async (err) => {
                if (err) {
                    console.error('Error deleting image:', err);
                }
                await Post.destroy({where: { id: postId }});
                res.status(200).json({ message: 'Post deleted!' });
            });
        } else {
            await Post.destroy({where: { id: postId }});
            res.status(200).json({ message: 'Post deleted!' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};