const request = require('supertest');
const app = require('../app'); // Remplacez par le chemin correct vers votre app Express
const Post = require('../models/modelPost');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');
const fs = require('fs');

fs.unlink = jest.fn((path, callback) => callback(null));
jest.mock('../models/modelPost');
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

describe('GET /posts', () => {

    // Simulation de la requête Get réussie

    it('should return all posts', async () => {

        //Simulation d'un tableau de posts dans notre base de données.
        const mockPosts = [
            {   id: 1, 
                user_id: 1,
                imageUrl: "http://test.com/image1.jpg",
                content: 'test post'
            },
            {   id: 2, 
                user_id: 2,
                imageUrl: "http://test.com/image2.jpg",
                content: 'test post 2'
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
            id: 1, 
            user_id: 1,
            imageUrl: "http://test.com/image1.jpg",
            content: "test post"
        };

        Post.findByPk.mockResolvedValue(post);

        const response = await request(app)
            .get('/posts/1');

        expect(response.status).toBe(200);
        expect(Post.findByPk).toHaveBeenCalledWith("1");

    });

    it('should return 404 if post is not found', async () => {
        Post.findByPk.mockResolvedValue(null); // Mock l'absence de l'utilisateur

        const response = await request(app)
            .get('/posts/1');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe(undefined);
    });

    it('should return 500 if something goes wrong', async () => {
        Post.findByPk.mockRejectedValue(new Error('Database error')); // Mock une erreur lors de la recherche

        const response = await request(app)
            .get('/posts/1');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database error');
    });
});

describe('POST /posts', () => {
    //Avant chaque test, simulation de notre middleware auth.js et de la fonction jwt.verify

    beforeEach(() => {
        jwt.verify = jest.fn().mockImplementation((token, secret) => {
            if (token === 'validtoken') {
                return { user_id: 1, role_id: 2 };
            } else {
                throw new Error('Token not valid');
            }
        });
    });

    // Reset les mocks après chaque test

    afterEach(() => {
        jest.clearAllMocks();  
    });

    it('should create a new post and return 201', async () => {
        const newPost = {
            id: 3, 
            user_id: 1,
            imageUrl: "http://test.com/image1.jpg",
            content: "new post"
        }

        Post.create.mockResolvedValue(newPost)

        const response = await request(app)
            .post('/posts')
            .attach('image', Buffer.from('fake image data'), 'testimage.jpg')
            .set('Authorization', 'Bearer validtoken')
            .field('content', newPost.content);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Post created');
    })

    it('should return a 401 status if there is no token', async () => {
        const newPost = {
            content: 'post'
          };

        Post.create.mockResolvedValue(new Error ('Failed to create post'))

        const response = await request(app)
          .post('/posts')
          .send(newPost);

          expect(response.status).toBe(401);
          expect(response.body.message).toBe('Authorization header missing');
    
    })
})

describe ('PUT /posts/:id', () => {

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

    it('should modify a post', async () => {
        const oldPost = {
            id: 4,
            user_id: 1,
            content: "old post"
        }
        const updatedPost = {
            id: 4,
            user_id: 1,
            content: "modified post"
        }

        Post.findByPk.mockResolvedValue(oldPost);
        Post.update.mockResolvedValue([1, [updatedPost]])

        const response = await request (app)
            .put('/posts/4')
            .set('Authorization', `Bearer validtoken`)
            .send(updatedPost);

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Post modified!")
    })

    it('should update a post with a new image', async () => {
        const oldPost = {
            id: 4,
            user_id: 1,
            imageUrl: "http://test.com/image1.jpg",
            content: "old post"
        }
        const updatedPost = {
            id: 4,
            user_id: 1,
            imageUrl: "http://test.com/image1.jpg",
            content: "modified post"
        }

        Post.update.mockResolvedValue([1]);
  
        const response = await request(app)
          .put('/posts/4')
          .attach('image', Buffer.from('fake image data'), 'testimage.jpg')
          .set('Authorization', 'Bearer validtoken')
          .field('content', updatedPost.content);
  
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Post modified!' });
      });

    it('should return a 401 status if the token is missing', async () => {
        const oldPost = {
            id: 4,
            user_id: 1,
            content: "old post"
        }
        const updatedPost = {
            id: 4,
            user_id: 1,
            content: "modified post"
        }

        Post.findByPk.mockResolvedValue(oldPost);

        const response = await request (app)
            .put('/posts/4')
            .send(updatedPost);

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Authorization header missing")
    }),

    it('should return a 403 status if you try to modify another post', async () => {
        const oldPost = {
            id: 4,
            user_id: 3,
            content: "old post"
        }
        const updatedPost = {
            id: 4,
            user_id: 3,
            content: "modified post"
        }

        Post.findByPk.mockResolvedValue(oldPost);

        const response = await request (app)
            .put('/posts/4')
            .set('Authorization', `Bearer validtoken`)
            .send(updatedPost);

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Forbidden: you are not allowed to do that!")
    })
})


describe ('DELETE /posts/:id', () => {
    it('should delete a post with an image and return a 200 status', async () => {
        const postToDelete = {
            id: 5,
            user_id: 1,
            imageUrl: "http://test.com/image1.jpg",
            content: "post to delete"
        }

        Post.findByPk.mockResolvedValue(postToDelete);
        Post.destroy.mockResolvedValue(1);
        

        const response = await request(app)
            .delete('/posts/5')
            .set('Authorization', 'Bearer validtoken');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Post deleted!");
        expect(fs.unlink).toHaveBeenCalled();

    });

    it('should delete a post with no image and return a 200 status', async () => {
        const postToDelete = {
            id: 5,
            user_id: 1,
            content: "post to delete"
        }

        Post.findByPk.mockResolvedValue(postToDelete);
        Post.destroy.mockResolvedValue(1);
        

        const response = await request(app)
            .delete('/posts/5')
            .set('Authorization', 'Bearer validtoken');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Post deleted!");

    });

    it('should return a 401 status if the token is missing', async () => {
        const postToDelete = {
            id: 5,
            user_id: 1,
            content: "post to delete"
        }

        Post.findByPk.mockResolvedValue(postToDelete);

        const response = await request (app)
            .delete('/posts/5')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Authorization header missing")
    })
    
    it('should return a 403 status if you try to delete another post', async () => {
        const postToDelete = {
            id: 5,
            user_id: 2,
            content: "post to delete"
        }

        Post.findByPk.mockResolvedValue(postToDelete);

        const response = await request (app)
            .delete('/posts/5s')
            .set('Authorization', `Bearer validtoken`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe("Forbidden: you are not allowed to do that!")
    })


})
