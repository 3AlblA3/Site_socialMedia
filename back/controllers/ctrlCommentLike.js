const CommentLike = require("../models/modelCommentLike")

exports.getAllCommentLikes = async (req, res, next) => {
    try {
        const commentLikes = await CommentLike.findAll();
        res.status(200).json(commentLikes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




exports.getOneCommentLike = async (req, res, next) => {
    try{ const commentLike = await CommentLike.findByPk(req.params.id); 
        if (commentLike) {
            res.status(200).json(commentLike);
        } else {
            res.status(404).json({ message: 'CommentLike not found!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.toggleCommentLike = async (req, res, next) => {
    try {
      const { comment_id } = req.body;
      const user_id = req.auth.user_id;
  
      const existingLike = await CommentLike.findOne({
        where: { user_id, comment_id },
        paranoid: false //Inclut le soft delete
      });
  
      if (existingLike) {
        if (existingLike.deletedAt) {
          // Si le like a été supprimé, le restore
          await existingLike.restore();
          res.status(200).json({ message: 'Like restored', liked: true });
        } else {
          // Si le like existe, le supprimer
          await existingLike.destroy();
          res.status(200).json({ message: 'Like removed', liked: false });
        }
      } else {
        // Si le like n'existe pas, le créer
        await CommentLike.create({ user_id, comment_id });
        res.status(201).json({ message: 'Like added', liked: true });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };




