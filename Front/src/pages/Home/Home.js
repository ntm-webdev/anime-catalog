import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAnimes } from "../../store/reducers/animes";
import { AuthContext } from "../../context/auth-context";
import styles from "./Home.module.css";
import Spinner from "../../components/UI/Spinner/Spinner";
import Anime from "../../components/Anime/Anime";

const AnimeSection = () => {
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const spinner = useSelector((state) => state.animes.spinner);
  const animes = useSelector((state) => state.animes.animes);
  const error = useSelector((state) => state.animes.error);

  useEffect(() => {
    dispatch(fetchAnimes(`http://localhost:8080/animes`));
  }, []);

  let content;
  if (spinner && animes.length <= 0) {
    content = <Spinner />;
  } else if (animes.length <= 0) {
    content = (
      <div className={`row ${styles.breath}`}>
        {authCtx.userName !== "" && (
          <h2 style={{ color: "yellow", marginTop: "1rem" }}>
            {`Hello, ${authCtx.userName}`}
          </h2>
        )}
        <p style={{ backgroundColor: "black", color: "white" }}>
          No animes were found.
        </p>
      </div>
    );
  } else {
    content = (
      <>
        {authCtx.userName !== "" && (
          <h2 style={{ color: "yellow", marginTop: "1rem" }}>
            {`Hello, ${authCtx.userName}`}
          </h2>
        )}
        <div className={`row ${styles.breath}`}>
          {animes.map((anime) => (
            <Anime
              key={anime._id}
              id={anime._id}
              title={anime.title}
              genre={anime.genre}
              rating={anime.rating > -1 ? anime.rating.toFixed(2) : "N/A"}
              image={anime.image}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="container">
      {!error ? (
        content
      ) : (
        <p style={{ backgroundColor: "black", color: "red" }}>{error}</p>
      )}
    </div>
  );
};

export default AnimeSection;
