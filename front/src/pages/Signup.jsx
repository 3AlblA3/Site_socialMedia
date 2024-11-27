import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {

  //Partie javascript

  //Gestion de nos champs de formulaires

  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  //Definition de notre URL 

  const URL = "http://localhost:3000/users/signup";

  //Création de notre fonction onSubmit

  async function signupSubmit(event) {
    event.preventDefault();

    // Mise en place de nos regex

    const nameRegex = new RegExp("^[a-zA-ZÀ-ÖØ-öø-ÿ]+$");
    if (!nameRegex.test(first_name)) {
      alert('Le nom ne doit contenir que des lettres.');
      return;
    }

    if (!nameRegex.test(last_name)) {
      alert('Le nom ne doit contenir que des lettres.');
      return;
    }

    const regexMail = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+");
    if (!regexMail.test(email)) {
      alert('Veuillez entrer une adresse e-mail valide.');
      return;
    }

    const passwordRegex = new RegExp("^(?=.*[A-Z])(?=.*[!@#$%^&*()_\\-+=\\[\\]{};':\"\\\\|,.<>\\/?]).{12,}$");
    if (!passwordRegex.test(password)) {
      alert('Le mot de passe doit contenir au moins 12 caractères, une majuscule et un caractère spécial.');
      return;
    }

    // Si le mot de passe n'est pas confirmé, on relance l'opération

    if (password !== confirmPassword) {
      alert('Erreur, mots de passe différents');
      return;
    }

    // Définition de notre user avec les futurs champs du formulaire

    const user = {
      first_name,
      last_name,
      email,
      password,
    };

    // Fetch post 

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
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert(`Error: ${errorData.error}`);
      } else {

        //En cas de réussite, renvoie d'une réponse réussie et renvoie vers la page login avec navigate

        const responseData = await response.json();
        console.log('Success:', responseData);
        alert('Inscription réussie !');
        navigate('/login'); 
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la connexion');
    }
  };

  //Partie Html

  return (
    <section id="main__section">

      {/* Formulaire  */}

      <form onSubmit={signupSubmit} id="form" className="signupForm">
        <label htmlFor="first_name">Prénom :</label>
        <input type="text" name="first_name" id="first_name" value={first_name}
              onChange={(e) => setFirstName(e.target.value)} required/>
        <label htmlFor="last_name">Nom :</label>
        <input type="text" name="last_name" id="last_name" value={last_name}
              onChange={(e) => setLastName(e.target.value)} required/>
        <label htmlFor="email">Email :</label>
        <input type="email" name="email" id="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required/>
        <p>Choisissez un mot de passe comprenant:<br />
        -12 caractères<br />
        -Un caractère spécial<br />
        -Un chiffre<br />
        -Une majuscule<br /></p>
        <label htmlFor="password">Mot de passe :</label>
        <input type="password" name="password" id="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
        <label htmlFor="confirmPassword">Confirmez le mot de passe :</label>
        <input type="password" name="confirmPassword" id="confirmPassword" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} required />
        <input type="submit" value="S'inscrire" />
      </form>
    </section>
  );
}

export default Signup;