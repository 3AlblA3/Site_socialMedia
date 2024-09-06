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

describe('POST /commentLikes', () => {

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

    it('should create a new commentLike and return 200', async () => {
        const newCommentLike ={   
            id: 1, 
            user_id: 1,
            comment_id: 1
        } 

        CommentLike.create.mockResolvedValue(newCommentLike)

        const response = await request(app)
            .post('/commentLikes')
            .set('Authorization', 'Bearer validtoken')
            .send(newCommentLike)

        expect(response.status).toBe(200);
    })

    it('should return a 401 status if there is no token', async () => {
        const newCommentLike ={   
            id: 1, 
            user_id: 1,
            comment_id: 1
        } 


        CommentLike.create.mockResolvedValue(new Error ('Failed to create commentLike'))

        const response = await request(app)
          .post('/commentLikes')
          .send(newCommentLike);

          expect(response.status).toBe(401);
          expect(response.body.message).toBe('Authorization header missing');
    
    })
})

describe ('DELETE /commentLikes/:id', () => {
    it('should delete a commentLike and return a 200 status', async () => {
        const commentLikeToDelete ={   
            id: 1, 
            user_id: 1,
            comment_id: 1
        } 

        CommentLike.findByPk.mockResolvedValue(commentLikeToDelete);
        CommentLike.destroy.mockResolvedValue(1);

        const response = await request(app)
            .delete('/commentLikes/1')
            .set('Authorization', 'Bearer validtoken');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("CommentLike deleted!")
    });

    it('should return a 401 status if the token is missing', async () => {
        const commentLikeToDelete = {
            id: 1, 
            user_id: 1,
            comment_id: 1
        }

        CommentLike.findByPk.mockResolvedValue(commentLikeToDelete);

        const response = await request (app)
            .delete('/commentLikes/1')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Authorization header missing")
    })
    
    it('should return a 403 status if you try to delete another commentLike', async () => {
        const commentLikeToDelete = {
            id: 1, 
            user_id: 2,
            comment_id: 1
        }

        CommentLike.findByPk.mockResolvedValue(commentLikeToDelete);

        const response = await request (app)
            .delete('/commentLikes/1')
            .set('Authorization', `Bearer validtoken`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Forbidden: you are not allowed to do that!")
    })
})

