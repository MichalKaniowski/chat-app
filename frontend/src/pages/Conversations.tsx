import { useEffect, useState } from "react";
import axios from "axios";
import DesktopSidebar from "../components/navigation/DesktopSidebar";
import EmptyState from "../components/EmptyState";
import ConversationsList from "../components/conversations/sidebar/ConversationsList";
import { useLocation } from "react-router-dom";
import Conversation from "../components/conversations/conversation/Conversation";
import { Conversation as ConversationType, Message } from "../types/database";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

export default function ConversationsPage() {
  const { state } = useLocation();
  const [activeConversation, setActiveConversation] =
    useState<ConversationType>(state);

  const token = sessionStorage.getItem("token");
  const refreshToken = sessionStorage.getItem("refreshToken");

  const { isLoading: conversationIsLoading } = useQuery(
    ["conversation"],
    getAndSetNewestConversation,
    {
      cacheTime: 60 * 1000, // 1min
      staleTime: 60 * 1000, // 1min
    }
  );

  const { isLoading: conversationsIsLoading, data: conversations } = useQuery(
    ["conversations"],
    getConversations,
    {
      cacheTime: 60 * 1000, // 1min
      staleTime: 60 * 1000, // 1min
    }
  );

  useEffect(() => {
    setActiveConversation(state);
  }, [state]);

  async function getAndSetNewestConversation() {
    const conversationId = activeConversation?._id || state?._id;

    if (!conversationId) return null;

    const res = await axios.get(
      `http://localhost:3000/conversations/${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}, Basic ${refreshToken}`,
        },
      }
    );
    const conversation = await res.data;

    setActiveConversation(conversation);
    return conversation;
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
      return conversations;
    } catch (error) {
      toast.error("Something went wrong while getting conversations.");
    }
  }

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
      <ConversationsList
        conversations={conversations}
        isLoading={conversationsIsLoading}
      />
      {state ? (
        <Conversation
          conversation={activeConversation || state}
          onMessageAdd={addMessageHandler}
          isLoading={conversationIsLoading || state?.message === "loading"}
        />
      ) : (
        <EmptyState />
      )}
    </DesktopSidebar>
  );
}
