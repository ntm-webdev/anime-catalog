import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import styles from "./AnimeView.module.css";
import Spinner from "../../components/UI/Spinner/Spinner";
import Modal from "../../components/UI/Modal/Modal";
import Feedback from "../../components/Feedback/Feedback";
import useHttp from "../../hooks/use-http";
import Trailer from "../../components/Trailer/Trailer";

const getFormatedDate = (date) => {
  return (
    (date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) +
    "/" +
    (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
    "/" +
    date.getFullYear()
  );
};

const getFormatedTrailer = (url) => {
  return url.replace("watch?v=", "embed/");
};

const getAnimeRating = (rating) => {
  return rating > -1 ? rating.toFixed(2) : "N/A";
};

const AnimeView = () => {
  const params = useParams();
  const authCtx = useContext(AuthContext);
  const { sendRequest, spinner, message } = useHttp();
  const [anime, setAnime] = useState();
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState();
  const [comment, setComment] = useState();
  const [feedbackId, setFeedbackId] = useState();
  const [editMode, setEditMode] = useState(false);

  let formatedDate;
  let userDidWatch;
  let watchListButton = false;
  let isAuthor;
  let trailer;
  let content;
  let animeRating;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setShowModal(false);
    setEditMode(false);
    try {
      const res = await sendRequest(`${process.env.REACT_APP_BASE_URL}/anime/${params.id}`, "get");
      setAnime(res);
      setRating(null);
      setComment(null);
      setFeedbackId(null);
    } catch (error) {
      return;
    }
  };

  const showModalHandler = (isEditing, f_rating = null, f_comment = null, f_id = null) => {
    setShowModal((prevState) => !prevState);
    if (isEditing) {
      setEditMode(true);
      setRating(f_rating);
      setComment(f_comment);
      setFeedbackId(f_id);
    }
  };

  const removeFeedBackHandler = async (u_id, a_id, f_id) => {
    const res = window.confirm(`Are you sure you want to remove your feedback from the following anime: ${anime.title}?`);
    if (res) {
      try {
        const data = { data: { userId: u_id, animeId: a_id, feedbackId: f_id } };
        await sendRequest(`${process.env.REACT_APP_BASE_URL_ADM}/remove-feedback`, "delete", data);
        fetchData();
      } catch (error) {
        return;
      }
    } else {
      setShowModal(false);
    }
  };

  const addToMyWatchListHandler = async (isAdding) => {
    const data = { userId: authCtx.userId, animeId: params.id, isAdding };
    try {
      await sendRequest(`${process.env.REACT_APP_BASE_URL_ADM}/add-watchlist`, "post", data);
      await fetchData();
    } catch (error) {
      return;
    }
  };

  if (spinner || !anime) {
    content = <Spinner />;
  } else {
    userDidWatch = anime.usersWannaWatch.find(el => el._id === authCtx.userId);
    isAuthor = anime.feedback.find(el => el.userid._id === authCtx.userId);
    formatedDate = getFormatedDate(new Date(anime.release_date));
    trailer = getFormatedTrailer(anime.trailer);
    animeRating = getAnimeRating(anime.rating);

    if (authCtx.isLoggedIn) {
      watchListButton =
        userDidWatch && userDidWatch._id === authCtx.userId ? (
          <button
            className="btn btn-danger"
            onClick={() => addToMyWatchListHandler(false)}
          >
            <i className="fa fa-list"></i> &nbsp; Remove from my Watchlist
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={() => addToMyWatchListHandler(true)}
          >
            <i className="fa fa-list"></i> &nbsp; Add to my Watchlist
          </button>
        );
    } else {
      watchListButton = null;
    }

    content = (
      <>
        <div className="row">
          <div className="col-sm-12 col-md-4">
            <img
              src={`${process.env.REACT_APP_BASE_URL}/images/${anime.image}`}
              alt={anime.title}
              className={styles.animeImg}
            />
          </div>
          <div className={`col-sm-12 col-md-8 ${styles.main}`}>
            <h2>{anime.title}</h2>
            {watchListButton}
            <p>{anime.description}</p>
            <div className={styles.genre}>
              Genre: <span>{anime.genre}</span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className={styles.additionalInformation}>
              <span>Release date: {formatedDate}</span>
              <span>
                Rating: {animeRating}
              </span>
              <span>Episodes: {anime.episodes}</span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className={`${styles.section} ${styles.sectionBlack}`}>
              <Trailer trailerUrl={trailer} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className={`${styles.section} ${styles.sectionBlack}`}>
              <div className={styles.feedbackTitle}>
                <h2>Feedbacks</h2>&nbsp;
                {anime && authCtx.isLoggedIn && !isAuthor && (
                  <button
                    className="btn btn-success"
                    onClick={() => showModalHandler(false)}
                  >
                    Add your feedback
                  </button>
                )}
              </div>
              {anime && anime.feedback.length > 0 ? (
                <div className={styles.feedbackSection}>
                  {anime.feedback.map((feedback) => (
                    <div key={feedback._id} className={styles.feedback}>
                      <div className={styles.feedbackTitleNoPadding}>
                        <h5>{feedback.userid.name} says:</h5>
                        {authCtx.userId === feedback.userid._id && (
                          <div className="btn-group">
                            <button
                              className="btn btn-success"
                              onClick={() =>
                                showModalHandler(
                                  true,
                                  feedback.rating,
                                  feedback.comment,
                                  feedback._id
                                )
                              }
                            >
                              <i className="fa fa-edit"></i>
                              &nbsp;Edit
                            </button>
                            &nbsp;
                            <button
                              className="btn btn-danger"
                              onClick={() =>
                                removeFeedBackHandler(
                                  authCtx.userId,
                                  params.id,
                                  feedback._id
                                )
                              }
                            >
                              <i className="fa fa-trash"></i>
                              &nbsp;Remove
                            </button>
                          </div>
                        )}
                      </div>
                      <strong>Rating: {feedback.rating}</strong>
                      <p>{feedback.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noFeedback}>
                  <strong>This anime has no feedback for now.</strong>
                </div>
              )}
            </div>
          </div>
        </div>
        {showModal && (
          <Modal onClose={showModalHandler}>
            <Feedback
              animeId={anime._id}
              fetchData={fetchData}
              animeRating={rating}
              animeComment={comment}
              feedbackId={feedbackId}
              editMode={editMode}
            />
          </Modal>
        )}
      </>
    );
  }

  return (
    <div className={`container ${styles.animeContainer}`}>
      {message.msg ? <p>{message.msg}</p> : content}
    </div>
  );
};

export default AnimeView;
