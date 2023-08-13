import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "../types/database";

export default function UserBox({ user }: { user: User }) {
  const navigate = useNavigate();

  async function conversationCreateHandler() {
    const token = sessionStorage.getItem("token");
    const refreshToken = sessionStorage.getItem("refreshToken");

    const conversation = await axios.post(
      "http://localhost:3000/conversations",
      { id: user._id },
      {
        headers: {
          Authorization: `Bearer ${token}, Basic ${refreshToken}`,
        },
      }
    );

    // data passed to navigate must be serialized
    const serializedConversation = {
      ...conversation.data,
      _id: conversation.data._id.toString(),
      userIds: conversation.data.userIds.map((userId: string) =>
        userId.toString()
      ),
    };

    navigate(`/conversations/${conversation?.data?._id}`, {
      state: serializedConversation,
    });
  }

  return (
    <div style={{ marginBottom: "50px" }}>
      <h3>{user.username}</h3>
      <p>{user.email}</p>
      <button onClick={conversationCreateHandler}>Create conversation</button>
    </div>
  );
}
