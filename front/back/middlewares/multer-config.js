// Multer sert à telecharger des images vers le site

const multer = require('multer');

// Definition de nos types d'images

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
};

const storage = multer.diskStorage({

// Definition de l'endroit où seront envoyées nos images

  destination: (req, file, callback) => {
    callback(null, 'images');
  },

// On choisit comment notre fichier sera nommé. 

  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); 
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image_url');