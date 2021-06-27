import { Switch, Route, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/js/all.js";
import AuthProvider from "./context/auth-context";
import Nav from "./components/UI/Nav/Nav";
import Home from "./pages/Home/Home";
import AddAnime from "./pages/AddAnime/AddAnime";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import AnimeView from "./pages/AnimeView/AnimeView";
import MyArea from "./pages/MyArea/MyArea";

const App = () => (
  <AuthProvider>
    <Nav />
    <Switch>
      <Route path="/add-anime">
        <AddAnime />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/my-area">
        <MyArea />
      </Route>
      <Route path="/anime/:id">
        <AnimeView />
      </Route>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  </AuthProvider>
);

export default App;
