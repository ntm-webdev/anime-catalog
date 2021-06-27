import { useContext, useRef } from "react";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import useInput from "../../hooks/use-input";
import useHttp from "../../hooks/use-http";
import Spinner from "../../components/UI/Spinner/Spinner";

const regEmail = /\w+@\w+\.\w{2,10}/;

const SignIn = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const imageField = useRef();

  const {
    onChangeHandler: onNameChangeHandler,
    isValid: nameIsValid,
    value: name,
    isTouched: nameIsTouched,
  } = useInput((value) => value.length > 0);

  const {
    onChangeHandler: onEmailChangeHandler,
    isValid: emailIsValid,
    value: email,
    isTouched: emailIsTouched,
  } = useInput((value) => regEmail.test(value));

  const {
    onChangeHandler: onPasswordChangeHandler,
    isValid: passwordIsValid,
    value: password,
    isTouched: passwordIsTouched,
  } = useInput((value) => value.length > 3);

  const {
    onChangeHandler: onConfPasswordChangeHandler,
    isValid: confPasswordIsValid,
    value: confPassword,
    isTouched: confPasswordIsTouched,
  } = useInput((value) => value === password);

  const {
    onChangeHandler: onImageChangeHandler,
    isValid: imageIsValid,
    value: image,
    isTouched: imageIsTouched,
  } = useInput((value) => value.length > 0);

  const { sendRequest, spinner, message, error, errors } = useHttp();

  const isFormValid =
    !nameIsValid ||
    !emailIsValid ||
    !passwordIsValid ||
    !confPasswordIsValid ||
    !imageIsValid ||
    confPassword !== password;

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (isFormValid) {
      return;
    }

    let fd = new FormData();
    fd.append("name", name);
    fd.append("email", email);
    fd.append("password", password);
    fd.append("confPassword", confPassword);
    fd.append("image", image);

    try {
      const userData = await sendRequest(`${process.env.REACT_APP_BASE_URL}/signup`, "post", fd);
      authCtx.login(userData.token, userData.userId, userData.name);
      window.setTimeout(() => {
        history.replace("/");
      }, 1000);
    } catch (err) {
      return;
    }
  };

  return (
    <div className="formContainer">
      <form noValidate onSubmit={onSubmitHandler}>
        {message.length > 0 && (
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
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onBlur={onNameChangeHandler}
            onChange={onNameChangeHandler}
          />
          {!nameIsValid && nameIsTouched && (
            <p className="error">Invalid name.</p>
          )}
          {errors.length > 0 && errors[0].msg != null && (
            <p className="error">Invalid name.</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onBlur={onEmailChangeHandler}
            onChange={onEmailChangeHandler}
          />
          {!emailIsValid && emailIsTouched && (
            <p className="error">Invalid email.</p>
          )}
          {errors.length > 0 && errors[1].msg != null && (
            <p className="error">Invalid email.</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onBlur={onPasswordChangeHandler}
            onChange={onPasswordChangeHandler}
          />
          {!passwordIsValid && passwordIsTouched && (
            <p className="error">Invalid password.</p>
          )}
          {errors.length > 0 && errors[2].msg != null && (
            <p className="error">Invalid password.</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="confPassword">Confirm password</label>
          <input
            type="password"
            className="form-control"
            id="confPassword"
            min="0"
            value={confPassword}
            onBlur={onConfPasswordChangeHandler}
            onChange={onConfPasswordChangeHandler}
          />
          {!confPasswordIsValid &&
            confPasswordIsTouched &&
            confPassword !== password && (
              <p className="error">The passwords don't match.</p>
            )}
          {errors.length > 0 && errors[3].msg != null && (
            <p className="error">The passwords don't match.</p>
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
            defaultValue={image}
            onBlur={onImageChangeHandler}
            onChange={onImageChangeHandler}
          />
          {!imageIsValid && imageIsTouched && (
            <p className="error">Invalid image.</p>
          )}
        </div>
        {!spinner && (
          <button
            type="submit"
            className="btn btnYellow"
            disabled={isFormValid}
          >
            Sign in
          </button>
        )}
        {spinner && <Spinner />}
      </form>
    </div>
  );
};

export default SignIn;
