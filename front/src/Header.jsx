import { Fragment } from "react";
import { Link } from "react-router-dom"; // Importer Link
import './assets/Header.css'

// Les fonctions sont des composants
function Header() {

  return (

    <Fragment>
        <header>
            <section>
            <Link to="/"><h1>Social Media</h1></Link>
            </section>
            <section>
            <Link to="/signup"><h3>Sign up</h3></Link>
            <Link to="/login"><h3>Log in</h3></Link>
            </section>
        </header>
    </Fragment>
  )
}

export default Header