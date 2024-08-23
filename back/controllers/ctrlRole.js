const Role = require("../models/modelRole")

exports.getAllRoles = async (req, res, next) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.getOneRole = async (req, res, next) => {
    try{ const role = await Role.findByPk(req.params.id); 
        if (role) {
            res.status(200).json(role);
        } else {
            res.status(404).json({ message: 'Role not found!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};