import { Link } from "react-router-dom";
import styles from "./Anime.module.css";

const Anime = (props) => (
  <div className={`col-sm-12 col-md-4 col-lg-3`}>
    <div className={`card ${styles.customCard} h-100`}>
      <Link to={`/anime/${props.id}`} className={styles.anchor}>
        <img
          className={styles.cardImage}
          src={`http://localhost:8080/images/${props.image}`}
          alt={props.title}
        />
        <div className="card-body">
          <h5 className="card-title">{props.title}</h5>
          <p className="card-text">
            <span className={styles.cardBodyRating}>{props.rating}</span>
          </p>
          <p className="card-text">
            <strong>{props.genre}</strong>
          </p>
        </div>
      </Link>
    </div>
  </div>
);

export default Anime;
