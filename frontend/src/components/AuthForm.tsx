import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AuthForm.module.css";
import { AiOutlineGoogle, AiFillGithub } from "react-icons/ai";
import Input from "./ui/Input";
import toast from "react-hot-toast";

type FormState = "register" | "login";

export default function AuthForm() {
  const [formState, setFormState] = useState<FormState>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/users");
    }
  }, [token, navigate]);

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

  async function formSubmitHandler(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !email.includes("@") || !email.includes(".")) {
      toast.error("Invalid email");
      return;
    }

    if (!password) {
      toast.error("Invalid password");
      return;
    }

    if (password.trim().length < 6) {
      toast.error("Your password is too weak");
      return;
    }

    let url = "";
    if (formState === "register") {
      url = `${import.meta.env.VITE_API_BASE_URL}/users/signup`;
    } else if (formState === "login") {
      url = `${import.meta.env.VITE_API_BASE_URL}/users/login`;
    }

    const user = await axios
      .post(url, {
        username,
        email,
        password,
      })
      .then((callback) => {
        sessionStorage.setItem("token", callback?.data?.token);
        sessionStorage.setItem("refreshToken", callback?.data?.refreshToken);
        navigate("/users");
        toast.success(
          `Succesfully ${formState === "login" ? "logged in." : "signed up"}`
        );
      })
      .catch(() => {
        toast.error("Invalid credentials");
      });
  }

  return (
    <div className={styles.container}>
      <div className={styles["form-container"]} onSubmit={formSubmitHandler}>
        <form>
          <h1 className={styles.heading}>
            {formState === "register" ? "Sign up" : "Sign in"}
          </h1>

          {formState === "register" && (
            <Input
              id="username"
              label="Username"
              onValueChange={(value: string) => setUsername(value)}
              validate={(value: string) => value.length > 0}
            />
          )}

          <Input
            id="email"
            label="Email"
            onValueChange={(value: string) => setEmail(value)}
            validate={(value: string) =>
              value.includes("@") && value.includes(".")
            }
          />

          <Input
            id="password"
            label="Password"
            onValueChange={(value: string) => setPassword(value)}
            type="password"
            validate={(value: string) => value.length > 5}
          />

          <button className={styles["action-button"]}>
            {formState === "register" ? "Sign up" : "Sign in"}
          </button>
        </form>
        <hr />
        <div className={styles["social-buttons-container"]}>
          <button className={styles["social-button"]}>
            <AiOutlineGoogle size={24} />
          </button>
          <button className={styles["social-button"]}>
            <AiFillGithub size={24} />
          </button>
        </div>
        <div className={styles["already-user"]}>
          <p>
            {formState === "login"
              ? "Don't have an account?"
              : "Already a user?"}
          </p>
          <button
            className={styles["change-action-button"]}
            type="button"
            onClick={formStateChangeHandler}
          >
            {formState === "login" ? "SIGN UP" : "SIGN IN"}
          </button>
        </div>
      </div>
    </div>
  );
}
