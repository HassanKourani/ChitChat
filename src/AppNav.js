import { Link, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
const AppNav = () => {
  const path = useLocation();
  const [location, setLocation] = useState("");
  const id = useParams().uid;
  const vid = useParams().vid;

  useEffect(() => {
    if (path.pathname.split("/").includes("home")) {
      setLocation("home");
    } else if (path.pathname.split("/").includes("search")) {
      setLocation("search");
    } else if (path.pathname.split("/").includes("profile") && id === vid) {
      setLocation("profile");
    } else {
      setLocation("");
    }
  }, [path]);

  return (
    <div className="app-nav">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-12 h-12 text-primary inline align-top"
      >
        <path
          fillRule="evenodd"
          d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-2xl font-extrabold align-bottom ml-2">
        CHITCHAT
      </span>
      <div className="text-2xl sm:w-1/2 w-full m-auto flex sm:inline">
        <Link to={`/home/${id}`}>
          <div
            className={
              location === "home"
                ? "app-nav-link font-extrabold"
                : "app-nav-link"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Home
          </div>
        </Link>
        <Link to={`/search/${id}`}>
          <div
            className={
              location === "search"
                ? "app-nav-link font-extrabold"
                : "app-nav-link"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            Search
          </div>
        </Link>
        <Link to={`/profile/${id}/${id}`}>
          <div
            className={
              location === "profile"
                ? "app-nav-link font-extrabold"
                : "app-nav-link"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            Profile
          </div>
        </Link>
        <Link to={`/create-post/${id}`}>
          <button className="w-full py-3 bg-primary text-white rounded-full text-lg mt-6 hover:shadow-md">
            POST
          </button>
        </Link>
        <button className="app-nav-link hover:bg-red-300 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z"
              clipRule="evenodd"
            />
          </svg>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default AppNav;
