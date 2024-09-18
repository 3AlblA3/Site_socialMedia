import React, { useState } from 'react';
 
 // Fonction pour créer un commentaire, on passe le post_id et le content en paramètre
 
export async function createComment(post_id, commentContent) {

    let token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token not found');
      alert('Vous devez être connecté pour commenter.');
      return;
    }

    const commentURL = "http://localhost:3000/comments";
    const comment = new FormData();
    comment.append('content', commentContent);
    comment.append('post_id', post_id)
    if (image_url) {
      comment.append('image_url', image_url)
    }

    try {
      const response = await fetch(commentURL, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: comment,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      window.location.reload();


    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la création du commentaire');
    }
};  

//Fonction supprimer le commentaire

export async function deleteComment(id) {
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`http://localhost:3000/comments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      window.location.reload();

    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la suppression : ' + error.message);
    }
  }

// Fonction pour modifier le commentaire

export async function modifyComment(id, modifiedCommentContent) {
    const token = localStorage.getItem('authToken');
    const comment = { content: modifiedCommentContent };

    try {
      const response = await fetch(`http://localhost:3000/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      window.location.reload();


    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la modification : ' + error.message);
    }
}
