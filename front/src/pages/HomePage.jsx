import React, { useState, useEffect } from 'react';
import CreatePost from '../components/CreatePost';
import { createComment, deleteComment, modifyComment } from '../components/HandleComment';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [postLikesMap, setPostLikesMap] = useState({});
  const [commentLikesMap, setCommentLikesMap] = useState({});
  const [user_id, setUserId] = useState(null);
  const [modifiedContent, setModifiedContent] = useState('');
  const [modifiedCommentContent, setModifiedCommentContent] = useState('');
  const [newComments, setNewComments] = useState({});
  const [showComments, setShowComments] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserId(decodedToken.user_id);
    }

    async function getPosts() {
      try {
        const response = await fetch('http://localhost:3000/posts/');
        const postsData = await response.json();

        const usersResponse = await fetch('http://localhost:3000/users/');
        const usersData = await usersResponse.json();

        const commentResponse = await fetch('http://localhost:3000/comments/');
        const commentsData = await commentResponse.json();

        const postLikesResponse = await fetch('http://localhost:3000/postLikes/');
        const postLikesData = await postLikesResponse.json();

        const commentLikesResponse = await fetch('http://localhost:3000/commentLikes/');
        const commentLikesData = await commentLikesResponse.json();

        const usersMap = usersData.reduce((map, user) => {
          map[user.id] = `${user.first_name} ${user.last_name}`;
          return map;
        }, {});

        const commentsMap = commentsData.reduce((map, comment) => {
          if (!map[comment.post_id]) {
            map[comment.post_id] = [];
          }
          map[comment.post_id].push(comment);
          return map;
        }, {});

        const postLikesMap = postLikesData.reduce((map, like) => {
          if (!map[like.post_id]) {
            map[like.post_id] = 0;
          }
          map[like.post_id]++;
          return map;
        }, {});

        const commentLikesMap = commentLikesData.reduce((map, like) => {
          if (!map[like.comment_id]) {
            map[like.comment_id] = 0;
          }
          map[like.comment_id]++;
          return map;
        }, {});

        setPosts(postsData);
        setUsersMap(usersMap);
        setCommentsMap(commentsMap);
        setPostLikesMap(postLikesMap);
        setCommentLikesMap(commentLikesMap);
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la récupération des posts: ' + error.message);
      }
    }

    getPosts();
  }, []);

  async function deletePost(id) {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert('Post supprimé avec succès!');
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la suppression : ' + error.message);
    }
  }

  async function modifyPost(id) {
    const token = localStorage.getItem('authToken');
    const post = { content: modifiedContent };

    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === id ? { ...p, content: modifiedContent } : p))
      );
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la modification : ' + error.message);
    }
  }

  function toggleComments(post_id) {
    setShowComments((prevState) => ({
      ...prevState,
      [post_id]: !prevState[post_id],
    }));
  }

  async function handleAddComment(post_id) {

    //On récupère le notre champ de commentaire en fonciton du post_id sur lequel il est situé

    const commentContent = newComments[post_id];
  
    if (!commentContent || commentContent.trim() === '') {
      alert('Le commentaire ne peut pas être vide.');
      return;
    }
  
    try {
      // Appelle de la fonction de createComment
      const newComment = await createComment(post_id, commentContent);
  
      // Condition qui s'assure que le commentaire est bien lié au bon post_id

      if (newComment && newComment.post_id === post_id) {
        setCommentsMap((prevCommentsMap) => ({
          ...prevCommentsMap,
          [post_id]: [...(prevCommentsMap[post_id] || []), newComment] // Add the new comment to the post's comment array
        }));
  
        // Clear the input field for this post
        setNewComments((prev) => ({
          ...prev,
          [post_id]: ''
        }));
  
        // Ensure comments are visible for this post
        setShowComments((prev) => ({
          ...prev,
          [post_id]: true
        }));

      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert("Une erreur est survenue lors de l'ajout du commentaire.");
    }

    window.location.reload();

  }

  function handleModifyComment(comment_id, modifiedCommentContent) {
    modifyComment(comment_id, modifiedCommentContent);
  }

  function handleDeleteComment(comment_id) {
    deleteComment(comment_id);
  }

  return (
    <>
      <CreatePost />
      <section className="posts" id="posts">
        {posts
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((post) => {
            const author = usersMap[post.user_id];
            const postComments = commentsMap[post.id] || [];
            const postLikesCount = postLikesMap[post.id] || 0;
            const isPostAuthor = post.user_id === user_id;

            return (
              <article key={post.id}>
                <div className="article__header">
                  <h3>{author}</h3>
                  {isPostAuthor && (
                    <div className="article__header__menu">
                      <img src="/dots.png" alt="menu" className="logos" />
                      <ul className="article__header__menu__deroulant">
                        <li>
                          <img
                            src="/stylo.png"
                            alt="modifier post"
                            className="article__header__menu__deroulant__icon"
                          />
                        </li>
                        <li>
                          <img
                            src="/trash.png"
                            alt="supprimer post"
                            className="article__header__menu__deroulant__icon"
                            onClick={() => deletePost(post.id)}
                          />
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                {post.image_url && (
                  <img src={post.image_url} alt="Post image" className="post__image" />
                )}
                <p>{post.content}</p>
                <div className="likes">
                  <img src="/like.png" alt="like" className="logos" />
                  <p>{postLikesCount}</p>
                </div>

                <div className="article__comments">
                  <p className="article__comments__menu" onClick={() => toggleComments(post.id)}>Voir les commentaires</p>
                  <div className={`article__comments__menu__deroulants ${showComments[post.id] ? 'visible' : ''}`}>
                    <ul>
                      {postComments.map((comment, index) => {
                        const commentLikesCount = commentLikesMap[comment.id] || 0;
                        const isAuthor = comment.user_id === user_id;
                        return (
                          <li key={index}>
                            {comment.content}
                            <div className="likes">
                              <img src="/like.png" alt="like" className="logos" />
                              <p>{commentLikesCount}</p>
                            </div>
                            {isAuthor && (
                              <>
                                <input type="text" name="modifiedCommentContent" id="modifiedCommentContent"
                                  value={modifiedCommentContent} onChange={(e) => setModifiedCommentContent(e.target.value)}/>
                                <button onClick={() => handleModifyComment(comment.id, modifiedCommentContent)}>
                                  Modifier
                                </button>
                                <button onClick={() => handleDeleteComment(comment.id)}>Supprimer</button>
                              </>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    <input type="text" placeholder="Ajouter un commentaire" value={newComments[post.id] || ''} 
                    onChange={(e) => setNewComments({ ...newComments, [post.id]: e.target.value })}/>
                    <button onClick={() => handleAddComment(post.id)}>Envoyer</button>
                  </div>
                </div>
                {isPostAuthor && (
                  <div>
                    <input type="text" name="content" id="content" value={modifiedContent}
                      onChange={(e) => setModifiedContent(e.target.value)}/>
                    <button onClick={() => modifyPost(post.id)}>Modifier le post</button>
                  </div>
                )}
              </article>
            );
          })}
      </section>
    </>
  );
}

export default HomePage;
