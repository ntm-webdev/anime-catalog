import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import useHttp from "../../hooks/use-http";
import styles from "./MyArea.module.css";
import Spinner from "../../components/UI/Spinner/Spinner";
import WatchList from "../../components/WatchList/WatchList";

const MyArea = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const [user, setUser] = useState();
  const { sendRequest, spinner, message } = useHttp();

  useEffect(() => {
    if (!authCtx.isLoggedIn) {
      history.replace("/");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = { params: { userId: authCtx.userId } };
    try {
      const res = await sendRequest(`${process.env.REACT_APP_BASE_URL_ADM}/my-area`, "get", data);
      setUser(res);
    } catch (err) {
      return;
    }
  };

  const removeFromMyWatchListHandler = async (animeId, isAdding) => {
    const data = { userId: authCtx.userId, animeId, isAdding };
    try {
      await sendRequest(`${process.env.REACT_APP_BASE_URL_ADM}/add-watchlist`, "post", data);
      await fetchData();
    } catch (error) {
      return;
    }
  };

  let content;
  if (spinner || !user) {
    content = <Spinner />;
  } else {
    content = (
      <div className={`${styles.mainContainer}`}>
        <div className="row">
          <div className="col-sm-12">
            <div className={styles.banner}>
              <img
                alt={user.name}
                className={styles.profilePicture}
                src={`${process.env.REACT_APP_BASE_URL}/images/${user.image}`}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className={styles.main}>
              <h2>{user.name},</h2>
              <div className={styles.content}>
                <h3>Your watch list:</h3>
                <br />
                {user.watchList.length > 0 ? (
                  <WatchList
                    animes={user.watchList}
                    onRemove={removeFromMyWatchListHandler}
                  />
                ) : (
                  <p>No animes were found on your watch list.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return message.msg ? <p>{message.msg}</p> : content;
};

export default MyArea;
