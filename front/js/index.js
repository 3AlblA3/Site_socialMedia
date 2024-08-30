let usersURL = "http://localhost:3000/users/"
let postsURL = "http://localhost:3000/posts/"
let commentsURL = "http://localhost:3000/comments/"
let postLikesURL = "http://localhost:3000/postLikes/"
let commentLikesURL = "http://localhost:3000/commentLikes/"

let section = document.getElementById("posts")
let html = ""

async function getPosts () {
        
    try{

        //On fetch toutes nos tables en route GET
        const response = await fetch(postsURL);
        const posts = await response.json();

        if (!response.ok) {
            throw new Error('Erreur d\'autorisation');
        }

        const usersResponse = await fetch(usersURL);
        const users = await usersResponse.json();
        console.log('Users:', users); // Debug pour voir les données retournées

        if (!Array.isArray(users)) {
            throw new Error('Les données utilisateurs ne sont pas dans le bon format.');
        }


        const commentResponse = await fetch(commentsURL);
        const comments = await commentResponse.json();

        const postLikesResponse = await fetch(postLikesURL);
        const postLikes = await postLikesResponse.json()

        // Mapping des utilisateurs par id pour un accès rapide

        const usersMap = users.reduce((map, user) => {
            map[user.id] = `${user.first_name} ${user.last_name}`;
            return map;
        }, {});

        // Mapping des commentaires par post_id
    
        const commentsMap = comments.reduce((map, comment) => {
            if (!map[comment.post_id]) {
                map[comment.post_id] = [];
            }
            map[comment.post_id].push(comment.content);
            return map;
        }, {});

        // Mapping des likes par post ID
        const postLikesMap = postLikes.reduce((map, like) => {
            if (!map[like.post_id]) {
                map[like.post_id] = 0;
            }
            map[like.post_id]++;
            return map;
        }, {});
                    
        for (let i of posts) {
            let author = usersMap[i.user_id];
            let postComments = commentsMap[i.id] || [];
            let postLikesCount = postLikesMap[i.id] || 0;

            html = `
            <article>
                <h3>${author}</h3>
                <p>${i.content}</p>
                <p>Likes: ${postLikesCount}</p>
                <p>Comments:</p>
                <ul>
                    ${postComments.map(comment => `<li>${comment}</li>`).join('')}
                </ul>
            </article>
            `;
            section.innerHTML += html;
            
        }
    }catch (error) {
        console.error('Erreur:', error); // Ajout du log pour voir l'erreur exacte
        alert('Erreur lors de la récupération des posts: ' + error.message);
    }   
};

getPosts()