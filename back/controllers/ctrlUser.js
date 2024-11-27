const User = require("../models/modelUser");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// Afficher tout les utilisateurs

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Créer un compte

exports.signup = async (req, res, next) => {    
    try {
        // Vérifier si un utilisateur avec cet email existe déjà, même soft-deleted
        const existingUser = await User.findOne({
            where: { email: req.body.email },
            paranoid: false
        });

        if (existingUser) { 
            if (existingUser.deletedAt) { // Si l'utilisateur a été supprimé
                const passwordValid = await bcrypt.compare(req.body.password, existingUser.password);

                if (passwordValid) {
                    // Restaurer l'utilisateur soft-deleted si le mot de passe est correct
                    await User.restore({ where: { id: existingUser.id } });
                    return res.status(200).json({ message: 'User restored'});
                } else {
                    // Mot de passe incorrect
                    return res.status(401).json({ error: "Wrong password" });
                }
            } else { 
                return res.status(400).json({ error: "Email already in use" });
            }
        } else {
            const hash = await bcrypt.hash(req.body.password, 10); // "Hachage" du mot de passe
            const user = await User.create({ 
                role_id: req.body.role_id, //Pour l'instant l'user pourra choisir son rôle à la création de son compte
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                email: req.body.email,
                password: hash
            });
        
            res.status(201).json({ message: 'User created!', user });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Quand l'user se connecte au site

exports.login = async (req, res, next) => {
    try {
        // Recherche de l'utilisateur par email
        const user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            // Si l'utilisateur n'existe pas, retourner une erreur
            return res.status(401).json({ error: 'Invalid mail/password!' });
        }

        // Comparaison du mot de passe
        const valid = await bcrypt.compare(req.body.password, user.password);

        if (!valid) {
            // Si le mot de passe est incorrect, retourner une erreur
            return res.status(401).json({ error: 'Invalid mail/password!' });
        }

        // Si la paire email/mot de passe est correcte, retourner l'ID et le role_id du user et un token
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

//Récupérer les informations d'un user

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

//Si l'utilisateur veut modifier les informations de son compte

exports.updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        //Vérifier que le user à modifier est bien celui qui exécute la requête

        if (user.id !== req.auth.user_id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const hash = await bcrypt.hash(req.body.password, 10); // "Hachage" du mot de passe

        const userObject = {
            role_id: req.body.role_id, //Pour l'instant l'user pourra choisir son rôle à la création de son compte
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            email: req.body.email,
            password: hash};

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

//Supprimer l'utilisateur

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        // On récupère les informations du user à supprimer

        const userToDelete = await User.findByPk(userId);

        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        //Vérifier que le user à supprimer est bien celui qui exécute la requête

        if (userToDelete.id !== req.auth.user_id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Si les vérifications passent, supprimer l'utilisateur
        await User.destroy({ where: { id: req.params.id } });
        res.status(200).json({ message: 'User deleted' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



