import React from 'react';
import { useState, useEffect } from 'react';


import { Link } from 'react-router-dom';

function HomePage() {

    //Hooks pour stocker les données de nos différents fetch
  
    const [posts, setPosts] = useState([]);
    const [usersMap, setUsersMap] = useState([]);
    const [commentsMap, setCommentsMap] = useState([]);
    const [postLikesMap, setPostLikesMap] = useState([]);
    const [commentLikesMap, setCommentLikesMap] = useState([]);
  
   // useEffect est utilisé pour effectuer l'appel API une fois que le composant est monté
  
    useEffect(() => {
      const getPosts = async () => {
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
  
    return (
      <section id="posts">
        {posts.map((post) => {
          const author = usersMap[post.user_id]; //On cherche l'auteur du post par son user_id 
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
            </article>
          );
        })}
      </section>
    );
  };
  
  export default HomePage;