const jwt = require('jsonwebtoken'); // import de jswonwebtoken
 
module.exports = (req, res, next) => {
   try {
    let token;

    // Check des cookies et récupération du token
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } 

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

       req.auth = {
        user_id: decodedToken.user_id,
        role_id: decodedToken.role_id,
       };

       res.setHeader('X-Content-Type-Options', 'nosniff');
       res.setHeader('X-Frame-Options', 'DENY');
       res.setHeader('X-XSS-Protection', '1; mode=block');
       res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    next();
   } catch(error) {
       if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }

        res.status(401).json({ message: 'Invalid token' });
   }
};

