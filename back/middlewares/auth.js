const jwt = require('jsonwebtoken'); // import de jswonwebtoken
 
module.exports = (req, res, next) => {
   try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        const token = authHeader.split(' ')[1]; 
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

       req.auth = {
        user_id: decodedToken.user_id,
        role_id: decodedToken.role_id,
       };
    next();
   } catch(error) {
       res.status(401).json({ error });
   }
};


