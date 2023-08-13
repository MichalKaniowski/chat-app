import axios from "axios";
import { useEffect, useState } from "react";
import UserBox from "./UserBox";
import jwt_decode from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/logoutUser";
import { Token } from "../types/database";
import { User } from "../types/database";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const token = sessionStorage.getItem("token") as string;
  const decodedToken: Token = jwt_decode(token);

  const navigate = useNavigate();

  useEffect(() => {
    async function getUsers() {
      const response = await axios.get("http://localhost:3000/users");

      const people: User[] = response.data;

      setUsers(people?.filter((user) => user.email !== decodedToken.email));
    }

    getUsers();
  }, [decodedToken?.email]);

  return (
    <div>
      <Link to="/conversations">Go to conversations</Link>
      <button onClick={() => logoutUser(navigate)}>
        This button will logout the user.
      </button>
      {users.map((user: User) => (
        <UserBox key={user._id} user={user} />
      ))}
    </div>
  );
}
