import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Posts from "./Posts";

const Home = ({ db }) => {
  const uid = useParams().uid;

  const [following, setFollowing] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState("");
  const [allPosts, setAllPosts] = useState("");

  const followingColRef = collection(db, "users", uid, "following");
  const usersRef = collection(db, "users");

  useEffect(() => {
    onSnapshot(followingColRef, (snapshot) => {
      setFollowing(snapshot.docs.map((item) => item.id));
    });

    onSnapshot(usersRef, (snapshot) => {
      setUsers(snapshot.docs.map((item) => item.id));
    });
  }, []);

  function postExists(id) {
    if (posts) {
      return posts.some(function (el) {
        return el.id === id;
      });
    }
  }

  function loadPostsToArray() {
    return new Promise(function (resolve, reject) {
      const values = users.filter((value) => following.includes(value));
      const array = [];
      values.map((user) => {
        const postsColRef = collection(db, "users", user, "posts");
        onSnapshot(postsColRef, (snapshot) => {
          //console.log(snapshot.docs.map((item) => item.id)[0]);
          if (!postExists(snapshot.docs.map((item) => item.id)[0])) {
            array.push(
              snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
            );
            resolve(array);
          }
        });
      });
    });
  }
  useEffect(() => {
    loadPostsToArray().then(function (array) {
      setPosts(array);
    });
  }, [following]);

  useEffect(() => {
    const arr = [];
    posts &&
      posts.map((user) => {
        user.map((post) => arr.push(post));
      });
    setAllPosts(
      arr.sort(function (a, b) {
        return b.created_at.seconds - a.created_at.seconds;
      })
    );
  }, [posts]);

  useEffect(() => {
    allPosts && console.log(allPosts);
  }, [allPosts]);

  //posts && posts.map((post) => console.log(post));

  return (
    <div className="app-main">
      <Posts db={db} uid={uid} posts={allPosts} />
    </div>
  );
};

export default Home;
