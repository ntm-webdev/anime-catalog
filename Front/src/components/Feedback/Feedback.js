import { useContext } from "react";

import styles from "./Feedback.module.css";
import useInput from "../../hooks/use-input";
import useHttp from "../../hooks/use-http";
import { AuthContext } from "../../context/auth-context";
import Spinner from "../UI/Spinner/Spinner";

const Feedback = ({ animeId, fetchData, animeRating, animeComment, feedbackId, editMode }) => {
  const authCtx = useContext(AuthContext);
  const { sendRequest, spinner, message, errors } = useHttp();

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
    if (editMode) {
      data = {
        rating,
        comment,
        userId: authCtx.userId,
        animeId: animeId,
        feedbackId: feedbackId,
      };
    } else {
      data = {
        rating,
        comment,
        userId: authCtx.userId,
        animeId: animeId,
      };
    }

    try {
      await sendRequest(`${process.env.REACT_APP_BASE_URL_ADM}/add-feedback`, "post", data);
      fetchData();
    } catch (error) {
      return;
    }
  };

  return (
    <div className={`${styles.feedback}`}>
      <h2>Leave your feedback</h2>
      <form noValidate onSubmit={onSubmitHandler}>
        {message.msg && <div className={`alert ${message.success ? 'alert-success' : 'alert-danger'}`} role="alert">{message.msg}</div>}
        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <input
            type="number"
            className="form-control"
            id="rating"
            min="0"
            max="10"
            defaultValue={animeRating}
            onBlur={onRatingChangeHandler}
            onChange={onRatingChangeHandler}
          />
          {!ratingIsValid && ratingIsTouched && (
            <p className="error">Invalid rating.</p>
          )}
          {errors.length > 0 && errors[0].msg != null && (
            <p className="error">Invalid rating.</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="description">Comment</label>
          <textarea
            className="form-control"
            id="comment"
            rows="3"
            defaultValue={animeComment}
            onBlur={onCommentChangeHandler}
            onChange={onCommentChangeHandler}
          ></textarea>
          {!commentIsValid && commentIsTouched && (
            <p className="error">Invalid comment.</p>
          )}
          {errors.length > 0 && errors[1].msg != null && (
            <p className="error">Invalid comment.</p>
          )}
        </div>
        <button className="btn btnYellow" disabled={isFormValid}>
          POST
        </button>
        &nbsp;
        {spinner && <Spinner />}
      </form>
    </div>
  );
};

export default Feedback;
