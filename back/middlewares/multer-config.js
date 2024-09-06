// Multer sert à telecharger des images vers le site

const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
};

const storage = multer.diskStorage({//storage , à passer à multer comme configuration, 
    // qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants :
  destination: (req, file, callback) => {//destination indique à multer d'enregistrer les fichiers dans le dossier images ;
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // filename indique à multer d'utiliser le nom d'origine, 
    //de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier
    const extension = MIME_TYPES[file.mimetype]; //constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée.
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');