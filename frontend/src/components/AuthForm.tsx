import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AuthForm.module.css";
import { AiOutlineGoogle, AiFillGithub } from "react-icons/ai";
import Input from "./ui/Input";
import toast from "react-hot-toast";
import getSession from "../utils/getSession";
import { socket } from "../utils/socket";
import { Token } from "../types/database";

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

    //todo: check whats happening here
    const user = await axios
      .post(url, {
        username,
        email,
        password,
      })
      .then((callback) => {
        sessionStorage.setItem("token", callback?.data?.token);
        sessionStorage.setItem("refreshToken", callback?.data?.refreshToken);

        const data = getSession();
        const decodedToken = data.decodedToken as Token;

        axios
          .patch(
            `${import.meta.env.VITE_API_BASE_URL}/users/update-online-status`,
            { id: decodedToken!.id, isOnline: true }
          )
          .then(() => {
            socket.emit("user-connected", decodedToken);
          });

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
    <div className={`${styles.container} grainy`}>
      <div className={styles["form-container"]} onSubmit={formSubmitHandler}>
        <form>
          <h1 className={styles.heading}>
            {formState === "register" ? "Sign up" : "Sign in"}
          </h1>

          <div className={styles["input-container"]}>
            {formState === "register" && (
              <Input
                id="username"
                label="Username"
                placeholder="Jon Doe"
                onValueChange={(value: string) => setUsername(value)}
                validate={(value: string) => value.length > 0}
              />
            )}

            <Input
              id="email"
              label="Email"
              placeholder="john.doe@email.com"
              onValueChange={(value: string) => setEmail(value)}
              validate={(value: string) =>
                value.includes("@") && value.includes(".")
              }
            />

            <Input
              id="password"
              label="Password"
              placeholder="******"
              onValueChange={(value: string) => setPassword(value)}
              type="password"
              validate={(value: string) => value.length > 5}
            />
          </div>

          <button className={styles["action-button"]}>
            {formState === "register" ? "Sign up" : "Sign in"}
          </button>
        </form>
        <div className={styles["social-buttons-container"]}>
          <button className={styles["social-button"]}>
            <img
              src="/images/google-icon.svg"
              className={styles["social-icon"]}
            />
          </button>
        </div>
        <button
          type="button"
          onClick={formStateChangeHandler}
          className={styles["already-user-button"]}
        >
          <p>
            {formState === "login"
              ? "Don't have an account?"
              : "Already a user?"}
          </p>
        </button>
      </div>
    </div>
  );
}
