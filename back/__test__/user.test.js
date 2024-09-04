const request = require('supertest');
const app = require('../app'); // Remplacez par le chemin correct vers votre app Express
const User = require('../models/modelUser');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../models/modelUser');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
});

beforeAll(async () => {
    await sequelize.authenticate();
});
afterAll(async () => {
    await sequelize.close(); 
});
    
//Groupe de test concernant la route GET

describe('GET /users', () => {

    // Simulation de la requête Get réussie

    it('should return all users', async () => {

        //Simulation d'un tableau de users dans notre base de données.
        const mockUsers = [
            {   id: 1, 
                role_id: 2,
                first_name: 'monsieur', 
                last_name: 'test', 
                email: 'monsieur.test@gmail.com', 
                password:"pwdtest"
            } 
        ];
        
        //Simulation de la fonction findAll qui trouve notre simulation de nos users.

        User.findAll.mockResolvedValue(mockUsers);

        //On poste notre requête sur la route get

        const response = await request(app).get('/users');

        // Réponses attendues

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUsers);
        expect(User.findAll).toHaveBeenCalledTimes(1);
    });

    //Test de notre requête échouée
    
    it('should return 500 if something goes wrong', async () => {
        User.findAll.mockRejectedValue(new Error('Database error'));
        const response = await request(app).get('/users');
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database error');
        });
});

// Test de notre route GET by id

describe('GET /users/:id', () => {
    it('should return the user if found', async () => {
        const user = {
            id: 1,
            role_id: 2,
            first_name: 'Get',
            last_name: 'User',
            email: 'getuser@gmail.com',
            password: 'hashedpassword'
        };

        User.findByPk.mockResolvedValue(user); // Mock la recherche de l'utilisateur

        const response = await request(app)
            .get('/users/1');

        expect(response.status).toBe(200);
        // expect(User.findByPk).toHaveBeenCalledWith(1);
        expect(User.findByPk).toHaveBeenCalledWith(parseInt(1, 10));

    });

    it('should return 404 if user is not found', async () => {
        User.findByPk.mockResolvedValue(null); // Mock l'absence de l'utilisateur

        const response = await request(app)
            .get('/users/1');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe(undefined);
    });

    it('should return 500 if something goes wrong', async () => {
        User.findByPk.mockRejectedValue(new Error('Database error')); // Mock une erreur lors de la recherche

        const response = await request(app)
            .get('/users/1');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database error');
    });
});


// Test de notre fonction signup

