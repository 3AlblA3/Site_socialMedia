// Import de nos dépendances et fonction externes

import React, { useState, useEffect } from 'react';
import CreatePost from '../components/CreatePost';
import { createComment, deleteComment, modifyComment } from '../components/HandleComment';

//Fonction globale de notre page d'accueil

function HomePage() {

  // Hooks pour stocker les données de nos différents fetch, get et post

  const [posts, setPosts] = useState([]);
  const [usersMap, setUsersMap] = useState([]);
  const [commentsMap, setCommentsMap] = useState([]);
  const [postLikesMap, setPostLikesMap] = useState([]);
  const [commentLikesMap, setCommentLikesMap] = useState([]);
  const [user_id, setUserId] = useState(null);
  const [modifiedContent, setModifiedContent] = useState(''); 
  const [modifiedCommentContent, setModifiedCommentContent] = useState(''); 
  const [newComments, setNewComments] = useState({}); 
  const [showComments, setShowComments] = useState({});

  // useEffect est utilisé pour effectuer le call API une fois que le composant est monté
  useEffect(() => {

    // On décode notre token, avec la fonction atob et on passe son user_id dans le State user_id

    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserId(decodedToken.user_id);
    }

    async function getPosts() {
      try {
        // Fetch des données des différentes API
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

        // Mapping des utilisateurs par id du user
        const usersMap = usersData.reduce((map, user) => {
          map[user.id] = `${user.first_name} ${user.last_name}`;
          return map;
        }, {});

        // Mapping des commentaires par post_id du comment
        const commentsMap = commentsData.reduce((map, comment) => {
          if (!map[comment.post_id]) {
            map[comment.post_id] = [];
          }
          map[comment.post_id].push(comment);
          return map;
        }, {});

        // Mapping des likes par post_id du like
        const postLikesMap = postLikesData.reduce((map, like) => {
          if (!map[like.post_id]) {
            map[like.post_id] = 0;
          }
          map[like.post_id]++;
          return map;
        }, {});

        // Mapping des likes par comment_id du like
        const commentLikesMap = commentLikesData.reduce((map, like) => {
          if (!map[like.comment_id]) {
            map[like.comment_id] = 0;
          }
          map[like.comment_id]++;
          return map;
        }, {});

        //on met à jour nos étâts avec nos tableaux mappés.

        setPosts(postsData);
        setUsersMap(usersMap);
        setCommentsMap(commentsMap);
        setPostLikesMap(postLikesMap);
        setCommentLikesMap(commentLikesMap);
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la récupération des posts: ' + error.message);
      }
    };

    getPosts();
  }, []);

  // Fonction suppression des posts

  async function deletePost(id) {
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      alert('Post supprimé avec succès!');
      window.location.reload();

    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la suppression : ' + error.message);
    }
  }

  // Fonction pour modifier les posts

  async function modifyPost(id) {
    const token = localStorage.getItem('authToken');
    const post = { content: modifiedContent };

    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la modification : ' + error.message);
    }
  }

  function toggleComments(post_id) {
    setShowComments(prevState => ({
      ...prevState,
      [post_id]: !prevState[post_id] // Bascule l'affichage des commentaires pour chaque post
    }));
  }

  // Rappel de nos fonctions de gestion des commentaires avec les paramètres nécéssaires

  function handleAddComment (post_id) {
    const commentContent = newComments[post_id]; // Récupère le nouveeau commentaire selon le post_id dans lequel il a été posté
    createComment(post_id, commentContent); // Appelle la fonction pour créer un commentaire
  };

  function handleModifyComment (comment_id, modifiedCommentContent) {
    modifyComment(comment_id, modifiedCommentContent); // Modifie un commentaire
  };

  function handleDeleteComment (comment_id) {
    deleteComment(comment_id); // Supprime un commentaire
  };

  console.log(posts); // Check the structure of your posts array and ensure created_at is present


  return (
    <>
      <CreatePost />

      <section className="posts" id="posts">
        {posts
        .slice() // Create a shallow copy of the posts array to avoid mutating the original array
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort posts by most recent
        .map((post) => {
          const author = usersMap[post.user_id];
          const postComments = commentsMap[post.id] || [];
          const postLikesCount = postLikesMap[post.id] || 0;

          return (
            <article key={post.id}>
              <div className = "article__header">
                <h3>{author}</h3>
                <div className ="article__header__menu">
                  <img src="/dots.png" alt="menu" className="logos"/>
                  <ul className="article__header__menu__deroulant">
                        <li><img src="/stylo.png" alt="modifier post" className="article__header__menu__deroulant__icon"></img></li>
                        <li><img src="/trash.png" alt="supprimer post" className="article__header__menu__deroulant__icon"></img></li>
                  </ul>
                </div>
              </div>
              {/* Affichage d'une image s'il y a */}
              {post.image_url && (
                <img src={post.image_url} alt="Post image" className="post__image"/>)}
              <p>{post.content}</p>
              <div className='likes'>
                <img src="/like.png" alt="like" className='logos' />
                <p>{postLikesCount}</p>
              </div>

              {/* Affichage des commentaires */}

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
                          <div className='likes'>
                            <img src="/like.png" alt="like" className='logos' />
                            <p>{commentLikesCount}</p>
                          </div>
                          {/* Affiche les boutons de modification et de suppression uniquement si l'utilisateur est l'auteur du commentaire */}
                          {isAuthor && (
                            <>
                              <input type="text" name="modifiedCommentContent" id="modifiedCommentContent" value={modifiedCommentContent}
                              onChange={(e) => setModifiedCommentContent(e.target.value)}/>
                              <button onClick={() => handleModifyComment(comment.id, modifiedCommentContent)}>Modifier</button>
                              <button onClick={() => handleDeleteComment(comment.id)}>Supprimer</button>
                            </>
                         )}
                        </li>
                      );
                  })}
                  </ul>
                  {/* Formulaire pour ajouter un commentaire */}
                  <input type="text" placeholder="Ajouter un commentaire" value={newComments[post.id] || ''}
                  onChange={(e) => setNewComments({ ...newComments, [post.id]: e.target.value })}/>
                  <button onClick={() => handleAddComment(post.id)}>Envoyer</button>
                </div>
              </div>
              {post.user_id === user_id && (
              <div>
                <input type="text" name="content" id="content" value={modifiedContent}
                  onChange={(e) => setModifiedContent(e.target.value)}/>
                <button onClick={() => modifyPost(post.id)}>Modifier le post</button>
                <button onClick={() => deletePost(post.id)}>Supprimer le post</button>
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