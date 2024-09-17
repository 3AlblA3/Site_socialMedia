import React, { useState } from 'react';
import '../styles/CreatePost.css'

function CreatePost() {

    let token = localStorage.getItem('authToken');
    if (!token) {
        console.error('Token not found');
        alert('Vous devez être connecté pour publier un post.');
        return;
      }
    const [content, setContent] = useState('')
    const [image_url, setImageUrl] = useState(null)

    const postURL = "http://localhost:3000/posts"

    async function FormPost(event) {
        event.preventDefault()
        const post = new FormData();
        post.append('content', content);
        if (image_url) {
            post.append('image_url', image_url)
        }

        try {
            const response = await fetch(postURL, {
                method: 'POST',
                headers: {
                  "Authorization": `Bearer ${token}`
                },
                body: post,
              });

              if (!response.ok) {
                const errorData = await response.text(); 
                throw new Error(`HTTP error! status: ${response.status}.`);
            }
                
                const responseData = await response.json();
                console.log('Success:', responseData);
                alert('post réussi !');
                window.location.reload();

            } 
        catch (error) {
            console.error('Error:', error);
            alert(`Erreur: ${error.message}`);
        }
    };

return (
        <section id="createPost">
            <form onSubmit={FormPost} id="formPost">
                <label htmlFor="content">Quelque chose à dire?</label>
                <input type="text" name="content" id="content" value={content} 
                onChange={(e) => setContent(e.target.value)} required />
                <label htmlFor="image_url">Choisir un fichier</label>
                <input type="file" id="image_url" name="image_url"
                onChange={(e) => setImageUrl(e.target.files[0])}/>
                <input type="submit" value="Envoyer" />
            </form>
        </section>
    );
}

export default CreatePost;
