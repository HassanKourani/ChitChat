import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { Link, useHistory, useLocation } from "react-router-dom";

const Posts = ({ db, uid, posts }) => {
  const history = useHistory();
  const path = useLocation();

  const [likedPosts, setLikedPosts] = useState("");

  //get the user info

  //all the posts the user Liked
  const LikesPostscolRef = collection(db, "users", uid, "liked_posts");

  useEffect(() => {
    onSnapshot(LikesPostscolRef, (snapshot) => {
      setLikedPosts(
        snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
      );
    });
  }, [path]);

  function isLiked(pid) {
    if (likedPosts) {
      return likedPosts.some(function (el) {
        return el.id === pid;
      });
    }
  }

  //Like Post
  const handleLike = (e, post) => {
    e.preventDefault();
    e.stopPropagation();

    const postDocRef = doc(db, "users", post.uid, "posts", post.id);

    //if post is liked dec likes and remove the post from liked posts collection
    //if posts is not liked inc likes and add post to the liked posts collection
    if (!isLiked(post.id)) {
      if (post.likes !== undefined) {
        updateDoc(postDocRef, {
          likes: post.likes + 1,
        });
      } else {
        updateDoc(postDocRef, {
          likes: 1,
        });
      }
      //add post to the liked_posts collection (Live User)
      setDoc(doc(db, "users", uid, "liked_posts", post.id), {});
    } else {
      updateDoc(postDocRef, {
        likes: post.likes - 1,
      });
      const docRef = doc(db, "users", uid, "liked_posts", post.id);
      deleteDoc(docRef);
    }
  };

  //open input to add Comment
  const handleActiveComment = (e, post) => {
    e.stopPropagation();
    history.push(`/post/${uid}/${post.uid}/${post.id}`);
  };

  const hanldeGoToPost = (e, post) => {
    e.preventDefault();
    e.stopPropagation();
    history.push(`/post/${uid}/${post.uid}/${post.id}`);
  };

  const handleDeletePost = (e, post) => {
    e.preventDefault();
    e.stopPropagation();
    const docRef = doc(db, "users", uid, "posts", post.id);
    deleteDoc(docRef);
    const allPostsdocRef = doc(db, "users", uid, "allPosts", post.id);
    deleteDoc(allPostsdocRef);
  };

  return (
    <div className="">
      {posts.length > 0 && (
        <div className="m-4 text-lg font-bold">
          <span className="">POSTS</span>
        </div>
      )}
      {posts.length === 0 && (
        <div className="m-8 text-xl font-bold text-center text-gray-300">
          {posts && <span className="">No Posts :(</span>}
        </div>
      )}
      {!posts && (
        <div className="flex justify-center items-center">
          <svg
            aria-hidden="true"
            className=" w-10 h-10 text-gray-300 animate-spin fill-primary"
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
        </div>
      )}
      {posts &&
        posts.map((post) => (
          <div
            className="flex gap-4 border-b border-gray-100 py-3 hover:bg-gray-100 px-4 cursor-pointer"
            key={post.id}
            onClick={(e) => hanldeGoToPost(e, post)}
          >
            {post.profile && (
              <div className="w-12 h-11 rounded-full overflow-hidden">
                <img
                  src={post.profile}
                  className="w-full h-full rounded-full"
                  alt=""
                />
              </div>
            )}
            {!post.profile && (
              <div className="w-12 h-11 rounded-full bg-black"></div>
            )}
            <div className="w-full">
              <div className=" flex justify-between">
                <div
                  className="font-extrabold hover:text-gray-400"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link to={`/profile/${uid}/${post.uid}`}>{post.user}</Link>
                </div>
                {posts && (
                  <div className="opacity-50 text-gray-400">
                    {post && new Date(post.created_at.seconds * 1000).getDate()}
                    /
                    {post &&
                      new Date(post.created_at.seconds * 1000).getMonth() + 1}
                    /
                    {post &&
                      new Date(post.created_at.seconds * 1000).getFullYear()}
                  </div>
                )}
              </div>
              <div className="mt-2">{post.body}</div>
              {post.image && (
                <div className="">
                  <img
                    src={post.image}
                    className="sm:w-1/2 w-full rounded-lg"
                    alt=""
                  />
                </div>
              )}
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
                      onClick={(e) => handleLike(e, post)}
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
                      onClick={(e) => handleLike(e, post)}
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
                    onClick={(e) => handleActiveComment(e, post)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                    />
                  </svg>

                  {!isNaN(post.comments) && <span>{post.comments}</span>}
                  {isNaN(post.comments) && <span>0</span>}
                </div>
                {uid === post.uid && (
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 hover:text-red-600"
                      onClick={(e) => handleDeletePost(e, post)}
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
        ))}
    </div>
  );
};

export default Posts;
