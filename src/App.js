import "animate.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LandingPage from "./LandingPage";
import Navbar from "./Navbar";
import Signin from "./Signin";
import Signup from "./Signup";
import { db } from "./Config";
import { getAuth } from "firebase/auth";
import AppNav from "./AppNav";
import Profile from "./Profile";
import CreatePost from "./CreatePost";
import Post from "./Post";
import Search from "./Search";
import Chat from "./Chat";
import UsersList from "./UsersList";
import Home from "./Home";

function App() {
  const auth = getAuth();
  return (
    <Router>
      <div className="font-Nunito">
        <Switch>
          <Route exact path="/">
            <Navbar />
            <LandingPage />
          </Route>
          <Route exact path="/signup">
            <Navbar />
            <Signup db={db} auth={auth} />
          </Route>
          <Route exact path="/signin">
            <Navbar />
            <Signin auth={auth} />
          </Route>
          <Route exact path="/home/:uid">
            <AppNav />
            <Home db={db} />
          </Route>
          <Route exact path="/profile/:uid/:vid">
            <AppNav />
            <Profile db={db} />
          </Route>
          <Route exact path="/create-post/:uid">
            <AppNav />
            <CreatePost db={db} />
          </Route>
          <Route exact path="/post/:uid/:vid/:pid">
            <AppNav />
            <Post db={db} />
          </Route>
          <Route exact path="/chat/:uid/:vid">
            <AppNav />
            <Chat db={db} />
          </Route>
          <Route exact path="/search/:uid">
            <AppNav />
            <Search db={db} />
          </Route>
          <Route exact path="/followers/:uid/:vid">
            <AppNav />
            <UsersList db={db} />
          </Route>
          <Route exact path="/following/:uid/:vid">
            <AppNav />
            <UsersList db={db} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
