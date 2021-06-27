import { Link } from "react-router-dom";
import styles from "./Anime.module.css";

const Anime = ({ animeId, title, genre, rating, image }) => (
  <div className="col-sm-12 col-md-4 col-lg-3">
    <div className={`card ${styles.customCard} h-100`}>
      <Link to={`/anime/${animeId}`} className={styles.anchor}>
        <img
          className={styles.cardImage}
          src={`${process.env.REACT_APP_BASE_URL}/images/${image}`}
          alt={title}
        />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">
            <span className={styles.cardBodyRating}>{rating}</span>
          </p>
          <p className="card-text">
            <strong>{genre}</strong>
          </p>
        </div>
      </Link>
    </div>
  </div>
);

export default Anime;
