import { useEffect, useState } from "react";
import axios from "axios";
import DesktopSidebar from "../components/navigation/DesktopSidebar";
import EmptyState from "../components/EmptyState";
import ConversationsList from "../components/conversations/sidebar/ConversationsList";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Conversation from "../components/conversations/conversation/Conversation";
import { Conversation as ConversationType, Message } from "../types/database";
import toast from "react-hot-toast";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const { state } = useLocation();
  const [activeConversation, setActiveConversation] =
    useState<ConversationType>(state);

  useEffect(() => {
    setActiveConversation(state);
  }, [state]);

  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const refreshToken = sessionStorage.getItem("refreshToken");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }

    async function getConversations() {
      try {
        const res = await axios.get("http://localhost:3000/conversations", {
          headers: {
            Authorization: `Bearer ${token}, Basic ${refreshToken}`,
          },
        });

        const data = await res.data;
        const newAccessToken = data?.token;

        if (newAccessToken) {
          sessionStorage.setItem("token", newAccessToken);
        }

        const conversations = data.conversations;
        setConversations(conversations);
      } catch (error) {
        toast.error("Something went wrong while getting conversations.");
      }
    }

    getConversations();
  }, [token, refreshToken, navigate]);

  function addMessageHandler(message: Message) {
    setActiveConversation((prevConversation: ConversationType) => {
      const newConversation = {
        ...prevConversation,
        messageIds: [...prevConversation.messageIds, message] as Message[],
      };
      return newConversation;
    });
  }

  return (
    <DesktopSidebar>
      <ConversationsList conversations={conversations} />
      {state ? (
        <Conversation
          conversation={activeConversation}
          onMessageAdd={addMessageHandler}
        />
      ) : (
        <EmptyState />
      )}
    </DesktopSidebar>
  );
}
