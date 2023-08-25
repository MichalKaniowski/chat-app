import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import EmptyState from "../components/EmptyState";
import ConversationsList from "../components/conversations/sidebar/ConversationsList";
import { useLocation } from "react-router-dom";
import Conversation from "../components/conversations/conversation/Conversation";
import { Conversation as ConversationType, Message } from "../types/database";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import getAuthorizationHeader from "../utils/getAuthorizationHeader";
import Navigation from "../components/navigation/Navigation";

export default function ConversationsPage() {
  const { state } = useLocation();
  const [isScreenBig, setIsScreenBig] = useState(false);
  const [activeConversation, setActiveConversation] =
    useState<ConversationType>(state);

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
    function updateScreenSize() {
      setIsScreenBig(window.innerWidth >= 600);
    }

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  useEffect(() => {
    setActiveConversation(state);
  }, [state]);

  async function getAndSetNewestConversation() {
    const conversationId = activeConversation?._id || state?._id;

    if (!conversationId) return null;

    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/conversations/${conversationId}`,
      {
        headers: {
          Authorization: getAuthorizationHeader(),
        },
      }
    );
    const conversation = await res.data;

    setActiveConversation(conversation);
    return conversation;
  }

  async function getConversations() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/conversations`,
        {
          headers: {
            Authorization: getAuthorizationHeader(),
          },
        }
      );

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

  const addMessageHandler = useCallback((message: Message) => {
    setActiveConversation((prevConversation: ConversationType) => {
      const messages = (prevConversation.messageIds as Message[]).filter(
        (message) => message._id !== "fake-message"
      );

      const newConversation = {
        ...prevConversation,
        messageIds: [...messages, message] as Message[],
      };

      return newConversation;
    });
  }, []);

  return (
    <Navigation>
      {(!state || isScreenBig) && (
        <ConversationsList
          conversations={conversations}
          isLoading={conversationsIsLoading}
        />
      )}
      {state ? (
        <Conversation
          conversation={activeConversation}
          onMessageAdd={addMessageHandler}
          isLoading={conversationIsLoading || state?.message === "loading"}
          isScreenBig={isScreenBig}
        />
      ) : (
        <EmptyState />
      )}
    </Navigation>
  );
}
