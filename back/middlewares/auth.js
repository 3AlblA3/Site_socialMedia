    //middleware qui va vérifier que l’utilisateur est bien connecté et 
//transmettre les informations de connexion aux différentes méthodes qui vont gérer les requêtes.

const jwt = require('jsonwebtoken'); // import de jswonwebtoken

//Étant donné que de nombreux problèmes peuvent se produire, nous insérons tout à l'intérieur d'un bloc try...catch.
 
module.exports = (req, res, next) => {
   try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
       const token = authHeader.split(' ')[1]; //extraire le token du header Authorization de la requête entrante
       //split pour tout récupérer après l'espace dans le head
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //verify pour décoder notre token.
       const user_id = decodedToken.user_id; //extrayons l'ID utilisateur de notre token et rajout à l’objet Request afin que nos différentes routes puissent l’exploiter.
       req.auth = {
           user_id: user_id
       };
    next();
   } catch(error) {
       res.status(401).json({ error });
   }
};