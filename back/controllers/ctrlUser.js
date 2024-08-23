const User = require("../models/modelUser");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.signup = async (req, res, next) => {
    try {
        // Vérifier si un utilisateur avec cet email existe déjà, même soft-deleted
        const existingUser = await User.findOne({
            where: { email: req.body.email },
            paranoid: false, // Rechercher même les enregistrements soft-deleted
        });

        if (existingUser) {
            if (existingUser.deletedAt) {
                // Restaurer l'utilisateur soft-deleted
                await existingUser.restore();
                res.status(200).json({ message: 'User restored', user: existingUser });
            } else {
                return res.status(400).json({ error: "Email already in use" });
            }
        } else {
            const hash = await bcrypt.hash(req.body.password, 10); // Hachage du mot de passe
            const user = await User.create({
                role_id: req.body.role_id,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                email: req.body.email,
                password: hash
            });
        
            res.status(201).json({ message: 'Utilisateur créé !', user });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res, next) => {
    try {
        // Recherche de l'utilisateur par email
        const user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            // Si l'utilisateur n'existe pas, retourner une erreur
            return res.status(401).json({ error: 'Paire Mail/Mot de passe incorrect !' });
        }

        // Comparaison du mot de passe
        const valid = await bcrypt.compare(req.body.password, user.password);

        if (!valid) {
            // Si le mot de passe est incorrect, retourner une erreur
            return res.status(401).json({ error: 'Paire Mail/Mot de passe incorrect !' });
        }

        // Si la paire email/mot de passe est correcte, retourner l'ID de l'utilisateur et un token
        const token = jwt.sign(
            { user_id: user.id, role_id: user.role_id }, // Payload
            process.env.JWT_SECRET, // Clé secrète
            { algorithm: 'HS256', expiresIn: '24h' } // Options
        );

        // Retourner le token dans la réponse
        res.status(200).json({ token: token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getOneUser = async (req, res, next) => {
    try{ const user = await User.findByPk(req.params.id); 
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//UPDATE
exports.updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { role_id, user_id } = req.auth; // Supposons que req.auth contient les informations du JWT

        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // Vérifier les autorisations
        if (role_id !== 3 && user_id !== userId) { // L'utilisateur ne peut pas modifier les autres comptes sauf si c'est un admin
            return res.status(403).json({ message: 'Forbidden' });
        }

        const userObject = req.body;

        // Supprimer l'ID et l'email des données à mettre à jour
        delete userObject.id;
        delete userObject.email;

        // Mettre à jour l'utilisateur
        await User.update(userObject, { where: { id: userId } });

        res.status(200).json({ message: 'User modified!' });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.deleteUser = async (req, res, next) => {
    try {
        const userToDelete = await User.findOne({ where: { id: req.params.id } });

        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Vérifier les permissions en fonction du rôle
        if (req.auth.role_id === 2) {
            // Registered users can only delete their own accounts
            if (req.auth.user_id !== userToDelete.id) {
                return res.status(403).json({ message: 'Forbidden: You can only delete your own account' });
            }
        } else if (req.auth.role_id !== 3) {
            // Only admins can delete any account
            return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this account' });
        }

        // Si les vérifications passent, supprimer l'utilisateur
        await User.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: 'User deleted' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


