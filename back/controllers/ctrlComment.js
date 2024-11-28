const Comment = require("../models/modelComment");
const fs = require('fs');

exports.getAllComments = async (req, res, next) => {
    try {
        const comments = await Comment.findAll();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createComment = async (req, res, next) => {
    try {
        const newComment = req.file ? {
            ...req.body,
            user_id: req.auth.user_id,
            image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {
            ...req.body,
            user_id: req.auth.user_id,
        }
        const comment = await Comment.create(newComment);
        res.status(201).json({ message: 'Comment created', comment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getOneComment = async (req, res, next) => {
    try{ 
        const comment = await Comment.findByPk(req.params.id); 
        if (comment) {
            res.status(200).json(comment);
        } else {
            res.status(404).json({ message: 'Comment not found!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;  
        const commentObject = req.file ? {
            ...req.body,
            user_id: req.auth.user_id,
            image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {
            ...req.body,
            user_id: req.auth.user_id,
        }
        
        delete commentObject.id; 

        await Comment.update(commentObject, {where: { id: commentId }});

        res.status(200).json({ message: 'Comment modified!' });

    }catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.id; 
        const comment = await Comment.findByPk(commentId)
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found!' });
        }
        if (comment.image_url) {
            const filename = comment.image_url.split('/images/')[1];
            fs.unlink(`images/${filename}`, async (err) => {
                if (err) {
                    console.error('Error deleting image:', err);
                }
                await Comment.destroy({where: { id: commentId }});
                res.status(200).json({ message: 'Comment deleted!' });
            });
        } else {
            await Comment.destroy({where: { id: commentId }});
            res.status(200).json({ message: 'Comment deleted!' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};