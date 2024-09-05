const request = require('supertest');
const app = require('../app'); // Remplacez par le chemin correct vers votre app Express
const Post = require('../models/modelPost');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');

jest.mock('../models/modelPost');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

beforeAll(async () => {
    await sequelize.authenticate();
});
afterAll(async () => {
    await sequelize.close(); 
});

describe('GET /posts', () => {

    // Simulation de la requête Get réussie

    it('should return all posts', async () => {

        //Simulation d'un tableau de posts dans notre base de données.
        const mockPosts = [
            {   id: 1, 
                user_id: 1,
                content: 'ceci est un commentaire test'
            } 
        ];
        
        //Simulation de la fonction findAll qui trouve notre simulation de nos posts.

        Post.findAll.mockResolvedValue(mockPosts);

        //On poste notre requête sur la route get

        const response = await request(app).get('/posts');

        // Réponses attendues

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockPosts);
    });

    //Test de notre requête échouée
    
    it('should return 500 if something goes wrong', async () => {
        Post.findAll.mockRejectedValue(new Error('Database error'));
        const response = await request(app).get('/posts');
        expect(response.status).toBe(500);
        });
});

describe('GET /posts/:id', () => {
    it('should return the post if found', async () => {
        const post = {
            id: 2, 
            user_id: 1,
            content: "ceci est un commentaire test"
        };

        Post.findByPk.mockResolvedValue(post);

        const response = await request(app)
            .get('/posts/2');

        expect(response.status).toBe(200);
        expect(Post.findByPk).toHaveBeenCalledWith("2");

    });

    it('should return 404 if post is not found', async () => {
        Post.findByPk.mockResolvedValue(null); // Mock l'absence de l'utilisateur

        const response = await request(app)
            .get('/posts/2');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe(undefined);
    });

    it('should return 500 if something goes wrong', async () => {
        Post.findByPk.mockRejectedValue(new Error('Database error')); // Mock une erreur lors de la recherche

        const response = await request(app)
            .get('/posts/2');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database error');
    });
});

describe('POST /posts/', () => {

    it('should create a new user and return 201', async () => {
        const newPost = {
            id: 3, 
            user_id: 2,
            content: "nouveau commentaire"
        }
    })


})