describe('POST /users/signup', () => {

    // Test de la bonne création de notre user

    it('should create a new user and return 201', async () => {
        const newUser = {
            role_id: 2,
            first_name: 'Jean',
            last_name: 'Dujardin',
            email: 'jean.dujardin@gmail.com',
            password: 'oss117'
        };

        //Simulation de notre focntion hash, puis si l'user n'as pas été trouvé, créer un newUser.

        bcrypt.hash.mockResolvedValue('hashedpassword');
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({ id: 1, ...newUser, password: 'hashedpassword' });

        // Simulation de notre requête une fois que tout ça est fait

        const response = await request(app)
            .post('/users/signup')
            .send(newUser);

        //Réponse attendue

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Utilisateur créé !');
        expect(response.body.user.email).toBe('jean.dujardin@gmail.com');
        expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
            role_id: 2,
            first_name: 'Jean',
            last_name: 'Dujardin',
            email: 'jean.dujardin@gmail.com',
            password: 'hashedpassword'
        }));
    });

    // Test si l'email de notre user existe déjà et déjà en utilisation

    it('should return 400 if email already exists', async () => {
        const existingUser = {
            id: 1,
            role_id: 2,
            first_name: 'Existing',
            last_name: 'User',
            email: 'existinguser@gmail.com',
            password: 'hashedpassword'
        };

        User.findOne.mockResolvedValue(existingUser);

        const response = await request(app)
            .post('/users/signup')
            .send({ email: 'existinguser@gmail.com', password: 'password123' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Email already in use');
    });

    //Test de la fonction restore de notre signup

    it('should restore a soft-deleted user and return 200 if password is correct', async () => {

        //Simulation d'un user supprimé dans la BDD
        const deletedUser = {
            id: 1,
            role_id: 2,
            first_name: 'Deleted',
            last_name: 'User',
            email: 'deleteduser@gmail.com',
            password: 'hashedpassword',
            deletedAt: new Date()
        };

        //Simulation des fonctions findone, bcrypt compare et restore 

        User.findOne.mockResolvedValue(deletedUser);
        bcrypt.compare.mockResolvedValue(true);
        User.restore = jest.fn().mockResolvedValue(1)
        // Simulation de notre requête

        const response = await request(app)
            .post('/users/signup')
            .send({ email: 'deleteduser@gmail.com', password: 'mdp123' });

        // Résultas attendus de notre test

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User restored');
        expect(User.restore).toHaveBeenCalledWith();
    });

    it('should return 401 if password is incorrect when restoring a soft-deleted user', async () => {
        const deletedUser = {
            id: 1,
            role_id: 2,
            first_name: 'Deleted',
            last_name: 'User',
            email: 'deleteduser@gmail.com',
            password: 'hashedpassword',
            deletedAt: new Date()
        };

        User.findOne.mockResolvedValue(deletedUser);
        bcrypt.compare.mockResolvedValue(false);

        const response = await request(app)
            .post('/users/signup')
            .send({ email: 'deleteduser@gmail.com', password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Mot de passe incorrect pour restaurer l\'utilisateur');
        expect(User.restore).not.toHaveBeenCalled();
    });

    //Test d'une erreur lors de notre requête

    it('should return 500 if something goes wrong', async () => {
        User.findOne.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/users/signup')
            .send({ email: 'erroruser@example.com', password: 'password123' });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database error');
    });
});

//Test de notre fonction login

describe('POST /users/login', () => {

    it('should return a token if login is successful', async () => {

        //Simulation de notre user dans la bdd

        const user = {
            id: 1,
            role_id: 2,
            first_name: 'Existing',
            last_name: 'User',
            email: 'existinguser@gmail.com',
            password: 'hashedpassword'
        };

        User.findOne.mockResolvedValue(user);

        //simulation du resultat true de la fonction compare de bcrypt et simulation de token
        
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('validtoken');

        // Création de notre requête posts

        const response = await request(app)
            .post('/users/login')
            .send({ email: 'existinguser@gmail.com', password: 'password123' });

        //Résultats attendus

        expect(response.status).toBe(200);
        expect(response.body.token).toBe('validtoken');
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
        expect(jwt.sign).toHaveBeenCalledWith(
            { user_id: user.id, role_id: user.role_id }, 
            process.env.JWT_SECRET,
            { algorithm: 'HS256', expiresIn: '24h' }
        );
    });

    // Si l'email n'est pas trouvé dans la bdd

    it('should return 401 if email is not found', async () => {
        User.findOne.mockResolvedValue(null);

        const response = await request(app)
            .post('/users/login')
            .send({ email: 'nonexistentuser@example.com', password: 'password123' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Paire Mail/Mot de passe incorrect !');
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    // Si le mot de passe est incorrect

    it('should return 401 if password is incorrect', async () => {
        const user = {
            id: 1,
            role_id: 2,
            first_name: 'Existing',
            last_name: 'User',
            email: 'existinguser@gmail.com',
            password: 'hashedpassword'
        };

        User.findOne.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(false);

        const response = await request(app)
            .post('/users/login')
            .send({ email: 'existinguser@gmail.com', password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Paire Mail/Mot de passe incorrect !');
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
    });

    it('should return 500 if something goes wrong', async () => {
        User.findOne.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/users/login')
            .send({ email: 'erroruser@example.com', password: 'password123' });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database error');
    });
});

// Test de la route DELETE

describe('DELETE /users/:id', () => {
    it('should delete the user and return 200 if successful', async () => {
        const user = {
            id: 1,
            role_id: 2,
            first_name: 'Delete',
            last_name: 'User',
            email: 'deleteuser@gmail.com',
            password: 'hashedpassword'
        };

        User.findByPk.mockResolvedValue(user); // Mock la recherche de l'utilisateur
        User.destroy = jest.fn().mockResolvedValue(1); // Mock la suppression de l'utilisateur

        const response = await request(app)
        .delete('/users/1')
        .set('Authorization', `Bearer validtoken`); // Si un token est nécessaire

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User deleted');
        expect(User.findByPk).toHaveBeenCalledWith(1);
        expect(User.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return 404 if user is not found', async () => {
        User.findByPk.mockResolvedValue(null); // Mock l'absence de l'utilisateur

        const response = await request(app)
        .delete('/users/1')
        .set('Authorization', `Bearer validtoken`); // Si un token est nécessaire
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });

    it('should return 500 if something goes wrong', async () => {
        User.findByPk.mockRejectedValue(new Error('Database error')); // Mock une erreur lors de la recherche

        const response = await request(app)
        .delete('/users/1')
        .set('Authorization', `Bearer validtoken`); // Si un token est nécessaire

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database error');
    });
});

// Test de notre route PUT

describe('PUT /users/:id', () => {
    it('should modify the user and return 200 if successful', async () => {
        const user = {
            id: 1,
            role_id: 2,
            first_name: 'Modify',
            last_name: 'User',
            email: 'modifyuser@gmail.com',
            password: 'hashedpassword'
        };

        const updatedUser = {
            id: 1,
            role_id: 2,
            first_name: 'Modified',
            last_name: 'User',
            email: 'modifieduser@gmail.com',
            password: 'hashedpassword'
        };

        User.findByPk.mockResolvedValue(user); // Mock la recherche de l'utilisateur
        jwt.verify.mockResolvedValue({ user_id: 1, role_id: 2 });
        User.update = jest.fn().mockResolvedValue([1, [updatedUser]]); // Mock la mise à jour de l'utilisateur

        const response = await request(app)
            .put('/users/1')
            .set('Authorization', `Bearer validtoken`)
            .send({
                first_name: 'Modified',
                last_name: 'User',
                email: 'modifieduser@gmail.com',
                
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User updated');
        expect(response.body.user).toEqual(updatedUser);
        expect(User.update).toHaveBeenCalledWith(
            expect.objectContaining({
                first_name: 'Modified',
                last_name: 'User',
                email: 'modifieduser@gmail.com'
            }),
            { where: { id: 1 }, returning: true, individualHooks: true }
        );
    });

    it('should return 404 if user is not found', async () => {

        User.findByPk.mockResolvedValue(null); // Mock l'absence de l'utilisateur
        jwt.verify.mockResolvedValue({ user_id: 1, role_id: 2 });


        const response = await request(app)
            .put('/users/1')
            .set('Authorization', `Bearer validtoken`)
            .send({
                first_name: 'Modified',
                last_name: 'User',
                email: 'modifieduser@gmail.com'
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });

    it('should return 500 if something goes wrong', async () => {

        User.findByPk.mockRejectedValue(new Error('Database error')); // Mock une erreur lors de la recherche
        jwt.verify.mockResolvedValue({ user_id: 1, role_id: 2 });

        const response = await request(app)
            .put('/users/1')
            .set('Authorization', `Bearer validtoken`)
            .send({
                first_name: 'Modified',
                last_name: 'User',
                email: 'modifieduser@gmail.com'
            });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database error');
    });
});
