import { useParams, Link, useHistory } from "react-router-dom";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
const Post = ({ db }) => {
  const history = useHistory();

  const uid = useParams().uid;
  const pid = useParams().pid;
  const vid = useParams().vid;

  const [post, setPost] = useState("");
  const [likedPosts, setLikedPosts] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(0);
  const [user, setUser] = useState("");

  const postRef = doc(db, "users", vid, "posts", pid);
  const userRef = doc(db, "users", uid);

  const LikesPostscolRef = collection(db, "users", uid, "liked_posts");
  const CommentsColRef = collection(db, "users", vid, "posts", pid, "comments");

  useEffect(() => {
    onSnapshot(userRef, (doc) => {
      setUser({ ...doc.data(), id: doc.id });
      //console.log(doc.id);
    });
    onSnapshot(postRef, (doc) => {
      setPost({ ...doc.data(), id: doc.id });
    });
    onSnapshot(LikesPostscolRef, (snapshot) => {
      setLikedPosts(
        snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
      );
    });
    onSnapshot(CommentsColRef, (snapshot) => {
      setComments(
        snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
      );
    });
  }, []);

  function isLiked(pid) {
    return likedPosts.some(function (el) {
      return el.id === pid;
    });
  }

  //Like Post
  const handleLike = (e, pid, likes) => {
    e.preventDefault();
    e.stopPropagation();

    const postDocRef = doc(db, "users", vid, "posts", pid);

    //if post is liked dec likes and remove the post from liked posts collection
    //if posts is not liked inc likes and add post to the liked posts collection
    if (!isLiked(pid)) {
      if (likes !== undefined) {
        updateDoc(postDocRef, {
          likes: likes + 1,
        });
      } else {
        updateDoc(postDocRef, {
          likes: 1,
        });
      }
      //add post to the liked_posts collection (Live User)
      setDoc(doc(db, "users", uid, "liked_posts", pid), {});
    } else {
      updateDoc(postDocRef, {
        likes: likes - 1,
      });
      const docRef = doc(db, "users", uid, "liked_posts", pid);
      deleteDoc(docRef);
    }
  };

  //add Comment
  const handleAddComment = (e, comments) => {
    e.preventDefault();
    e.stopPropagation();

    const postDocRef = doc(db, "users", vid, "posts", pid);

    if (comment) {
      if (!isNaN(comments)) {
        updateDoc(postDocRef, {
          comments: comments + 1,
        }).then(() => {
          setComment("");
        });
      } else {
        updateDoc(postDocRef, {
          comments: 1,
        }).then(() => {
          setComment("");
        });
      }

      addDoc(CommentsColRef, {
        comment: comment,
        user: user.name,
        uid: user.id,
      });
    }
  };

  const handleDeleteComment = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    const postDocRef = doc(db, "users", vid, "posts", pid);

    updateDoc(postDocRef, {
      comments: comments - 1,
    });

    const docRef = doc(db, "users", vid, "posts", pid, "comments", id);
    deleteDoc(docRef);
  };

  const handleDeletePost = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const docRef = doc(db, "users", uid, "posts", pid);
    deleteDoc(docRef);
    history.goBack();
  };

  //console.log(comments.length);
  return (
    <div className="app-main">
      {post && (
        <div className="flex gap-4 border-b border-gray-100 py-3 px-4 ">
          <div className="">
            <div className="w-12 h-12 bg-black rounded-full"></div>
          </div>
          <div className="w-full">
            <div className=" flex justify-between">
              <div
                className="font-extrabold hover:text-gray-400"
                onClick={(e) => e.stopPropagation()}
              >
                <Link to={`/profile/${uid}/${post.uid}`}>{post.user}</Link>
              </div>
              <div className="opacity-50 text-gray-400">
                {post && new Date(post.created_at.seconds * 1000).getDate()}/
                {post &&
                  new Date(post.created_at.seconds * 1000).getMonth() + 1}
                /
                {post && new Date(post.created_at.seconds * 1000).getFullYear()}
              </div>
            </div>
            <div className="mt-2">{post.body}</div>
            <div className="mt-4 flex gap-4">
              <div className="flex items-center gap-1">
                {!isLiked(post.id) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer hover:text-red-500"
                    onClick={(e) => handleLike(e, post.id, post.likes)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                )}
                {isLiked(post.id) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 cursor-pointer hover:text-gray-300 text-red-500"
                    onClick={(e) => handleLike(e, post.id, post.likes)}
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                )}

                {post.likes && <span>{post.likes}</span>}
                {post.likes === undefined && <span>0</span>}
              </div>
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 cursor-pointer hover:text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                  />
                </svg>

                {comments && <span>{comments.length}</span>}
                {comments === undefined && <span>0</span>}
              </div>
              {uid === post.uid && (
                <div className="flex items-center ml-auto self-end">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 hover:text-red-600"
                    onClick={(e) => handleDeletePost(e)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {post && (
        <div className="">
          <p className="text-2xl p-2">Comments</p>
          {comments &&
            comments.map((comment) => (
              <div
                className="text-lg border-b border-gray-200 px-5 py-3 flex gap-2 items-start"
                key={comment.id}
              >
                <div className="w-8 h-8 bg-black rounded-full"></div>
                <div className="">
                  <p className="font-bold hover:text-gray-300">
                    <Link to={`/profile/${uid}/${comment.uid}`}>
                      {comment.user}
                    </Link>
                  </p>
                  <p>{comment.comment}</p>
                </div>
                {uid === comment.uid && (
                  <div className="flex items-center ml-auto self-end">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 hover:text-red-600 cursor-pointer"
                      onClick={(e) =>
                        handleDeleteComment(e, comment.id, post.comments)
                      }
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}

          <div className="w-full px-2 py-3 border border-secondary-100 bg-white flex items-center relative overflow-hidden">
            <input
              type="text"
              className=" w-full  outline-none"
              placeholder="Comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="absolute right-0 bg-primary h-full px-4 rounded hover:bg-green-500"
              onClick={(e) => handleAddComment(e, post.comments)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
          {comments.length < 1 && (
            <p className="text-3xl text-gray-300 opacity-100 text-center m-6">
              Empty :(
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;
