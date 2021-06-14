import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";

const animesSlice = createSlice({
  name: "animes",
  initialState: {
    animes: [],
    totalPages: 0,
    error: "",
    spinner: false,
  },
  reducers: {
    loading: (state) => {
      state.spinner = true;
    },
    loadAnimes: (state, action) => {
      state.spinner = false;
      state.animes = action.payload.fetchedData;
      state.totalPages = action.payload.totalPages;
    },
    errorHandling: (state) => {
      state.spinner = false;
      state.error = "Something went wrong, please try again";
    },
  },
});

export const fetchAnimes = (url) => async (dispatch) => {
  try {
    dispatch(loading());
    const response = await axios.get(url);
    dispatch(loadAnimes(response.data));
  } catch (err) {
    dispatch(errorHandling());
  }
};

export const { loadAnimes, loading, errorHandling } = animesSlice.actions;

export default animesSlice.reducer;
