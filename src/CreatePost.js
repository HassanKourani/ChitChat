import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect } from "react";

import { getStorage, ref } from "firebase/storage";

const CreatePost = ({ db }) => {
  // Create a root reference
  const storage = getStorage();

  // Create a reference to 'mountains.jpg'
  const mountainsRef = ref(storage, "mountains.jpg");

  const history = useHistory();
  const uid = useParams().uid;

  const [body, setBody] = useState("");
  const [user, setUser] = useState("");
  const [image, setImage] = useState([]);

  const postsColRef = collection(db, "users", uid, "posts");
  const userRef = doc(db, "users", uid);

  useEffect(() => {
    getDoc(userRef).then((res) => {
      setUser(res.data());
    });
  }, []);
  //console.log(user.name);

  const handlePost = (e) => {
    e.preventDefault();
    if (body && user) {
      addDoc(postsColRef, {
        body: body,
        likes: 0,
        user: user.name,
        uid: uid,
        created_at: serverTimestamp(),
      }).then(() => {
        setBody("");
      });
    }
  };

  const onChangeImage = (e) => {
    setImage([...image, e.target.files[0]]);
    //console.log(e.target.files[0]);
  };

  useEffect(() => {
    console.log("picture: ", image);
  }, [image]);

  return (
    <div className="app-main">
      <div className="flex justify-between px-8 py-2">
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 hover:text-red-500"
            onClick={() => history.goBack()}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <button className={body ? "" : "cursor-default"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={
              body ? "w-6 h-6 hover:text-green-500" : "w-6 h-6 opacity-50"
            }
            onClick={(e) => handlePost(e)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
      <div className="border-b border-gray-300 px-4 py-2">
        <div className="w-8 h-8 bg-black rounded-full ml-2"></div>
        <input
          type="text"
          className="w-full px-6 py-4 outline-none"
          placeholder="What's Happening?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="w-min ml-8">
          <label htmlFor="image" className="cursor-pointer hover:text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="file"
              id="image"
              accept="image/*"
              className="hidden"
              onChange={(e) => onChangeImage(e)}
            />
          </label>
        </div>
      </div>

      {/* <input type="file" accept="image/*" /> */}
    </div>
  );
};

export default CreatePost;
