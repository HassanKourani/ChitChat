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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CreatePost = ({ db, storage }) => {
  const history = useHistory();
  const uid = useParams().uid;

  const [body, setBody] = useState("");
  const [user, setUser] = useState("");
  const [pending, setPending] = useState(false);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [successful, setSuccessful] = useState(false);

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
    setPending(true);
    if (body && user) {
      if (image) {
        addDoc(postsColRef, {
          body: body,
          likes: 0,
          user: user.name,
          uid: uid,
          image: url,
          profile: user.profile,
          created_at: serverTimestamp(),
        }).then(() => {
          setBody("");
          setImage(null);
          setPending(false);
          setSuccessful(true);
          setTimeout(() => {
            setSuccessful(false);
          }, 2500);
        });
      } else {
        addDoc(postsColRef, {
          body: body,
          likes: 0,
          user: user.name,
          uid: uid,
          image: null,
          profile: user.profile,
          created_at: serverTimestamp(),
        }).then(() => {
          setBody("");
          setPending(false);
          setSuccessful(true);
          setTimeout(() => {
            setSuccessful(false);
          }, 2500);
        });
      }
    }
  };

  useEffect(() => {
    if (image) {
      setLoadingImage(true);
      const imageRef = ref(storage, image.name);
      uploadBytes(imageRef, image).then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            setUrl(url);
          })
          .then(() => {
            setLoadingImage(false);
          });
      });
    }
  }, [image]);

  const onChangeImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  return (
    <div className="app-main">
      {successful && (
        <div className="fixed top-1/2 right-1/3  w-40 h-20 bg-green-500 flex justify-center items-center font-bold text-white opacity-60 rounded-md animate__animated animate__fadeIn">
          Posted successfully
        </div>
      )}
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
        {!pending && (
          <button
            className={
              body
                ? "hover:bg-primary hover:text-white text-primary p-2 rounded-md"
                : "cursor-default p-2 text-gray-200"
            }
            onClick={(e) => handlePost(e)}
          >
            <span className="mr-2 font-extrabold">Post</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={body ? "w-6 h-6 inline" : "w-6 h-6 opacity-50 inline"}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        )}
        {pending && (
          <svg
            aria-hidden="true"
            className=" w-6 h-6 text-gray-300 animate-spin fill-primary"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        )}
      </div>
      <div className="border-b border-gray-300 px-4 py-2">
        <img
          src={user.profile}
          alt=""
          className="w-10 h-10 bg-black rounded-full ml-2"
        />
        <input
          type="text"
          className="w-full px-6 py-4 outline-none"
          placeholder="What's Happening?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        {image && (
          <div className="relative w-full sm:w-1/2">
            <div
              className="absolute right-2 bg-red-500 cursor-pointer my-2 opacity-60 hover:opacity-100"
              onClick={handleRemoveImage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-white"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </div>

            <img src={url} alt="" className="m-2 rounded-lg " />
          </div>
        )}
        {loadingImage && (
          <svg
            aria-hidden="true"
            className=" w-6 h-6 text-gray-300 animate-spin fill-primary"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        )}
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
              onChange={onChangeImage}
            />
          </label>
        </div>
      </div>

      {/* <input type="file" accept="image/*" /> */}
    </div>
  );
};

export default CreatePost;
