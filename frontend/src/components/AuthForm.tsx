import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type FormState = "register" | "login";

export default function AuthForm() {
  const [formState, setFormState] = useState<FormState>("register");
  const emailRef = useRef<HTMLInputElement>(null!);
  const passwordRef = useRef<HTMLInputElement>(null!);

  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/users");
    }
  }, [token]);

  async function formSubmitHandler(e: React.FormEvent) {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (formState === "register") {
      handleSignup(email, password);
    } else if (formState === "login") {
      handleLogin(email, password);
    }
  }

  async function handleSignup(email: string, password: string) {
    const user = await axios.post("http://localhost:3000/users/signup", {
      email,
      password,
    });

    if (user && user?.status === 200) {
      sessionStorage.setItem("token", user?.data?.token);
    }
  }

  async function handleLogin(email: string, password: string) {
    const user = await axios.post("http://localhost:3000/users/login", {
      email,
      password,
    });

    if (user && user?.status === 200) {
      sessionStorage.setItem("token", user?.data?.token);
    }
  }

  function formStateChangeHandler() {
    setFormState((prevState) => {
      if (prevState === "register") {
        return "login";
      } else if (prevState === "login") {
        return "register";
      }

      return prevState;
    });
  }

  return (
    <form onSubmit={formSubmitHandler}>
      <h1>{formState === "register" ? "Sign up" : "Sign in"}</h1>
      <input ref={emailRef} />
      <input ref={passwordRef} />
      <button>{formState === "register" ? "Sign up" : "Sign in"}</button>
      <button
        type="button"
        onClick={formStateChangeHandler}
        style={{ display: "block", marginTop: "15px" }}
      >
        change
      </button>
    </form>
  );
}
