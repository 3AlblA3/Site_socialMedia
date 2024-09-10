import { Fragment } from "react"

// Les fonctions sont des composants
function Header() {

  return (

    <Fragment>
        <header>
            <a href="index.html"><h1>Social Media</h1></a>
            <a href="signup.html"><h3>Sign up</h3></a>
            <a href="login.html"><h3>Log in</h3></a>
        </header>
    </Fragment>
  )
}

export default Header