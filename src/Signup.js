import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import ShowPassword from "./ShowPassword";

const Signup = ({ auth, db }) => {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [checkPass, setCheckPass] = useState("");
  const [passErr, setPassErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);

  const history = useHistory();

  const handleShowPass = () => {
    setShowPass(!showPass);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailErr(false);
    setPassErr(false);
    if (checkPass === password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
          //console.log(cred);
          setDoc(doc(db, "users", cred.user.uid), {
            email: email,
            name: userName,
          }).then(() => {
            history.push(`/profile/${cred.user.uid}/${cred.user.uid}`);
          });
        })
        .catch((err) => {
          if (err.code === "auth/weak-password") {
            setPassErr("At least 6 characters");
          } else if (err.code === "auth/email-already-in-use") {
            setEmailErr("Email already taken");
          }
        });
    } else {
      setPassword("");
      setCheckPass("");
      setPassErr("Check Password");
    }
  };
  return (
    <div className="sign-form animate__animated animate__fadeInUp ">
      <h1 className="border-b-2 border-secondary-200 text-primary w-1/2 text-center py-6 font-extrabold text-3xl md:text-6xl ">
        Sign up
      </h1>
      <form
        className="mt-6 text-lg flex flex-col items-center gap-4"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="sign-input border-secondary-100"
          placeholder="Username"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          required
        />
        <div className="">
          {emailErr && <p className="err-text">{emailErr}</p>}
          <input
            type="email"
            className={
              emailErr
                ? "sign-input border-red-500"
                : "sign-input border-secondary-100"
            }
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
        </div>
        <div className="">
          {passErr && <p className="err-text">{passErr}</p>}
          <div className="relative flex justify-center">
            <input
              type={showPass ? "text" : "password"}
              className={
                passErr
                  ? "sign-input border-red-500"
                  : "sign-input border-secondary-100"
              }
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
            <ShowPassword
              passErr={passErr}
              showPass={showPass}
              handleShowPass={handleShowPass}
            />
          </div>
        </div>

        <input
          type={showPass ? "text" : "password"}
          className={
            passErr
              ? "sign-input border-red-500"
              : "sign-input border-secondary-100"
          }
          placeholder="Repeat Password"
          value={checkPass}
          onChange={(e) => {
            setCheckPass(e.target.value);
          }}
          required
        />
        <button
          type="submit"
          className="rounded-full bg-primary py-2 px-3 text-white self-center sm:self-end hover:shadow-md"
        >
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Signup;
