import React, { useState, useEffect } from 'react';
import CreatePost from '../components/CreatePost';
import { createComment, deleteComment, modifyComment } from '../components/HandleComment';
import togglePostLike from '../components/HandlePostLike';
import toggleCommentLike from '../components/HandleCommentLike';

function HomePage() {
  const [showModifyPosts, setShowModifyPosts] = useState({});
  const [posts, setPosts] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [postLikesMap, setPostLikesMap] = useState({});
  const [commentLikesMap, setCommentLikesMap] = useState({});
  const [user_id, setUserId] = useState(null);
  const [role_id, setRoleId] = useState(null);
  const [modifiedPostContent, setModifiedPostContent] = useState('');
  const [modifiedCommentContent, setModifiedCommentContent] = useState('');
  const [newComments, setNewComments] = useState({});
  const [newPostLike, setNewPostLike] = useState({});
  const [newCommentLike, setNewCommentLike] = useState({});
  const [showComments, setShowComments] = useState({});
  const [showModifyComments, setShowModifyComments] = useState({});
  

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserId(decodedToken.user_id);
      setRoleId(decodedToken.role_id);
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
        alert('Erreur lors de la récupération des posts: ' + error.message);
      }
    }

    getPosts();
  }, []);

  //Gestion de la suppression de posts

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

      //Remets les posts dans l'ordre après la suppression
      setPosts((prevState) => prevState.filter((post) => post.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression : ' + error.message);
    }
  }

  // Modification des posts

  async function modifyPost(id) {
    const token = localStorage.getItem('authToken');
    const post = { content: modifiedPostContent };

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

      setPosts((prevState) => //Modifie le state des posts en incluant le tableau modifié.
        prevState.map((post) => (post.id === id ? { ...post, content: modifiedPostContent } : post))
      );
      toggleModifyPost(id);
    } catch (error) {
      alert('Erreur lors de la modification : ' + error.message);
    }
  }

