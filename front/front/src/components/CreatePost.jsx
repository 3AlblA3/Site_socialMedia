import React, { useState } from 'react';
import '../styles/CreatePost.css'

function CreatePost() {

    let token = localStorage.getItem('authToken');
    if (!token) {
        console.error('Token not found');
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
                console.error('Error response:', errorData);
                throw new Error(`HTTP error! status: ${response.status}. Details: ${errorData}`);
            }
                
            const responseData = await response.json();
            window.location.reload();
        } 
        catch (error) {
            console.error('Error:', error);
            alert(`Erreur: ${error.message}`);
        }
    }

return (
        <section id="createPost" className="createPost">
            <form onSubmit={FormPost} id="formPost" className="formCreatePost">
                <input type="text" name="content" id="content" placeholder="Quelque chose à dire?" value={content} className="inputContent" 
                onChange={(e) => setContent(e.target.value)} required />
                <input type="file" id="image_url" name="image_url" accept="image/png,image/gif,image/jpeg,image/jpg"
                onChange={(e) => setImageUrl(e.target.files[0])}  style={{ display: 'none' }}/>
                <label htmlFor="image_url" className="uploadIcon">
                    <img src="/camera.png" alt="Upload Icon" className="logoImage" />
                </label>
                <input type="submit" value="Envoyer" className='submit'/>
            </form>
        </section>
    );
}

export default CreatePost;
