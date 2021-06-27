import styles from "./WatchList.module.css";

const WatchList = ({ animes, onRemove }) => (
  <div className="row">
    {animes.map((anime) => (
      <div className="col-sm-12 col-md-4" key={anime._id}>
        <div className={`card ${styles.customizedCard} h-100`}>
          <img
            className={styles.cardImg}
            src={`${process.env.REACT_APP_BASE_URL}/images/${anime.image}`}
            alt={anime.title}
          />
          <div className="card-body">
            <h5 className={`card-title ${styles.heading}`}>{anime.title}</h5>
            <button
              className="btn btn-danger"
              onClick={() => onRemove(anime._id, false)}
            >
              Remove from watch list
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default WatchList;
