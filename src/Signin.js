import { useState } from "react";
import { useHistory } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import ShowPassword from "./ShowPassword";

const Signin = ({ auth }) => {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleShowPass = () => {
    setShowPass(!showPass);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((cred) =>
        history.push(`/profile/${cred.user.uid}/${cred.user.uid}`)
      )
      .catch((err) => {
        setError(true);
      });
  };

  return (
    <div className="sign-form animate__animated animate__fadeInUp">
      <h1 className="border-b-2 border-secondary-200 text-primary w-1/2 text-center py-6 font-extrabold text-3xl md:text-6xl ">
        Sign in
      </h1>
      <form
        className="mt-6 text-lg flex flex-col items-center gap-4"
        onSubmit={handleSubmit}
      >
        <div className="">
          {error && (
            <p className="err-text">Check your Email and/or Password</p>
          )}
          <input
            type="email"
            className={
              error
                ? "sign-input border-red-500"
                : "sign-input border-secondary-100"
            }
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="relative flex justify-center">
          <input
            type={showPass ? "text" : "password"}
            className={
              error
                ? "sign-input border-red-500"
                : "sign-input border-secondary-100"
            }
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ShowPassword
            passErr={error}
            showPass={showPass}
            handleShowPass={handleShowPass}
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-primary py-2 px-3 text-white self-center sm:self-end hover:shadow-md"
        >
          Sign in
        </button>
      </form>
    </div>
  );
};

export default Signin;
