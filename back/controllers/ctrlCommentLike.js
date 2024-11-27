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
        paranoid: false // This will include soft-deleted records
      });
  
      if (existingLike) {
        if (existingLike.deletedAt) {
          // If the like was soft-deleted, restore it
          await existingLike.restore();
          res.status(200).json({ message: 'Like restored', liked: true });
        } else {
          // If the like exists and is not deleted, soft-delete it
          await existingLike.destroy();
          res.status(200).json({ message: 'Like removed', liked: false });
        }
      } else {
        // If the like doesn't exist, create it
        await CommentLike.create({ user_id, comment_id });
        res.status(201).json({ message: 'Like added', liked: true });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };




