async function toggleCommentLike(post_id) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error('Token not found');
    alert('Vous devez être connecté pour liker.');
    return null;
  }

  const commentLikesURL = "http://localhost:3000/commentLikes/toggle";

  try {
    const response = await fetch(commentLikesURL, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ post_id }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export default toggleCommentLike