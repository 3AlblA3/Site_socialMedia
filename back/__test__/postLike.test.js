const request = require('supertest');
const app = require('../app'); // Remplacez par le chemin correct vers votre app Express
const PostLike = require('../models/modelPostLike');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');

jest.mock('../models/modelPostLike');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

beforeAll(async () => {
    await sequelize.authenticate();
});
afterAll(async () => {
    await sequelize.close(); 
});

describe('GET /postLikes', () => {

    // Simulation de la requête Get réussie

    it('should return all postLikes', async () => {

        //Simulation d'un tableau de posts dans notre base de données.
        const mockPostLike = [
            {   id: 1, 
                user_id: 1,
                post_id: 1
            } 
        ];
        
        //Simulation de la fonction findAll qui trouve notre simulation de nos posts.

        PostLike.findAll.mockResolvedValue(mockPostLike);

        //On poste notre requête sur la route get

        const response = await request(app).get('/postLikes');

        // Réponses attendues

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockPostLike);
    });

    //Test de notre requête échouée
    
    it('should return 500 if something goes wrong', async () => {

        PostLike.findAll.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/postLikes');

        expect(response.status).toBe(500);
        });
});

describe('GET /postLikes/:id', () => {
    it('should return the postLike if found', async () => {
        const postLike ={   
            id: 1, 
            user_id: 1,
            post_id: 1
        } 


        PostLike.findByPk.mockResolvedValue(postLike);

        const response = await request(app)
            .get('/postLikes/1');

        expect(response.status).toBe(200);
        expect(PostLike.findByPk).toHaveBeenCalledWith("1");

    });

    it('should return 404 if postLike is not found', async () => {
        PostLike.findByPk.mockResolvedValue(null); // Mock l'absence de l'utilisateur

        const response = await request(app)
            .get('/postLikes/1');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe(undefined);
    });

    it('should return 500 if something goes wrong', async () => {
        PostLike.findByPk.mockRejectedValue(new Error('Database error')); // Mock une erreur lors de la recherche

        const response = await request(app)
            .get('/postLikes/1');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database error');
    });
});

describe('POST /postLikes', () => {

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

    it('should create a new postLike and return 200', async () => {
        const newPostLike = {
            id: 1, 
            user_id: 1,
            post_id: 1
        }

        PostLike.create.mockResolvedValue(newPostLike)

        const response = await request(app)
            .post('/postLikes')
            .set('Authorization', 'Bearer validtoken')
            .send(newPostLike)

        expect(response.status).toBe(200);
    })

    it('should return a 401 status if there is no token', async () => {
        const newPostLike = {
            id: 1, 
            user_id: 1,
            post_id: 1
        }


        PostLike.create.mockResolvedValue(new Error ('Failed to create postLike'))

        const response = await request(app)
          .post('/postLikes')
          .send(newPostLike);

          expect(response.status).toBe(401);
          expect(response.body.message).toBe('Authorization header missing');
    
    })
})

describe ('DELETE /postLikes/:id', () => {
    it('should delete a postLike and return a 200 status', async () => {
        const postLiketoDelete = {
            id: 1,
            user_id: 1,
            post_id: 1
        }

        PostLike.findByPk.mockResolvedValue(postLiketoDelete);
        PostLike.destroy.mockResolvedValue(1);

        const response = await request(app)
            .delete('/postLikes/1')
            .set('Authorization', 'Bearer validtoken');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("PostLike deleted!")
    });

    it('should return a 401 status if the token is missing', async () => {
        const postLikeToDelete = {
            id: 1,
            user_id: 1,
            post_id: 1
        }

        PostLike.findByPk.mockResolvedValue(postLikeToDelete);

        const response = await request (app)
            .delete('/postLikes/1')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Authorization header missing")
    })
    
    it('should return a 403 status if you try to delete another postLike', async () => {
        const postLikeToDelete = {
            id: 1,
            user_id: 2,
            post_id: 1
        }

        PostLike.findByPk.mockResolvedValue(postLikeToDelete);

        const response = await request (app)
            .delete('/postLikes/1')
            .set('Authorization', `Bearer validtoken`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Forbidden: you are not allowed to do that!")
    })
})

