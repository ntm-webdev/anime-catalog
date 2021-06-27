import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import Spinner from "../../components/UI/Spinner/Spinner";
import { AuthContext } from '../../context/auth-context';

const regEmail = /\w+@\w+\.\w{2,10}/;

const Login = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const { sendRequest, spinner, message, error, errors } = useHttp();
  
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

  const isFormValid = !emailIsValid || !passwordIsValid;

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (isFormValid) {
      return;
    }

    const data = { email, password };

    let userData;
    try {
      userData = await sendRequest(`${process.env.REACT_APP_BASE_URL}/login`, 'post', data);
      authCtx.login(userData.token, userData.userId, userData.name);
      history.replace('/');
    } catch (err) {
      return;
    }
  };

  return (
    <div className="formContainer">
      <form noValidate onSubmit={onSubmitHandler}>
        {message && <div className="alert alert-success" role="alert">{message}</div>}
        {error !== '' && <div className="alert alert-danger" role="alert">{error}</div>}
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
          {errors != null && errors.length > 0 && errors[0].msg != null && (
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
          {errors != null && errors.length > 0 && errors[1].msg != null && (
            <p className="error">Invalid password.</p>
          )}
        </div>
        {!spinner && (
          <button
            type="submit"
            className="btn btnYellow"
            disabled={isFormValid}
          >
            Login
          </button>
        )}
        {spinner && (
          <Spinner />
        )}
      </form>
    </div>
  );
};

export default Login;
