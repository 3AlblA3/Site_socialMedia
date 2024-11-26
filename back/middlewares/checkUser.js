const User = require('../models/modelUser');

module.exports = async (req, res, next) => {
    try {
        const userId = req.params.id; 
        const user = await User.findByPk(userId); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); 
        }   
        if ( req.auth.role_id !== 3 && user.id !== req.auth.user_id ) {
            return res.status(403).json({ message: 'Forbidden: you are not allowed to do that!' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

