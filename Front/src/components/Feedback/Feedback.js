import { useContext } from "react";

import styles from "./Feedback.module.css";
import useInput from "../../hooks/use-input";
import useHttp from "../../hooks/use-http";
import { AuthContext } from "../../context/auth-context";
import Spinner from "../UI/Spinner/Spinner";

const Feedback = (props) => {
  const authCtx = useContext(AuthContext);
  const { sendRequest, spinner, message, error, errors } = useHttp();

  const {
    onChangeHandler: onRatingChangeHandler,
    isValid: ratingIsValid,
    value: rating,
    isTouched: ratingIsTouched,
  } = useInput((value) => value > -1);

  const {
    onChangeHandler: onCommentChangeHandler,
    isValid: commentIsValid,
    value: comment,
    isTouched: commentIsTouched,
  } = useInput((value) => value.length > 0);

  const isFormValid = !ratingIsValid || !commentIsValid;

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (isFormValid) {
      return;
    }

    let data;
    if (props.editMode) {
      data = {
        rating,
        comment,
        userId: authCtx.userId,
        animeId: props.animeId,
        feedbackId: props.feedbackId,
      };
    } else {
      data = {
        rating,
        comment,
        userId: authCtx.userId,
        animeId: props.animeId,
      };
    }

    try {
      await sendRequest(
        "http://localhost:8080/admin/add-feedback",
        "post",
        data,
        {
          headers: { Authorization: "Bearer " + authCtx.token },
        }
      );
      props.fetchData();
    } catch (error) {
      return;
    }
  };

  return (
    <div className={`${styles.feedback}`}>
      <h2>Leave your feedback</h2>
      <form noValidate onSubmit={onSubmitHandler}>
        {message !== "" && (
          <div className="alert alert-success" role="alert">
            {message}
          </div>
        )}
        {error !== "" && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <input
            type="number"
            className="form-control"
            id="rating"
            min="0"
            max="10"
            defaultValue={props.rating}
            onBlur={onRatingChangeHandler}
            onChange={onRatingChangeHandler}
          />
          {!ratingIsValid && ratingIsTouched && (
            <p className={styles.error}>Invalid rating.</p>
          )}
          {errors.length > 0 && errors[0].msg != null && (
            <p className={styles.error}>Invalid rating.</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="description">Comment</label>
          <textarea
            className="form-control"
            id="comment"
            rows="3"
            defaultValue={props.comment}
            onBlur={onCommentChangeHandler}
            onChange={onCommentChangeHandler}
          ></textarea>
          {!commentIsValid && commentIsTouched && (
            <p className={styles.error}>Invalid comment.</p>
          )}
          {errors.length > 0 && errors[1].msg != null && (
            <p className={styles.error}>Invalid comment.</p>
          )}
        </div>
        <button className={`btn ${styles.btnYellow}`} disabled={isFormValid}>
          POST
        </button>
        &nbsp;
        {spinner && <Spinner />}
      </form>
    </div>
  );
};

export default Feedback;
