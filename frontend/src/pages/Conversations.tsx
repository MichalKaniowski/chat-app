import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useFileModalContext } from "../hooks/context/useFileModalContext";

import { socket } from "../utils/socket";
import updateSeen from "../helpers/updateSeen";
import getConversation from "../helpers/getConversation";
import getConversations from "../helpers/getConversations";

import EmptyState from "../components/EmptyState";
import ConversationsList from "../components/conversations/sidebar/ConversationsList";
import { Conversation as ConversationType, Message } from "../types/database";
import Navigation from "../components/navigation/Navigation";
import FileModal from "../components/ui/FileModal";
import Conversation from "../components/conversations/conversation/Conversation";

export default function ConversationsPage() {
  const { state } = useLocation();
  const [isScreenBig, setIsScreenBig] = useState(false);
  const [activeConversation, setActiveConversation] =
    useState<ConversationType>(state);

  const { isModalOpen, file } = useFileModalContext();

  const convId = activeConversation?._id || state?._id || ("" as string);
  const { isLoading: conversationIsLoading } = useQuery(["conversation"], () =>
    getConversation(convId)
  );

  const {
    isLoading: conversationsIsLoading,
    data,
    refetch: refetchConversations,
  } = useQuery(["conversations"], getConversations);
  const conversations = data?.conversations || [];

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

      updateSeen(message.conversationId as string);
      refetchConversations();
    },
    [activeConversation, refetchConversations]
  );

  return (
    <Navigation>
      {isModalOpen && <FileModal fileUrl={file} />}
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
