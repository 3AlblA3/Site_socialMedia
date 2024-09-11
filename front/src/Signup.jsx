import React from 'react';

function Signup() {
  return (
    <div>
      <h1>Inscription</h1>
      <p>Remplissez le formulaire pour vous inscrire.</p>
    </div>
  );
}

export default Signup

let form = document.getElementById('form')
let URL = "http://localhost:3000/auth/signup"



form.addEventListener('submit', async (event) => {
    event.preventDefault()
    let username = document.getElementById("username").value
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    let confirmPassword = document.getElementById("confirmPassword").value

    let user = {
      username: username,
      email: email,
      password: password
    };

    if (password === confirmPassword) {
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
            alert(`Error: ${errorData.error}`);
        } else {
            // Si la requête a réussi, vous pouvez gérer le succès ici
            let responseData = await response.json();
            console.log('Success:', responseData);
            alert('Signup successful!');
            window.location.href = 'login.html'
          }
      }
        catch (error) {
          alert ('erreur lors de la connexion');
      }
    } else {
      alert('Mot de passe incorrect')
    }
  })
