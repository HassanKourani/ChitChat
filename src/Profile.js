import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import Posts from "./Posts";

const Profile = ({ db }) => {
  const uid = useParams().uid;
  const vid = useParams().vid;
  const path = useLocation();

  const [user, setUser] = useState("");
  const [following, setFollowing] = useState("");
  const [followers, setFollowers] = useState("");
  const [isFollowing, setIsFollowing] = useState(true);
  const [posts, setPosts] = useState("");

  // const [image, setImage] = useState();

  // post collection of A user ID
  const postsColRef = collection(db, "users", vid, "posts");
  const userRef = doc(db, "users", vid);
  const followingColRef = collection(db, "users", vid, "following");
  const followersColRef = collection(db, "users", vid, "followers");

  useEffect(() => {
    getDoc(userRef).then((res) => {
      setUser(res.data());
    });

    onSnapshot(followingColRef, (snapshot) => {
      setFollowing(
        snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
      );
    });

    onSnapshot(postsColRef, (snapshot) => {
      setPosts(snapshot.docs.map((item) => ({ ...item.data(), id: item.id })));
    });

    onSnapshot(followersColRef, (snapshot) => {
      setFollowers(
        snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
      );
    });
  }, [path]);

  function isfol(id) {
    return followers.some(function (el) {
      return el.id === id;
    });
  }

  useEffect(() => {
    if (followers) {
      setIsFollowing(isfol(uid));
    }
  }, [followersColRef]);

  const handleFollow = (e) => {
    e.preventDefault();
    if (!isfol(uid)) {
      setDoc(doc(db, "users", uid, "following", vid), {
        name: user.name,
        email: user.email,
      });
      setDoc(doc(db, "users", vid, "followers", uid), {
        name: user.name,
        email: user.email,
      });
    } else if (isfol) {
      const followingdocRef = doc(db, "users", uid, "following", vid);
      deleteDoc(followingdocRef);
      const followersdocRef = doc(db, "users", vid, "followers", uid);
      deleteDoc(followersdocRef);
    }
  };

  // const onChangeImage = (e) => {
  //   console.log("picture: ", image);
  //   setImage(...image, e.target.files[0]);
  // };

  return (
    <div className="app-main">
      <div className="relative h-48 w-full bg-primary flex justify-center items-center">
        {uid === vid && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="img-plus bg-gray-200"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        )}

        <div className="profile-img">
          {uid === vid && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="img-plus"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      {user && (
        <div className="p-10 font-bold md:text-xl text-lg flex justify-between border-b border-gray-300">
          <div>
            <div className="flex gap-2">
              <h1>{user.name}</h1>
              {uid !== vid && (
                <div className="flex items-center gap-1">
                  <button
                    className={
                      isFollowing
                        ? "follow-btn bg-gray-300 hover:bg-gray-400 hover:text-black"
                        : " follow-btn border bg-primary hover:bg-white hover:text-primary hover:border-primary"
                    }
                    onClick={handleFollow}
                  >
                    {isFollowing && <span>Following</span>}
                    {!isFollowing && <span>Follow</span>}
                  </button>
                  {isFollowing && (
                    <Link
                      to={`/chat/${uid}/${vid}`}
                      className="border border-black hover:border-primary rounded-full p-1 hover:text-primary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M10 2a.75.75 0 01.75.75v5.59l1.95-2.1a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0L6.2 7.26a.75.75 0 111.1-1.02l1.95 2.1V2.75A.75.75 0 0110 2z" />
                        <path d="M5.273 4.5a1.25 1.25 0 00-1.205.918l-1.523 5.52c-.006.02-.01.041-.015.062H6a1 1 0 01.894.553l.448.894a1 1 0 00.894.553h3.438a1 1 0 00.86-.49l.606-1.02A1 1 0 0114 11h3.47a1.318 1.318 0 00-.015-.062l-1.523-5.52a1.25 1.25 0 00-1.205-.918h-.977a.75.75 0 010-1.5h.977a2.75 2.75 0 012.651 2.019l1.523 5.52c.066.239.099.485.099.732V15a2 2 0 01-2 2H3a2 2 0 01-2-2v-3.73c0-.246.033-.492.099-.73l1.523-5.521A2.75 2.75 0 015.273 3h.977a.75.75 0 010 1.5h-.977z" />
                      </svg>
                    </Link>
                  )}
                </div>
              )}
            </div>

            <p className="font-normal text-lg opacity-50 text-gray-400">
              {user.email}
            </p>
          </div>
          <div className="flex md:gap-4 gap-1">
            {following && (
              <div className="text-center p-2 m-auto rounded-xl hover:bg-gray-100 cursor-pointer">
                {following.length}
                <Link to={`/following/${uid}/${vid}`} className="font-thin">
                  {" "}
                  Following
                </Link>
              </div>
            )}
            {followers && (
              <div className="text-center p-2 m-auto rounded-xl hover:bg-gray-100 cursor-pointer">
                {followers.length}
                <Link to={`/followers/${uid}/${vid}`} className="font-thin">
                  {" "}
                  Followers
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      <Posts db={db} uid={uid} vid={vid} posts={posts} />
    </div>
  );
};

export default Profile;
