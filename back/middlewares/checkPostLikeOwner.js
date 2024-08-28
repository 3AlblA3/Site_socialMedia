if (post.user_id !== req.auth.user_id) {
    return res.status(403).json({ message: 'Forbidden' });
}