import { configureStore } from "@reduxjs/toolkit";

import animesReducer from "./reducers/animes";

export default configureStore({
  reducer: {
    animes: animesReducer,
  },
});
