const request = require('supertest');
const app = require('../app'); // Remplacez par le chemin correct vers votre app Express
const CommentLike = require('../models/modelCommentLike');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');

jest.mock('../models/modelCommentLike');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

beforeAll(async () => {
    await sequelize.authenticate();
});
afterAll(async () => {
    await sequelize.close(); 
});

describe('GET /commentLikes', () => {

    // Simulation de la requête Get réussie

    it('should return all commentLikes', async () => {

        //Simulation d'un tableau de posts dans notre base de données.
        const mockCommentLike = [
            {   id: 1, 
                user_id: 1,
                comment_id: 1
            } 
        ];
        
        //Simulation de la fonction findAll qui trouve notre simulation de nos posts.

        CommentLike.findAll.mockResolvedValue(mockCommentLike);

        //On poste notre requête sur la route get

        const response = await request(app).get('/commentLikes');

        // Réponses attendues

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCommentLike);
    });

    //Test de notre requête échouée
    
    it('should return 500 if something goes wrong', async () => {

        CommentLike.findAll.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/commentLikes');

        expect(response.status).toBe(500);
        });
});

describe('GET /commentLikes/:id', () => {
    it('should return the commentLike if found', async () => {
        const commentLike ={   
            id: 1, 
            user_id: 1,
            comment_id: 1
        } 


        CommentLike.findByPk.mockResolvedValue(commentLike);

        const response = await request(app)
            .get('/commentLikes/1');

        expect(response.status).toBe(200);
        expect(CommentLike.findByPk).toHaveBeenCalledWith("1");

    });

    it('should return 404 if commentLike is not found', async () => {
        CommentLike.findByPk.mockResolvedValue(null); // Mock l'absence de l'utilisateur

        const response = await request(app)
            .get('/commentLikes/1');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe(undefined);
    });

    it('should return 500 if something goes wrong', async () => {
        CommentLike.findByPk.mockRejectedValue(new Error('Database error')); // Mock une erreur lors de la recherche

        const response = await request(app)
            .get('/commentLikes/1');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database error');
    });
});

describe('POST /commentLikes/toggle', () => {
    beforeEach(() => {
        jwt.verify = jest.fn().mockImplementation((token, secret) => {
            if (token === 'validtoken') {
                return { user_id: 1, role_id: 2 };
            } else {
                throw new Error('Token not valid');
            }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();  
    });

    it('should toggle a commentLike and return 200 or 201', async () => {
        const commentLikeData = { comment_id: 1 };

        // Mock the CommentLike.findOne to simulate no existing like
        CommentLike.findOne.mockResolvedValue(null);
        
        // Mock the CommentLike.create for a new like
        CommentLike.create.mockResolvedValue({ id: 1, user_id: 1, ...commentLikeData });

        const response = await request(app)
            .post('/commentLikes/toggle')
            .set('Cookie', ['token=validtoken'])
            .send(commentLikeData);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Like added');
        expect(response.body.liked).toBe(true);
    });

    it('should return a 401 status if there is no token', async () => {
        const commentLikeData = { comment_id: 1 };

        const response = await request(app)
          .post('/commentLikes/toggle')
          .send(commentLikeData);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Authentication token is missing');
    });
});