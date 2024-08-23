module.exports = (req, res, next) => {
    if (req.user.role >= 2) {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Insufficient rights' });
    }
};