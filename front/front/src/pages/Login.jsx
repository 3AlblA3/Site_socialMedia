import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {

  //Partie javascript

  //Gestion de nos champs de formulaires

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  //Definition de notre URL 

  const URL = "http://localhost:3000/users/login";

  //Création de notre fonction onSubmit

       async function loginSubmit(event) {
    event.preventDefault();

    const user = {
      email,
      password
    };

    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      // renvoie de la réponse json en cas d'erreur

      if (!response.ok) {
        let errorData = await response.json();
        console.error('Error:', errorData);
        alert(`Paire email/mot de passe incorrect: ${errorData.error}`);

      } else {

        //En cas de réussite, renvoi d'une réponse réussie et renvoi du jsonwebtoken dans le local storage

        const responseData = await response.json();
        console.log('Success:', responseData);
        alert('Connexion réussie !');
        localStorage.setItem('authToken', responseData.token);
        window.dispatchEvent(new Event('loginStateChange'));
        navigate('/'); 
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la connexion');
    }
  };

  //Partie Html

  return (
    <section id="posts">

      {/* Formulaire */}

      <form onSubmit={loginSubmit} id="form" className="signupForm">
        <label htmlFor="email">Email :</label>
        <input type="email" name="email" id="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required/>
        <label htmlFor="password">Mot de passe :</label>
        <input type="password" name="password" id="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
        <input type="submit" value="Se connecter" />
      </form>
    </section>
  );
}

export default Login;
