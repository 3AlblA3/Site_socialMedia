const request = require('supertest');
const app = require('../app'); // Remplacez par le chemin correct vers votre app Express
const Comment = require('../models/modelComment');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');
const fs = require('fs')

fs.unlink = jest.fn((path, callback) => callback(null));
jest.mock('../models/modelComment');
jest.mock('jsonwebtoken');
jest.mock('../middlewares/multer-config', () => {
    return (req, res, next) => {
      req.file = {
        filename: 'mocked-filename.jpg'
      };
      next();
    };
});


beforeAll(async () => {
    await sequelize.authenticate();
});
afterAll(async () => {
    await sequelize.close(); 
});

describe('GET /comments', () => {

    // Simulation de la requête Get réussie

    it('should return all comments', async () => {

        //Simulation d'un tableau de posts dans notre base de données.
        const mockComments = [
            {   id: 1, 
                post_id: 1,
                user_id: 1,
                imageUrl: "http://test.com/image1.jpg",
                content: 'test comment'
            } 
        ];
        
        //Simulation de la fonction findAll qui trouve notre simulation de nos posts.

        Comment.findAll.mockResolvedValue(mockComments);

        //On poste notre requête sur la route get

        const response = await request(app).get('/comments');

        // Réponses attendues

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockComments);
    });

    //Test de notre requête échouée
    
    it('should return 500 if something goes wrong', async () => {

        Comment.findAll.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/comments');

        expect(response.status).toBe(500);
        });
});

describe('GET /comments/:id', () => {
    it('should return the comment if found', async () => {
        const comment = {
            id: 1, 
            post_id: 1,
            user_id: 1,
            imageUrl: "http://test.com/image1.jpg",
            content: 'test comment'
        };

        Comment.findByPk.mockResolvedValue(comment);

        const response = await request(app)
            .get('/comments/1');

        expect(response.status).toBe(200);
        expect(Comment.findByPk).toHaveBeenCalledWith("1");

    });

    it('should return 404 if comment is not found', async () => {
        Comment.findByPk.mockResolvedValue(null); // Mock l'absence de l'utilisateur

        const response = await request(app)
            .get('/comments/1');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe(undefined);
    });

    it('should return 500 if something goes wrong', async () => {
        Comment.findByPk.mockRejectedValue(new Error('Database error')); // Mock une erreur lors de la recherche

        const response = await request(app)
            .get('/comments/1');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database error');
    });
});

describe('POST /comments', () => {

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

    it('should create a new comment and return 201', async () => {
        const newComment = {
            id: 3, 
            post_id: 1,
            user_id: 1,
            imageUrl: "http://test.com/image1.jpg",
            content: "new comment"
        }

        Comment.create.mockResolvedValue(newComment)

        const response = await request(app)
            .post('/comments')
            .attach('image', Buffer.from('fake image data'), 'testimage.jpg')
            .field('content', newComment.content)
            .set('Authorization', 'Bearer validtoken')
            

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Comment created');
    })

    it('should return a 401 status if there is no token', async () => {
        const newComment = {
            content: 'comment'
          };

        Comment.create.mockResolvedValue(new Error ('Failed to create comment'))

        const response = await request(app)
          .post('/comments')
          .send(newComment);

          expect(response.status).toBe(401);
          expect(response.body.message).toBe('Authorization header missing');
    
    })
})

describe ('PUT /comments/:id', () => {

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

    it('should modify a comment', async () => {
        const oldComment = {
            id: 4,
            user_id: 1,
            post_id: 1,
            content: "old comment"
        }
        const updatedComment = {
            content: "modified comment"
        }

        Comment.findByPk.mockResolvedValue(oldComment);
        Comment.update.mockResolvedValue([1, [{ ...oldComment, ...updatedComment }]])

        const response = await request (app)
            .put('/comments/4')
            .set('Authorization', `Bearer validtoken`)
            .send(updatedComment);

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Comment modified!")
    })

    it('should update a comment with a new image', async () => {
        const oldComment = {
            id: 4,
            user_id: 1,
            post_id: 1,
            imageUrl: "http://test.com/image1.jpg",
            content: "old comment"
        }
        const updatedComment = {
            id: 4,
            user_id: 1,
            post_id: 1,
            imageUrl: "http://test.com/image1.jpg",
            content: "modified comment"
        }

        Comment.update.mockResolvedValue([1]);
  
        const response = await request(app)
          .put('/comments/4')
          .attach('image', Buffer.from('fake image data'), 'testimage.jpg')
          .set('Authorization', 'Bearer validtoken')
          .field('content', updatedComment.content);
  
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Comment modified!' });
      });

    it('should return a 401 status if the token is missing', async () => {
        const oldComment = {
            id: 4,
            user_id: 1,
            post_id: 1,
            content: "old comment"
        }
        const updatedComment = {
            id: 4,
            user_id: 1,
            post_id: 1,
            content: "modified comment"
        }

        Comment.findByPk.mockResolvedValue(oldComment);

        const response = await request (app)
            .put('/comments/4')
            .send(updatedComment);

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Authorization header missing")
    }),

    it('should return a 403 status if you try to modify another comment', async () => {
        const oldComment = {
            id: 4,
            user_id: 3,
            post_id: 1,
            content: "old comment"
        }
        const updatedComment = {
            id: 4,
            user_id: 3,
            post_id: 1,
            content: "modified comment"
        }

        Comment.findByPk.mockResolvedValue(oldComment);

        const response = await request (app)
            .put('/comments/4')
            .set('Authorization', `Bearer validtoken`)
            .send(updatedComment);

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Forbidden: you are not allowed to do that!")
    })
})


describe ('DELETE /comments/:id', () => {
    it('should delete a post and return a 200 status', async () => {
        const commentToDelete = {
            id: 5,
            post_id: 1,
            user_id: 1,
            imageUrl: "http://test.com/image1.jpg",
            content: "comment to delete"
        }

        Comment.findByPk.mockResolvedValue(commentToDelete);
        Comment.destroy.mockResolvedValue(1);

        const response = await request(app)
            .delete('/comments/5')
            .set('Authorization', 'Bearer validtoken');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Comment deleted!")
        expect(fs.unlink).toHaveBeenCalled();


    });

    it('should return a 401 status if the token is missing', async () => {
        const commentToDelete = {
            id: 5,
            post_id: 1,
            user_id: 1,
            content: "comment to delete"
        }

        Comment.findByPk.mockResolvedValue(commentToDelete);

        const response = await request (app)
            .delete('/comments/5')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Authorization header missing")
    })
    
    it('should return a 403 status if you try to delete another post', async () => {
        const commentToDelete = {
            id: 5,
            post_id: 1,
            user_id: 2,
            content: "comment to delete"
        }

        Comment.findByPk.mockResolvedValue(commentToDelete);

        const response = await request (app)
            .delete('/comments/5s')
            .set('Authorization', `Bearer validtoken`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Forbidden: you are not allowed to do that!")
    })


})
