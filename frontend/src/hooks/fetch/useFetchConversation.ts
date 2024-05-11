import { useCallback, useEffect, useState } from "react";
import getConversation from "../../helpers/db/conversation/getConversation";
import { Conversation } from "../../types/database";

export default function useFetchConversation(conversationId?: string) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConversation = useCallback(async () => {
    if (!conversationId) {
      setConversation(null);
      return;
    }

    setIsLoading(true);

    const { conversation } = await getConversation(conversationId);
    setConversation(conversation);

    setIsLoading(false);
  }, [conversationId]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  const onConversationSet = useCallback((conversation: Conversation) => {
    setConversation(conversation);
  }, []);

  return {
    conversation,
    isLoading,
    onConversationSet,
    refetch: fetchConversation,
  };
}
