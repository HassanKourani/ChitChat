import { collection, doc, onSnapshot, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const UsersList = ({ db }) => {
  const uid = useParams().uid;
  const vid = useParams().vid;
  const path = useLocation().pathname.split("/")[1];

  const [user, setUser] = useState("");
  const [list, setList] = useState("");

  const userDocRef = doc(db, "users", vid);
  const listColRef = collection(db, "users", vid, path);

  useEffect(() => {
    getDoc(userDocRef).then((res) => {
      setUser(res.data());
    });
    onSnapshot(listColRef, (snapshot) => {
      setList(snapshot.docs.map((item) => ({ ...item.data(), id: item.id })));
    });
  }, []);

  //console.log(list);

  return (
    <div className="app-main">
      {user && (
        <div className="text-2xl font-bold py-4 px-2 text-black">
          {path === "following" && <span>People Followed by {user.name}:</span>}
          {path === "followers" && <span>People Following {user.name}:</span>}
        </div>
      )}
      {list &&
        list.map((user) => (
          <Link to={`/profile/${uid}/${user.id}`} key={user.id}>
            <div className=" py-4 px-6 border-t border-gray-300 text-gray-700 hover:bg-primary hover:text-white">
              <p className="text-xl font-bold">{user.name}</p>
              <p className="text-sm text-gray-300 font-thin">{user.email}</p>
            </div>
          </Link>
        ))}
      {list.length === 0 && (
        <div className="text-center text-4xl py-8 text-gray-300 font-bold">
          <span>Empty :(</span>
        </div>
      )}
    </div>
  );
};

export default UsersList;
