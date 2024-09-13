import React, { useState } from 'react';

function CreatePost() {

    let token = localStorage.getItem('authToken');
    if (!token) {
        console.error('Token not found');
        alert('Vous devez être connecté pour publier un post.');
        return;
      }
    const [content, setContent] = useState('')
    const postURL = "http://localhost:3000/posts"

    async function FormPost(event) {
        event.preventDefault()
        const post = {content}

        try {
            const response = await fetch(postURL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  "Authorization": `Bearer ${token}`,

                },
                body: JSON.stringify(post),
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }        
                
                const responseData = await response.json();
                console.log('Success:', responseData);
                alert('post réussi !');
            } 
        catch (error) {
                console.error('Error:', error);
                alert('Erreur');
        }
    };

    return (
        <section id="createPost">
            <form onSubmit={FormPost} id="formPost">
                <label htmlFor="content">Quelque chose à dire?</label> 
                <input type="text" name="content" id="content" value={content}
              onChange={(e) => setContent(e.target.value)} required/>
                <input type="submit" value="Envoyer" />
            </form>
        </section>
    )
}

export default CreatePost
