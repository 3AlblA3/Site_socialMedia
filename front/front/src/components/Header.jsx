import React, { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/Header.css'

function Header() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const checkLoginState = () => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoginState();
    window.addEventListener('loginStateChange', checkLoginState);
    return () => {
      window.removeEventListener('loginStateChange', checkLoginState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/')
    window.location.reload();
    ;
  };
  return (

    <Fragment>
        <header>
            <section>
              <Link to="/"><h1>SocialMedia</h1></Link>
            </section>
            <section>
            {isLoggedIn ? (
          <button onClick={handleLogout}>Log out</button>
        ) : (
          <>
            <Link to="/signup"><h3>Sign up</h3></Link>
            <Link to="/login"><h3>Log in</h3></Link>
          </>
        )}
            </section>
        </header>
    </Fragment>
  )
}

export default Header

