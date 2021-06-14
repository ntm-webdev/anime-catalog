import { useRef, useContext } from "react";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import useInput from "../../hooks/use-input";
import useHttp from "../../hooks/use-http";
import styles from "./AddAnime.module.css";
import Spinner from "../../components/UI/Spinner/Spinner";

const AddAnime = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  if (!authCtx.isLoggedIn) {
    history.replace("/");
  }

  const imageField = useRef();
  const { sendRequest, spinner, message, error, errors } = useHttp();

  const {
    onChangeHandler: onTitleChangeHandler,
    onCleanHandler: onTitleCleanHandler,
    isValid: titleIsValid,
    value: title,
    isTouched: titleIsTouched,
  } = useInput((value) => value.length > 1);

  const {
    onChangeHandler: onGenreChangeHandler,
    onCleanHandler: onGenreCleanHandler,
    isValid: genreIsValid,
    value: genre,
    isTouched: genreIsTouched,
  } = useInput((value) => value.length > 0);

  const {
    onChangeHandler: onDescriptionChangeHandler,
    onCleanHandler: onDescriptionCleanHandler,
    isValid: descriptionIsValid,
    value: description,
    isTouched: descriptionIsTouched,
  } = useInput((value) => value.length > 0);

  const {
    onChangeHandler: onImageChangeHandler,
    isValid: imageIsValid,
    value: image,
    isTouched: imageIsTouched,
  } = useInput((value) => value.length > 0);

  const {
    onChangeHandler: onReleaseDateChangeHandler,
    onCleanHandler: onReleaseDateCleanHandler,
    isValid: releaseDateIsValid,
    value: releaseDate,
    isTouched: releaseDateIsTouched,
  } = useInput((value) => value.length > 0);

  const {
    onChangeHandler: onEpisodesChangeHandler,
    onCleanHandler: onEpisodesCleanHandler,
    isValid: episodesIsValid,
    value: episodes,
    isTouched: episodesIsTouched,
  } = useInput((value) => value > 0);

  const {
    onChangeHandler: onTrailerChangeHandler,
    onCleanHandler: onTrailerCleanHandler,
    isValid: trailerIsValid,
    value: trailer,
    isTouched: trailerIsTouched,
  } = useInput((value) => value.length > 0);

  const isFormValid =
    !titleIsValid ||
    !genreIsValid ||
    !descriptionIsValid ||
    !imageIsValid ||
    !releaseDateIsValid ||
    !episodesIsValid ||
    !trailerIsValid;

  const cleanFields = () => {
    onTitleCleanHandler();
    onGenreCleanHandler();
    onDescriptionCleanHandler();
    imageField.current.value = "";
    onReleaseDateCleanHandler();
    onEpisodesCleanHandler();
    onTrailerCleanHandler();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (isFormValid) {
      return;
    }

    let fd = new FormData();
    fd.append("title", title);
    fd.append("genre", genre);
    fd.append("description", description);
    fd.append("image", image);
    fd.append("releaseDate", releaseDate);
    fd.append("episodes", episodes);
    fd.append("trailer", trailer);

    try {
      await sendRequest("http://localhost:8080/admin/add-anime", "post", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + authCtx.token,
        },
      });
      cleanFields();
    } catch (error) {
      return;
    }
  };

  return (
    <div className={styles.formContainer}>
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
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onBlur={onTitleChangeHandler}
            onChange={onTitleChangeHandler}
          />
          {!titleIsValid && titleIsTouched && (
            <p className={styles.error}>Invalid title.</p>
          )}
          {errors.length > 0 && errors[0].msg != null && (
            <p className={styles.error}>Invalid title.</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="genre">Genres</label>
          <select
            className="form-control"
            id="genre"
            value={genre}
            onBlur={onGenreChangeHandler}
            onChange={onGenreChangeHandler}
          >
            <option value="">Select one</option>
            <option>Shoujo</option>
            <option>Hentai</option>
            <option>Shonen</option>
            <option>Kodomo</option>
            <option>Seinen</option>
          </select>
          {!genreIsValid && genreIsTouched && (
            <p className={styles.error}>Invalid genre.</p>
          )}
          {errors.length > 0 && errors[1].msg != null && (
            <p className={styles.error}>Invalid genre.</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            value={description}
            onBlur={onDescriptionChangeHandler}
            onChange={onDescriptionChangeHandler}
          ></textarea>
          {!descriptionIsValid && descriptionIsTouched && (
            <p className={styles.error}>Invalid description.</p>
          )}
          {errors.length > 0 && errors[2].msg != null && (
            <p className={styles.error}>Invalid description.</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="file">Image</label>
          <input
            type="file"
            className="form-control-file"
            id="image"
            ref={imageField}
            name="image"
            rows="3"
            defaultValue={image}
            onBlur={onImageChangeHandler}
            onChange={onImageChangeHandler}
          />
          {!imageIsValid && imageIsTouched && (
            <p className={styles.error}>Invalid image.</p>
          )}
          {errors.length > 0 && errors[3].msg != null && (
            <p className={styles.error}>Invalid image.</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="release-date">Release date</label>
          <input
            type="date"
            className="form-control"
            id="release-date"
            value={releaseDate}
            onBlur={onReleaseDateChangeHandler}
            onChange={onReleaseDateChangeHandler}
          />
          {!releaseDateIsValid && releaseDateIsTouched && (
            <p className={styles.error}>Invalid release date.</p>
          )}
          {errors.length > 0 && errors[4].msg != null && (
            <p className={styles.error}>Invalid release date.</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="episodes">Episodes</label>
          <input
            type="number"
            className="form-control"
            id="episodes"
            min="0"
            value={episodes}
            onBlur={onEpisodesChangeHandler}
            onChange={onEpisodesChangeHandler}
          />
          {!episodesIsValid && episodesIsTouched && (
            <p className={styles.error}>Invalid episode.</p>
          )}
          {errors.length > 0 && errors[5].msg != null && (
            <p className={styles.error}>Invalid episode.</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="trailer">Trailer</label>
          <input
            type="text"
            className="form-control"
            id="trailer"
            value={trailer}
            onBlur={onTrailerChangeHandler}
            onChange={onTrailerChangeHandler}
          />
          {!trailerIsValid && trailerIsTouched && (
            <p className={styles.error}>Invalid trailer.</p>
          )}
          {errors.length > 0 && errors[6].msg != null && (
            <p className={styles.error}>Invalid trailer.</p>
          )}
        </div>
        {!spinner && (
          <button
            type="submit"
            className={`btn ${styles.btnYellow}`}
            disabled={isFormValid}
          >
            Save
          </button>
        )}
        {spinner && <Spinner />}
      </form>
    </div>
  );
};

export default AddAnime;
