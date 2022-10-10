import { collection, getDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
const Messages = ({ db }) => {
  const uid = useParams().uid;
  const usersColref = collection(db, "users", uid, "chat");
  const [users, setUsers] = useState("");
  const [usersInfo, setUsersInfo] = useState([]);

  useEffect(() => {
    onSnapshot(usersColref, (snapshot) => {
      setUsers(snapshot.docs.map((item) => item.id));
    });
  }, []);
  const array = [];
  function loadPostsToArray() {
    return new Promise(function (resolve, reject) {
      if (users) {
        users.map((user) => {
          const userDocRef = doc(db, "users", user);
          getDoc(userDocRef).then((res) => {
            //console.log(res.data());
            array.push({ ...res.data(), id: res.id });
            if (array.length === users.length) resolve(array);
            //console.log(array);
          });
        });
      }
    });
  }

  useEffect(() => {
    if (users.length !== usersInfo.length) {
      loadPostsToArray().then(function (array) {
        setUsersInfo(array);
      });
    }
  }, [array, users]);
  //console.log(usersInfo);

  return (
    <div className="app-main">
      <h1 className="text-2xl text-gray-600 m-3 font-bold">Chat</h1>
      {usersInfo &&
        usersInfo.map((user) => (
          <Link to={`/chat/${uid}/${user.id}`} key={user.id}>
            <div className=" py-4 px-6 border-t border-gray-300 text-gray-700 hover:bg-primary hover:text-white">
              <p className="text-xl font-bold">{user.name}</p>
              <p className="text-sm text-gray-300 font-thin"></p>
            </div>
          </Link>
        ))}
      {users && (
        <div className="text-center text-4xl py-8 text-gray-300 font-bold">
          {usersInfo.length === 0 && <span>No Messages</span>}
        </div>
      )}
      {!users && (
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
    </div>
  );
};

export default Messages;
