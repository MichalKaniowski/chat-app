import React, { useCallback, useState } from "react";

interface ConversationContextType {
  isConversationOpen: boolean;
  onConversationOpenStateChange: (state: boolean) => void;
}

const ConversationsContext = React.createContext<ConversationContextType>({
  isConversationOpen: false,
  onConversationOpenStateChange: () => {},
});

export default ConversationsContext;

export function ConversationsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isConversationOpen, setIsConversationOpen] = useState(false);

  const changeConversationStateHandler = useCallback((state: boolean) => {
    // waiting for component to render before updating state
    setTimeout(() => {
      setIsConversationOpen(state);
    }, 0);
  }, []);

  return (
    <ConversationsContext.Provider
      value={{
        isConversationOpen,
        onConversationOpenStateChange: changeConversationStateHandler,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}
