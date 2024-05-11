import { useCallback, useEffect, useState } from "react";
import { Conversation } from "../../types/database";
import useLocalStorage from "../useLocalStorage";
import getConversations from "../../helpers/db/conversation/getConversations";

interface LocalStorageConversation {
  conversations: Conversation[];
  expiration: number;
}

export default function useFetchConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getItem, setItem } = useLocalStorage();

  const fetchConversations = useCallback(async () => {
    const cache = getItem("conversations") as LocalStorageConversation | null;

    if (cache) {
      if (cache.expiration > new Date().getTime()) {
        setConversations(cache.conversations);
        return;
      }
    }

    setIsLoading(true);

    const { conversations } = await getConversations();
    if (!conversations) return;

    setConversations(conversations);

    const conversationsWithExpiration = {
      conversations: conversations,
      expiration: new Date().getTime() + 60 * 1000,
    };
    setItem("conversations", JSON.stringify(conversationsWithExpiration));

    setIsLoading(false);
  }, [getItem, setItem]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    refetch: fetchConversations,
  };
}
