import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFileModalContext } from "../hooks/context/useFileModalContext";
import useFetchConversation from "../hooks/fetch/useFetchConversation";
import useFetchConversations from "../hooks/fetch/useFetchConversations";
import useIsScreenBig from "../hooks/context/useIsScreenBig";

import { socket } from "../utils/socket";
import updateSeen from "../helpers/db/updateSeen";
import { Message } from "../types/database";

import EmptyState from "../components/EmptyState";
import ConversationsList from "../components/conversations/sidebar/ConversationsList";
import Navigation from "../components/navigation/Navigation";
import FileModal from "../components/ui/FileModal";
import Conversation from "../components/conversations/conversation/Conversation";

export default function ConversationPage() {
  const { isScreenBig } = useIsScreenBig();

  const { conversationId } = useParams();
  const { isModalOpen, file } = useFileModalContext();

  const {
    conversation,
    isLoading: conversationIsLoading,
    onConversationSet,
  } = useFetchConversation(conversationId);

  const {
    isLoading: conversationsIsLoading,
    conversations,
    refetch: refetchConversations,
  } = useFetchConversations();

  const addMessageHandler = useCallback(
    async (message: Message) => {
      if (conversation) {
        const messages = (conversation.messageIds as Message[]).filter(
          (message) => message._id !== "fake-message"
        );
        const newConversation = {
          ...conversation,
          messageIds: [...messages, message] as Message[],
        };
        onConversationSet(newConversation);
      }
      updateSeen(message.conversationId as string);
    },
    [conversation, onConversationSet]
  );

  // handling webhooks
  useEffect(() => {
    async function receiveMessageHandler(message: Message) {
      addMessageHandler(message);
    }

    async function receiveConversationHandler() {
      refetchConversations();
    }

    socket.on("receive-message", receiveMessageHandler);
    socket.on("receive-conversation", receiveConversationHandler);

    return () => {
      socket.off("receive-message", receiveMessageHandler);
      socket.off("receive-conversation", receiveConversationHandler);
    };
  }, [addMessageHandler, refetchConversations]);

  return (
    <Navigation>
      {isModalOpen && <FileModal fileUrl={file} />}
      {isScreenBig && (
        <ConversationsList
          conversations={conversations}
          isLoading={conversationsIsLoading}
        />
      )}

      {conversation || conversationIsLoading ? (
        <Conversation
          conversation={conversation!}
          onMessageAdd={addMessageHandler}
          isLoading={conversationIsLoading}
        />
      ) : (
        <EmptyState />
      )}
    </Navigation>
  );
}
