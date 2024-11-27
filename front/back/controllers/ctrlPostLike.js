const PostLike = require("../models/modelPostLike")

// affichage de tout les postlikes

exports.getAllPostLikes = async (req, res, next) => {
    try {
        const postLikes = await PostLike.findAll();
        res.status(200).json(postLikes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// affichage d'un postlike

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

// Addition, suppression des postlikes

exports.togglePostLike = async (req, res, next) => {
    try {
      const { post_id } = req.body;
      const user_id = req.auth.user_id;
  
      const existingLike = await PostLike.findOne({
        where: { user_id, post_id },
      });
  
      if (existingLike) {
        if (existingLike.deletedAt) {
          //Si le like a été supprimé, on le restaure
          await existingLike.restore();
          res.status(200).json({ message: 'Like restored', liked: true });
        } else {
          //Si le like existe et n'a pas été supprimé, on le detruit
          await existingLike.destroy();
          res.status(200).json({ message: 'Like removed', liked: false });
        }
      } else {
        // Si le like n'existe pas, le crée
        await PostLike.create({ user_id, post_id });
        res.status(201).json({ message: 'Like added', liked: true });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


