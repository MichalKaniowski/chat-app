import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import getAuthorizationHeader from "../utils/getAuthorizationHeader";
import { socket } from "../utils/socket";

import EmptyState from "../components/EmptyState";
import ConversationsList from "../components/conversations/sidebar/ConversationsList";
import { Conversation as ConversationType, Message } from "../types/database";
import Navigation from "../components/navigation/Navigation";
import Modal from "../components/ui/ImageModal";
import Conversation from "../components/conversations/conversation/Conversation";
import { useFileModalContext } from "../hooks/context/useFileModalContext";

export default function ConversationsPage() {
  const { state } = useLocation();
  const [isScreenBig, setIsScreenBig] = useState(false);
  const [activeConversation, setActiveConversation] =
    useState<ConversationType>(state);

  const { isModalOpen, file } = useFileModalContext();

  const { isLoading: conversationIsLoading } = useQuery(
    ["conversation"],
    getAndSetNewestConversation
  );

  const {
    isLoading: conversationsIsLoading,
    data: conversations,
    refetch: refetchConversations,
  } = useQuery(["conversations"], getConversations);

  useEffect(() => {
    function updateScreenSize() {
      setIsScreenBig(window.innerWidth >= 600);
    }
    async function receiveMessageHandler(message: Message) {
      addMessageHandler(message);
    }

    async function receiveConversationHandler() {
      refetchConversations();
    }

    socket.on("receive-message", receiveMessageHandler);
    socket.on("receive-conversation", receiveConversationHandler);
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => {
      socket.off("receive-message", receiveMessageHandler);
      socket.off("receive-conversation", receiveConversationHandler);
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

    const conversation = await res?.data;

    if (!conversation) {
      return toast.error(
        "There was a problem while fetching this conversation"
      );
    }

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

      const conversations = data?.conversations;

      // empty array won't be caught here
      if (!conversations) {
        return toast.error(
          "Something went wrong while fetching conversations."
        );
      }

      return conversations;
    } catch (error) {
      toast.error("Something went wrong while getting conversations.");
    }
  }

  const addMessageHandler = useCallback(
    async (message: Message) => {
      // todo: think about using optimisticQuery or sth like that from tanstack query
      if (activeConversation) {
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
      }

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/conversations/${
          message.conversationId
        }/seen`,
        {},
        { headers: { Authorization: getAuthorizationHeader() } }
      );
      refetchConversations();
    },
    [activeConversation, refetchConversations]
  );

  return (
    <Navigation>
      {isModalOpen && <Modal fileUrl={file} />}
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
