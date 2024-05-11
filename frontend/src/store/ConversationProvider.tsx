import { createContext, useMemo, useState } from "react";

interface ConversationContextType {
  lastConversationId: string;
  onLastConversationSet: (conversationId: string) => void;
}

export const ConversationContext = createContext<ConversationContextType>({
  lastConversationId: "",
  onLastConversationSet: () => {},
});

export function ConversationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lastConversationId, setLastConversationId] = useState("");

  const value = useMemo(
    () => ({
      lastConversationId,
      onLastConversationSet: setLastConversationId,
    }),
    [lastConversationId]
  );

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}
