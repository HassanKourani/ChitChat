import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  query,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Posts from "./Posts";
const Home = ({ db }) => {
  const uid = useParams().uid;
  //States
  const [following, setFollowing] = useState([]);
  const [allPosts, setAllPosts] = useState("");

  //Collection Refs
  const followingColRef = collection(db, "users", uid, "following");
  const postsColRef = collection(db, "users", uid, "allPosts");
  const q = query(postsColRef, orderBy("created_at", "desc"));

  useEffect(() => {
    onSnapshot(followingColRef, (snapshot) => {
      setFollowing(snapshot.docs.map((item) => item.id));
    });

    onSnapshot(q, (snapshot) => {
      setAllPosts(
        snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
      );
    });
  }, []);

  useEffect(() => {
    allPosts &&
      allPosts.map((post) => {
        deleteDoc(doc(db, "users", uid, "allPosts", post.id));
      });

    following.map((value) => {
      const postsColRef = collection(db, "users", value, "posts");
      onSnapshot(postsColRef, (snapshot) => {
        const posts = snapshot.docs.map((item) => ({
          ...item.data(),
          id: item.id,
        }));
        posts.map((post) =>
          setDoc(doc(db, "users", uid, "allPosts", post.id), post)
        );
      });
    });

    const postsColRef = collection(db, "users", uid, "posts");
    onSnapshot(postsColRef, (snapshot) => {
      const posts = snapshot.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));
      posts.map((post) =>
        setDoc(doc(db, "users", uid, "allPosts", post.id), post)
      );
    });
  }, [following]);
  // compare two array and get the diff
  // what the first array has that the second dont .
  return (
    <div className="app-main">
      <Posts db={db} uid={uid} posts={allPosts} />
    </div>
  );
};

export default Home;
