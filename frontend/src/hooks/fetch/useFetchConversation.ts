import { useCallback, useEffect, useState } from "react";
import getConversation from "../../helpers/db/conversation/getConversation";
import { Conversation } from "../../types/database";
import useLocalStorage from "../useLocalStorage";

interface LocalStorageConversation extends Conversation {
  expiration: number;
}

export default function useFetchConversation(conversationId?: string) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { getItem, setItem } = useLocalStorage();

  const fetchConversation = useCallback(async () => {
    const conversationKey = `conversation_${conversationId}`;

    if (!conversationId) {
      setConversation(null);
      return;
    }

    const cache = getItem(conversationKey) as LocalStorageConversation | null;

    if (cache) {
      if (cache.expiration > new Date().getTime()) {
        setConversation(cache);
        return;
      }
    }

    setIsLoading(true);

    const { conversation } = await getConversation(conversationId);
    setConversation(conversation);

    const conversationWithExpiration = {
      ...conversation,
      expiration: new Date().getTime() + 60 * 1000,
    };
    setItem(conversationKey, JSON.stringify(conversationWithExpiration));

    setIsLoading(false);
  }, [conversationId, getItem, setItem]);

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
