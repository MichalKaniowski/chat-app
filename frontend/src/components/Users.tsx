// @ts-nocheck

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import UserBox from "./UserBox";
import jwt_decode from "jwt-decode";

export default function Users() {
  const [users, setUsers] = useState<any>([]);
  const token = sessionStorage.getItem("token") as string;
  const decodedToken = jwt_decode(token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]);

  useEffect(() => {
    async function getUsers() {
      const people = await axios.get("http://localhost:3000/users", {
        email: decodedToken.email,
      });

      setUsers(
        people?.data?.filter((user) => user.email !== decodedToken.email)
      );
    }

    getUsers();
  }, []);

  return (
    <div>
      {users.map((user: any) => (
        <UserBox key={user._id} user={user} />
      ))}
    </div>
  );
}
