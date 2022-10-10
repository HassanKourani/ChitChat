import "animate.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LandingPage from "./LandingPage";
import Navbar from "./Navbar";
import Signin from "./Signin";
import Signup from "./Signup";
import { db, storage } from "./Config";
import { getAuth } from "firebase/auth";
import AppNav from "./AppNav";
import Profile from "./Profile";
import CreatePost from "./CreatePost";
import Post from "./Post";
import Search from "./Search";
import Chat from "./Chat";
import UsersList from "./UsersList";
import Home from "./Home";
import Messages from "./Messages";

function App() {
  const auth = getAuth();
  return (
    <Router>
      <div className="font-Nunito relative">
        <Switch>
          <Route exact path="/">
            <Navbar />
            <Signin auth={auth} />
          </Route>
          <Route exact path="/signup">
            <Navbar />
            <Signup db={db} auth={auth} />
          </Route>
          <Route exact path="/home/:uid">
            <AppNav auth={auth} />
            <Home db={db} storage={storage} />
          </Route>
          <Route exact path="/profile/:uid/:vid">
            <AppNav auth={auth} />
            <Profile db={db} storage={storage} />
          </Route>
          <Route exact path="/create-post/:uid">
            <AppNav auth={auth} />
            <CreatePost db={db} storage={storage} />
          </Route>
          <Route exact path="/post/:uid/:vid/:pid">
            <AppNav auth={auth} />
            <Post db={db} storage={storage} />
          </Route>
          <Route exact path="/chat/:uid/:vid">
            <AppNav auth={auth} />
            <Chat db={db} />
          </Route>
          <Route exact path="/search/:uid">
            <AppNav auth={auth} />
            <Search db={db} />
          </Route>
          <Route exact path="/messages/:uid">
            <AppNav auth={auth} />
            <Messages db={db} />
          </Route>
          <Route exact path="/followers/:uid/:vid">
            <AppNav auth={auth} />
            <UsersList db={db} />
          </Route>
          <Route exact path="/following/:uid/:vid">
            <AppNav auth={auth} />
            <UsersList db={db} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
//1. query the comments order by created at
//2. add profile images
//3. add backGround images
//4. add images to posts
//5. landing page
