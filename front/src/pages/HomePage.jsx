import React from 'react';
import { useState, useEffect } from 'react';
import CreatePost from '../components/CreatePost';

function HomePage() {

    //Hooks pour stocker les données de nos différents fetch
  
    const [posts, setPosts] = useState([]);
    const [usersMap, setUsersMap] = useState([]);
    const [commentsMap, setCommentsMap] = useState([]);
    const [postLikesMap, setPostLikesMap] = useState([]);
    const [commentLikesMap, setCommentLikesMap] = useState([]);
    const [user_id, setUserId] = useState(null);
    const [modifiedContent, setModifiedContent] = useState(''); // Ajout de l'état pour modifiedContent
  
   // useEffect est utilisé pour effectuer l'appel API une fois que le composant est monté
  
    useEffect(() => {

      //Récupération du token

      const token = localStorage.getItem('authToken');

      if (token) {
        // Décodage du token pour récupérer l'user_id
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
  
          // Mapping des utilisateurs par ID
          const usersMap = usersData.reduce((map, user) => {
            map[user.id] = `${user.first_name} ${user.last_name}`;
            return map;
          }, {});
  
          // Mapping des commentaires par post_id
          const commentsMap = commentsData.reduce((map, comment) => {
            if (!map[comment.post_id]) {
              map[comment.post_id] = [];
            }
            map[comment.post_id].push(comment.content);
            return map;
          }, {});
  
          // Mapping des likes par post ID
          const postLikesMap = postLikesData.reduce((map, like) => {
            if (!map[like.post_id]) {
              map[like.post_id] = 0;
            }
            map[like.post_id]++;
            return map;
          }, {});
  
          // Mapping des likes par post ID
          const commentLikesMap = commentLikesData.reduce((map, like) => {
            if (!map[like.comment_id]) {
               map[like.comment_id] = 0;
            }
            map[like.comment_id]++;
            return map;
            }, {});
  
          // Mise à jour des etats avec les données récupérées
  
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

      
    }, []); // Le tableau vide [] assure que le fetch ne se fait qu'une seule fois, au montage

    //Fonction suppression des posts 

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
        console.log('Post deleted successfully:', responseData);
        alert('Post supprimé avec succès!');
  
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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(post)
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const responseData = await response.json();
        console.log('Post modified successfully:', responseData);
        alert('Post modifié avec succès!');
        window.location.reload();

  
      } catch (error) {
        console.error('Error:', error);
        alert('Erreur lors de la suppression : ' + error.message);
      }
    }
  
    return (

      <>
      <CreatePost />

      <section id="posts">

        {/* On fait un map de nos posts pour en un afficher un par article, équivalent d'une boucle for of */}

        {posts.map((post) => {
          const author = usersMap[post.user_id];
          const postComments = commentsMap[post.id] || [];
          const postLikesCount = postLikesMap[post.id] || 0;
          
          return (
            <article key={post.id}>
              <h3>{author}</h3>
              <p>{post.content}</p>
              <p>Likes: {postLikesCount}</p>
              <p>Comments:</p>
              <ul>
                {postComments.map((comment, index) => (
                  <li key={index}>{comment}</li>
                ))}
              </ul>
              {post.user_id === user_id && (
                <div>              
                  <input type="text" name="content" id="content" value={modifiedContent}
                    onChange={(e) => setModifiedContent(e.target.value)} ></input>
                  <button onClick={() => modifyPost(post.id)}>Modifier</button>
                  <button onClick={() => deletePost(post.id)}>Supprimer</button>
                </div>  
              )}
            </article>
          );
        })}
      </section>
      </>
    );
  };
  
  export default HomePage;