// Gère la visibilité de l'icône modifier post

  function toggleModifyPost(post_id) {

    // On Garde trâce du post à modifier par le post_id

    setShowModifyPosts((prevState) => ({ 
      ...prevState, //Créer un objet à partir de l'objet existant
      [post_id]: !prevState[post_id], //ajoute ou modifie le post_id quand il passe en true/false
    }));
  }

  //Gère l'affichage des commentaires par post_id

  function toggleComments(post_id) {
    setShowComments((prevState) => ({
      ...prevState,
      [post_id]: !prevState[post_id],
    }));
  }
  

  //Gère le like/unlike d'un post

  async function handlePostLike(post_id) {
    try {

      //Import de la fonction togglePostLike

      const result = await togglePostLike(post_id);
      if (result) {
        // Si le résultat est correct

        setPostLikesMap((prevState) => ({//Update de l'etat setPostLikesMap
          ...prevState,
          [post_id]: result.liked 
            ? (prevState[post_id] || 0) + 1
            : Math.max((prevState[post_id] || 1) - 1, 0),
        }));

        //Maintiens le statut actuel des likes
        setNewPostLike((prevState) => ({
          ...prevState,
          [post_id]: result.liked,
        }));
      }
    } catch (error) {
      alert('Erreur lors de la gestion du like');
    }
  }


  // Gère le like/unlike d'un commentaire
  async function handleCommentLike(comment_id) {
    try {

      const result = await toggleCommentLike(comment_id);
      if (result) {

        setCommentLikesMap((prevState) => ({
          ...prevState,
          [comment_id]: result.liked 
            ? (prevState[comment_id] || 0) + 1
            : Math.max((prevState[comment_id] || 1) - 1, 0),
        }));
        setNewCommentLike((prevState) => ({
          ...prevState,
          [comment_id]: result.liked,
        }));
      }
    } catch (error) {
      alert('Erreur lors de la gestion du like');
    }
  }
  
  // Ajout d'un commentaire par post_id
  async function handleAddComment(post_id) {
    const commentContent = newComments[post_id];
    if (!commentContent || commentContent.trim() === '') {
      alert('Le commentaire ne peut pas être vide.');
      return;
    }

    // Import de la fonction d'un createComment

    try {
      const newComment = await createComment(post_id, commentContent);

      //Ajoute le nouveau commentaire à notre tableau de commentaires pour ce post

      if (newComment && newComment.post_id === post_id) {
        setCommentsMap((prevState) => ({
          ...prevState,
          [post_id]: [...(prevState[post_id] || []), newComment],
        }));

        // Reset le champ d'entrée pour les nouveaux commentaires
        setNewComments((prevState) => ({
          ...prevState,
          [post_id]: '',
        }));

        // Assure que le commentaire est bien visible 
        setShowComments((prevState) => ({
          ...prevState,
          [post_id]: true,
        }));
      }
    } catch (error) {
      alert("Une erreur est survenue lors de l'ajout du commentaire.");
    }
  }

  // Gestion de l'affichage du modify comments

  function toggleModifyComments(comment_id) {
    setShowModifyComments((prevState) => ({
      ...prevState,
      [comment_id]: !prevState[comment_id], 
    }));
  }

  // Gestion de la modification d'un commentaire

  function handleModifyComment(comment_id, modifiedCommentContent) {
    modifyComment(comment_id, modifiedCommentContent);
    toggleModifyComments(comment_id);
  }

  // Gestion de la suppression d'un commentaire

  function handleDeleteComment(comment_id) {
    deleteComment(comment_id);
  }
  const [showMenu, setShowMenu] = useState({});

  // Affichage du menu de modification des posts

  function toggleMenu(id) {
    setShowMenu(prevState => ({ //prevState represente l'etat actuel: convention React
      ...prevState,
      [id]: !prevState[id]
    }));
  }

  const [showCommentMenu, setShowCommentMenu] = useState({});

  function toggleCommentMenu(id) {
    setShowCommentMenu(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
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
            const isAllowed = post.user_id === user_id || role_id === 3;

            return (
              <article key={post.id}>
                <div className="article__header">
                  <h3>{author}</h3>
                  {isAllowed && (
                  <div className="article__header__menu">
                    <img src="/dots.png" alt="menu" className="logos" 
                      onClick={() => toggleMenu(post.id)}/>
                    <ul className={`article__header__menu__deroulant ${showMenu[post.id] ? 'visible' : ''}`}>
                      <li>
                        <img src="/stylo.png" alt="modifier post" 
                          className="article__header__menu__deroulant__icon"
                          onClick={() => toggleModifyPost(post.id)}/>
                      </li>
                      <li>
                        <img src="/trash.png" alt="supprimer post"
                        className="article__header__menu__deroulant__icon"
                        onClick={() => deletePost(post.id)}/>
                      </li>
                    </ul>
                  </div>
                  )}
                </div>

                {post.image_url && <img src={post.image_url} alt="Post image" className="post__image" />}
                <p>{post.content}</p>

                {/* Post Likes */}
                <div className="likes">
                  <img src={newPostLike[post.id] ? "/liked.png" : "/like.png"} alt="like" 
                  className="logos" onClick={() => handlePostLike(post.id)} />
                 <p>{postLikesMap[post.id] || 0}</p>
                </div>

                {/* Modifier Post*/}
                {showModifyPosts[post.id] && (
                  <div className="article__comments__modify__post">
                    <input type="text" name="content" id="content" value={modifiedPostContent}
                      onChange={(e) => setModifiedPostContent(e.target.value)}/>
                    <button onClick={() => modifyPost(post.id)}>Modifier le post</button>
                  </div>
                )}

                {/* Commentaires */}
                <div className="article__comments">
                  <p className="article__comments__menu" onClick={() => toggleComments(post.id)}>
                    
                  {showComments[post.id] ? "Masquer les commentaires" : "Voir les commentaires"}
                  </p>

                  <div className={`article__comments__menu__deroulants ${showComments[post.id] ? 'visible' : ''}`}>
                    <ul>
                      {postComments.map((comment) => {
                        const commentLikesCount = commentLikesMap[comment.id] || 0;
                        const isAuthor = comment.user_id === user_id || role_id === 3;
                        const commentAuthor = usersMap[comment.user_id];

                        return (
                          <li key={comment.id} className="article__comments_window">
                            <div className="comment__header">
                              <h4>{commentAuthor}</h4>
                              {isAuthor && (
                                <div className="article__header__menu">
                                <img src="/dots.png" alt="menu" className="logos" 
                                  onClick={() => toggleCommentMenu(comment.id)}
                                />
                                <ul className={`article__header__menu__deroulant ${showCommentMenu[comment.id] ? 'visible' : ''}`}>
                                  <li>
                                    <img src="/stylo.png" alt="modifier commentaire" className="article__header__menu__deroulant__icon"
                                      onClick={() => toggleModifyComments(comment.id)}
                                    />
                                  </li>
                                  <li>
                                    <img src="/trash.png" alt="supprimer commentaire" className="article__header__menu__deroulant__icon"
                                      onClick={() => handleDeleteComment(comment.id)}
                                    />
                                  </li>
                                </ul>
                              </div>
                              )}
                            </div>

                            <p>{comment.content}</p>

                            {/* Comment Likes */}
                            <div className="likes">
                              <img src={newCommentLike[comment.id] ? "/liked.png" : "/like.png"} alt="like" 
                              className="logos" onClick={() => handleCommentLike(comment.id)} />
                              <p>{commentLikesMap[comment.id] || 0}</p>
                            </div>

                            {showModifyComments[comment.id] && (
                              <div>
                                <input type="text" value={modifiedCommentContent}
                                  onChange={(e) => setModifiedCommentContent(e.target.value)}/>
                                <button onClick={() => handleModifyComment(comment.id, modifiedCommentContent)}>
                                  Modifier le commentaire
                                </button>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>

                    <input type="text" placeholder="Ajouter un commentaire"
                      value={newComments[post.id] || ''}
                      onChange={(e) => setNewComments({ ...newComments, [post.id]: e.target.value })}/>
                    <button onClick={() => handleAddComment(post.id)}>Envoyer</button>
                  </div>
                </div>
              </article>
            );
          })}
      </section>
    </>
  );
}

export default HomePage;
