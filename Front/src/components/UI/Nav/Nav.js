import { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./Nav.module.css";
import { AuthContext } from "../../../context/auth-context";
import { fetchAnimes } from "../../../store/reducers/animes";

const Nav = () => {
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const history = useHistory();

  const searchHandler = (event) => {
    if (event.target.value === "") {
      dispatch(fetchAnimes(`${process.env.REACT_APP_BASE_URL}/animes`));
    } else {
      dispatch(fetchAnimes(`${process.env.REACT_APP_BASE_URL}/animes?sort=title:${event.target.value}`));
    }
  };

  const logoutHandler = () => {
    authCtx.logout();
    history.replace("/");
  };

  return (
    <nav className={styles.menu}>
      <Link to="/" className={styles.logo}>
        <span className="fas fa-video"></span> AnimeCatalog
      </Link>

      <form className={`form-inline ${styles.textbox}`}>
        <div className="form-group mx-sm-3 mb-2">
          <label htmlFor="inputPassword2" className="sr-only">
            Search
          </label>
          <input
            type="search"
            className="form-control"
            placeholder="Search a movie"
            onChange={searchHandler}
          />
        </div>
      </form>

      <ul className={styles.menuOptions}>
        {authCtx.isLoggedIn && (
          <li>
            <Link to="/add-anime">ADD ANIME</Link>
          </li>
        )}
        {authCtx.isLoggedIn && (
          <li>
            <Link to="/my-area">MY AREA</Link>
          </li>
        )}
        {!authCtx.isLoggedIn && (
          <li>
            <Link to="/signup">SIGN UP</Link>
          </li>
        )}
        {!authCtx.isLoggedIn ? (
          <li>
            <Link to="/login">LOGIN</Link>
          </li>
        ) : (
          <li>
            <span onClick={logoutHandler}>LOGOUT</span>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
