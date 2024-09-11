import React from 'react';

function Login() {
  return (
    <div>
      <h1>Connexion</h1>
      <p>Entrez vos informations pour vous connecter.</p>
    </div>
  );
}

export default Login;

let form = document.getElementById('form')
let URL = "http://localhost:3000/auth/login"



form.addEventListener('submit', async (event) => {
    event.preventDefault()
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value

    let user = {
      email: email,
      password: password
    };

      try{
          let response = await fetch(URL, {
              method: "POST",
              body: JSON.stringify(user),
              headers: {
                "Content-Type": "application/json; charset=UTF-8"
              }
            }
          )
          if (!response.ok) {
            // Affichez une erreur si la réponse n'est pas OK
            let errorData = await response.json();
            console.error('Error:', errorData);
            alert(`Paire email/mot de passe incorrect: ${errorData.error}`);
        } else {
            // Si la requête a réussi, vous pouvez gérer le succès ici
            let responseData = await response.json();
            console.log('Success', responseData);
            alert('Login successful!');
            localStorage.setItem('authToken', responseData.token); // Stocke le token dans le local storage
            window.location.href = 'tasks.html'
          }
      }
        catch (error) {
          alert ('erreur lors de la connexion');
      }
  });
