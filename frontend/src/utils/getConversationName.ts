import jwtDecode from "jwt-decode";
import { Conversation, Token, User } from "../types/database";

export default function getConversationName(conversation: Conversation) {
  const token = sessionStorage.getItem("token") as string;
  const { id } = jwtDecode(token) as Token;

  const users = conversation.userIds as User[];

  const conversationName = conversation?.isGroup
    ? conversation.name
    : (users?.find((user) => user._id !== id)?.username as string);

  return conversationName;
}
