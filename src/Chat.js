import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  getDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
const Chat = ({ db }) => {
  const uid = useParams().uid;
  const vid = useParams().vid;
  const messagesEndRef = useRef(null);

  const [user, setUser] = useState("");
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  //received and sent in the user side.
  const userRef = doc(db, "users", vid);

  //all messages
  const allMessagesColRef = collection(
    db,
    "users",
    uid,
    "chat",
    vid,
    "allmessages"
  );
  const allMessagesVColRef = collection(
    db,
    "users",
    vid,
    "chat",
    uid,
    "allmessages"
  );
  const q = query(allMessagesColRef, orderBy("createdAt"));

  useEffect(() => {
    getDoc(userRef).then((res) => {
      setUser(res.data());
    });
    onSnapshot(q, (snapshot) => {
      setChat(snapshot.docs.map((item) => ({ ...item.data(), id: item.id })));
    });
  }, []);
  //console.log(chat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (message) {
      addDoc(allMessagesColRef, {
        message: message,
        from: uid,
        createdAt: serverTimestamp(),
      }).then(() => {
        setMessage("");
      });
      addDoc(allMessagesVColRef, {
        message: message,
        from: uid,
        createdAt: serverTimestamp(),
      });
    }
  };

  //   console.log(sent, "to ", user.name);
  //   console.log(received, "from ", user.name);

  return (
    <div className="app-main bg-gray-100">
      <div className="fixed z-50 top-0 sm:w-2/3 lg:w-3/4 bg-primary rounded-b-md text-white text-xl p-3 shadow-sm shadow-gray-400">
        {user && user.name}
      </div>
      <div className="max-h-full relative px-3 flex flex-col">
        {chat &&
          chat.map((message) => (
            <div
              key={message.id}
              className={
                message.from === uid
                  ? "message bg-primary self-end text-white animate__animated animate__bounceIn"
                  : "message bg-gray-400 text-black animate__animated animate__bounceIn"
              }
              ref={messagesEndRef}
            >
              <span>{message.message}</span>
            </div>
          ))}
      </div>

      <div className="flex fixed bottom-0 sm:w-2/3 lg:w-3/4 border border-primary pl-2 h-12 overflow-hidden rounded-l-full">
        <input
          type="text"
          className="w-full outline-none"
          placeholder="Message "
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button
          className=" bg-primary h-full px-4 hover:bg-green-500"
          onClick={handleSendMessage}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-white"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chat;
