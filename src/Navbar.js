import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="nav ">
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="lg:w-14 lg:h-14 min-w-8 min-w-max h-8 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>

        <h1 className="lg:text-5xl text-2xl font-bold">CHITCHAT</h1>
      </div>
      <div className="sm:mt-20">
        <p className="sm:text-3xl text-lg hidden sm:block">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non dolorem
          animi, voluptates necessitatibus earum nesciunt?
        </p>

        <div className="font-bold  text-primary text-sm sm:text-lg sm:mt-20">
          <Link to="/signin" className="nav-btn">
            Sign in
          </Link>
          <Link to="/signup" className="nav-btn">
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;